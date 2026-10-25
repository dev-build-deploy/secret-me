/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { execFileSync, spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { scan } from "../src/scanner";

const FIXTURES = path.join(__dirname, "fixtures");
const CLI = path.join(__dirname, "..", "lib", "cli", "index.js");
const RULES = [
  "secret-me-anthropic-key",
  "secret-me-github-token",
  "secret-me-private-key",
  "secret-me-url-credentials",
  "secret-me-password-assignment",
  "secret-me-config-assignment",
  "secret-me-env-file",
];

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.com", ...args], {
    cwd,
    encoding: "utf8",
  });
}

function repoWith(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "secret-me-test-"));
  git(dir, "init", "-q", "-b", "main");
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

const read = (name: string): string => fs.readFileSync(path.join(FIXTURES, name), "utf8");
const leaky = (): Record<string, string> => ({
  "leaky.js": read("leaky.js"),
  "private-key.txt": read("private-key.txt"),
  ".env": read("dotenv.txt"),
});

let dirs: string[] = [];
const track = (d: string): string => (dirs.push(d), d);
afterEach(() => {
  dirs.forEach(d => fs.rmSync(d, { recursive: true, force: true }));
  dirs = [];
});

describe("scan (pinned gitleaks on a temp git repo)", () => {
  jest.setTimeout(120000);

  it("flags every kind of secret in the staged changes, redacted", async () => {
    const dir = track(repoWith(leaky()));
    git(dir, "add", "-A");
    const findings = await scan({ kind: "staged" }, { cwd: dir });
    const rules = new Set(findings.map(f => f.rule));
    for (const r of RULES.filter(r => r !== "secret-me-config-assignment")) expect(rules).toContain(r);
    expect(findings.every(f => f.commit === "" && !f.pushed)).toBe(true);
    const out = JSON.stringify(findings);
    expect(out).not.toContain("FAKE0FAKE1FAKE2");
    expect(out).not.toContain("Passw0rd-Zq8xK2mW");
    expect(findings.find(f => f.rule === "secret-me-github-token" && f.line === 3)?.redacted).toBe("ghp_****");
  });

  it("passes the Azure emulator key, placeholders and process.env references", async () => {
    const dir = track(
      repoWith({ "public-values.js": read("public-values.js"), ".env.example": "DB_PASSWORD=changeme\n" })
    );
    git(dir, "add", "-A");
    expect(await scan({ kind: "staged" }, { cwd: dir })).toEqual([]);
  });

  it("scans a git range, the history and a path, with the commit on each finding", async () => {
    const dir = track(repoWith({ "ok.txt": "fine\n" }));
    git(dir, "add", "-A");
    git(dir, "commit", "-qm", "init");
    const base = git(dir, "rev-parse", "HEAD").trim();
    fs.writeFileSync(path.join(dir, "leaky.js"), read("leaky.js"));
    git(dir, "add", "-A");
    git(dir, "commit", "-qm", "leak");
    const head = git(dir, "rev-parse", "HEAD").trim();

    const range = await scan({ kind: "range", range: `${base}..${head}` }, { cwd: dir });
    expect(range.length).toBeGreaterThan(0);
    expect(range.every(f => f.commit === head && f.file === "leaky.js")).toBe(true);
    expect(await scan({ kind: "range", range: `${head}..${head}` }, { cwd: dir })).toEqual([]);
    expect((await scan({ kind: "history" }, { cwd: dir })).length).toBe(range.length);
    expect((await scan({ kind: "path", path: "leaky.js" }, { cwd: dir })).length).toBe(range.length);
    expect(await scan({ kind: "path", path: "ok.txt" }, { cwd: dir })).toEqual([]);
  });

  it("adds the rotate note only when a remote already has the commit", async () => {
    const remote = track(fs.mkdtempSync(path.join(os.tmpdir(), "secret-me-remote-")));
    git(remote, "init", "-q", "--bare", "-b", "main");
    const dir = track(repoWith(leaky()));
    git(dir, "add", "-A");
    git(dir, "commit", "-qm", "leak");

    const local = await scan({ kind: "history" }, { cwd: dir });
    expect(local.length).toBeGreaterThan(0);
    expect(local.some(f => f.pushed || f.note)).toBe(false);
    expect((await scan({ kind: "outgoing" }, { cwd: dir })).length).toBe(local.length);

    git(dir, "remote", "add", "origin", remote);
    git(dir, "push", "-q", "origin", "main");
    const pushed = await scan({ kind: "history" }, { cwd: dir });
    expect(pushed.every(f => f.pushed && f.note?.includes("rotate it first"))).toBe(true);
    expect(await scan({ kind: "outgoing" }, { cwd: dir })).toEqual([]);
  });

  it("honours the repository's .secret-me.toml (with a reason) and refuses an entry without one", async () => {
    const files = {
      ...leaky(),
      ".secret-me.toml": "[[allowlists]]\ndescription = 'test fixtures'\npaths = ['''^leaky\\.js$''']\n",
    };
    const dir = track(repoWith(files));
    git(dir, "add", "-A");
    const findings = await scan({ kind: "staged" }, { cwd: dir });
    expect(findings.some(f => f.file === "leaky.js")).toBe(false);
    expect(findings.some(f => f.file === "private-key.txt")).toBe(true);

    fs.writeFileSync(path.join(dir, ".secret-me.toml"), "[[allowlists]]\npaths = ['''^leaky\\.js$''']\n");
    await expect(scan({ kind: "staged" }, { cwd: dir })).rejects.toThrow(/no description/);
  });

  it("scans content on stdin as the file it will become (path rules apply)", async () => {
    const dir = track(repoWith({}));
    expect(
      (await scan({ kind: "stdin", name: "src/a.js", content: read("leaky.js") }, { cwd: dir })).length
    ).toBeGreaterThan(0);
    const env = await scan({ kind: "stdin", name: ".env", content: "A=1\n" }, { cwd: dir });
    expect(env.map(f => f.rule)).toEqual(["secret-me-env-file"]);
    expect(await scan({ kind: "stdin", name: "src/a.js", content: read("public-values.js") }, { cwd: dir })).toEqual(
      []
    );
  });
});

describe("secret-me scan (the CLI)", () => {
  jest.setTimeout(120000);
  const cli = (cwd: string, ...args: string[]): { status: number | null; stdout: string; stderr: string } =>
    spawnSync("node", [CLI, ...args], { cwd, encoding: "utf8" });

  it("exits 1 with --json findings, 0 when clean and 2 on errors", () => {
    const dir = track(repoWith(leaky()));
    git(dir, "add", "-A");
    const bad = cli(dir, "scan", "--staged", "--json", "--sarif", path.join(dir, "out.sarif"));
    expect(bad.status).toBe(1);
    const json = JSON.parse(bad.stdout) as { count: number; findings: { rule: string; redacted: string }[] };
    expect(json.count).toBeGreaterThan(0);
    expect(json.findings.every(f => f.redacted.endsWith("****"))).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(dir, "out.sarif"), "utf8")).version).toBe("2.1.0");

    const clean = track(repoWith({ "ok.txt": "fine\n" }));
    expect(cli(clean, "scan", "--path", ".").status).toBe(0);
    expect(cli(clean, "scan", "--staged", "--history").status).toBe(2);
    expect(cli(clean, "scan", "--stdin").status).toBe(2);
    expect(cli(clean, "scan", "--config", "missing.toml").status).toBe(2);
  });
});
