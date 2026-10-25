<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# SecretMe

Flags **any secret, token or password** before it leaves your machine, in four places: while you work (the [Claude Code plugin](docs/claude-plugin.md)), when you commit (the [pre-commit hook](docs/pre-commit.md)), when you open a pull request or push (the [GitHub Action](docs/github-action.md)), and on demand (the [CLI](docs/cli.md)).

It does not reinvent a scanner: it wraps [gitleaks](https://github.com/gitleaks/gitleaks) (pinned, the release checksum verified, cached) and adds the organisation's rules and allowlist ([config](docs/config.md)). Deterministic, no AI; compact or `--json` output; findings are **always redacted** (the first 4 characters, then `****`), so a report never becomes a second leak.

```console
$ secret-me scan --staged
secret-me: 2 secrets found
  src/app.js:12  secret-me-github-token  ghp_****
  .env  secret-me-env-file  ****
$ echo $?
1
```

## What it catches

gitleaks' default rules, plus the org rules: Anthropic API keys, GitHub tokens of every kind (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`, `github_pat_`), private key blocks, `.env` files (not `.env.example`), passwords in URLs (`scheme://user:password@host`) and passwords or credentials in code and config. Known public values (the Azure Storage emulator's development key to start with) are allowlisted, each with a reason; a repository adds its own in `.secret-me.toml`.

## Use it

| Where | How | Docs |
| --- | --- | --- |
| Terminal | `npx secret-me scan --staged`, `--diff origin/main..HEAD`, `--history`, `--path src` | [docs/cli.md](docs/cli.md) |
| pre-commit | `id: secret-me` from this repository | [docs/pre-commit.md](docs/pre-commit.md) |
| GitHub | `uses: dev-build-deploy/secret-me@v0` on pull_request, push and schedule | [docs/github-action.md](docs/github-action.md) |
| Claude Code | the `secret-me` plugin: denies a Write, Edit, `git commit` or `git push` that carries a secret | [docs/claude-plugin.md](docs/claude-plugin.md) |

Exit codes: `0` clean, `1` findings, `2` error. When a finding sits in a commit a remote already has, the report says to **rotate the secret first**, then clean the history: a pushed secret is compromised.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Test fixtures use obviously fake tokens, and their paths are allowlisted in this repository's own [.secret-me.toml](.secret-me.toml); the repository scans itself in CI.

## License

- [MIT](./LICENSES/MIT.txt) © 2026 Kevin de Jong <monkaii@hotmail.com>
