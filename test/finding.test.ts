/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { formatText, redact, ROTATE_NOTE } from "../src/finding";

describe("redact", () => {
  it("keeps the first 4 characters, then ****", () => {
    expect(redact("abcdefghijkl")).toBe("abcd****");
  });
  it("never reveals more than half of a short value", () => {
    expect(redact("abcd")).toBe("ab****");
    expect(redact("")).toBe("****");
  });
});

describe("formatText", () => {
  it("says so when clean", () => {
    expect(formatText([])).toBe("secret-me: no secrets found\n");
  });
  it("prints one compact line per finding, with the rotate note when pushed", () => {
    const text = formatText([
      {
        rule: "r1",
        description: "d",
        file: "a.js",
        line: 3,
        commit: "0123456789abcdef",
        redacted: "abcd****",
        pushed: true,
        note: ROTATE_NOTE,
      },
      { rule: "r2", description: "d", file: ".env", line: 0, commit: "", redacted: "****", pushed: false },
    ]);
    expect(text).toBe(
      `secret-me: 2 secrets found\n  a.js:3  r1  abcd**** commit 01234567  (${ROTATE_NOTE})\n  .env  r2  ****\n`
    );
  });
});
