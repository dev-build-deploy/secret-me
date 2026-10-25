---
name: handling-secrets
description: How to work with secrets, tokens, passwords and keys without leaking them, and what to do after a leak. Use when code or config needs a credential, when the secret-me hook denies a Write, Edit, git commit or git push, or when a secret was committed or pushed.
---

<!--
SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->

# Handling secrets

SecretMe (gitleaks plus the org rules) checks every file Claude writes and every `git commit` and `git push`. It is deterministic: it denies a call that carries something that looks like a secret and shows it redacted (first 4 characters, then `****`).

## Never

- Never echo, print, log, paste or summarise a secret: not in a reply, a commit message, a comment, a test, a doc or a shell command (`echo $TOKEN`, `cat .env`, `env`, `printenv` dump the values into the conversation). To check a variable exists, test it without showing it: `[ -n "$NAME" ] && echo set`.
- Never write a real credential into a file, not even "temporarily" or in a test. Do not read `.env`, key files or credential stores unless the user asked you to.
- Never work around a denial (splitting the token, encoding it, writing it through `Bash`). The denial is the answer: change what you write.

## Instead

- **Code and config**: read the value at runtime from an environment variable (`process.env.NAME`, `os.environ["NAME"]`, `std::getenv`), and document the variable name, not its value. Config files hold a placeholder: `changeme`, `<token>`, `${NAME}`.
- **Local development**: a `.env` file that is git-ignored, plus a committed `.env.example` with placeholders (the rules ignore `.env.example`).
- **CI**: GitHub Actions secrets (`${{ secrets.NAME }}`), environments, or OIDC instead of long-lived tokens.
- **Production**: the platform's secret store (a cloud secret manager, a vault, the OS keychain), not the repository.
- **Tests**: obviously fake values that do not match a token shape, or build the value at run time. If a fixture must look like a token, put it under a path the repository allowlists in `.secret-me.toml`.
- **A known public value** (the Azure Storage emulator key, a documented example key): add an allowlist entry with a reason to `.secret-me.toml`:

  ```toml
  [[allowlists]]
  description = "why this value is public and safe"
  regexes = ['''the-exact-value''']
  ```

## After a leak

Order matters: the secret is compromised the moment it left the machine.

1. **Rotate first.** Revoke the credential at its provider and issue a new one. Do this before anything else; rewriting history does not un-leak a pushed value (forks, clones, caches and CI logs keep it).
2. Check the provider's audit log for use of the old credential.
3. **Then clean the history** if the value is in git: for a commit not yet pushed, amend or rebase it away; for a pushed one, rewrite with `git filter-repo` (or BFG), force-push, and ask collaborators to re-clone. Remember pull requests and forks keep the old commits.
4. Put the new value in the secret store, not the code, and run `secret-me scan --history` to confirm nothing is left.

A finding on a commit that is `pushed` always means step 1 first.
