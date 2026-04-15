import { describe, expect, it } from "vitest"

import {
  cardBrands,
  detectCardBrand,
  formatCardNumber,
  luhnValidate,
  normalizeCardNumber,
  validateCardLength,
  validateCardNumber,
} from "./credit-card"

describe("normalizeCardNumber", () => {
  it("keeps only digits", () => {
    expect(normalizeCardNumber("4111 1111-1111 1111")).toBe("4111111111111111")
  })
})

describe("luhnValidate", () => {
  it("returns false for empty input", () => {
    expect(luhnValidate("")).toBe(false)
  })

  it("validates a known Visa test number", () => {
    expect(luhnValidate("4111111111111111")).toBe(true)
  })

  it("rejects an invalid checksum", () => {
    expect(luhnValidate("4111111111111112")).toBe(false)
  })
})

describe("detectCardBrand", () => {
  it("detects string-prefix brands", () => {
    expect(detectCardBrand("411111")).toEqual(cardBrands[0])
    expect(detectCardBrand("378282")).toEqual(cardBrands[2])
    expect(detectCardBrand("620000")).toEqual(cardBrands[5])
    expect(detectCardBrand("")).toBeNull()
  })

  it("detects ranged-prefix brands", () => {
    expect(detectCardBrand("222100")).toEqual(cardBrands[1])
    expect(detectCardBrand("352800")).toEqual(cardBrands[4])
    expect(detectCardBrand("300123")).toEqual(cardBrands[6])
  })

  it("returns null for unknown prefixes", () => {
    expect(detectCardBrand("911111")).toBeNull()
    expect(detectCardBrand("2")).toBeNull()
  })
})

describe("validateCardLength", () => {
  it("validates supported lengths for a detected brand", () => {
    const visa = detectCardBrand("4111111111111")
    expect(validateCardLength("4111111111111", visa)).toBe(true)
  })

  it("returns false when the brand is missing or the length is unsupported", () => {
    const mastercard = detectCardBrand("5555555555554444")
    expect(validateCardLength("555555555555444", mastercard)).toBe(false)
    expect(validateCardLength("5555555555554444", null)).toBe(false)
  })
})

describe("formatCardNumber", () => {
  it("returns an empty string when there are no digits", () => {
    expect(formatCardNumber("abcd")).toBe("")
  })

  it("formats using the detected brand pattern", () => {
    const amex = detectCardBrand("378282246310005")
    expect(formatCardNumber("378282246310005", amex)).toBe("3782 822463 10005")
  })

  it("falls back to the default grouping when the brand is unknown", () => {
    expect(formatCardNumber("9111111111111111")).toBe("9111 1111 1111 1111")
  })
})

describe("validateCardNumber", () => {
  it("returns a valid result for a Visa test number", () => {
    expect(validateCardNumber("4111 1111 1111 1111")).toEqual({
      raw: "4111 1111 1111 1111",
      digits: "4111111111111111",
      formattedNumber: "4111 1111 1111 1111",
      brand: cardBrands[0],
      isLuhnValid: true,
      isLengthValid: true,
      isValid: true,
    })
  })

  it("returns an invalid result when the brand is known but the checksum fails", () => {
    expect(validateCardNumber("4111111111111112")).toEqual({
      raw: "4111111111111112",
      digits: "4111111111111112",
      formattedNumber: "4111 1111 1111 1112",
      brand: cardBrands[0],
      isLuhnValid: false,
      isLengthValid: true,
      isValid: false,
    })
  })

  it("returns an invalid result when the prefix is unknown", () => {
    expect(validateCardNumber("9111111111111111")).toEqual({
      raw: "9111111111111111",
      digits: "9111111111111111",
      formattedNumber: "9111 1111 1111 1111",
      brand: null,
      isLuhnValid: false,
      isLengthValid: false,
      isValid: false,
    })
  })
})
