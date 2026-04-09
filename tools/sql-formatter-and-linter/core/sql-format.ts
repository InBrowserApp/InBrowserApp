import { format } from "sql-formatter"

import type { SqlDialect } from "./sql-dialects"
import {
  isSqlCaseStyle,
  SQL_CASE_STYLES,
  type SqlCaseStyle,
} from "./sql-case-style"
import {
  DEFAULT_SQL_LINT_OPTIONS,
  type SqlLintIssue,
  type SqlLintOptions,
} from "./sql-lint"
import { lintSql } from "./sql-lint"

type SqlFormatOptions = {
  dialect: SqlDialect
  tabWidth: number
  useTabs: boolean
  linesBetweenQueries: number
  expressionWidth: number
  keywordCase: SqlCaseStyle
  dataTypeCase: SqlCaseStyle
  functionCase: SqlCaseStyle
}

type SqlFormatResult =
  | { state: "empty" }
  | { state: "formatted"; sql: string }
  | { state: "error"; message: string }

type SqlToolResult = {
  formatResult: SqlFormatResult
  lintIssues: SqlLintIssue[]
}

const DEFAULT_SQL_FORMAT_OPTIONS: SqlFormatOptions = {
  dialect: "sql",
  tabWidth: 2,
  useTabs: false,
  linesBetweenQueries: 1,
  expressionWidth: 50,
  keywordCase: "preserve",
  dataTypeCase: "preserve",
  functionCase: "preserve",
}

function clampTabWidth(value: number): number {
  return clampInteger(value, 1, 8, DEFAULT_SQL_FORMAT_OPTIONS.tabWidth)
}

function clampLinesBetweenQueries(value: number): number {
  return clampInteger(
    value,
    1,
    5,
    DEFAULT_SQL_FORMAT_OPTIONS.linesBetweenQueries
  )
}

function clampExpressionWidth(value: number): number {
  return clampInteger(
    value,
    20,
    240,
    DEFAULT_SQL_FORMAT_OPTIONS.expressionWidth
  )
}

function clampMaxLineLength(value: number): number {
  return clampInteger(value, 0, 300, DEFAULT_SQL_LINT_OPTIONS.maxLineLength)
}

function formatSql(
  source: string,
  options: SqlFormatOptions,
  fallbackMessage = "Formatting failed"
): SqlFormatResult {
  if (!source.trim()) {
    return { state: "empty" }
  }

  try {
    return {
      state: "formatted",
      sql: format(source, {
        language: options.dialect,
        tabWidth: clampTabWidth(options.tabWidth),
        useTabs: options.useTabs,
        linesBetweenQueries: clampLinesBetweenQueries(
          options.linesBetweenQueries
        ),
        expressionWidth: clampExpressionWidth(options.expressionWidth),
        keywordCase: options.keywordCase,
        dataTypeCase: options.dataTypeCase,
        functionCase: options.functionCase,
      }),
    }
  } catch (error) {
    return {
      state: "error",
      message: getFormatErrorMessage(error, fallbackMessage),
    }
  }
}

function runSqlTool(
  source: string,
  formatOptions: SqlFormatOptions,
  lintOptions: SqlLintOptions,
  fallbackMessage = "Formatting failed"
): SqlToolResult {
  const formatResult = formatSql(source, formatOptions, fallbackMessage)
  const lintIssues = lintSql(
    source,
    {
      ...lintOptions,
      maxLineLength: clampMaxLineLength(lintOptions.maxLineLength),
    },
    formatResult.state === "error" ? formatResult.message : ""
  )

  return {
    formatResult,
    lintIssues,
  }
}

function clampInteger(
  value: number,
  min: number,
  max: number,
  fallback: number
): number {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.round(value)))
}

function getFormatErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  return error instanceof Error ? error.message : fallbackMessage
}

export {
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
  SQL_CASE_STYLES,
  clampExpressionWidth,
  clampLinesBetweenQueries,
  clampMaxLineLength,
  clampTabWidth,
  formatSql,
  getFormatErrorMessage,
  isSqlCaseStyle,
  runSqlTool,
  type SqlFormatOptions,
  type SqlFormatResult,
  type SqlLintIssue,
  type SqlLintOptions,
}
