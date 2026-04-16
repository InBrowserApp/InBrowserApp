import { describe, expect, test } from "vitest"

import {
  deriveEncodedFileName,
  encodeBase32,
  encodeBytesAsBase32,
  encodeTextAsBase32,
} from "./base32-encoder"

describe("encodeBytesAsBase32", () => {
  test("encodes binary data as padded Base32", () => {
    expect(encodeBytesAsBase32(Uint8Array.from([102, 111, 111]))).toBe(
      "MZXW6==="
    )
  })

  test("supports ArrayBuffer input", () => {
    const bytes = Uint8Array.from([72, 101, 108, 108, 111])

    expect(encodeBytesAsBase32(bytes.buffer)).toBe("JBSWY3DP")
  })

  test("returns an empty string for empty input", () => {
    expect(encodeBytesAsBase32(new Uint8Array())).toBe("")
  })

  test("can omit padding when requested", () => {
    expect(
      encodeBytesAsBase32(Uint8Array.from([102, 111, 111]), {
        padding: false,
      })
    ).toBe("MZXW6")
  })
})

describe("encodeTextAsBase32", () => {
  test("encodes UTF-8 text", () => {
    expect(encodeTextAsBase32("foo")).toBe("MZXW6===")
    expect(encodeTextAsBase32("你好")).toBe("4S62BZNFXU======")
  })
})

describe("encodeBase32", () => {
  test("encodes a blob as padded Base32", async () => {
    await expect(encodeBase32(new Blob(["foo"]))).resolves.toBe("MZXW6===")
  })
})

describe("deriveEncodedFileName", () => {
  test("uses the text download name when no file is selected", () => {
    expect(deriveEncodedFileName()).toBe("encoded.base32.txt")
  })

  test("derives a .b32 name from the uploaded file name", () => {
    expect(deriveEncodedFileName("sample.txt")).toBe("sample.b32")
    expect(deriveEncodedFileName("sample")).toBe("sample.b32")
  })

  test("falls back to file.b32 when the uploaded file basename is empty", () => {
    expect(deriveEncodedFileName(".txt")).toBe("file.b32")
  })

  test("falls back to file.b32 when the uploaded file name is missing", () => {
    expect(deriveEncodedFileName(null)).toBe("file.b32")
    expect(deriveEncodedFileName("")).toBe("file.b32")
  })
})
