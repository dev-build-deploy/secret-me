/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { parse, stringify } from "smol-toml";

import { DEFAULT_CONFIG } from "./defaults.js";

/** The repository's configuration file, at its root. */
export const CONFIG_FILE = ".secret-me.toml";

type Table = Record<string, unknown>;

/** A configuration error (exit code 2). */
export class ConfigError extends Error {}

function asArray(value: unknown): Table[] {
  if (value === undefined) return [];
  if (!Array.isArray(value))
    throw new ConfigError("rules and allowlists must be TOML arrays of tables ([[rules]], [[allowlists]])");
  return value as Table[];
}

/** Every allowlist entry (also those nested in a rule) must say why the value is safe. */
export function checkReasons(config: Table, source: string): void {
  const check = (entry: Table, where: string): void => {
    const reason = entry.description;
    if (typeof reason !== "string" || reason.trim() === "") {
      throw new ConfigError(
        `${source}: ${where} has no description; every allowlist entry needs the reason it is safe`
      );
    }
  };
  asArray(config.allowlists).forEach((a, i) => check(a, `[[allowlists]] #${i + 1}`));
  if (config.allowlist !== undefined) check(config.allowlist as Table, "[allowlist]");
  asArray(config.rules).forEach(rule => {
    asArray(rule.allowlists).forEach((a, i) => check(a, `rule ${String(rule.id)}: [[rules.allowlists]] #${i + 1}`));
  });
}

/**
 * Merges the org defaults with the repository's configuration (rules and allowlists are appended) and tells
 * gitleaks to extend its own default rules.
 */
export function mergeConfig(repoToml?: string, repoSource = CONFIG_FILE): Table {
  const defaults = parse(DEFAULT_CONFIG) as Table;
  let repo: Table = {};
  if (repoToml !== undefined) {
    try {
      repo = parse(repoToml);
    } catch (error) {
      throw new ConfigError(`${repoSource}: ${(error as Error).message}`);
    }
    checkReasons(repo, repoSource);
  }
  const allowlists = [...asArray(defaults.allowlists), ...asArray(repo.allowlists)];
  if (repo.allowlist !== undefined) allowlists.push(repo.allowlist as Table);
  return {
    title: "secret-me",
    extend: { useDefault: true },
    rules: [...asArray(defaults.rules), ...asArray(repo.rules)],
    allowlists,
  };
}

/** Reads `.secret-me.toml` (or the given file) from the folder and merges it; a missing default file is fine. */
export function loadConfig(root: string, file?: string): Table {
  const target = path.resolve(root, file ?? CONFIG_FILE);
  if (!fs.existsSync(target)) {
    if (file) throw new ConfigError(`configuration file not found: ${file}`);
    return mergeConfig();
  }
  return mergeConfig(fs.readFileSync(target, "utf8"), path.relative(root, target) || CONFIG_FILE);
}

/** The merged configuration as the TOML gitleaks reads. */
export function toToml(config: Table): string {
  return stringify(config);
}
