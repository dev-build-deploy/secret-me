/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { Finding, ROTATE_NOTE } from "./finding";
import { Target } from "./scanner";

/** Hidden marker of the one sticky pull request comment. */
export const COMMENT_MARKER = "<!-- secret-me -->";

const ZERO_SHA = /^0+$/;

/** The parts of the GitHub event payload the action reads. */
export interface EventInfo {
  eventName: string;
  payload: {
    pull_request?: { base: { sha: string }; head: { sha: string } };
    before?: string;
    after?: string;
    commits?: unknown[];
  };
}

/** What to scan for an event: PR commits, pushed commits, or the whole history. */
export function targetFor(event: EventInfo): Target {
  const { eventName, payload } = event;
  if ((eventName === "pull_request" || eventName === "pull_request_target") && payload.pull_request) {
    return { kind: "range", range: `${payload.pull_request.base.sha}..${payload.pull_request.head.sha}` };
  }
  if (eventName === "push" && payload.after) {
    if (payload.before && !ZERO_SHA.test(payload.before)) {
      return { kind: "range", range: `${payload.before}..${payload.after}` };
    }
    // A new branch has no "before": scan the commits the push carries.
    const count = Math.max(payload.commits?.length ?? 1, 1);
    return { kind: "range", range: `-${count} ${payload.after}` };
  }
  return { kind: "history" };
}

/** The sticky pull request comment: redacted, and what to do about it. */
export function commentBody(findings: Finding[]): string {
  if (findings.length === 0) {
    return `${COMMENT_MARKER}\n### SecretMe\n\nNo secrets found in the commits of this pull request.\n`;
  }
  const rows = findings
    .map(
      f =>
        `| \`${f.file}${f.line > 0 ? `:${f.line}` : ""}\` | \`${f.rule}\` | \`${f.redacted}\` | \`${f.commit.slice(0, 8)}\` |`
    )
    .join("\n");
  return [
    COMMENT_MARKER,
    "### SecretMe: secrets found",
    "",
    `${findings.length} ${findings.length === 1 ? "secret" : "secrets"} in the commits of this pull request (values redacted).`,
    "",
    "| Location | Rule | Value | Commit |",
    "| --- | --- | --- | --- |",
    rows,
    "",
    `**${ROTATE_NOTE[0].toUpperCase()}${ROTATE_NOTE.slice(1).replace("already pushed", "These commits are pushed")}.**`,
    "Remove the value from the code (use an environment variable or a secret store), rewrite the commits, and force-push.",
    "A known public value (a test key, an emulator key) goes into `.secret-me.toml` as an allowlist entry with a reason.",
    "",
  ].join("\n");
}
