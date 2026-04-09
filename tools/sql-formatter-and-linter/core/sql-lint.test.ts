import { describe, expect, test } from "vitest"

import {
  compareSqlLintIssues,
  DEFAULT_SQL_LINT_OPTIONS,
  lintSql,
} from "./sql-lint"

describe("lintSql", () => {
  test("returns no issues for blank input", () => {
    expect(lintSql("   ", DEFAULT_SQL_LINT_OPTIONS)).toEqual([])
  })

  test("reports parse errors with explicit line and column details", () => {
    const issues = lintSql(
      "select 1",
      DEFAULT_SQL_LINT_OPTIONS,
      "Parse error at token: X at line 3 column 7"
    )

    expect(issues[0]).toMatchObject({
      code: "parse-error",
      severity: "error",
      line: 3,
      column: 7,
    })
  })

  test("falls back to source-based positions when a parse error only contains an index", () => {
    const issues = lintSql(
      "select 1\nfrom users",
      DEFAULT_SQL_LINT_OPTIONS,
      "Parse error at index 9"
    )

    expect(issues[0]).toMatchObject({
      line: 2,
      column: 1,
    })
  })

  test("falls back to the first character when a parse error has no location details", () => {
    const issues = lintSql(
      "select 1",
      DEFAULT_SQL_LINT_OPTIONS,
      "Formatting failed"
    )

    expect(issues[0]).toMatchObject({
      line: 1,
      column: 1,
    })
  })

  test("warns on select star, unsafe mutations, long lines, missing semicolons, and keyword case drift", () => {
    const issues = lintSql("select * from users\nupdate users set note = 'x'", {
      ...DEFAULT_SQL_LINT_OPTIONS,
      maxLineLength: 10,
      keywordCase: "upper",
    })

    expect(issues.map((issue) => issue.code)).toEqual([
      "no-select-star",
      "unsafe-update-delete",
      "keyword-case-consistency",
      "keyword-case-consistency",
      "max-line-length",
      "keyword-case-consistency",
      "max-line-length",
      "keyword-case-consistency",
      "missing-semicolon",
    ])
  })

  test("ignores where tokens that only appear inside strings, identifiers, and comments", () => {
    const issues = lintSql(
      [
        "update users set note = 'where''s nice';",
        'update users set "where" = 1;',
        "update users set `where` = 1;",
        "update users set [where] = 1;",
        "update users set note = 1 -- where",
        "from users;",
        "update users set note = 1 /* where */;",
        "delete from users where id = 1;",
      ].join("\n"),
      DEFAULT_SQL_LINT_OPTIONS
    )

    expect(
      issues.filter((issue) => issue.code === "unsafe-update-delete")
    ).toHaveLength(6)
  })

  test("does not add optional issues when the checks are disabled", () => {
    const issues = lintSql("select * from users", {
      checkSelectStar: false,
      checkUnsafeMutation: false,
      requireSemicolon: false,
      maxLineLength: 0,
      keywordCase: "preserve",
    })

    expect(issues).toEqual([])
  })

  test("caps keyword case issues at twenty matches", () => {
    const issues = lintSql("select\n".repeat(25), {
      ...DEFAULT_SQL_LINT_OPTIONS,
      checkSelectStar: false,
      requireSemicolon: false,
      maxLineLength: 0,
      keywordCase: "upper",
    })

    expect(issues).toHaveLength(20)
    expect(
      issues.every((issue) => issue.code === "keyword-case-consistency")
    ).toBe(true)
  })

  test("skips keyword case warnings when the current query already matches the requested case", () => {
    const issues = lintSql("SELECT 1;", {
      ...DEFAULT_SQL_LINT_OPTIONS,
      checkSelectStar: false,
      requireSemicolon: false,
      maxLineLength: 0,
      keywordCase: "upper",
    })

    expect(issues).toEqual([])
  })

  test("supports lower-case keyword enforcement", () => {
    const issues = lintSql("SELECT 1;", {
      ...DEFAULT_SQL_LINT_OPTIONS,
      checkSelectStar: false,
      requireSemicolon: false,
      maxLineLength: 0,
      keywordCase: "lower",
    })

    expect(issues).toHaveLength(1)
    expect(issues[0]?.code).toBe("keyword-case-consistency")
  })

  test("compares lint issues by severity, location, then code", () => {
    expect(
      compareSqlLintIssues(
        {
          code: "max-line-length",
          severity: "info",
          message: "A",
          line: 1,
          column: 1,
        },
        {
          code: "missing-semicolon",
          severity: "info",
          message: "B",
          line: 1,
          column: 1,
        }
      )
    ).toBeLessThan(0)
  })
})
