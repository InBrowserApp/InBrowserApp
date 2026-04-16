import { describe, expect, test } from "vitest"

import {
  PREVIEW_CHARACTER_LIMIT,
  decodeBase32,
  decodeBase32Preview,
  deriveDecodedFileName,
  encodeBase32,
} from "./base32"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

describe("encodeBase32", () => {
  test("encodes known RFC 4648 values", () => {
    expect(encodeBase32(encoder.encode(""))).toBe("")
    expect(encodeBase32(encoder.encode("f"))).toBe("MY======")
    expect(encodeBase32(encoder.encode("fo"))).toBe("MZXQ====")
    expect(encodeBase32(encoder.encode("foo"))).toBe("MZXW6===")
    expect(encodeBase32(encoder.encode("foob"))).toBe("MZXW6YQ=")
    expect(encodeBase32(encoder.encode("fooba"))).toBe("MZXW6YTB")
    expect(encodeBase32(encoder.encode("foobar"))).toBe("MZXW6YTBOI======")
  })

  test("accepts ArrayBuffer input and can omit padding", () => {
    const bytes = encoder.encode("foo")
    const buffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    )

    expect(encodeBase32(buffer)).toBe("MZXW6===")
    expect(encodeBase32(encoder.encode("f"), { padding: false })).toBe("MY")
    expect(encodeBase32(encoder.encode("foo"), { padding: false })).toBe(
      "MZXW6"
    )
  })
})

describe("decodeBase32", () => {
  test("decodes known RFC 4648 values", () => {
    expect(decoder.decode(decodeBase32("MY======"))).toBe("f")
    expect(decoder.decode(decodeBase32("MZXQ===="))).toBe("fo")
    expect(decoder.decode(decodeBase32("MZXW6==="))).toBe("foo")
    expect(decoder.decode(decodeBase32("MZXW6YQ="))).toBe("foob")
    expect(decoder.decode(decodeBase32("MZXW6YTB"))).toBe("fooba")
    expect(decoder.decode(decodeBase32("MZXW6YTBOI======"))).toBe("foobar")
  })

  test("accepts lowercase, whitespace, and missing padding", () => {
    expect(decoder.decode(decodeBase32("my"))).toBe("f")
    expect(decoder.decode(decodeBase32("mzxw6==="))).toBe("foo")
    expect(decoder.decode(decodeBase32("MZXW6"))).toBe("foo")
    expect(decoder.decode(decodeBase32("MZXW6 YQ="))).toBe("foob")
  })

  test("returns an empty byte array for empty input", () => {
    expect(Array.from(decodeBase32(""))).toEqual([])
  })

  test("rejects invalid characters, lengths, padding, and leftover bits", () => {
    expect(() => decodeBase32("M1======")).toThrow("Invalid Base32 character")
    expect(() => decodeBase32("MY===")).toThrow(/Invalid Base32/)
    expect(() => decodeBase32("M")).toThrow(/Invalid Base32/)
    expect(() => decodeBase32("M=ZXW6==")).toThrow("Invalid Base32 padding")
    expect(() => decodeBase32("MZXW6Y==")).toThrow("Invalid Base32 padding")
    expect(() => decodeBase32("AB")).toThrow("Invalid Base32 padding")
  })
})

describe("decodeBase32Preview", () => {
  test("returns an empty state for blank input", () => {
    expect(decodeBase32Preview("   ")).toEqual({ state: "empty" })
  })

  test("returns a decoded preview for valid input", () => {
    expect(decodeBase32Preview("MZXW6===")).toEqual({
      state: "decoded",
      bytes: new Uint8Array([102, 111, 111]),
      text: "foo",
      previewText: "foo",
      isPreviewTruncated: false,
    })
  })

  test("returns a truncated preview when decoded text is too long", () => {
    const longText = "a".repeat(PREVIEW_CHARACTER_LIMIT + 1)
    const result = decodeBase32Preview(encodeBase32(encoder.encode(longText)))

    expect(result.state).toBe("decoded")

    if (result.state !== "decoded") {
      throw new Error("Expected a decoded preview result")
    }

    expect(result.text).toHaveLength(PREVIEW_CHARACTER_LIMIT + 1)
    expect(result.previewText).toBe(`${"a".repeat(PREVIEW_CHARACTER_LIMIT)}...`)
    expect(result.isPreviewTruncated).toBe(true)
  })

  test("returns an invalid state for malformed input", () => {
    expect(decodeBase32Preview("invalid")).toEqual({ state: "invalid-base32" })
  })
})

describe("deriveDecodedFileName", () => {
  test("falls back to decoded.bin without a file name", () => {
    expect(deriveDecodedFileName()).toBe("decoded.bin")
    expect(deriveDecodedFileName(null)).toBe("decoded.bin")
  })

  test("replaces the file extension with .bin", () => {
    expect(deriveDecodedFileName("sample.b32")).toBe("sample.bin")
    expect(deriveDecodedFileName("sample")).toBe("sample.bin")
  })

  test("falls back to decoded.bin for empty basenames", () => {
    expect(deriveDecodedFileName(".b32")).toBe("decoded.bin")
  })
})
