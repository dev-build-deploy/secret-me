/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

/** The gitleaks release secret-me is built and tested against. */
export const GITLEAKS_VERSION = "8.30.1";

/** SHA-256 of each release archive, from gitleaks_8.30.1_checksums.txt of the release. */
export const GITLEAKS_CHECKSUMS: Record<string, string> = {
  "darwin_arm64.tar.gz": "b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5",
  "darwin_x64.tar.gz": "dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709",
  "linux_arm64.tar.gz": "e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080",
  "linux_x64.tar.gz": "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb",
  "windows_arm64.zip": "b95f5e4f5c425cedca7ee203d9afd29597e692c4924a12ed42f970537c72cc0f",
  "windows_x64.zip": "d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e",
};

/** Compares dotted versions: negative when a < b. */
export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^v/, "").split(".").map(Number);
  const pb = b.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** The archive suffix of this platform, as keyed in GITLEAKS_CHECKSUMS. */
export function platformAsset(platform = process.platform, arch = process.arch): string {
  const os_ = platform === "win32" ? "windows" : platform;
  const cpu = arch === "x64" ? "x64" : arch === "arm64" ? "arm64" : arch;
  const suffix = `${os_}_${cpu}.${platform === "win32" ? "zip" : "tar.gz"}`;
  if (!(suffix in GITLEAKS_CHECKSUMS)) throw new Error(`no gitleaks release for ${platform}/${arch}`);
  return suffix;
}

/** The cache folder of the pinned gitleaks binary (override with SECRET_ME_CACHE). */
export function cacheDir(): string {
  const base =
    process.env.SECRET_ME_CACHE ??
    path.join(process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"), "secret-me");
  return path.join(base, `gitleaks-${GITLEAKS_VERSION}`);
}

/** The version of a gitleaks binary, or undefined when it does not run. */
export async function binaryVersion(bin: string): Promise<string | undefined> {
  try {
    const { stdout } = await run(bin, ["version"]);
    return /\d+\.\d+\.\d+/.exec(stdout)?.[0];
  } catch {
    return undefined;
  }
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`download failed (${res.status}): ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Finds the gitleaks to run: SECRET_ME_GITLEAKS, else one on the PATH that is at least the pinned version, else the
 * pinned release from GitHub (SHA-256 verified against GITLEAKS_CHECKSUMS) cached under the user's cache folder.
 */
export async function resolveGitleaks(): Promise<string> {
  const candidates = [process.env.SECRET_ME_GITLEAKS, "gitleaks"].filter((c): c is string => !!c);
  for (const bin of candidates) {
    const v = await binaryVersion(bin);
    if (v && compareVersions(v, GITLEAKS_VERSION) >= 0) return bin;
  }

  const dir = cacheDir();
  const bin = path.join(dir, process.platform === "win32" ? "gitleaks.exe" : "gitleaks");
  if ((await binaryVersion(bin)) === GITLEAKS_VERSION) return bin;

  const suffix = platformAsset();
  const url = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_${suffix}`;
  const archive = await download(url);
  const sum = createHash("sha256").update(archive).digest("hex");
  if (sum !== GITLEAKS_CHECKSUMS[suffix]) {
    throw new Error(`checksum mismatch for ${url} (got ${sum}); refusing to run it`);
  }

  fs.mkdirSync(dir, { recursive: true });
  const archivePath = path.join(dir, `archive.${suffix.endsWith(".zip") ? "zip" : "tar.gz"}`);
  fs.writeFileSync(archivePath, archive);
  await run("tar", ["-xf", archivePath, "-C", dir, path.basename(bin)]);
  fs.rmSync(archivePath);
  fs.chmodSync(bin, 0o755);
  return bin;
}
