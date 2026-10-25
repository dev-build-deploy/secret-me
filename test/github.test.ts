/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { Finding } from "../src/finding";
import { commentBody, COMMENT_MARKER, targetFor } from "../src/github";

describe("targetFor", () => {
  it("scans the commits of a pull request", () => {
    expect(
      targetFor({
        eventName: "pull_request",
        payload: { pull_request: { base: { sha: "aaa" }, head: { sha: "bbb" } } },
      })
    ).toEqual({ kind: "range", range: "aaa..bbb" });
  });
  it("scans the pushed commits", () => {
    expect(targetFor({ eventName: "push", payload: { before: "aaa", after: "bbb" } })).toEqual({
      kind: "range",
      range: "aaa..bbb",
    });
  });
  it("scans the carried commits of a new branch", () => {
    expect(
      targetFor({ eventName: "push", payload: { before: "0".repeat(40), after: "bbb", commits: [1, 2, 3] } })
    ).toEqual({
      kind: "range",
      range: "-3 bbb",
    });
  });
  it("scans the full history on schedule and manual runs", () => {
    expect(targetFor({ eventName: "schedule", payload: {} })).toEqual({ kind: "history" });
    expect(targetFor({ eventName: "workflow_dispatch", payload: {} })).toEqual({ kind: "history" });
  });
});

describe("commentBody", () => {
  const finding: Finding = {
    rule: "secret-me-github-token",
    description: "GitHub token",
    file: "a.js",
    line: 2,
    commit: "0123456789abcdef",
    redacted: "ghp_****",
    pushed: true,
  };
  it("is marked, redacted and says what to do", () => {
    const body = commentBody([finding]);
    expect(body.startsWith(COMMENT_MARKER)).toBe(true);
    expect(body).toContain("`ghp_****`");
    expect(body).toContain("rotate it first");
  });
  it("reports a clean pull request", () => {
    expect(commentBody([])).toContain("No secrets found");
  });
});
