import { describe, expect, it } from "vitest"
import {
  previewQuery,
  validateFile,
  validateQuery,
  validateStatementTail,
} from "./query"

describe("SQLite input boundaries", () => {
  const header = new TextEncoder().encode("SQLite format 3\0")
  it("accepts SQLite headers and checks size before loading the file", () => {
    expect(() => validateFile(100, header)).not.toThrow()
    expect(() => validateFile(50 * 1024 * 1024, header)).not.toThrow()
    expect(() => validateFile(50 * 1024 * 1024 + 1, header)).toThrow("tooLarge")
    expect(() => validateFile(99, header)).toThrow("invalid")
    expect(() => validateFile(1024, new Uint8Array(16))).toThrow("invalid")
    expect(() => validateFile(1024, new Uint8Array())).toThrow("invalid")
  })
  it.each([
    "SELECT 1",
    "with x AS (SELECT 1) SELECT * FROM x",
    "EXPLAIN SELECT 1",
    "EXPLAIN /* inspect */ QUERY PLAN SELECT 1",
    " \n-- comment\n/* note */ SELECT 1",
    "/* note */WITH x AS (SELECT 1) SELECT * FROM x",
  ])("accepts read query syntax: %s", (sql) => {
    expect(() => validateQuery(sql)).not.toThrow()
  })
  it.each([
    "PRAGMA query_only=OFF",
    "EXPLAIN PRAGMA query_only=OFF",
    "EXPLAIN /* hi */ PRAGMA writable_schema=ON",
    "ATTACH ':memory:' AS other",
    "DELETE FROM t",
    "VACUUM",
    "INSERT INTO t VALUES(1)",
    "SELECTOR 1",
  ])("excludes unsupported commands: %s", (sql) => {
    expect(() => validateQuery(sql)).toThrow("readOnlyError")
  })
  it("rejects empty and oversized SQL", () => {
    expect(() => validateQuery(" \n-- no query\n/* hi */")).toThrow(
      "emptyQuery"
    )
    expect(() => validateQuery("SELECT '" + "a".repeat(100_000) + "'")).toThrow(
      "queryTooLarge"
    )
  })
  it.each([
    "",
    " \n; ;",
    " --comment\n /* done */ ;",
    "/* unclosed comment",
    "-- tail",
  ])("permits only comments or separators in a statement tail: %s", (tail) => {
    expect(() => validateStatementTail(tail)).not.toThrow()
  })
  it.each([
    "PRAGMA query_only=OFF",
    "EXPLAIN PRAGMA query_only=OFF",
    "EXPLAIN /* hi */ PRAGMA writable_schema=ON",
    "; SELECT 2",
    "/* hi */ DELETE FROM t",
    "-- hi\nATTACH ':memory:' AS x",
  ])("rejects a second statement before preparation: %s", (tail) => {
    expect(() => validateStatementTail(tail)).toThrow("singleStatement")
  })
  it("quotes database identifiers without interpolation vulnerabilities", () => {
    expect(previewQuery('a"; DROP TABLE tasks; --')).toBe(
      'SELECT * FROM "a""; DROP TABLE tasks; --";'
    )
    expect(previewQuery("weird table")).toBe('SELECT * FROM "weird table";')
  })
})
