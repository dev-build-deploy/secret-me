<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# Claude Code plugin

The `secret-me` plugin keeps [Claude Code](https://claude.com/claude-code) from writing or committing a secret. It lives in [`claude-plugin/`](../claude-plugin) and bundles the same CLI (`claude-plugin/bundle`, rebuilt by `npm run build:plugin`, checked in CI), so it needs only `node` on the PATH.

## Install

```
/plugin marketplace add dev-build-deploy/claude-plugins
/plugin install secret-me@dev-build-deploy
```

or straight from a clone: `claude --plugin-dir ./claude-plugin`.

## What it does

- **Write, Edit, NotebookEdit**: the content about to be written is scanned (`secret-me scan --stdin --name <file>`, so path rules and your `.secret-me.toml` allowlist apply). A finding **denies** the call with the redacted finding and how to avoid it: an environment variable, a secret store, a placeholder.
- **Bash**: a `git commit` scans what is staged, a `git push` what is outgoing (commits no remote has). A finding denies the command; a pushed one says to rotate first.
- **Skill `handling-secrets`**: never echo, print or paste a secret; environment variables and the platform's secret store; after a leak, rotate first, then clean history.
- If the scanner cannot run (no `node`, no network for the first gitleaks download), the call goes through with a toast: a broken scanner must not lock the session. CI and the pre-commit hook remain the gates.

Not covered: `git commit -a` / `-am` (tracked changes not yet staged) and secrets written through `Bash` (`cat >`, `tee`); the pre-commit hook and CI catch those.

## Tests

`claude plugin test claude-plugin` (a fake token in a Write is denied, clean content and the Azure dev key pass, commit and push are guarded). The real scanning of the same content is covered by the jest suite.

## Marketplace entry

For `dev-build-deploy/claude-plugins` (`.claude-plugin/marketplace.json`, in `plugins`), a `git-subdir` source like reuse-me's:

```json
{
  "name": "secret-me",
  "description": "Denies a Write, Edit, git commit or git push that would carry a secret, token or password (gitleaks with org rules; redacted findings).",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/dev-build-deploy/secret-me.git",
    "path": "claude-plugin",
    "ref": "main"
  }
}
```
