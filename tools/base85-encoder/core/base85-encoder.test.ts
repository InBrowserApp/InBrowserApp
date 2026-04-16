import { describe, expect, test } from "vitest"

import {
  INVALID_BASE85_LENGTH,
  deriveEncodedFileName,
  encodeBase85,
  encodeBytesAsBase85,
  encodeTextAsBase85,
} from "./base85-encoder"

describe("encodeBytesAsBase85", () => {
  test("encodes binary data as ASCII85 by default", () => {
    expect(encodeBytesAsBase85(Uint8Array.from([102, 111, 111]))).toBe("AoDS")
  })

  test("supports ArrayBuffer input", () => {
    const bytes = new TextEncoder().encode("Hello")

    expect(encodeBytesAsBase85(bytes.buffer)).toBe("87cURDZ")
  })

  test("returns an empty string for empty input", () => {
    expect(encodeBytesAsBase85(new Uint8Array())).toBe("")
  })

  test("compresses zero blocks in ASCII85", () => {
    expect(encodeBytesAsBase85(Uint8Array.from([0, 0, 0, 0]))).toBe("z")
  })

  test("encodes spec example bytes as Z85", () => {
    expect(
      encodeBytesAsBase85(
        Uint8Array.from([0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b]),
        { variant: "z85" }
      )
    ).toBe("HelloWorld")
  })

  test("throws when Z85 input length is not divisible by 4", () => {
    expect(() =>
      encodeBytesAsBase85(Uint8Array.from([1, 2, 3]), {
        variant: "z85",
      })
    ).toThrowError(INVALID_BASE85_LENGTH)
  })
})

describe("encodeTextAsBase85", () => {
  test("encodes UTF-8 text", () => {
    expect(encodeTextAsBase85("foo")).toBe("AoDS")
    expect(encodeTextAsBase85("你好")).toBe("jLq5JV7c")
  })
})

describe("encodeBase85", () => {
  test("encodes a blob as ASCII85", async () => {
    await expect(encodeBase85(new Blob(["foo"]))).resolves.toBe("AoDS")
  })
})

describe("deriveEncodedFileName", () => {
  test("uses the text download name when no file is selected", () => {
    expect(deriveEncodedFileName()).toBe("encoded.a85.txt")
    expect(deriveEncodedFileName(undefined, "z85")).toBe("encoded.z85.txt")
  })

  test("derives a variant-specific name from the uploaded file name", () => {
    expect(deriveEncodedFileName("sample.txt")).toBe("sample.a85")
    expect(deriveEncodedFileName("sample", "z85")).toBe("sample.z85")
  })

  test("falls back to a generic file name when the uploaded basename is empty", () => {
    expect(deriveEncodedFileName(".txt")).toBe("file.a85")
    expect(deriveEncodedFileName(null, "z85")).toBe("file.z85")
  })
})
