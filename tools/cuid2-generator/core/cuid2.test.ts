import { describe, expect, test } from "vitest"

import {
  CUID2_DEFAULT_LENGTH,
  CUID2_MAX_COUNT,
  CUID2_MAX_LENGTH,
  CUID2_MIN_LENGTH,
  createCuid2Generator,
  generateCuid2Ids,
  isValidCuid2,
  normalizeCuid2Count,
  normalizeCuid2Length,
} from "./cuid2"

describe("cuid2 core", () => {
  test("normalizes identifier length within the supported range", () => {
    expect(normalizeCuid2Length(undefined)).toBe(CUID2_DEFAULT_LENGTH)
    expect(normalizeCuid2Length(Number.NaN)).toBe(CUID2_DEFAULT_LENGTH)
    expect(normalizeCuid2Length(1)).toBe(CUID2_MIN_LENGTH)
    expect(normalizeCuid2Length(CUID2_MAX_LENGTH + 10)).toBe(CUID2_MAX_LENGTH)
    expect(normalizeCuid2Length(18.7)).toBe(18)
  })

  test("normalizes batch count within the supported range", () => {
    expect(normalizeCuid2Count(undefined)).toBe(1)
    expect(normalizeCuid2Count(Number.NaN)).toBe(1)
    expect(normalizeCuid2Count(0)).toBe(1)
    expect(normalizeCuid2Count(CUID2_MAX_COUNT + 5)).toBe(CUID2_MAX_COUNT)
    expect(normalizeCuid2Count(7.9)).toBe(7)
  })

  test("creates valid CUID2 values for the requested length", () => {
    const generate = createCuid2Generator(12)
    const cuid2 = generate()

    expect(cuid2).toHaveLength(12)
    expect(isValidCuid2(cuid2)).toBe(true)
  })

  test("generates a full batch of valid identifiers", () => {
    const ids = generateCuid2Ids(4, 10)

    expect(ids).toHaveLength(4)
    expect(ids.every((value) => value.length === 10)).toBe(true)
    expect(ids.every((value) => isValidCuid2(value))).toBe(true)
  })

  test("rejects malformed identifiers", () => {
    expect(isValidCuid2("")).toBe(false)
    expect(isValidCuid2("1abc")).toBe(false)
    expect(isValidCuid2("ABCDEF")).toBe(false)
    expect(isValidCuid2("a".repeat(CUID2_MAX_LENGTH + 1))).toBe(false)
  })
})
