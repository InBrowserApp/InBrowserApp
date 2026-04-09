import {
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
  isSqlCaseStyle,
  type SqlFormatOptions,
  type SqlLintOptions,
} from "../core/sql-format"
import { isSqlDialect } from "../core/sql-dialects"

type SqlFormatOptionsStorageValue = Partial<SqlFormatOptions>
type SqlLintOptionsStorageValue = Partial<SqlLintOptions>

function parseStoredFormatOptions(
  storedValue: string | null
): SqlFormatOptions {
  if (!storedValue) {
    return DEFAULT_SQL_FORMAT_OPTIONS
  }

  try {
    const parsed = JSON.parse(storedValue) as SqlFormatOptionsStorageValue

    return {
      dialect:
        parsed.dialect && isSqlDialect(parsed.dialect)
          ? parsed.dialect
          : DEFAULT_SQL_FORMAT_OPTIONS.dialect,
      tabWidth:
        typeof parsed.tabWidth === "number"
          ? parsed.tabWidth
          : DEFAULT_SQL_FORMAT_OPTIONS.tabWidth,
      useTabs:
        typeof parsed.useTabs === "boolean"
          ? parsed.useTabs
          : DEFAULT_SQL_FORMAT_OPTIONS.useTabs,
      linesBetweenQueries:
        typeof parsed.linesBetweenQueries === "number"
          ? parsed.linesBetweenQueries
          : DEFAULT_SQL_FORMAT_OPTIONS.linesBetweenQueries,
      expressionWidth:
        typeof parsed.expressionWidth === "number"
          ? parsed.expressionWidth
          : DEFAULT_SQL_FORMAT_OPTIONS.expressionWidth,
      keywordCase:
        parsed.keywordCase && isSqlCaseStyle(parsed.keywordCase)
          ? parsed.keywordCase
          : DEFAULT_SQL_FORMAT_OPTIONS.keywordCase,
      dataTypeCase:
        parsed.dataTypeCase && isSqlCaseStyle(parsed.dataTypeCase)
          ? parsed.dataTypeCase
          : DEFAULT_SQL_FORMAT_OPTIONS.dataTypeCase,
      functionCase:
        parsed.functionCase && isSqlCaseStyle(parsed.functionCase)
          ? parsed.functionCase
          : DEFAULT_SQL_FORMAT_OPTIONS.functionCase,
    }
  } catch {
    return DEFAULT_SQL_FORMAT_OPTIONS
  }
}

function parseStoredLintOptions(storedValue: string | null): SqlLintOptions {
  if (!storedValue) {
    return DEFAULT_SQL_LINT_OPTIONS
  }

  try {
    const parsed = JSON.parse(storedValue) as SqlLintOptionsStorageValue

    return {
      checkSelectStar:
        typeof parsed.checkSelectStar === "boolean"
          ? parsed.checkSelectStar
          : DEFAULT_SQL_LINT_OPTIONS.checkSelectStar,
      checkUnsafeMutation:
        typeof parsed.checkUnsafeMutation === "boolean"
          ? parsed.checkUnsafeMutation
          : DEFAULT_SQL_LINT_OPTIONS.checkUnsafeMutation,
      requireSemicolon:
        typeof parsed.requireSemicolon === "boolean"
          ? parsed.requireSemicolon
          : DEFAULT_SQL_LINT_OPTIONS.requireSemicolon,
      maxLineLength:
        typeof parsed.maxLineLength === "number"
          ? parsed.maxLineLength
          : DEFAULT_SQL_LINT_OPTIONS.maxLineLength,
      keywordCase:
        parsed.keywordCase && isSqlCaseStyle(parsed.keywordCase)
          ? parsed.keywordCase
          : DEFAULT_SQL_LINT_OPTIONS.keywordCase,
    }
  } catch {
    return DEFAULT_SQL_LINT_OPTIONS
  }
}

export { parseStoredFormatOptions, parseStoredLintOptions }
