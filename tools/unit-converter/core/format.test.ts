import { describe, expect, test } from "vitest"

import { DEFAULT_PRECISION, formatNumber, significantDigits } from "./format"
import { parseNumber } from "./parse"

describe("formatNumber", () => {
  test("returns an empty string for non-finite values", () => {
    expect(formatNumber(Number.NaN, "6")).toBe("")
    expect(formatNumber(Number.POSITIVE_INFINITY, "6")).toBe("")
  })

  test("formats zero without a sign", () => {
    expect(formatNumber(0, "6")).toBe("0")
    expect(formatNumber(-0, "6")).toBe("0")
  })

  test("rounds to the requested significant figures", () => {
    expect(formatNumber(3.280839895, "6")).toBe("3.28084")
    expect(formatNumber(3.280839895, "4")).toBe("3.281")
  })

  test("collapses floating-point noise and trailing zeros", () => {
    expect(formatNumber(0.1 + 0.2, "6")).toBe("0.3")
    expect(formatNumber(2000, "6")).toBe("2000")
  })

  test.each(["4", "6", "10"] as const)(
    "keeps finite boundary values finite at %s digits",
    (precision) => {
      const positive = formatNumber(Number.MAX_VALUE, precision, "de")
      const negative = formatNumber(-Number.MAX_VALUE, precision)

      expect(positive).not.toContain("Infinity")
      expect(negative).not.toContain("Infinity")
      expect(parseNumber(positive, "de").kind).toBe("valid")
      expect(parseNumber(negative).kind).toBe("valid")
    }
  )

  test("max uses the shortest lossless Number representation", () => {
    expect(formatNumber(1 / 3, "max")).toBe("0.3333333333333333")
    expect(formatNumber(Number.MAX_SAFE_INTEGER, "max")).toBe(
      "9007199254740991"
    )
  })

  test("localizes the decimal separator without adding grouping", () => {
    expect(formatNumber(1234.5, "max", "de")).toBe("1234,5")
    expect(formatNumber(1234.5, "max", "ar-u-nu-arab")).toBe("1234٫5")
  })

  test.each([
    ["de", 0.001],
    ["fr", 3.280839895013123],
    ["ar", 1.234e21],
  ])("round-trips generated output in %s", (locale, value) => {
    const formatted = formatNumber(value, "max", locale)

    expect(parseNumber(formatted, locale)).toEqual({ kind: "valid", value })
  })

  test("falls back to the ASCII decimal separator for invalid locales", () => {
    expect(formatNumber(1.5, "max", "_")).toBe("1.5")
  })
})

describe("significantDigits", () => {
  test("maps numeric precision options", () => {
    expect(significantDigits("4")).toBe(4)
    expect(significantDigits("10")).toBe(10)
  })
})

describe("defaults", () => {
  test("default precision is six significant figures", () => {
    expect(DEFAULT_PRECISION).toBe("6")
  })
})
