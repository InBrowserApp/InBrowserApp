import { describe, expect, test } from "vitest"

import { parseNumber } from "./parse"

describe("parseNumber", () => {
  test("treats blank input as empty", () => {
    expect(parseNumber("   ")).toEqual({ kind: "empty" })
  })

  test("parses a plain decimal", () => {
    expect(parseNumber("3.28")).toEqual({ kind: "valid", value: 3.28 })
  })

  test("accepts a sign and exponent", () => {
    expect(parseNumber("-1.5e3")).toEqual({ kind: "valid", value: -1500 })
  })

  test("ignores spaces and underscores as visual grouping", () => {
    expect(parseNumber("1_000 000")).toEqual({ kind: "valid", value: 1000000 })
  })

  test("treats a lone comma as a decimal separator", () => {
    expect(parseNumber("3,5")).toEqual({ kind: "valid", value: 3.5 })
  })

  test("drops commas as thousands grouping when a dot is present", () => {
    expect(parseNumber("1,234.5")).toEqual({ kind: "valid", value: 1234.5 })
  })

  test("parses a leading-dot decimal", () => {
    expect(parseNumber(".5")).toEqual({ kind: "valid", value: 0.5 })
  })

  test("rejects non-numeric text", () => {
    expect(parseNumber("abc")).toEqual({ kind: "invalid" })
  })

  test("rejects values that overflow to infinity", () => {
    expect(parseNumber("1e999")).toEqual({ kind: "invalid" })
  })
})
