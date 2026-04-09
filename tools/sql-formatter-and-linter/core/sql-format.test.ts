import { describe, expect, test } from "vitest"

import {
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
  clampExpressionWidth,
  clampLinesBetweenQueries,
  clampMaxLineLength,
  clampTabWidth,
  formatSql,
  getFormatErrorMessage,
  runSqlTool,
} from "./sql-format"

describe("sql-format", () => {
  test("formats SQL with the current formatter options", () => {
    const result = formatSql(
      "select id, email from users where status = 'active' order by created_at desc;",
      {
        ...DEFAULT_SQL_FORMAT_OPTIONS,
        keywordCase: "upper",
      }
    )

    expect(result).toEqual({
      state: "formatted",
      sql: `SELECT
  id,
  email
FROM
  users
WHERE
  status = 'active'
ORDER BY
  created_at DESC;`,
    })
  })

  test("returns an empty state for blank input", () => {
    expect(formatSql("   ", DEFAULT_SQL_FORMAT_OPTIONS)).toEqual({
      state: "empty",
    })
  })

  test("returns a parse error when formatting fails", () => {
    const result = formatSql("select (", DEFAULT_SQL_FORMAT_OPTIONS)

    expect(result.state).toBe("error")

    if (result.state === "error") {
      expect(result.message).toContain("Parse error")
      expect(result.message).toContain("line 1 column 9")
    }
  })

  test("runs formatting and linting together", () => {
    const result = runSqlTool(
      "select * from users",
      DEFAULT_SQL_FORMAT_OPTIONS,
      {
        ...DEFAULT_SQL_LINT_OPTIONS,
        keywordCase: "upper",
      }
    )

    expect(result.formatResult.state).toBe("formatted")
    expect(result.lintIssues.map((issue) => issue.code)).toEqual([
      "no-select-star",
      "keyword-case-consistency",
      "keyword-case-consistency",
      "missing-semicolon",
    ])
  })

  test("clamps numeric formatter settings into supported ranges", () => {
    expect(clampTabWidth(Number.NaN)).toBe(DEFAULT_SQL_FORMAT_OPTIONS.tabWidth)
    expect(clampTabWidth(999)).toBe(8)
    expect(clampLinesBetweenQueries(-5)).toBe(1)
    expect(clampExpressionWidth(999)).toBe(240)
    expect(clampMaxLineLength(-1)).toBe(0)
    expect(clampMaxLineLength(Number.POSITIVE_INFINITY)).toBe(
      DEFAULT_SQL_LINT_OPTIONS.maxLineLength
    )
  })

  test("normalizes formatter errors into user-facing messages", () => {
    expect(
      getFormatErrorMessage(new Error("Parse error"), "Formatting failed")
    ).toBe("Parse error")
    expect(getFormatErrorMessage("boom", "Formatting failed")).toBe(
      "Formatting failed"
    )
  })
})
