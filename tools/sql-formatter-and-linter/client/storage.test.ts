import { describe, expect, test } from "vitest"

import {
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
} from "../core/sql-format"
import { parseStoredFormatOptions, parseStoredLintOptions } from "./storage"

describe("sql client storage", () => {
  test("returns default format options when storage is empty or invalid", () => {
    expect(parseStoredFormatOptions(null)).toEqual(DEFAULT_SQL_FORMAT_OPTIONS)
    expect(parseStoredFormatOptions("{")).toEqual(DEFAULT_SQL_FORMAT_OPTIONS)
    expect(parseStoredFormatOptions("{}")).toEqual(DEFAULT_SQL_FORMAT_OPTIONS)
  })

  test("restores format options and falls back for invalid dialect or case values", () => {
    expect(
      parseStoredFormatOptions(
        JSON.stringify({
          dialect: "mysql",
          tabWidth: 4,
          useTabs: true,
          linesBetweenQueries: 2,
          expressionWidth: 90,
          keywordCase: "invalid",
          dataTypeCase: "lower",
          functionCase: "invalid",
        })
      )
    ).toEqual({
      dialect: "mysql",
      tabWidth: 4,
      useTabs: true,
      linesBetweenQueries: 2,
      expressionWidth: 90,
      keywordCase: DEFAULT_SQL_FORMAT_OPTIONS.keywordCase,
      dataTypeCase: "lower",
      functionCase: DEFAULT_SQL_FORMAT_OPTIONS.functionCase,
    })
  })

  test("restores fully valid format options without fallback", () => {
    expect(
      parseStoredFormatOptions(
        JSON.stringify({
          dialect: "postgresql",
          tabWidth: 2,
          useTabs: false,
          linesBetweenQueries: 1,
          expressionWidth: 50,
          keywordCase: "upper",
          dataTypeCase: "lower",
          functionCase: "upper",
        })
      )
    ).toEqual({
      dialect: "postgresql",
      tabWidth: 2,
      useTabs: false,
      linesBetweenQueries: 1,
      expressionWidth: 50,
      keywordCase: "upper",
      dataTypeCase: "lower",
      functionCase: "upper",
    })
  })

  test("returns default lint options when storage is empty or invalid", () => {
    expect(parseStoredLintOptions(null)).toEqual(DEFAULT_SQL_LINT_OPTIONS)
    expect(parseStoredLintOptions("{")).toEqual(DEFAULT_SQL_LINT_OPTIONS)
    expect(parseStoredLintOptions("{}")).toEqual(DEFAULT_SQL_LINT_OPTIONS)
  })

  test("restores lint options and falls back for invalid keyword case values", () => {
    expect(
      parseStoredLintOptions(
        JSON.stringify({
          checkSelectStar: false,
          checkUnsafeMutation: false,
          requireSemicolon: false,
          maxLineLength: 0,
          keywordCase: "invalid",
        })
      )
    ).toEqual({
      checkSelectStar: false,
      checkUnsafeMutation: false,
      requireSemicolon: false,
      maxLineLength: 0,
      keywordCase: DEFAULT_SQL_LINT_OPTIONS.keywordCase,
    })
  })

  test("restores fully valid lint options without fallback", () => {
    expect(
      parseStoredLintOptions(
        JSON.stringify({
          checkSelectStar: true,
          checkUnsafeMutation: false,
          requireSemicolon: true,
          maxLineLength: 120,
          keywordCase: "upper",
        })
      )
    ).toEqual({
      checkSelectStar: true,
      checkUnsafeMutation: false,
      requireSemicolon: true,
      maxLineLength: 120,
      keywordCase: "upper",
    })
  })
})
