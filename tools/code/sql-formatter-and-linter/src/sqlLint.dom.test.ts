import { describe, expect, it } from 'vitest'
import { lintSql, type SqlLintOptions } from './sqlLint'

const defaultOptions: SqlLintOptions = {
  checkSelectStar: true,
  checkUnsafeMutation: true,
  requireSemicolon: true,
  maxLineLength: 80,
  keywordCase: 'preserve',
}

describe('lintSql', () => {
  it('returns empty issues for blank input', () => {
    expect(lintSql('   ', defaultOptions)).toEqual([])
  })

  it('reports parse errors with explicit line and column', () => {
    const issues = lintSql(
      'SELECT * FROM users',
      { ...defaultOptions, checkSelectStar: false, requireSemicolon: false },
      'Parse error: Unexpected token at line 2 column 7',
    )

    expect(issues[0]).toMatchObject({
      code: 'parse-error',
      severity: 'error',
      line: 2,
      column: 7,
    })
  })

  it('falls back to line 1 column 1 when parse error location is unavailable', () => {
    const issues = lintSql(
      'SELECT 1',
      { ...defaultOptions, checkSelectStar: false, requireSemicolon: false },
      'Parse failed',
    )

    expect(issues[0]).toMatchObject({
      code: 'parse-error',
      line: 1,
      column: 1,
    })
  })

  it('falls back when parsed line or column is not finite', () => {
    const huge = '9'.repeat(500)
    const issues = lintSql(
      'SELECT 1',
      { ...defaultOptions, checkSelectStar: false, requireSemicolon: false },
      `Parse error at line ${huge} column ${huge}`,
    )

    expect(issues[0]).toMatchObject({
      code: 'parse-error',
      line: 1,
      column: 1,
    })
  })

  it('reports SELECT * and unsafe mutation statements', () => {
    const issues = lintSql(
      `SELECT * FROM users;
UPDATE users SET status = 'active';
DELETE FROM users;`,
      defaultOptions,
    )

    expect(issues.some((issue) => issue.code === 'no-select-star')).toBe(true)
    expect(
      issues.filter((issue) => issue.code === 'unsafe-update-delete').map((issue) => issue.message),
    ).toEqual(
      expect.arrayContaining([
        'UPDATE without WHERE may affect every row.',
        'DELETE without WHERE may remove every row.',
      ]),
    )
  })

  it('does not report unsafe mutation when WHERE is present', () => {
    const issues = lintSql(
      `UPDATE users SET status = 'active' WHERE id = 1;
DELETE FROM users WHERE id = 1;`,
      defaultOptions,
    )

    expect(issues.some((issue) => issue.code === 'unsafe-update-delete')).toBe(false)
  })

  it('reports missing semicolon and long lines', () => {
    const issues = lintSql('SELECT id, name FROM users', defaultOptions)

    expect(issues.some((issue) => issue.code === 'missing-semicolon')).toBe(true)

    const withLongLine = lintSql(
      'SELECT id, name, email, created_at, updated_at, deleted_at, tenant_id FROM users;',
      { ...defaultOptions, requireSemicolon: false, maxLineLength: 30 },
    )
    expect(withLongLine.some((issue) => issue.code === 'max-line-length')).toBe(true)
  })

  it('covers stable sorting fallback when severity and position match', () => {
    const issues = lintSql('SELECT 1', {
      ...defaultOptions,
      checkSelectStar: false,
      checkUnsafeMutation: false,
      requireSemicolon: true,
      maxLineLength: 7,
    })

    expect(issues.filter((issue) => issue.code === 'missing-semicolon')).toHaveLength(1)
    expect(issues.filter((issue) => issue.code === 'max-line-length')).toHaveLength(1)
  })

  it('checks keyword case consistency for upper and lower style', () => {
    const upperIssues = lintSql('select * from users;', {
      ...defaultOptions,
      requireSemicolon: false,
      checkSelectStar: false,
      keywordCase: 'upper',
    })

    expect(upperIssues.some((issue) => issue.code === 'keyword-case-consistency')).toBe(true)

    const lowerIssues = lintSql('SELECT id FROM users;', {
      ...defaultOptions,
      requireSemicolon: false,
      keywordCase: 'lower',
      checkSelectStar: false,
    })

    expect(lowerIssues.some((issue) => issue.code === 'keyword-case-consistency')).toBe(true)
  })

  it('limits keyword case reports and keeps sorted severity order', () => {
    const input = `
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
SELECT ID FROM USERS
`

    const issues = lintSql(input, {
      ...defaultOptions,
      requireSemicolon: false,
      checkSelectStar: false,
      checkUnsafeMutation: false,
      maxLineLength: 0,
      keywordCase: 'lower',
    })

    const keywordIssues = issues.filter((issue) => issue.code === 'keyword-case-consistency')
    expect(keywordIssues.length).toBe(20)

    const severities = issues.map((issue) => issue.severity)
    expect(severities).toEqual(
      [...severities].sort(
        (a, b) => ['error', 'warning', 'info'].indexOf(a) - ['error', 'warning', 'info'].indexOf(b),
      ),
    )
  })
})
