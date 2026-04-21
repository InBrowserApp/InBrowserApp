import { describe, expect, test } from "vitest"

import {
  BASE58_ALPHABETS,
  DEFAULT_BASE58_ALPHABET_KEY,
  PREVIEW_CHARACTER_LIMIT,
  decodeBase58,
  decodeBase58Preview,
  deriveDecodedFileName,
  encodeBase58,
  normalizeBase58Input,
  resolveBase58AlphabetKey,
} from "./base58"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

describe("base58", () => {
  test("normalizes whitespace in the input", () => {
    expect(normalizeBase58Input(" StV1 \nDL6CwTryKyV\t")).toBe(
      "StV1DL6CwTryKyV"
    )
  })

  test("resolves supported alphabet keys and falls back for unknown values", () => {
    expect(resolveBase58AlphabetKey("flickr")).toBe("flickr")
    expect(resolveBase58AlphabetKey("nope")).toBe(DEFAULT_BASE58_ALPHABET_KEY)
  })

  test("encodes and decodes bitcoin alphabet content", () => {
    expect(decoder.decode(decodeBase58("StV1DL6CwTryKyV"))).toBe("hello world")
    expect(encodeBase58(encoder.encode("hello world"))).toBe("StV1DL6CwTryKyV")
  })

  test("supports alternate alphabets", () => {
    const source = encoder.encode("hello world")
    const flickr = encodeBase58(source, {
      alphabet: BASE58_ALPHABETS.flickr,
    })
    const ripple = encodeBase58(source, {
      alphabet: BASE58_ALPHABETS.ripple,
    })

    expect(
      decoder.decode(
        decodeBase58(flickr, { alphabet: BASE58_ALPHABETS.flickr })
      )
    ).toBe("hello world")
    expect(
      decoder.decode(
        decodeBase58(ripple, { alphabet: BASE58_ALPHABETS.ripple })
      )
    ).toBe("hello world")
  })

  test("returns an empty string for empty input", () => {
    expect(encodeBase58(new Uint8Array())).toBe("")
  })

  test("preserves leading zero bytes and accepts ArrayBuffer input", () => {
    const source = Uint8Array.from([0, 0, 1, 2, 3])
    const encoded = encodeBase58(source.buffer)

    expect(encoded.startsWith("11")).toBe(true)
    expect(Array.from(decodeBase58(encoded))).toEqual(Array.from(source))
  })

  test("returns an empty array for blank input", () => {
    expect(Array.from(decodeBase58(" \n\t"))).toEqual([])
  })

  test("throws for invalid characters and invalid alphabets", () => {
    expect(() => decodeBase58("0OIl")).toThrow("Invalid Base58 character")
    expect(() => decodeBase58("abc", { alphabet: "short" })).toThrow(
      "Invalid Base58 alphabet"
    )
    expect(() =>
      decodeBase58("abc", {
        alphabet: "1111111111111111111111111111111111111111111111111111111111",
      })
    ).toThrow("Invalid Base58 alphabet")
  })

  test("returns preview metadata for decoded values", () => {
    expect(decodeBase58Preview("StV1DL6CwTryKyV")).toEqual({
      state: "decoded",
      bytes: encoder.encode("hello world"),
      text: "hello world",
      previewText: "hello world",
      isPreviewTruncated: false,
    })
  })

  test("returns an empty preview for blank input", () => {
    expect(decodeBase58Preview("  ")).toEqual({ state: "empty" })
  })

  test("returns a truncated preview for long decoded text", () => {
    const input = encodeBase58(
      encoder.encode("a".repeat(PREVIEW_CHARACTER_LIMIT + 1))
    )
    const result = decodeBase58Preview(input)

    expect(result.state).toBe("decoded")

    if (result.state !== "decoded") {
      throw new Error("Expected decoded preview")
    }

    expect(result.text).toHaveLength(PREVIEW_CHARACTER_LIMIT + 1)
    expect(result.previewText).toBe(`${"a".repeat(PREVIEW_CHARACTER_LIMIT)}...`)
    expect(result.isPreviewTruncated).toBe(true)
  })

  test("returns an invalid preview state for malformed input", () => {
    expect(decodeBase58Preview("0OIl")).toEqual({ state: "invalid-base58" })
  })

  test("derives decoded file names with a .bin suffix", () => {
    expect(deriveDecodedFileName()).toBe("decoded.bin")
    expect(deriveDecodedFileName(null)).toBe("decoded.bin")
    expect(deriveDecodedFileName("sample.b58")).toBe("sample.bin")
    expect(deriveDecodedFileName("sample")).toBe("sample.bin")
    expect(deriveDecodedFileName(".b58")).toBe("decoded.bin")
  })
})
