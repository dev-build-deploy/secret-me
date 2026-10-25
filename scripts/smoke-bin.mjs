// SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
// SPDX-License-Identifier: CC0-1.0

// Runs the committed bundles the way users do: `bin/secret-me --help`, `bin/secret-me scan --path` on a clean and a
// leaky file, and the Claude plugin's call (`node claude-plugin/bundle/index.js scan --json --stdin --name <file>`,
// content on a stdin pipe). Catches a bundle or bin wrapper that no longer loads (e.g. CommonJS `require` of an ESM
// bundle). Usage: node scripts/smoke-bin.mjs

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const bin = resolve("bin/secret-me");
const plugin = resolve("claude-plugin/bundle/index.js");
const fixture = resolve("test/fixtures/leaky.js");
const dir = mkdtempSync(join(tmpdir(), "secret-me-smoke-"));
const clean = join(dir, "clean.js");
writeFileSync(clean, "export const answer = 42;\n");
// A copy outside the repository: this repository's own .secret-me.toml allows the fixtures.
const leaky = join(dir, "leaky.js");
writeFileSync(leaky, readFileSync(fixture));

const cases = [
  { args: [bin, "--help"], exit: 0, output: /Usage: secret-me/ },
  { args: [bin, "scan", "--path", clean], exit: 0 },
  { args: [bin, "scan", "--path", leaky], exit: 1, output: /secret-me-/ },
  { args: [plugin, "scan", "--json", "--stdin", "--name", "x.js"], input: readFileSync(fixture), exit: 1, output: /"count":\s*[1-9]/ },
  { args: [plugin, "scan", "--json", "--stdin", "--name", "x.js"], input: "export const answer = 42;\n", exit: 0 },
];

let failed = false;
for (const c of cases) {
  const run = spawnSync(process.execPath, c.args, { encoding: "utf8", input: c.input, timeout: 120000 });
  const out = `${run.stdout}${run.stderr}`;
  const ok = run.status === c.exit && (!c.output || c.output.test(out));
  console.log(`${ok ? "ok  " : "FAIL"} node ${c.args.map(a => a.replace(dir, "<tmp>").replace(resolve("."), ".")).join(" ")} (exit ${run.status}, expected ${c.exit})`);
  if (!ok) {
    failed = true;
    console.error(out.trim());
  }
}
rmSync(dir, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
