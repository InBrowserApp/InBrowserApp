export type SqlLintSeverity = 'error' | 'warning' | 'info'

export type SqlCaseStyle = 'preserve' | 'upper' | 'lower'

export type SqlLintIssueCode =
  | 'parse-error'
  | 'no-select-star'
  | 'unsafe-update-delete'
  | 'missing-semicolon'
  | 'max-line-length'
  | 'keyword-case-consistency'

export type SqlLintIssue = {
  code: SqlLintIssueCode
  severity: SqlLintSeverity
  message: string
  line: number
  column: number
}

export type SqlLintOptions = {
  checkSelectStar: boolean
  checkUnsafeMutation: boolean
  requireSemicolon: boolean
  maxLineLength: number
  keywordCase: SqlCaseStyle
}

type Position = {
  line: number
  column: number
}

type MaskMode =
  | 'code'
  | 'single-quoted-string'
  | 'double-quoted-string'
  | 'backtick-quoted-identifier'
  | 'bracket-quoted-identifier'
  | 'line-comment'
  | 'block-comment'

const keywordRegex = new RegExp(
  `\\b(${[
    'select',
    'from',
    'where',
    'group',
    'order',
    'by',
    'having',
    'limit',
    'offset',
    'join',
    'inner',
    'left',
    'right',
    'full',
    'cross',
    'on',
    'insert',
    'into',
    'values',
    'update',
    'set',
    'delete',
    'create',
    'alter',
    'drop',
    'table',
    'with',
    'union',
    'and',
    'or',
  ].join('|')})\\b`,
  'gi',
)

const severityRank: Record<SqlLintSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
}

export function lintSql(
  source: string,
  options: SqlLintOptions,
  parseErrorMessage: string = '',
): SqlLintIssue[] {
  const issues: SqlLintIssue[] = []
  const text = source
  const trimmed = text.trim()

  if (!trimmed) {
    return []
  }

  if (parseErrorMessage) {
    const position = parseLineColumnFromError(parseErrorMessage) ?? { line: 1, column: 1 }
    pushIssue(
      issues,
      {
        code: 'parse-error',
        severity: 'error',
        message: parseErrorMessage,
      },
      position,
    )
  }

  if (options.checkSelectStar) {
    const selectStarRegex = /\bselect\s+\*/gi
    for (const match of text.matchAll(selectStarRegex)) {
      const index = match.index as number
      pushIssue(
        issues,
        {
          code: 'no-select-star',
          severity: 'warning',
          message: 'Avoid SELECT * in production queries.',
        },
        indexToPosition(text, index),
      )
    }
  }

  if (options.checkUnsafeMutation) {
    const mutationRegex = /\b(update|delete)\b[\s\S]*?(?=;|$)/gi

    for (const match of text.matchAll(mutationRegex)) {
      const index = match.index as number
      const statement = match[0]
      const head = String(match[1]).toLowerCase()
      const hasWhereClause = statementHasWhereClause(statement)

      if (head === 'update' && !hasWhereClause) {
        pushIssue(
          issues,
          {
            code: 'unsafe-update-delete',
            severity: 'warning',
            message: 'UPDATE without WHERE may affect every row.',
          },
          indexToPosition(text, index),
        )
      }

      if (head === 'delete' && !hasWhereClause) {
        pushIssue(
          issues,
          {
            code: 'unsafe-update-delete',
            severity: 'warning',
            message: 'DELETE without WHERE may remove every row.',
          },
          indexToPosition(text, index),
        )
      }
    }
  }

  if (options.requireSemicolon && !/;\s*$/.test(trimmed)) {
    pushIssue(
      issues,
      {
        code: 'missing-semicolon',
        severity: 'info',
        message: 'Consider ending SQL statements with a semicolon.',
      },
      indexToPosition(text, text.length - 1),
    )
  }

  if (options.maxLineLength > 0) {
    const lines = text.split('\n')
    for (const [index, line] of lines.entries()) {
      if (line.length <= options.maxLineLength) continue
      pushIssue(
        issues,
        {
          code: 'max-line-length',
          severity: 'info',
          message: `Line exceeds ${options.maxLineLength} characters.`,
        },
        { line: index + 1, column: options.maxLineLength + 1 },
      )
    }
  }

  if (options.keywordCase !== 'preserve') {
    const maxCaseIssues = 20

    for (const match of text.matchAll(keywordRegex)) {
      if (
        issues.filter((issue) => issue.code === 'keyword-case-consistency').length >= maxCaseIssues
      ) {
        break
      }

      const index = match.index as number
      const actual = match[0]
      const expected = options.keywordCase === 'upper' ? actual.toUpperCase() : actual.toLowerCase()
      if (actual === expected) continue

      pushIssue(
        issues,
        {
          code: 'keyword-case-consistency',
          severity: 'info',
          message: `Keyword "${actual}" should be ${options.keywordCase} case.`,
        },
        indexToPosition(text, index),
      )
    }
  }

  return issues.sort((a, b) => {
    const severityDiff = severityRank[a.severity] - severityRank[b.severity]
    if (severityDiff !== 0) return severityDiff
    if (a.line !== b.line) return a.line - b.line
    if (a.column !== b.column) return a.column - b.column
    return a.code.localeCompare(b.code)
  })
}

function statementHasWhereClause(statement: string): boolean {
  const maskedStatement = maskSqlCommentsAndLiterals(statement)
  return /\bwhere\b/i.test(maskedStatement)
}

function maskSqlCommentsAndLiterals(sql: string): string {
  let masked = ''
  let mode: MaskMode = 'code'
  let index = 0

  while (index < sql.length) {
    const char = sql[index] as string
    const nextChar = sql[index + 1] as string | undefined

    if (mode === 'code') {
      if (char === "'") {
        mode = 'single-quoted-string'
        masked += ' '
        index += 1
        continue
      }

      if (char === '"') {
        mode = 'double-quoted-string'
        masked += ' '
        index += 1
        continue
      }

      if (char === '`') {
        mode = 'backtick-quoted-identifier'
        masked += ' '
        index += 1
        continue
      }

      if (char === '[') {
        mode = 'bracket-quoted-identifier'
        masked += ' '
        index += 1
        continue
      }

      if (char === '-' && nextChar === '-') {
        mode = 'line-comment'
        masked += '  '
        index += 2
        continue
      }

      if (char === '/' && nextChar === '*') {
        mode = 'block-comment'
        masked += '  '
        index += 2
        continue
      }

      masked += char
      index += 1
      continue
    }

    if (mode === 'single-quoted-string') {
      if (char === "'" && nextChar === "'") {
        masked += '  '
        index += 2
        continue
      }

      if (char === "'") {
        mode = 'code'
        masked += ' '
        index += 1
        continue
      }

      masked += char === '\n' ? '\n' : ' '
      index += 1
      continue
    }

    if (mode === 'double-quoted-string') {
      if (char === '"' && nextChar === '"') {
        masked += '  '
        index += 2
        continue
      }

      if (char === '"') {
        mode = 'code'
        masked += ' '
        index += 1
        continue
      }

      masked += char === '\n' ? '\n' : ' '
      index += 1
      continue
    }

    if (mode === 'backtick-quoted-identifier') {
      if (char === '`') {
        mode = 'code'
        masked += ' '
        index += 1
        continue
      }

      masked += char === '\n' ? '\n' : ' '
      index += 1
      continue
    }

    if (mode === 'bracket-quoted-identifier') {
      if (char === ']' && nextChar === ']') {
        masked += '  '
        index += 2
        continue
      }

      if (char === ']') {
        mode = 'code'
        masked += ' '
        index += 1
        continue
      }

      masked += char === '\n' ? '\n' : ' '
      index += 1
      continue
    }

    if (mode === 'line-comment') {
      if (char === '\n') {
        mode = 'code'
        masked += '\n'
        index += 1
        continue
      }

      masked += ' '
      index += 1
      continue
    }

    if (char === '*' && nextChar === '/') {
      mode = 'code'
      masked += '  '
      index += 2
      continue
    }

    masked += char === '\n' ? '\n' : ' '
    index += 1
  }

  return masked
}

function pushIssue(
  issues: SqlLintIssue[],
  issue: Omit<SqlLintIssue, 'line' | 'column'>,
  position: Position,
): void {
  issues.push({ ...issue, ...position })
}

function indexToPosition(text: string, index: number): Position {
  if (index <= 0) {
    return { line: 1, column: 1 }
  }

  const slice = text.slice(0, index)
  const lines = slice.split('\n')
  const lastLine = lines[lines.length - 1] as string
  return {
    line: lines.length,
    column: lastLine.length + 1,
  }
}

function parseLineColumnFromError(message: string): Position | null {
  const match = message.match(/line\s+(\d+)\s+column\s+(\d+)/i)
  if (!match) {
    return null
  }

  const line = Number.parseInt(match[1] as string, 10)
  const column = Number.parseInt(match[2] as string, 10)

  if (!Number.isFinite(line) || !Number.isFinite(column)) {
    return null
  }

  return { line, column }
}
