/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as fs from "node:fs";

import { Command } from "commander";

import { loadConfig, toToml } from "../config";
import { formatText } from "../finding";
import { toSarif } from "../sarif";
import { scan, ScanError, Target } from "../scanner";
import { VERSION } from "../version";

interface ScanFlags {
  staged?: boolean;
  diff?: string;
  outgoing?: boolean;
  history?: boolean;
  path?: string;
  stdin?: boolean;
  name?: string;
  json?: boolean;
  sarif?: string;
  config?: string;
}

function chooseTarget(flags: ScanFlags): Target {
  const modes = [flags.staged, flags.diff, flags.outgoing, flags.history, flags.path, flags.stdin].filter(Boolean);
  if (modes.length > 1) {
    throw new ScanError("choose one of --staged, --diff, --outgoing, --history, --path, --stdin");
  }
  if (flags.staged) return { kind: "staged" };
  if (flags.diff) return { kind: "range", range: flags.diff };
  if (flags.outgoing) return { kind: "outgoing" };
  if (flags.history) return { kind: "history" };
  if (flags.stdin) {
    if (!flags.name) throw new ScanError("--stdin needs --name <file> (the path the content is written to)");
    return { kind: "stdin", name: flags.name, content: fs.readFileSync(0, "utf8") };
  }
  return { kind: "path", path: flags.path ?? "." };
}

const program = new Command();
program
  .name("secret-me")
  .description("Flags secrets, tokens and passwords before they leave your machine (gitleaks, with org rules)")
  .version(VERSION);

program
  .command("scan")
  .description("Scan for secrets; exit 1 on findings, 2 on errors. Values are always redacted.")
  .option("--staged", "the staged changes (pre-commit)")
  .option("--diff <range>", "the commits in a git range, e.g. origin/main..HEAD")
  .option("--outgoing", "the commits no remote has yet (what a push would send)")
  .option("--history", "the whole git history")
  .option("--path <path>", "a file or folder, as it is on disk (default: .)")
  .option("--stdin", "content on stdin, scanned as the file --name")
  .option("--name <file>", "with --stdin: the path the content stands for")
  .option("--json", "machine-readable output")
  .option("--sarif <file>", "also write a SARIF 2.1.0 report")
  .option("--config <file>", "configuration file (default: .secret-me.toml)")
  .action(async (flags: ScanFlags) => {
    try {
      const findings = await scan(chooseTarget(flags), { config: flags.config });
      if (flags.sarif) fs.writeFileSync(flags.sarif, JSON.stringify(toSarif(findings), null, 2));
      if (flags.json) {
        process.stdout.write(
          `${JSON.stringify({ tool: "secret-me", version: VERSION, count: findings.length, findings })}\n`
        );
      } else {
        process.stdout.write(formatText(findings));
      }
      process.exitCode = findings.length > 0 ? 1 : 0;
    } catch (error) {
      process.stderr.write(`secret-me: error: ${(error as Error).message}\n`);
      process.exitCode = 2;
    }
  });

program
  .command("config")
  .description("Print the effective configuration (org rules + allowlist + .secret-me.toml) as gitleaks TOML")
  .option("--config <file>", "configuration file (default: .secret-me.toml)")
  .action((flags: { config?: string }) => {
    try {
      process.stdout.write(toToml(loadConfig(process.cwd(), flags.config)));
    } catch (error) {
      process.stderr.write(`secret-me: error: ${(error as Error).message}\n`);
      process.exitCode = 2;
    }
  });

program.parseAsync().catch((error: Error) => {
  process.stderr.write(`secret-me: error: ${error.message}\n`);
  process.exitCode = 2;
});
