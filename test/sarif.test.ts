/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { toSarif } from "../src/sarif";

describe("toSarif", () => {
  it("writes a SARIF 2.1.0 log with redacted results", () => {
    const log = toSarif([
      { rule: "r1", description: "d", file: "a.js", line: 4, commit: "", redacted: "abcd****", pushed: false },
      { rule: "r1", description: "d", file: "b.js", line: 0, commit: "", redacted: "****", pushed: false },
    ]) as {
      version: string;
      runs: { tool: { driver: { rules: unknown[] } }; results: { message: { text: string } }[] }[];
    };
    expect(log.version).toBe("2.1.0");
    expect(log.runs[0].tool.driver.rules).toHaveLength(1);
    expect(log.runs[0].results).toHaveLength(2);
    expect(log.runs[0].results[0].message.text).toContain("abcd****");
  });
});
