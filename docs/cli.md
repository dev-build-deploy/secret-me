<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# CLI

```sh
npx secret-me scan [mode] [--json] [--sarif <file>] [--config <file>]
```

One mode at a time; without one, `--path .`.

| Mode | Scans |
| --- | --- |
| `--staged` | the staged changes (what a commit would add) |
| `--diff <range>` | the commits in a git range, e.g. `origin/main..HEAD` |
| `--outgoing` | the commits no remote has yet (what a push would send) |
| `--history` | the whole git history |
| `--path <path>` | a file or folder as it is on disk |
| `--stdin --name <file>` | content on stdin, scanned as the file it will become (path rules and allowlists apply); used by the Claude plugin |

`secret-me config` prints the effective gitleaks configuration (org rules + allowlist + `.secret-me.toml`).

## Output

Compact text, one line per finding (`file:line  rule  redacted  commit`), or `--json`:

```json
{"tool":"secret-me","version":"0.1.0","count":1,"findings":[{"rule":"secret-me-github-token","description":"GitHub token (...)","file":"src/app.js","line":12,"commit":"0123456789abcdef...","redacted":"ghp_****","pushed":true,"note":"already pushed: rotate it first (revoke and reissue), then clean the history"}]}
```

- **Redaction**: the first 4 characters, then `****` (at most half of a value shorter than 8 characters). The real value is never printed, logged or put in a report; gitleaks runs without `--verbose` and its report lives in a private temp folder that is removed afterwards.
- **`pushed` / `note`**: the commit is reachable from a remote-tracking branch (in CI: every scanned commit). Rotate first, then clean the history.
- `--sarif <file>` also writes a SARIF 2.1.0 report (see [github-action.md](github-action.md) for code scanning).
- Exit codes: `0` no findings, `1` findings, `2` error (bad option, bad config, no gitleaks, ...).

Re-running gives the same output (idempotent). A finding is silenced for good with an allowlist entry in [`.secret-me.toml`](config.md), for one line with a `gitleaks:allow` comment, or by fingerprint in `.gitleaksignore` (both are gitleaks features).

## gitleaks

secret-me runs gitleaks **8.30.1**: `SECRET_ME_GITLEAKS` or a `gitleaks` on the PATH when it is at least that version, else the release archive from GitHub, its SHA-256 checked against the checksum pinned in the source, cached under `~/.cache/secret-me` (`SECRET_ME_CACHE` to move it). A mismatch is refused.
