import { describe, expect, test } from "vitest"

import {
  PREVIEW_CHARACTER_LIMIT,
  decodeBase16,
  decodeBase16Preview,
  deriveDecodedFileName,
} from "./base16"

const decoder = new TextDecoder()

describe("decodeBase16", () => {
  test("decodes uppercase and lowercase hex content", () => {
    expect(decoder.decode(decodeBase16("666F6F"))).toBe("foo")
    expect(decoder.decode(decodeBase16("666f6f"))).toBe("foo")
  })

  test("accepts whitespace and a leading 0x prefix", () => {
    expect(decoder.decode(decodeBase16("0x666f6f"))).toBe("foo")
    expect(decoder.decode(decodeBase16("66 6f 6f"))).toBe("foo")
    expect(decoder.decode(decodeBase16("66\n6F\n6f"))).toBe("foo")
  })

  test("returns an empty byte array for empty input", () => {
    expect(Array.from(decodeBase16(""))).toEqual([])
  })

  test("throws for odd-length and invalid characters", () => {
    expect(() => decodeBase16("F")).toThrow("Invalid hex length")
    expect(() => decodeBase16("ZZ")).toThrow("Invalid hex character")
  })
})

describe("decodeBase16Preview", () => {
  test("returns an empty state for blank input", () => {
    expect(decodeBase16Preview("   ")).toEqual({ state: "empty" })
  })

  test("returns a decoded preview for valid input", () => {
    expect(decodeBase16Preview("48656C6C6F")).toEqual({
      state: "decoded",
      bytes: new Uint8Array([72, 101, 108, 108, 111]),
      text: "Hello",
      previewText: "Hello",
      isPreviewTruncated: false,
    })
  })

  test("returns a truncated preview when decoded text is too long", () => {
    const input = "61".repeat(PREVIEW_CHARACTER_LIMIT + 1)
    const result = decodeBase16Preview(input)

    expect(result.state).toBe("decoded")

    if (result.state !== "decoded") {
      throw new Error("Expected a decoded preview result")
    }

    expect(result.text).toHaveLength(PREVIEW_CHARACTER_LIMIT + 1)
    expect(result.previewText).toBe(`${"a".repeat(PREVIEW_CHARACTER_LIMIT)}...`)
    expect(result.isPreviewTruncated).toBe(true)
  })

  test("returns an invalid state for malformed hex input", () => {
    expect(decodeBase16Preview("GG")).toEqual({ state: "invalid-base16" })
  })
})

describe("deriveDecodedFileName", () => {
  test("falls back to decoded.bin without a file name", () => {
    expect(deriveDecodedFileName()).toBe("decoded.bin")
    expect(deriveDecodedFileName(null)).toBe("decoded.bin")
  })

  test("replaces the file extension with .bin", () => {
    expect(deriveDecodedFileName("sample.hex")).toBe("sample.bin")
    expect(deriveDecodedFileName("sample")).toBe("sample.bin")
  })

  test("falls back to decoded.bin for empty basenames", () => {
    expect(deriveDecodedFileName(".hex")).toBe("decoded.bin")
  })
})
