import { describe, expect, test, vi } from "vitest"

import {
  isValidBase62,
  isValidBase64,
  isValidForBase,
  normalizeBase,
  parseBase,
  parseBase32,
  parseBase36,
  parseBase62,
  parseBase64Number,
  parseDecimal,
  parseHex,
  parseOctal,
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

  test("covers wrapper parsers for octal, base32, and base36", () => {
    expect(parseOctal("377")).toBe(255n)
    expect(parseBase32("100")).toBe(1024n)
    expect(parseBase36("zz")).toBe(1295n)
  })

  test("rejects invalid characters and out-of-range bases", () => {
    expect(isValidForBase("", 2)).toBe(true)
    expect(isValidForBase("2", 2)).toBe(false)
    expect(isValidForBase("abc", 1)).toBe(false)
    expect(isValidForBase("abc", 65)).toBe(false)
    expect(parseBase("1Z", 16)).toBe(null)
    expect(toBase(5n, 65)).toBe("")
  })

  test("returns null when bigint construction throws", () => {
    const originalBigInt = globalThis.BigInt

    vi.stubGlobal("BigInt", ((value: bigint | boolean | number | string) => {
      if (value === 10) {
        throw new Error("boom")
      }

      return originalBigInt(value)
    }) as typeof BigInt)

    expect(parseBase("1", 10)).toBe(null)

    vi.unstubAllGlobals()
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
