/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import {
  compareVersions,
  GITLEAKS_CHECKSUMS,
  GITLEAKS_VERSION,
  platformAsset,
  resolveGitleaks,
  binaryVersion,
} from "../src/gitleaks";

describe("gitleaks pin", () => {
  it("compares versions", () => {
    expect(compareVersions("8.30.1", "8.30.1")).toBe(0);
    expect(compareVersions("8.31.0", "8.30.1")).toBeGreaterThan(0);
    expect(compareVersions("v8.9.0", "8.30.1")).toBeLessThan(0);
  });

  it("has a SHA-256 for every platform archive", () => {
    for (const sum of Object.values(GITLEAKS_CHECKSUMS)) expect(sum).toMatch(/^[0-9a-f]{64}$/);
  });

  it("maps this platform to an archive", () => {
    expect(platformAsset("linux", "x64")).toBe("linux_x64.tar.gz");
    expect(platformAsset("darwin", "arm64")).toBe("darwin_arm64.tar.gz");
    expect(platformAsset("win32", "x64")).toBe("windows_x64.zip");
    expect(() => platformAsset("freebsd", "x64")).toThrow(/no gitleaks release/);
  });

  it("resolves a gitleaks that is at least the pinned version", async () => {
    const bin = await resolveGitleaks();
    const version = await binaryVersion(bin);
    expect(version).toBeDefined();
    expect(compareVersions(version ?? "0", GITLEAKS_VERSION)).toBeGreaterThanOrEqual(0);
  }, 120000);
});
