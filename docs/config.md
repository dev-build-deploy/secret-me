<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# Configuration

`.secret-me.toml` in the repository root (or `--config <file>`) is optional. It uses [gitleaks' configuration schema](https://github.com/gitleaks/gitleaks#configuration); secret-me merges it with the org configuration and always extends gitleaks' default rules (`useDefault`).

## Org rules (built in)

| Rule | Finds |
| --- | --- |
| `secret-me-anthropic-key` | Anthropic API keys (`sk-ant-...`) |
| `secret-me-github-token` | `ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_` and `github_pat_` tokens |
| `secret-me-private-key` | PEM private key blocks (RSA, EC, OpenSSH, PGP, ...) |
| `secret-me-env-file` | a committed `.env` or `.env.<name>` file (templates ending in `.example`, `.sample`, `.template`, `.dist` are fine) |
| `secret-me-url-credentials` | `scheme://user:password@host` (placeholders such as `user:password@` are fine) |
| `secret-me-password-assignment` | a quoted password, secret, token or key assigned in code or config (entropy-checked) |
| `secret-me-config-assignment` | the unquoted form in `.env`, ini, yaml, toml, json and properties files (entropy-checked) |

When a gitleaks rule and a secret-me rule hit the same line, one finding is reported (the secret-me rule). `secret-me config` prints everything in effect.

## Org allowlist

Every allowlist entry carries a `description`: why the value is safe.

| Entry | Why |
| --- | --- |
| Azure Storage emulator (Azurite) account key for `devstoreaccount1` | the well-known development key from Microsoft's docs, bundled in `@azure/storage-blob` |
| `node_modules/` | installed dependencies are their publishers' to scan |

## Your allowlist and rules

```toml
# Known public value.
[[allowlists]]
description = "Stripe's documented test card token, public in their docs"
regexes = ['''tok_visa''']

# Fixtures with fake tokens.
[[allowlists]]
description = "Test fixtures hold obviously fake tokens on purpose"
paths = ['''^test/fixtures/''']

# A rule of your own.
[[rules]]
id = "acme-internal-token"
description = "ACME internal service token"
regex = '''acme_[a-z0-9]{32}'''
keywords = ["acme_"]
```

- Your `[[rules]]` and `[[allowlists]]` are **appended** to the org ones.
- An allowlist entry **without a `description` is an error** (exit 2). Entries match when any of `paths`, `regexes`, `commits`, `stopwords` match; add `condition = "AND"` to require all. `paths` match the repository-relative path, `regexes` the secret.
- Prefer the narrowest entry: the exact value, not a whole folder.
