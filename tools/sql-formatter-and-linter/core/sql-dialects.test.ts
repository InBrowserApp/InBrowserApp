import { describe, expect, test } from "vitest"

import {
  SQL_FILE_ACCEPT,
  detectDialectFromFilename,
  isSqlDialect,
} from "./sql-dialects"

describe("sql-dialects", () => {
  test("detects the dialect from known file extensions", () => {
    expect(detectDialectFromFilename("report.pgsql")).toBe("postgresql")
    expect(detectDialectFromFilename("schema.mysql")).toBe("mysql")
  })

  test("returns null when no supported extension can be detected", () => {
    expect(detectDialectFromFilename("README")).toBeNull()
    expect(detectDialectFromFilename("query.unknown")).toBeNull()
  })

  test("validates dialect values and exposes the accepted file list", () => {
    expect(isSqlDialect("sql")).toBe(true)
    expect(isSqlDialect("oracle")).toBe(false)
    expect(SQL_FILE_ACCEPT).toContain(".sql")
    expect(SQL_FILE_ACCEPT).toContain(".pgsql")
  })
})
