import { describe, expect, test } from "vitest"

import {
  deriveEncodedFileName,
  encodeBase16,
  encodeBytesAsBase16,
  encodeTextAsBase16,
} from "./base16-encoder"

describe("encodeBytesAsBase16", () => {
  test("encodes binary data as uppercase hex", () => {
    expect(encodeBytesAsBase16(Uint8Array.from([0, 15, 16, 255]))).toBe(
      "000F10FF"
    )
  })
})

describe("encodeTextAsBase16", () => {
  test("encodes UTF-8 text", () => {
    expect(encodeTextAsBase16("foo")).toBe("666F6F")
    expect(encodeTextAsBase16("你好")).toBe("E4BDA0E5A5BD")
  })
})

describe("encodeBase16", () => {
  test("encodes a blob as uppercase hex", async () => {
    await expect(encodeBase16(new Blob(["foo"]))).resolves.toBe("666F6F")
  })
})

describe("deriveEncodedFileName", () => {
  test("uses the text download name when no file is selected", () => {
    expect(deriveEncodedFileName()).toBe("encoded.hex.txt")
  })

  test("derives a .hex name from the uploaded file name", () => {
    expect(deriveEncodedFileName("sample.txt")).toBe("sample.hex")
  })

  test("falls back to file.hex when the uploaded file basename is empty", () => {
    expect(deriveEncodedFileName(".txt")).toBe("file.hex")
  })

  test("falls back to file.hex when the uploaded file name is missing", () => {
    expect(deriveEncodedFileName(null)).toBe("file.hex")
  })
})
