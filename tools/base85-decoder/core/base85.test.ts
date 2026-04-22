import { describe, expect, test } from "vitest"

import {
  PREVIEW_CHARACTER_LIMIT,
  decodeBase85,
  decodeBase85Preview,
  deriveDecodedFileName,
  isBase85Variant,
} from "./base85"

const decoder = new TextDecoder()
const encoder = new TextEncoder()
const ASCII85_HELLO_WORLD = '87cURD]i,"Ebo7'
const ASCII85_HELLO_WORLD_LOWER = "BOu!rD]j7BEbo7"
const Z85_HELLO_WORLD = "nm=QNz=Z<$y?aXj"

function encodeAscii85(text: string) {
  const bytes = encoder.encode(text)
  let output = ""

  for (let offset = 0; offset < bytes.length; offset += 4) {
    const chunk = bytes.subarray(offset, offset + 4)

    if (
      chunk.length === 4 &&
      chunk[0] === 0 &&
      chunk[1] === 0 &&
      chunk[2] === 0 &&
      chunk[3] === 0
    ) {
      output += "z"
      continue
    }

    let value = 0

    for (let index = 0; index < 4; index += 1) {
      value = value * 256 + (chunk[index] ?? 0)
    }

    const digits = Array.from({ length: 5 }, () => 0)

    for (let index = 4; index >= 0; index -= 1) {
      digits[index] = value % 85
      value = Math.floor(value / 85)
    }

    const encodedChunk = digits
      .map((digit) => String.fromCharCode(33 + digit))
      .join("")

    output +=
      chunk.length < 4 ? encodedChunk.slice(0, chunk.length + 1) : encodedChunk
  }

  return output
}

describe("decodeBase85", () => {
  test("decodes ASCII85 payloads", () => {
    expect(decoder.decode(decodeBase85(""))).toBe("")
    expect(decoder.decode(decodeBase85(ASCII85_HELLO_WORLD))).toBe(
      "Hello World"
    )
    expect(decoder.decode(decodeBase85(ASCII85_HELLO_WORLD_LOWER))).toBe(
      "hello world"
    )
    expect(decoder.decode(decodeBase85("z"))).toBe("\0\0\0\0")
    expect(decoder.decode(decodeBase85('<~87cURD]i,"Ebo7~>'))).toBe(
      "Hello World"
    )
    expect(decoder.decode(decodeBase85('87cU\nRD]i,\t"Ebo7'))).toBe(
      "Hello World"
    )
    expect(decoder.decode(decodeBase85("AoDS"))).toBe("foo")
  })

  test("decodes Z85 payloads", () => {
    expect(
      decoder.decode(decodeBase85(Z85_HELLO_WORLD, { variant: "z85" }))
    ).toBe("HelloWorld!!")
    expect(Array.from(decodeBase85("00000", { variant: "z85" }))).toStrictEqual(
      [0, 0, 0, 0]
    )
  })

  test("rejects invalid delimiter, character, and length combinations", () => {
    expect(() => decodeBase85('<~87cURD]i,"Ebo7')).toThrow(
      "Invalid Base85 delimiter"
    )
    expect(() => decodeBase85('87cURD]i,"Ebo7~>')).toThrow(
      "Invalid Base85 delimiter"
    )
    expect(() => decodeBase85("!!!!u!")).toThrow("Invalid Base85 length")
    expect(() => decodeBase85("!!!!z")).toThrow("Invalid Base85 length")
    expect(() => decodeBase85("abc", { variant: "z85" })).toThrow(
      "Invalid Base85 length"
    )
    expect(() => decodeBase85("~~~~~", { variant: "z85" })).toThrow(
      "Invalid Base85 character"
    )
  })

  test("rejects groups that overflow the 32-bit range", () => {
    expect(() => decodeBase85('s8W-"')).toThrow("Invalid Base85 value")
    expect(() => decodeBase85("%nSc1", { variant: "z85" })).toThrow(
      "Invalid Base85 value"
    )
  })
})

describe("decodeBase85Preview", () => {
  test("returns an empty state for blank input", () => {
    expect(decodeBase85Preview("   ", "ascii85")).toStrictEqual({
      state: "empty",
    })
  })

  test("returns a decoded preview for valid input", () => {
    expect(decodeBase85Preview(ASCII85_HELLO_WORLD, "ascii85")).toStrictEqual({
      state: "decoded",
      bytes: encoder.encode("Hello World"),
      text: "Hello World",
      previewText: "Hello World",
      isPreviewTruncated: false,
    })
  })

  test("returns a truncated preview for long decoded text", () => {
    const longText = "a".repeat(PREVIEW_CHARACTER_LIMIT + 1)
    const encoded = encodeAscii85(longText)
    const result = decodeBase85Preview(encoded, "ascii85")

    expect(result.state).toBe("decoded")

    if (result.state !== "decoded") {
      throw new Error("Expected a decoded preview result")
    }

    expect(result.text).toBe(longText)
    expect(result.previewText).toBe(`${"a".repeat(PREVIEW_CHARACTER_LIMIT)}...`)
    expect(result.isPreviewTruncated).toBe(true)
  })

  test("returns an invalid state for malformed input", () => {
    expect(decodeBase85Preview("not-valid~>", "ascii85")).toStrictEqual({
      state: "invalid-base85",
    })
  })
})

describe("file naming and variants", () => {
  test("falls back to decoded.bin without a file name", () => {
    expect(deriveDecodedFileName()).toBe("decoded.bin")
    expect(deriveDecodedFileName(null)).toBe("decoded.bin")
  })

  test("preserves the basename for uploaded files", () => {
    expect(deriveDecodedFileName("payload.a85")).toBe("payload.bin")
    expect(deriveDecodedFileName(".a85")).toBe("decoded.bin")
  })

  test("detects valid variant keys", () => {
    expect(isBase85Variant("ascii85")).toBe(true)
    expect(isBase85Variant("z85")).toBe(true)
    expect(isBase85Variant("custom")).toBe(false)
  })
})
