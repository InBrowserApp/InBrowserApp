import { describe, expect, test } from "vitest"

import {
  MAX_ARABIC_NUMBER,
  MIN_ARABIC_NUMBER,
  arabicToRoman,
  isValidRomanNumeral,
  normalizeRomanNumeral,
  parseArabicInput,
  romanToArabic,
} from "./roman"

describe("roman numeral helpers", () => {
  test("normalizes roman numerals", () => {
    expect(normalizeRomanNumeral("  mmxxiv ")).toBe("MMXXIV")
  })

  test("parses empty, invalid, out-of-range, and valid arabic input", () => {
    expect(parseArabicInput("")).toEqual({ kind: "empty" })
    expect(parseArabicInput("12.5")).toEqual({ kind: "invalid" })
    expect(parseArabicInput("0")).toEqual({ kind: "out-of-range", value: 0 })
    expect(parseArabicInput("4000")).toEqual({
      kind: "out-of-range",
      value: 4000,
    })
    expect(parseArabicInput("2024")).toEqual({ kind: "valid", value: 2024 })
  })

  test("converts arabic numbers to roman numerals", () => {
    expect(arabicToRoman(MIN_ARABIC_NUMBER)).toBe("I")
    expect(arabicToRoman(2024)).toBe("MMXXIV")
    expect(arabicToRoman(MAX_ARABIC_NUMBER)).toBe("MMMCMXCIX")
  })

  test("throws for out-of-range arabic numbers", () => {
    expect(() => arabicToRoman(0)).toThrow("Number out of range")
    expect(() => arabicToRoman(4000)).toThrow("Number out of range")
    expect(() => arabicToRoman(3.14)).toThrow("Number out of range")
  })

  test("converts roman numerals to arabic numbers", () => {
    expect(romanToArabic("I")).toBe(1)
    expect(romanToArabic(" mmxxiv ")).toBe(2024)
    expect(romanToArabic("MMMCMXCIX")).toBe(3999)
  })

  test("rejects malformed roman numerals", () => {
    expect(() => romanToArabic("")).toThrow("Roman numeral is empty")
    expect(() => romanToArabic("ABC")).toThrow("Invalid Roman numeral")
    expect(() => romanToArabic("IIII")).toThrow("Invalid Roman numeral")
    expect(() => romanToArabic("VX")).toThrow("Invalid Roman numeral")
  })

  test("validates roman numerals", () => {
    expect(isValidRomanNumeral("MMXXIV")).toBe(true)
    expect(isValidRomanNumeral("MMMM")).toBe(false)
    expect(isValidRomanNumeral("123")).toBe(false)
  })
})
