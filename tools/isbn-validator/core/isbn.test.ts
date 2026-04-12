import { describe, expect, it } from "vitest"

import {
  convertISBN10To13,
  convertISBN13To10,
  getISBN10CheckDigit,
  getISBN13CheckDigit,
  normalizeISBN,
  validateISBN,
} from "./isbn"

describe("normalizeISBN", () => {
  it("removes separators and uppercases X", () => {
    expect(normalizeISBN("0-306-40615-2")).toBe("0306406152")
    expect(normalizeISBN("0-8044-2957-x")).toBe("080442957X")
    expect(normalizeISBN(" 978-0-306-40615-7 ")).toBe("9780306406157")
  })
})

describe("getISBN10CheckDigit", () => {
  it("computes numeric and X check digits", () => {
    expect(getISBN10CheckDigit("030640615")).toBe("2")
    expect(getISBN10CheckDigit("080442957")).toBe("X")
  })

  it("returns null for invalid cores", () => {
    expect(getISBN10CheckDigit("123")).toBe(null)
    expect(getISBN10CheckDigit("12345678X")).toBe(null)
  })
})

describe("getISBN13CheckDigit", () => {
  it("computes the check digit", () => {
    expect(getISBN13CheckDigit("978030640615")).toBe("7")
  })

  it("returns null for invalid cores", () => {
    expect(getISBN13CheckDigit("97803064061")).toBe(null)
    expect(getISBN13CheckDigit("97803064061X")).toBe(null)
  })
})

describe("validateISBN", () => {
  it("validates ISBN-10 numbers and converts them to ISBN-13", () => {
    const result = validateISBN("0-306-40615-2")

    expect(result.type).toBe("isbn-10")
    expect(result.isValid).toBe(true)
    expect(result.isbn10).toBe("0306406152")
    expect(result.isbn13).toBe("9780306406157")
  })

  it("validates ISBN-10 values with X check digits", () => {
    const result = validateISBN("0-8044-2957-X")

    expect(result.isValid).toBe(true)
    expect(result.actualCheckDigit).toBe("X")
  })

  it("rejects invalid ISBN-10 formats", () => {
    const result = validateISBN("12345678X9")

    expect(result.type).toBe("isbn-10")
    expect(result.isLengthValid).toBe(true)
    expect(result.isFormatValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("rejects invalid ISBN-10 checksums", () => {
    const result = validateISBN("0306406153")

    expect(result.isChecksumValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it("validates ISBN-13 numbers and converts 978 prefixes to ISBN-10", () => {
    const result = validateISBN("9780306406157")

    expect(result.type).toBe("isbn-13")
    expect(result.isValid).toBe(true)
    expect(result.isbn13).toBe("9780306406157")
    expect(result.isbn10).toBe("0306406152")
    expect(result.prefix).toBe("978")
  })

  it("keeps 979-prefixed ISBN-13 values valid without ISBN-10 conversion", () => {
    const result = validateISBN("9790306406156")

    expect(result.isValid).toBe(true)
    expect(result.prefix).toBe("979")
    expect(result.isbn10).toBe(null)
  })

  it("rejects invalid ISBN-13 formats and checksums", () => {
    const invalidFormat = validateISBN("97803064061X7")
    expect(invalidFormat.isFormatValid).toBe(false)
    expect(invalidFormat.isValid).toBe(false)

    const invalidChecksum = validateISBN("9780306406158")
    expect(invalidChecksum.isFormatValid).toBe(true)
    expect(invalidChecksum.isChecksumValid).toBe(false)
    expect(invalidChecksum.isValid).toBe(false)
  })

  it("flags invalid lengths", () => {
    const result = validateISBN("1234567")

    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})

describe("conversions", () => {
  it("converts valid numbers between ISBN-10 and ISBN-13", () => {
    expect(convertISBN10To13("0306406152")).toBe("9780306406157")
    expect(convertISBN13To10("9780306406157")).toBe("0306406152")
  })

  it("returns null for invalid or unsupported conversions", () => {
    expect(convertISBN10To13("12345678X9")).toBe(null)
    expect(convertISBN13To10("97803064061X7")).toBe(null)
    expect(convertISBN13To10("9790306406156")).toBe(null)
  })
})
