import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  DEFAULT_NANOID_LENGTH,
  generateNanoid,
  getAlphabetMetrics,
  normalizeNanoidCount,
  normalizeNanoidLength,
} from "./nanoid"

let byteOffset = 0

beforeEach(() => {
  byteOffset = 0

  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const values = array as Uint8Array

    for (let index = 0; index < values.length; index += 1) {
      values[index] = (byteOffset + index) % 256
    }

    byteOffset = (byteOffset + values.length) % 256
    return array
  })
})

describe("getAlphabetMetrics", () => {
  test("counts unique characters and duplicates", () => {
    expect(getAlphabetMetrics("aab🙂🙂c")).toEqual({
      uniqueCount: 4,
      duplicates: ["a", "🙂"],
    })
  })

  test("returns no duplicates for a valid alphabet", () => {
    expect(getAlphabetMetrics("abc123")).toEqual({
      uniqueCount: 6,
      duplicates: [],
    })
  })
})

describe("normalizeNanoidLength", () => {
  test("uses the default length for invalid input", () => {
    expect(normalizeNanoidLength(undefined)).toBe(DEFAULT_NANOID_LENGTH)
    expect(normalizeNanoidLength(Number.NaN)).toBe(DEFAULT_NANOID_LENGTH)
  })

  test("clamps to the supported range", () => {
    expect(normalizeNanoidLength(0)).toBe(1)
    expect(normalizeNanoidLength(400)).toBe(128)
    expect(normalizeNanoidLength(18.9)).toBe(18)
  })
})

describe("normalizeNanoidCount", () => {
  test("defaults to 1 for invalid input", () => {
    expect(normalizeNanoidCount(undefined)).toBe(1)
    expect(normalizeNanoidCount(Number.NaN)).toBe(1)
  })

  test("clamps to the supported range", () => {
    expect(normalizeNanoidCount(0)).toBe(1)
    expect(normalizeNanoidCount(200)).toBe(100)
    expect(normalizeNanoidCount(5.8)).toBe(5)
  })
})

describe("generateNanoid", () => {
  test("generates an ID using only characters from the alphabet", () => {
    const value = generateNanoid("0123456789", 12)

    expect(value).toHaveLength(12)
    expect(value).toMatch(/^[0-9]+$/u)
  })

  test("supports multi-byte characters in the alphabet", () => {
    const value = generateNanoid("🙂🙃", 6)

    expect(Array.from(value)).toHaveLength(6)
    expect(value).toMatch(/^[🙂🙃]+$/u)
  })

  test("throws when the requested length is invalid", () => {
    expect(() => generateNanoid("abc", 0)).toThrow(RangeError)
  })

  test("throws when the alphabet has fewer than two unique characters", () => {
    expect(() => generateNanoid("a", 8)).toThrow(RangeError)
  })

  test("throws when the alphabet contains duplicates", () => {
    expect(() => generateNanoid("aabc", 8)).toThrow(RangeError)
  })
})
