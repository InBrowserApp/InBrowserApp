import { describe, expect, test } from "vitest"

import {
  isValidBase62,
  isValidBase64,
  isValidForBase,
  normalizeBase,
  parseBase,
  parseBase62,
  parseBase64Number,
  parseDecimal,
  parseHex,
  toBase,
  toBase62,
  toBase64Number,
  toDecimal,
  toHex,
} from "./number-base"

describe("number base helpers", () => {
  test("normalizes arbitrary bases into the supported range", () => {
    expect(normalizeBase(Number.NaN)).toBe(2)
    expect(normalizeBase(1)).toBe(2)
    expect(normalizeBase(64.9)).toBe(64)
    expect(normalizeBase(100)).toBe(64)
  })

  test("validates standard bases case-insensitively up to base36", () => {
    expect(isValidForBase("deadBEEF", 16)).toBe(true)
    expect(parseHex("deadBEEF")).toBe(3735928559n)
    expect(toHex(3735928559n)).toBe("deadbeef")
  })

  test("treats higher standard bases as case-sensitive", () => {
    expect(isValidBase62("Az")).toBe(true)
    expect(parseBase62("Az")).toBe(2267n)
    expect(parseBase62("aZ")).toBe(681n)
    expect(toBase62(2267n)).toBe("Az")
  })

  test("supports the alternate base64 alphabet", () => {
    expect(isValidBase64("D/")).toBe(true)
    expect(parseBase64Number("D/")).toBe(255n)
    expect(parseBase64Number("d/")).toBe(1919n)
    expect(toBase64Number(255n)).toBe("D/")
  })

  test("rejects invalid characters and out-of-range bases", () => {
    expect(isValidForBase("2", 2)).toBe(false)
    expect(isValidForBase("abc", 1)).toBe(false)
    expect(isValidForBase("abc", 65)).toBe(false)
    expect(parseBase("1Z", 16)).toBe(null)
    expect(toBase(5n, 65)).toBe("")
  })

  test("round-trips custom bases and zero", () => {
    expect(parseBase("0", 58)).toBe(0n)
    expect(toBase(0n, 58)).toBe("0")
    expect(toBase(123456789n, 58)).toBe("aQHnj")
    expect(parseBase("aQHnj", 58)).toBe(123456789n)
  })

  test("parses and formats decimal values", () => {
    expect(parseDecimal("255")).toBe(255n)
    expect(toDecimal(255n)).toBe("255")
  })
})
