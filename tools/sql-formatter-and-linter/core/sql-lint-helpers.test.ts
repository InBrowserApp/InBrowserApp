import { describe, expect, test } from "vitest"

import {
  indexToPosition,
  parseLineColumnFromError,
  statementHasWhereClause,
} from "./sql-lint-helpers"

describe("sql-lint-helpers", () => {
  test("ignores multiline where tokens inside strings, identifiers, and block comments", () => {
    expect(
      statementHasWhereClause("update users set note = 'where\nstill here'")
    ).toBe(false)
    expect(
      statementHasWhereClause('update users set "where\nstill here" = 1')
    ).toBe(false)
    expect(
      statementHasWhereClause("update users set `where\nstill here` = 1")
    ).toBe(false)
    expect(
      statementHasWhereClause("update users set [where\nstill here] = 1")
    ).toBe(false)
    expect(
      statementHasWhereClause(
        "update users set note = 1 /* where\nstill here */"
      )
    ).toBe(false)
    expect(statementHasWhereClause("delete from users where id = 1")).toBe(true)
  })

  test("converts absolute indexes into line and column positions", () => {
    expect(indexToPosition("select\nfrom users", 0)).toEqual({
      line: 1,
      column: 1,
    })
    expect(indexToPosition("select\nfrom users", 7)).toEqual({
      line: 2,
      column: 1,
    })
  })

  test("parses line-column and index-based formatter errors", () => {
    expect(
      parseLineColumnFromError("select\n(", "Parse error at line 2 column 1")
    ).toEqual({
      line: 2,
      column: 1,
    })
    expect(
      parseLineColumnFromError("select\n(", "Parse error at index 7")
    ).toEqual({
      line: 2,
      column: 1,
    })
    expect(parseLineColumnFromError("select 1", "Formatting failed")).toBeNull()
  })
})
