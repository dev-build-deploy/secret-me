/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

/** One leaked value, always redacted. */
export interface Finding {
  rule: string;
  description: string;
  file: string;
  line: number;
  /** The commit it was found in; empty for a staged change, a path or a file being written. */
  commit: string;
  /** The first characters of the value, then `****`. */
  redacted: string;
  /** The commit is reachable from a remote: the value has left this machine. */
  pushed: boolean;
  /** What to do about it; only on a pushed finding. */
  note?: string;
}

export const ROTATE_NOTE = "already pushed: rotate it first (revoke and reissue), then clean the history";

/** The first 4 characters, then `****` (at most half of a short value, so it never reveals it). */
export function redact(secret: string): string {
  const keep = Math.min(4, Math.floor(secret.length / 2));
  return `${secret.slice(0, keep)}****`;
}

/** One line per finding, compact for people and LLMs. */
export function formatText(findings: Finding[]): string {
  if (findings.length === 0) return "secret-me: no secrets found\n";
  const lines = [`secret-me: ${findings.length} ${findings.length === 1 ? "secret" : "secrets"} found`];
  for (const f of findings) {
    const where = f.line > 0 ? `${f.file}:${f.line}` : f.file;
    const commit = f.commit ? ` commit ${f.commit.slice(0, 8)}` : "";
    lines.push(`  ${where}  ${f.rule}  ${f.redacted}${commit}${f.note ? `  (${f.note})` : ""}`);
  }
  return `${lines.join("\n")}\n`;
}
