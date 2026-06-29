import { describe, expect, test } from "vitest"

import { DEFAULT_PRECISION, formatNumber, significantDigits } from "./format"

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

  test("max keeps far more digits", () => {
    expect(formatNumber(1 / 3, "max")).toBe("0.333333333333333")
  })
})

describe("significantDigits", () => {
  test("maps numeric options and max", () => {
    expect(significantDigits("4")).toBe(4)
    expect(significantDigits("max")).toBe(15)
  })
})

describe("defaults", () => {
  test("default precision is six significant figures", () => {
    expect(DEFAULT_PRECISION).toBe("6")
  })
})
