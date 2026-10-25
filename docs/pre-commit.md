<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# pre-commit hook

[pre-commit](https://pre-commit.com) config:

```yaml
repos:
- repo: https://github.com/dev-build-deploy/secret-me
  rev: v0.1.0
  hooks:
  - id: secret-me
```

The hook (`.pre-commit-hooks.yaml`, id `secret-me`, stage `pre-commit`) runs `secret-me scan --staged` on the staged changes. It always runs (not only for some file types), needs Node 24, and downloads the pinned gitleaks on first use (cached). A finding fails the commit and prints it redacted, with file and line.

Without the pre-commit framework, a plain git hook: `.git/hooks/pre-commit`

```sh
#!/bin/sh
exec npx --yes secret-me scan --staged
```

An unpushed finding is fixed before it is ever a leak: unstage the file, remove the value, commit again.
