/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import { ConfigError, mergeConfig, toToml } from "../src/config";

type Rule = { id: string };

describe("mergeConfig", () => {
  it("extends the gitleaks defaults and carries the org rules and the Azure emulator allowlist", () => {
    const config = mergeConfig();
    expect(config.extend).toEqual({ useDefault: true });
    const ids = (config.rules as Rule[]).map(r => r.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "secret-me-anthropic-key",
        "secret-me-github-token",
        "secret-me-private-key",
        "secret-me-env-file",
        "secret-me-url-credentials",
        "secret-me-password-assignment",
      ])
    );
    expect(toToml(config)).toContain("Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1");
  });

  it("gives every built-in allowlist entry a reason", () => {
    for (const a of mergeConfig().allowlists as { description: string }[]) {
      expect(a.description.length).toBeGreaterThan(10);
    }
  });

  it("appends the repository's rules and allowlists", () => {
    const config = mergeConfig(
      `[[rules]]\nid = "mine"\nregex = '''zzz'''\n[[allowlists]]\ndescription = "a reason"\npaths = ['''^docs/''']`
    );
    expect((config.rules as Rule[]).at(-1)?.id).toBe("mine");
    expect((config.allowlists as unknown[]).length).toBe((mergeConfig().allowlists as unknown[]).length + 1);
  });

  it("refuses an allowlist entry without a reason", () => {
    expect(() => mergeConfig("[[allowlists]]\npaths = ['''^docs/''']")).toThrow(ConfigError);
    expect(() => mergeConfig("[[allowlists]]\ndescription = '  '\npaths = ['''^docs/''']")).toThrow(/no description/);
    expect(() => mergeConfig("[allowlist]\npaths = ['''^docs/''']")).toThrow(/no description/);
    expect(() => mergeConfig("[[rules]]\nid='x'\nregex='''y'''\n[[rules.allowlists]]\nstopwords=['z']")).toThrow(
      /rule x/
    );
  });

  it("names the file on a TOML syntax error", () => {
    expect(() => mergeConfig("[[rules", "my.toml")).toThrow(/my.toml/);
  });
});
