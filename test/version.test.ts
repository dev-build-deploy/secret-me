/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { VERSION } from "../src/version.js";

describe("version", () => {
  it("is a semantic version", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
