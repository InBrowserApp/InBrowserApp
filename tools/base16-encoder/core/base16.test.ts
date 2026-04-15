import { describe, expect, test } from "vitest"

import {
  PREVIEW_CHARACTER_LIMIT,
  deriveEncodedFileName,
  encodeBase16,
  encodeBytesToBase16Preview,
  encodeTextToBase16Preview,
} from "./base16"

describe("encodeBase16", () => {
  test("encodes ascii text bytes to uppercase hex", () => {
    expect(encodeBase16(new TextEncoder().encode("foo"))).toBe("666F6F")
  })

  test("encodes arbitrary binary bytes", () => {
    expect(encodeBase16(new Uint8Array([0, 15, 16, 255]))).toBe("000F10FF")
  })

  test("returns an empty string for empty byte arrays", () => {
    expect(encodeBase16(new Uint8Array())).toBe("")
  })
})

describe("encodeTextToBase16Preview", () => {
  test("returns an empty state for empty text", () => {
    expect(encodeTextToBase16Preview("")).toEqual({ state: "empty" })
  })

  test("encodes text with utf-8 semantics", () => {
    expect(encodeTextToBase16Preview("✓")).toEqual({
      state: "encoded",
      text: "E29C93",
      previewText: "E29C93",
      isPreviewTruncated: false,
    })
  })
})

describe("encodeBytesToBase16Preview", () => {
  test("returns an empty state for empty bytes", () => {
    expect(encodeBytesToBase16Preview(new Uint8Array())).toEqual({
      state: "empty",
    })
  })

  test("returns an encoded preview for non-empty bytes", () => {
    expect(encodeBytesToBase16Preview(new Uint8Array([0xab, 0xcd]))).toEqual({
      state: "encoded",
      text: "ABCD",
      previewText: "ABCD",
      isPreviewTruncated: false,
    })
  })

  test("truncates long encoded previews", () => {
    const input = new Uint8Array(PREVIEW_CHARACTER_LIMIT / 2 + 1).fill(0xab)
    const result = encodeBytesToBase16Preview(input)

    expect(result.state).toBe("encoded")

    if (result.state !== "encoded") {
      throw new Error("Expected an encoded preview result")
    }

    expect(result.text).toHaveLength(PREVIEW_CHARACTER_LIMIT + 2)
    expect(result.previewText).toBe(
      `${"AB".repeat(PREVIEW_CHARACTER_LIMIT / 2)}...`
    )
    expect(result.isPreviewTruncated).toBe(true)
  })
})

describe("deriveEncodedFileName", () => {
  test("uses the default download name without a file", () => {
    expect(deriveEncodedFileName()).toBe("encoded.hex.txt")
    expect(deriveEncodedFileName(null)).toBe("encoded.hex.txt")
  })

  test("replaces the file extension with .hex", () => {
    expect(deriveEncodedFileName("sample.txt")).toBe("sample.hex")
    expect(deriveEncodedFileName("sample")).toBe("sample.hex")
  })

  test("falls back to file.hex for empty basenames", () => {
    expect(deriveEncodedFileName(".txt")).toBe("file.hex")
  })
})
