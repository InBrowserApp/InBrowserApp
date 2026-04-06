import { describe, expect, test } from "vitest"

import {
  decodeBase64,
  encodeBase64,
  isValidBase64,
  normalizeBase64Input,
} from "./base64"

describe("encodeBase64", () => {
  test("encodes ASCII text", () => {
    expect(encodeBase64("Hello, World!")).toBe("SGVsbG8sIFdvcmxkIQ==")
  })

  test("encodes empty string", () => {
    expect(encodeBase64("")).toBe("")
  })

  test("encodes Unicode (CJK)", () => {
    const encoded = encodeBase64("你好世界")
    const decoded = decodeBase64(encoded)
    expect(decoded).toBe("你好世界")
  })

  test("encodes emoji", () => {
    const encoded = encodeBase64("👋🌍")
    const decoded = decodeBase64(encoded)
    expect(decoded).toBe("👋🌍")
  })
})

describe("decodeBase64", () => {
  test("decodes valid base64", () => {
    expect(decodeBase64("SGVsbG8sIFdvcmxkIQ==")).toBe("Hello, World!")
  })

  test("decodes empty string", () => {
    expect(decodeBase64("")).toBe("")
  })

  test("handles whitespace in input", () => {
    expect(decodeBase64("SGVs bG8s\nIFdv cmxk IQ==")).toBe("Hello, World!")
  })

  test("throws on invalid base64", () => {
    expect(() => decodeBase64("!!!")).toThrow()
  })
})

describe("normalizeBase64Input", () => {
  test("removes spaces", () => {
    expect(normalizeBase64Input("a b c")).toBe("abc")
  })

  test("removes newlines and tabs", () => {
    expect(normalizeBase64Input("a\nb\tc\r\n")).toBe("abc")
  })

  test("returns empty string for empty input", () => {
    expect(normalizeBase64Input("")).toBe("")
  })
})

describe("isValidBase64", () => {
  test("returns true for valid base64", () => {
    expect(isValidBase64("SGVsbG8=")).toBe(true)
  })

  test("returns true for empty string", () => {
    expect(isValidBase64("")).toBe(true)
  })

  test("returns true for whitespace-only string", () => {
    expect(isValidBase64("   ")).toBe(true)
  })

  test("returns false for invalid base64", () => {
    expect(isValidBase64("!!!invalid!!!")).toBe(false)
  })

  test("returns true for base64 with whitespace", () => {
    expect(isValidBase64("SGVs bG8=")).toBe(true)
  })
})
