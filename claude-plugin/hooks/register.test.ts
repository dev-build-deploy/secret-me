// SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
// SPDX-License-Identifier: MIT

import { expect, test } from 'claude-code/testing'

import { gitAction, parseScan } from './register'

const ROOT = '/private/tmp/secret-me-plugin-test'

// FAKE values, assembled at run time so this file holds no token-shaped literal.
const FAKE_GITHUB = ['ghp', '_', 'FAKE0FAKE1FAKE2FAKE3FAKE4FAKE5FAKE6FA'].join('')
const AZURE_KEY = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='

// Stands for the engine beneath the plugin. `process.run` plays the bundled CLI: a hooks module cannot spawn the real one
// from a test, so the real scanning (the same content through gitleaks, the Azure key included) is covered by
// test/scan.test.ts in the jest suite; here we test what the hooks do with the CLI's answers.
const out = (findings: any[]) => ({ exitCode: findings.length ? 1 : 0, stdout: JSON.stringify({ findings }), stderr: '' })
const github = (file: string, extra: any = {}) => ({ rule: 'secret-me-github-token', file, line: 1, commit: '', redacted: 'ghp_****', pushed: false, ...extra })

function fakeCli(argv: string[], stdin: string) {
  const name = argv[argv.indexOf('--name') + 1] ?? ''
  if (argv.includes('--stdin')) {
    if (/(^|\/)\.env$/.test(name)) return out([{ rule: 'secret-me-env-file', file: name, line: 0, commit: '', redacted: '****', pushed: false }])
    // known public values are allowlisted by the real CLI; the FAKE token is not
    return stdin.includes('ghp' + '_') ? out([github(name)]) : out([])
  }
  if (argv.includes('--staged')) return out([github('src/a.js')])
  if (argv.includes('--outgoing')) return out([github('src/a.js', { commit: '0123456789abcdef', pushed: true })])
  return { exitCode: 2, stdout: '', stderr: 'secret-me: error: unknown mode' }
}

async function setup($: any, on: any, broken = false) {
  let reached: any
  on('tool.call', (_: any, e: any) => { reached = e; return { result: {} } })
  on('session.start', (_: any, e: any) => ({ cwd: e.cwd }))
  on('session.cwd', () => ({ value: ROOT }))
  on('process.run', (_: any, e: any) => {
    const r = broken ? { exitCode: 2, stdout: '', stderr: 'secret-me: error: cannot get gitleaks' } : fakeCli(e.argv, e.init?.stdin ?? '')
    return { value: { ...r, isStdoutTruncated: false, isStderrTruncated: false } }
  })
  await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
  return {
    call: async (input: any) => {
      reached = undefined
      const r = await $.tool.call(input)
      return { r, reached }
    },
  }
}

test('a Write with a fake GitHub token is denied, redacted, with the way out', async ($, on) => {
  const t = await setup($, on)
  const { r, reached } = await t.call({ tool: 'Write', file_path: `${ROOT}/src/a.js`, content: `const t = "${FAKE_GITHUB}"\n` })
  const text = JSON.stringify(r)
  expect(reached).toBeUndefined()
  expect(text).toContain('secret-me: not writing')
  expect(text).toContain('ghp_****')
  expect(text).toContain('environment variable')
  expect(text).not.toContain(FAKE_GITHUB)
})

test('clean content passes through to the Write', async ($, on) => {
  const t = await setup($, on)
  const { reached } = await t.call({ tool: 'Write', file_path: `${ROOT}/src/a.js`, content: 'const token = process.env.TOKEN\n' })
  expect(reached.content).toBe('const token = process.env.TOKEN\n')
})

test('the Azure Storage emulator dev key passes', async ($, on) => {
  const t = await setup($, on)
  const content = `const c = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=${AZURE_KEY};"\n`
  const { reached } = await t.call({ tool: 'Write', file_path: `${ROOT}/src/storage.js`, content })
  expect(reached.content).toBe(content)
})

test('an Edit and a .env Write are checked too', async ($, on) => {
  const t = await setup($, on)
  const edit = await t.call({ tool: 'Edit', file_path: `${ROOT}/a.js`, old_string: 'x', new_string: `const t = "${FAKE_GITHUB}"` })
  expect(edit.reached).toBeUndefined()
  const env = await t.call({ tool: 'Write', file_path: `${ROOT}/.env`, content: 'A=1\n' })
  expect(env.reached).toBeUndefined()
  expect(JSON.stringify(env.r)).toContain('secret-me-env-file')
})

test('git commands are recognised, other commands are not', () => {
  expect(gitAction('git commit -m "x"')).toBe('commit')
  expect(gitAction('git add . && git -C sub push origin main')).toBe('push')
  expect(gitAction('git status')).toBeUndefined()
  expect(gitAction('echo git commit')).toBeUndefined()
})

test('scanner errors are not findings', () => {
  expect(parseScan(2, '', 'secret-me: error: boom\n')).toEqual({ error: 'secret-me: error: boom' })
  expect(parseScan(0, '{"findings":[]}', '')).toEqual({ findings: [] })
})

test('git commit with staged secrets is denied; git push says rotate first', async ($, on) => {
  const t = await setup($, on)
  const commit = await t.call({ tool: 'Bash', command: 'git commit -m "add"' })
  expect(commit.reached).toBeUndefined()
  expect(JSON.stringify(commit.r)).toContain('git commit blocked')
  expect(JSON.stringify(commit.r)).toContain('src/a.js:1 secret-me-github-token ghp_****')
  const push = await t.call({ tool: 'Bash', command: 'git push origin main' })
  expect(push.reached).toBeUndefined()
  expect(JSON.stringify(push.r)).toContain('rotate it first')
})

test('other Bash commands are not scanned', async ($, on) => {
  const t = await setup($, on)
  expect((await t.call({ tool: 'Bash', command: 'ls -la' })).reached.command).toBe('ls -la')
})

test('a scanner error does not lock the session', async ($, on) => {
  const broken = await setup($, on, true)
  expect((await broken.call({ tool: 'Bash', command: 'git commit -m x' })).reached.command).toBe('git commit -m x')
})
