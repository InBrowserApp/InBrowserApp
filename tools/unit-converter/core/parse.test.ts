import { describe, expect, test } from "vitest"

import { parseNumber } from "./parse"

describe("parseNumber", () => {
  test("treats blank input as empty", () => {
    expect(parseNumber("   ")).toEqual({ kind: "empty" })
  })

  test("parses ungrouped English decimals", () => {
    expect(parseNumber("3.28")).toEqual({ kind: "valid", value: 3.28 })
    expect(parseNumber("+.5", "en")).toEqual({ kind: "valid", value: 0.5 })
    expect(parseNumber("12.", "en")).toEqual({ kind: "valid", value: 12 })
    expect(parseNumber("0", "en")).toEqual({ kind: "valid", value: 0 })
  })

  test("accepts ungrouped ASCII scientific notation in every locale", () => {
    expect(parseNumber("-1.5e3", "de")).toEqual({
      kind: "valid",
      value: -1500,
    })
    expect(parseNumber("2E+4", "ar")).toEqual({
      kind: "valid",
      value: 20000,
    })
  })

  test("parses strict English grouping", () => {
    expect(parseNumber("1,234.5", "en")).toEqual({
      kind: "valid",
      value: 1234.5,
    })
    expect(parseNumber("1,234,567", "en")).toEqual({
      kind: "valid",
      value: 1234567,
    })
  })

  test("parses German decimal and grouping separators", () => {
    expect(parseNumber("1.234,5", "de")).toEqual({
      kind: "valid",
      value: 1234.5,
    })
    expect(parseNumber(",5", "de")).toEqual({ kind: "valid", value: 0.5 })
  })

  test("parses Indian grouping and Devanagari digits", () => {
    expect(parseNumber("12,34,567.8", "hi")).toEqual({
      kind: "valid",
      value: 1234567.8,
    })
    expect(parseNumber("१२,३४,५६७.८", "hi")).toEqual({
      kind: "valid",
      value: 1234567.8,
    })
  })

  test("parses Arabic-Indic digits, separators, signs, and exponents", () => {
    expect(parseNumber("١٬٢٣٤٫٥", "ar")).toEqual({
      kind: "valid",
      value: 1234.5,
    })
    expect(parseNumber("؜-١٫٥e٣", "ar")).toEqual({
      kind: "valid",
      value: -1500,
    })
  })

  test.each([
    ["3,5", "en"],
    ["12,34.5", "en"],
    ["1,23,456", "en"],
    ["1234,567", "en"],
    ["1,,234", "en"],
    ["1,234.5", "de"],
    ["123,456", "hi"],
    ["1 2", "en"],
    ["1_000", "en"],
  ])("rejects malformed or wrong-locale grouping: %s (%s)", (raw, locale) => {
    expect(parseNumber(raw, locale)).toEqual({ kind: "invalid" })
  })

  test.each(["abc", ".", "+", "+.", "1.2.3", "1e", "1e2e3"])(
    "rejects invalid syntax: %s",
    (raw) => {
      expect(parseNumber(raw, "en")).toEqual({ kind: "invalid" })
    }
  )

  test("rejects malformed localized scientific notation", () => {
    expect(parseNumber("١٫٥e", "ar")).toEqual({ kind: "invalid" })
  })

  test("rejects overflow, underflow, and invalid locales", () => {
    expect(parseNumber("1e999", "en")).toEqual({ kind: "invalid" })
    expect(parseNumber("1e-999", "en")).toEqual({ kind: "invalid" })
    expect(parseNumber("1", "_")).toEqual({ kind: "invalid" })
  })

  test("accepts the smallest positive subnormal Number", () => {
    expect(parseNumber("5e-324", "en")).toEqual({
      kind: "valid",
      value: Number.MIN_VALUE,
    })
  })
})
