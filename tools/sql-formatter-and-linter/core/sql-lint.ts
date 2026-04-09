import type { SqlCaseStyle } from "./sql-case-style"
import {
  indexToPosition,
  parseLineColumnFromError,
  statementHasWhereClause,
  type Position,
} from "./sql-lint-helpers"

type SqlLintSeverity = "error" | "warning" | "info"

type SqlLintIssueCode =
  | "parse-error"
  | "no-select-star"
  | "unsafe-update-delete"
  | "missing-semicolon"
  | "max-line-length"
  | "keyword-case-consistency"

type SqlLintIssue = {
  code: SqlLintIssueCode
  severity: SqlLintSeverity
  message: string
  line: number
  column: number
}

type SqlLintOptions = {
  checkSelectStar: boolean
  checkUnsafeMutation: boolean
  requireSemicolon: boolean
  maxLineLength: number
  keywordCase: SqlCaseStyle
}

const DEFAULT_SQL_LINT_OPTIONS: SqlLintOptions = {
  checkSelectStar: true,
  checkUnsafeMutation: true,
  requireSemicolon: true,
  maxLineLength: 100,
  keywordCase: "preserve",
}

const keywordRegex = new RegExp(
  `\\b(${[
    "select",
    "from",
    "where",
    "group",
    "order",
    "by",
    "having",
    "limit",
    "offset",
    "join",
    "inner",
    "left",
    "right",
    "full",
    "cross",
    "on",
    "insert",
    "into",
    "values",
    "update",
    "set",
    "delete",
    "create",
    "alter",
    "drop",
    "table",
    "with",
    "union",
    "and",
    "or",
  ].join("|")})\\b`,
  "gi"
)

const severityRank: Record<SqlLintSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
}

function lintSql(
  source: string,
  options: SqlLintOptions,
  parseErrorMessage: string = ""
): SqlLintIssue[] {
  const issues: SqlLintIssue[] = []
  const text = source
  const trimmed = text.trim()

  if (!trimmed) {
    return []
  }

  if (parseErrorMessage) {
    const position = parseLineColumnFromError(text, parseErrorMessage) ?? {
      line: 1,
      column: 1,
    }

    pushIssue(
      issues,
      {
        code: "parse-error",
        severity: "error",
        message: parseErrorMessage,
      },
      position
    )
  }

  if (options.checkSelectStar) {
    const selectStarRegex = /\bselect\s+\*/gi

    for (const match of text.matchAll(selectStarRegex)) {
      const index = match.index as number

      pushIssue(
        issues,
        {
          code: "no-select-star",
          severity: "warning",
          message: "Avoid SELECT * in production queries.",
        },
        indexToPosition(text, index)
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

      if (head === "update" && !hasWhereClause) {
        pushIssue(
          issues,
          {
            code: "unsafe-update-delete",
            severity: "warning",
            message: "UPDATE without WHERE may affect every row.",
          },
          indexToPosition(text, index)
        )
      }

      if (head === "delete" && !hasWhereClause) {
        pushIssue(
          issues,
          {
            code: "unsafe-update-delete",
            severity: "warning",
            message: "DELETE without WHERE may remove every row.",
          },
          indexToPosition(text, index)
        )
      }
    }
  }

  if (options.requireSemicolon && !/;\s*$/.test(trimmed)) {
    pushIssue(
      issues,
      {
        code: "missing-semicolon",
        severity: "info",
        message: "Consider ending SQL statements with a semicolon.",
      },
      indexToPosition(text, text.length - 1)
    )
  }

  if (options.maxLineLength > 0) {
    const lines = text.split("\n")

    for (const [index, line] of lines.entries()) {
      if (line.length <= options.maxLineLength) continue

      pushIssue(
        issues,
        {
          code: "max-line-length",
          severity: "info",
          message: `Line exceeds ${options.maxLineLength} characters.`,
        },
        { line: index + 1, column: options.maxLineLength + 1 }
      )
    }
  }

  if (options.keywordCase !== "preserve") {
    const maxCaseIssues = 20

    for (const match of text.matchAll(keywordRegex)) {
      const caseIssueCount = issues.filter(
        (issue) => issue.code === "keyword-case-consistency"
      ).length

      if (caseIssueCount >= maxCaseIssues) {
        break
      }

      const index = match.index as number
      const actual = match[0]
      const expected =
        options.keywordCase === "upper"
          ? actual.toUpperCase()
          : actual.toLowerCase()

      if (actual === expected) {
        continue
      }

      pushIssue(
        issues,
        {
          code: "keyword-case-consistency",
          severity: "info",
          message: `Keyword "${actual}" should be ${options.keywordCase} case.`,
        },
        indexToPosition(text, index)
      )
    }
  }

  return issues.sort((leftIssue, rightIssue) => {
    return compareSqlLintIssues(leftIssue, rightIssue)
  })
}

function pushIssue(
  issues: SqlLintIssue[],
  issue: Omit<SqlLintIssue, "line" | "column">,
  position: Position
): void {
  issues.push({
    ...issue,
    line: position.line,
    column: position.column,
  })
}

function compareSqlLintIssues(
  leftIssue: SqlLintIssue,
  rightIssue: SqlLintIssue
): number {
  const severityDiff =
    severityRank[leftIssue.severity] - severityRank[rightIssue.severity]

  if (severityDiff !== 0) return severityDiff
  if (leftIssue.line !== rightIssue.line) {
    return leftIssue.line - rightIssue.line
  }
  if (leftIssue.column !== rightIssue.column) {
    return leftIssue.column - rightIssue.column
  }

  return leftIssue.code.localeCompare(rightIssue.code)
}

export {
  compareSqlLintIssues,
  DEFAULT_SQL_LINT_OPTIONS,
  lintSql,
  type SqlLintIssue,
  type SqlLintOptions,
}
