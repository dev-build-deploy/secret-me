// SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
// SPDX-License-Identifier: MIT

import type { Register } from 'claude-code'

/**
 * Claude Code companion of SecretMe: nothing that looks like a secret, token or password is written to a file, and
 * no commit or push carries one. The scanning is the same deterministic secret-me CLI (gitleaks with the org rules)
 * the pre-commit hook and the GitHub Action run, bundled in `../bundle`; this hook only calls it.
 * Findings are redacted (first 4 characters, then `****`): the secret never reaches Claude's context again.
 */

export type Finding = {
  rule: string
  file: string
  line: number
  commit: string
  redacted: string
  pushed: boolean
  note?: string
}

export type ScanResult = { findings: Finding[] } | { error: string }

const ADVICE =
  'Do not put the value in a file: read it from an environment variable (process.env.NAME, os.environ["NAME"]) ' +
  'or the platform secret store (GitHub Actions secrets, a keychain, a vault) and write a placeholder such as ' +
  '"changeme" or "<token>" here. If it is a known public value (a test or emulator key), allowlist it with a reason ' +
  'in .secret-me.toml instead. Never echo or paste the real value.'

/** What a `git` command line is about to do: a commit, a push, or neither. */
export function gitAction(command: string): 'commit' | 'push' | undefined {
  for (const segment of command.split(/&&|\|\||;|\||\n/)) {
    const tokens = segment.trim().split(/\s+/)
    if (tokens[0] !== 'git') continue
    let i = 1
    // Skip git's own options: -C <dir>, -c <k=v>, --no-pager, --git-dir=...
    while (i < tokens.length && tokens[i].startsWith('-')) i += tokens[i] === '-C' || tokens[i] === '-c' ? 2 : 1
    if (tokens[i] === 'commit' || tokens[i] === 'push') return tokens[i] as 'commit' | 'push'
  }
  return undefined
}

export function parseScan(exitCode: number, stdout: string, stderr: string): ScanResult {
  if (exitCode === 0 || exitCode === 1) {
    try {
      const parsed = JSON.parse(stdout) as { findings?: Finding[] }
      return { findings: parsed.findings ?? [] }
    } catch {
      return { error: 'unreadable scan output' }
    }
  }
  return { error: (stderr || `exit ${exitCode}`).trim().split('\n')[0] }
}

export function describe(findings: Finding[]): string {
  return findings
    .slice(0, 10)
    .map(f => `${f.file}${f.line > 0 ? `:${f.line}` : ''} ${f.rule} ${f.redacted}${f.commit ? ` (commit ${f.commit.slice(0, 8)})` : ''}`)
    .join('; ')
}

/** Denial text for content about to be written, or undefined to let it through. */
export function denyWrite(path: string, result: ScanResult): string | undefined {
  if ('error' in result || result.findings.length === 0) return undefined
  return `secret-me: not writing ${path}: ${describe(result.findings)}. ${ADVICE}`
}

/** Denial text for a git commit or push, or undefined to let it through. */
export function denyGit(action: 'commit' | 'push', result: ScanResult): string | undefined {
  if ('error' in result || result.findings.length === 0) return undefined
  const { findings } = result
  return (
    `secret-me: git ${action} blocked, ${findings.length} secret(s) ${action === 'commit' ? 'staged' : 'in the commits to push'}: ` +
    `${describe(findings)}. ` +
    (action === 'commit'
      ? 'Unstage the file (git restore --staged), remove the value, then commit. '
      : 'Remove the value from those commits (amend or rebase), and rotate it if it was ever pushed. ') +
    (findings.some(f => f.pushed) ? 'It is already on a remote: rotate it first, then clean the history. ' : '') +
    ADVICE
  )
}

// A scanner that cannot run must not lock the session: an error lets the call through, with a toast.
const toRun = (r: { exitCode: number; stdout: string; stderr: string }): ScanResult => parseScan(r.exitCode, r.stdout, r.stderr)
const failed = (what: string, result: ScanResult): string | undefined =>
  'error' in result ? `secret-me: could not scan ${what} (${result.error}); not blocked` : undefined

export const register: Register = on => {
  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    if (!e.content) return next(e)
    const result = await $.process
      .run(['node', `${$.plugin.root}/bundle/index.js`, 'scan', '--json', '--stdin', '--name', e.file_path], {
        cwd: await $.session.cwd(),
        stdin: e.content,
        timeoutMs: 120000,
      })
      .then(toRun, (err: Error): ScanResult => ({ error: err.message }))
    const problem = failed(e.file_path, result)
    if (problem) $.ui.toast(problem)
    const deny = denyWrite(e.file_path, result)
    return deny ? { deny } : next(e)
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    if (!e.new_string) return next(e)
    const result = await $.process
      .run(['node', `${$.plugin.root}/bundle/index.js`, 'scan', '--json', '--stdin', '--name', e.file_path], {
        cwd: await $.session.cwd(),
        stdin: e.new_string,
        timeoutMs: 120000,
      })
      .then(toRun, (err: Error): ScanResult => ({ error: err.message }))
    const problem = failed(e.file_path, result)
    if (problem) $.ui.toast(problem)
    const deny = denyWrite(e.file_path, result)
    return deny ? { deny } : next(e)
  })

  on('tool.call', { tool: 'NotebookEdit' }, async ($, e, next) => {
    if (!e.new_source) return next(e)
    const result = await $.process
      .run(['node', `${$.plugin.root}/bundle/index.js`, 'scan', '--json', '--stdin', '--name', e.notebook_path], {
        cwd: await $.session.cwd(),
        stdin: e.new_source,
        timeoutMs: 120000,
      })
      .then(toRun, (err: Error): ScanResult => ({ error: err.message }))
    const problem = failed(e.notebook_path, result)
    if (problem) $.ui.toast(problem)
    const deny = denyWrite(e.notebook_path, result)
    return deny ? { deny } : next(e)
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const action = gitAction(e.command)
    if (!action) return next(e)
    const result = await $.process
      .run(['node', `${$.plugin.root}/bundle/index.js`, 'scan', '--json', action === 'commit' ? '--staged' : '--outgoing'], {
        cwd: await $.session.cwd(),
        timeoutMs: 120000,
      })
      .then(toRun, (err: Error): ScanResult => ({ error: err.message }))
    const problem = failed(`git ${action}`, result)
    if (problem) $.ui.toast(problem)
    const deny = denyGit(action, result)
    return deny ? { deny } : next(e)
  })
}
