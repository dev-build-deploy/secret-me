<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# GitHub Action

```yaml
name: Secret scan
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: "17 4 * * 1"
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write   # the sticky comment
  security-events: write # only for the SARIF upload below

jobs:
  secret-me:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0   # the scan walks commits
      - uses: dev-build-deploy/secret-me@v0
        with:
          token: ${{ github.token }}
          sarif-file: secret-me.sarif   # optional
      - uses: github/codeql-action/upload-sarif@v4   # optional: code scanning
        if: always() && hashFiles('secret-me.sarif') != ''
        with:
          sarif_file: secret-me.sarif
          category: secret-me
```

## What it scans

| Event | Scanned |
| --- | --- |
| `pull_request` | the PR's commits (`base..head`); fails on findings and keeps **one sticky comment** (redacted) up to date, switching it to "no secrets" once fixed |
| `push` | the pushed commits (`before..after`; a new branch: the commits the push carries) |
| `schedule`, `workflow_dispatch` | the full history |

Every finding also becomes an error annotation on the file and line. Everything in CI counts as pushed, so each finding says to rotate first, then clean the history.

## Inputs and outputs

| Input | Default | |
| --- | --- | --- |
| `token` | | for the sticky PR comment (fork PRs get a read-only token: the comment is skipped with a warning, the annotations and the failed check remain) |
| `comment` | `true` | post the sticky comment |
| `fail-on-findings` | `true` | fail the step on findings |
| `config` | `.secret-me.toml` | configuration file |
| `sarif-file` | | write a SARIF 2.1.0 report here (the action cannot upload it itself; use `github/codeql-action/upload-sarif` as above) |

Outputs: `count`, `findings` (JSON, redacted), `sarif-file`.

The action downloads the pinned gitleaks (SHA-256 verified) into the runner's cache folder on every run unless `gitleaks` (>= 8.30.1) is on the PATH.
