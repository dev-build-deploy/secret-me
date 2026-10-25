/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { promisify } from "node:util";

import { loadConfig, toToml } from "./config.js";
import { Finding, redact, ROTATE_NOTE } from "./finding.js";
import { resolveGitleaks } from "./gitleaks.js";

const run = promisify(execFile);

/** What to scan. */
export type Target =
  | { kind: "staged" }
  | { kind: "range"; range: string }
  | { kind: "outgoing" }
  | { kind: "history" }
  | { kind: "path"; path: string }
  | { kind: "stdin"; name: string; content: string };

export interface ScanOptions {
  /** The folder to scan from (default: the current folder). */
  cwd?: string;
  /** The configuration file (default: `.secret-me.toml` in the git root, else in `cwd`). */
  config?: string;
  /** Treat every commit as pushed (a CI run only sees commits that are on the remote). */
  assumePushed?: boolean;
}

/** An error that is not a finding (exit code 2). */
export class ScanError extends Error {}

interface RawFinding {
  RuleID: string;
  Description: string;
  File: string;
  StartLine: number;
  Commit: string;
  Secret: string;
}

async function git(cwd: string, args: string[]): Promise<string> {
  const { stdout } = await run("git", args, { cwd, maxBuffer: 64 * 1024 * 1024 });
  return stdout.trim();
}

/** The root of the git repository around `cwd`, or `cwd` itself outside one. */
export async function repoRoot(cwd: string): Promise<string> {
  try {
    return await git(cwd, ["rev-parse", "--show-toplevel"]);
  } catch {
    return path.resolve(cwd);
  }
}

/** Whether a commit is reachable from a remote-tracking branch (it has left this machine). */
async function isPushed(cwd: string, commit: string): Promise<boolean> {
  try {
    return (await git(cwd, ["for-each-ref", "--contains", commit, "--count=1", "refs/remotes"])) !== "";
  } catch {
    return false;
  }
}

function gitleaksArgs(target: Target, cwd: string): string[] {
  switch (target.kind) {
    case "staged":
      return ["git", "--staged", "--pre-commit", "."];
    case "range":
      return ["git", `--log-opts=${target.range}`, "."];
    case "outgoing":
      return ["git", "--log-opts=HEAD --not --remotes", "."];
    case "history":
      return ["git", "."];
    case "path":
      return ["dir", path.relative(cwd, path.resolve(cwd, target.path)) || "."];
    case "stdin":
      return ["dir", "."];
  }
}

/**
 * Scans the target with the pinned gitleaks and the merged secret-me configuration.
 * Findings are deduplicated per line (a gitleaks and a secret-me rule on the same line report once, the secret-me
 * rule wins) and redacted.
 */
export async function scan(target: Target, options: ScanOptions = {}): Promise<Finding[]> {
  const start = path.resolve(options.cwd ?? process.cwd());
  const root = await repoRoot(start);
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "secret-me-"));
  try {
    const bin = await resolveGitleaks().catch((e: Error) => {
      throw new ScanError(`cannot get gitleaks: ${e.message}`);
    });
    const configPath = path.join(work, "gitleaks.toml");
    fs.writeFileSync(configPath, toToml(loadConfig(root, options.config)), { mode: 0o600 });

    let cwd = root;
    let staged: string | undefined;
    if (target.kind === "stdin") {
      // The content is scanned under its own relative path, so path rules and path allowlists apply to it.
      const abs = path.resolve(start, target.name);
      const rel = abs.startsWith(root + path.sep) ? path.relative(root, abs) : path.basename(abs);
      staged = path.join(work, "files");
      fs.mkdirSync(path.dirname(path.join(staged, rel)), { recursive: true });
      fs.writeFileSync(path.join(staged, rel), target.content, { mode: 0o600 });
      cwd = staged;
    } else if (target.kind === "path") {
      cwd = root;
    }

    const reportPath = path.join(work, "report.json");
    const args = [
      ...gitleaksArgs(target, cwd),
      "--config",
      configPath,
      "--report-format",
      "json",
      "--report-path",
      reportPath,
      "--exit-code",
      "0",
      "--no-banner",
      "--no-color",
      "--log-level",
      "error",
    ];
    // The repository's .gitleaksignore is honoured by gitleaks; findings never reach the logs (no --verbose).
    try {
      await run(bin, args, { cwd, maxBuffer: 64 * 1024 * 1024 });
    } catch (error) {
      const e = error as { stderr?: string; message: string };
      throw new ScanError(`gitleaks failed: ${(e.stderr || e.message).split("\n").slice(0, 3).join(" ").trim()}`);
    }

    const raw = JSON.parse(fs.readFileSync(reportPath, "utf8") || "[]") as RawFinding[] | null;
    return await toFindings(raw ?? [], root, options.assumePushed ?? false);
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

async function toFindings(raw: RawFinding[], root: string, assumePushed: boolean): Promise<Finding[]> {
  const pushedCache = new Map<string, boolean>();
  const byValue = new Map<string, Finding>();
  for (const r of raw) {
    const key = `${r.Commit}|${r.File}|${r.StartLine}`;
    const existing = byValue.get(key);
    if (existing && (existing.rule.startsWith("secret-me-") || !r.RuleID.startsWith("secret-me-"))) continue;
    let pushed = assumePushed && r.Commit !== "";
    if (!pushed && r.Commit) {
      if (!pushedCache.has(r.Commit)) pushedCache.set(r.Commit, await isPushed(root, r.Commit));
      pushed = pushedCache.get(r.Commit) === true;
    }
    byValue.set(key, {
      rule: r.RuleID,
      description: r.Description,
      file: r.File.replaceAll("\\", "/"),
      line: r.StartLine,
      commit: r.Commit,
      redacted: redact(r.Secret),
      pushed,
      ...(pushed ? { note: ROTATE_NOTE } : {}),
    });
  }
  return [...byValue.values()].sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule)
  );
}
