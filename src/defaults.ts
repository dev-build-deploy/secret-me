/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

/**
 * The org rules and the org allowlist, in gitleaks' own TOML schema. They are merged with gitleaks' default rules
 * (`useDefault`) and with the repository's `.secret-me.toml` (see docs/config.md).
 *
 * Every allowlist entry carries a `description`: the reason this value is safe to ignore.
 */
export const DEFAULT_CONFIG = String.raw`
title = "secret-me"

[[rules]]
id = "secret-me-anthropic-key"
description = "Anthropic API key"
regex = '''sk-ant-[a-z0-9]{2,8}-[A-Za-z0-9_\-]{20,}'''
keywords = ["sk-ant-"]

[[rules]]
id = "secret-me-github-token"
description = "GitHub token (personal, OAuth, user-to-server, server-to-server, refresh, fine-grained)"
regex = '''\b(?:gh[pousr]_[A-Za-z0-9]{30,255}|github_pat_[A-Za-z0-9_]{50,255})\b'''
keywords = ["ghp_", "gho_", "ghu_", "ghs_", "ghr_", "github_pat_"]

[[rules]]
id = "secret-me-private-key"
description = "Private key block"
regex = '''-----BEGIN[ A-Z0-9]*PRIVATE KEY(?: BLOCK)?-----\s*(?:[A-Za-z0-9+/=:,. -]+\s+)?([A-Za-z0-9+/=]{16,})'''
secretGroup = 1
keywords = ["private key"]

[[rules]]
id = "secret-me-env-file"
description = "A .env file (it holds secrets by design; keep it out of git)"
path = '''(?:^|/)\.env(?:\.[A-Za-z0-9_-]+)?$'''
  [[rules.allowlists]]
  description = ".env.example and friends are templates, not secrets"
  paths = ['''\.(?:example|sample|template|dist|defaults?)$''']

[[rules]]
id = "secret-me-url-credentials"
description = "Password in a URL (scheme://user:password@host)"
regex = '''[A-Za-z][A-Za-z0-9+.-]*://[^\s:@/"'<>]+:([^\s@/"'<>$][^\s@/"'<>]{2,})@[A-Za-z0-9.\-\[\]]+'''
secretGroup = 1
entropy = 2.0
keywords = ["://"]
  [[rules.allowlists]]
  description = "Placeholders and variable references in URLs"
  regexes = ['''^(?i:pass(?:w(?:or)?d)?|changeme|secret|x+|\*+|\{\{.*|%s)$''']
  stopwords = ["changeme", "example"]

[[rules]]
id = "secret-me-password-assignment"
description = "Quoted password, secret, token or key assigned in code or config"
regex = '''(?i)\b[\w.-]*(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?key|auth[_-]?token|token|credential)s?["']?\s*[:=]\s*["']([^\s"'$<>{}()\[\]][^\s"']{7,})["']'''
secretGroup = 1
entropy = 3.3
keywords = ["password", "passwd", "pwd", "secret", "key", "token", "credential"]
  [[rules.allowlists]]
  description = "Placeholders, test values and references"
  stopwords = ["example", "changeme", "placeholder", "your_", "your-", "xxxxxxxx", "process.env", "secrets.", "env."]

[[rules]]
id = "secret-me-config-assignment"
description = "Unquoted password, secret, token or key in an env, ini, yaml or properties file"
regex = '''(?im)^\s*(?:export\s+)?[\w.-]*(?:password|passwd|secret|api[_-]?key|access[_-]?key|auth[_-]?token|token|credential)s?\s*[:=]\s*([^\s"'$<>{}()\[\],;#][^\s"',;#]{7,})\s*$'''
secretGroup = 1
entropy = 3.5
keywords = ["password", "passwd", "secret", "key", "token", "credential"]
path = '''(?:^|/)(?:\.env[^/]*|[^/]*\.(?:env|ini|cfg|conf|properties|toml|ya?ml|json|tfvars))$'''
  [[rules.allowlists]]
  description = "Placeholders and references"
  stopwords = ["example", "changeme", "placeholder", "your_", "your-", "process.env", "secrets."]

[[allowlists]]
description = "Azure Storage emulator (Azurite) well-known development account key, published in Microsoft's docs and bundled in @azure/storage-blob"
regexes = ['''Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==''']

[[allowlists]]
description = "Installed dependencies are not ours to scan (their lockfiles and bundles are covered by their publishers)"
paths = ['''(?:^|/)node_modules/''']
`;
