import { describe, expect, test } from "vitest"

import { getIMEICheckDigit, normalizeIMEI, validateIMEI } from "./imei"

describe("normalizeIMEI", () => {
  test("removes spaces and hyphens", () => {
    expect(normalizeIMEI("49 015420-3237518")).toBe("490154203237518")
  })
})

describe("getIMEICheckDigit", () => {
  test("returns the expected Luhn check digit for a 14-digit core", () => {
    expect(getIMEICheckDigit("49015420323751")).toBe("8")
  })

  test("returns null for malformed cores", () => {
    expect(getIMEICheckDigit("4901542032375A")).toBeNull()
    expect(getIMEICheckDigit("123")).toBeNull()
  })
})

describe("validateIMEI", () => {
  test("returns empty state for empty input", () => {
    expect(validateIMEI("")).toEqual({
      raw: "",
      normalized: "",
      length: 0,
      tac: null,
      serialNumber: null,
      expectedCheckDigit: null,
      actualCheckDigit: null,
      isLengthValid: false,
      isFormatValid: false,
      isChecksumValid: false,
      isValid: false,
      reason: "empty",
    })
  })

  test("flags invalid formats after normalization", () => {
    const result = validateIMEI("49 015420-32375A8")

    expect(result.reason).toBe("invalid-format")
    expect(result.normalized).toBe("4901542032375A8")
    expect(result.isFormatValid).toBe(false)
    expect(result.expectedCheckDigit).toBeNull()
    expect(result.actualCheckDigit).toBeNull()
  })

  test("flags invalid lengths while still exposing the expected check digit", () => {
    const result = validateIMEI("49015420323751")

    expect(result.reason).toBe("invalid-length")
    expect(result.isLengthValid).toBe(false)
    expect(result.expectedCheckDigit).toBe("8")
    expect(result.actualCheckDigit).toBeNull()
    expect(result.tac).toBe("49015420")
    expect(result.serialNumber).toBe("323751")
  })

  test("flags invalid checksum digits", () => {
    const result = validateIMEI("490154203237519")

    expect(result.reason).toBe("invalid-checksum")
    expect(result.isChecksumValid).toBe(false)
    expect(result.expectedCheckDigit).toBe("8")
    expect(result.actualCheckDigit).toBe("9")
  })

  test("accepts valid IMEI numbers", () => {
    const result = validateIMEI("49 015420-3237518")

    expect(result.reason).toBe("valid")
    expect(result.isValid).toBe(true)
    expect(result.normalized).toBe("490154203237518")
    expect(result.expectedCheckDigit).toBe("8")
    expect(result.actualCheckDigit).toBe("8")
    expect(result.tac).toBe("49015420")
    expect(result.serialNumber).toBe("323751")
  })
})
