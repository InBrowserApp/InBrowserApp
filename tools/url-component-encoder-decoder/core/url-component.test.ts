import { describe, expect, test } from "vitest"

import {
  decodeUrlComponent,
  encodeUrlComponent,
  isValidUrlComponentEncoding,
} from "./url-component"

describe("encodeUrlComponent", () => {
  test("encodes reserved characters", () => {
    expect(encodeUrlComponent("Hello World! 50% off & more")).toBe(
      "Hello%20World!%2050%25%20off%20%26%20more"
    )
  })

  test("encodes unicode characters", () => {
    expect(encodeUrlComponent("你好 / café")).toBe(
      "%E4%BD%A0%E5%A5%BD%20%2F%20caf%C3%A9"
    )
  })

  test("returns an empty string for empty input", () => {
    expect(encodeUrlComponent("")).toBe("")
  })
})

describe("decodeUrlComponent", () => {
  test("decodes percent-encoded text", () => {
    expect(decodeUrlComponent("Hello%20World!%20%F0%9F%8C%8D")).toBe(
      "Hello World! 🌍"
    )
  })

  test("leaves plus signs unchanged", () => {
    expect(decodeUrlComponent("one+two")).toBe("one+two")
  })

  test("throws for incomplete escape sequences", () => {
    expect(() => decodeUrlComponent("100%")).toThrow("URI malformed")
  })

  test("throws for malformed utf-8 byte sequences", () => {
    expect(() => decodeUrlComponent("%E0%A4%A")).toThrow("URI malformed")
  })
})

describe("isValidUrlComponentEncoding", () => {
  test("returns true for valid input", () => {
    expect(isValidUrlComponentEncoding("hello%20world")).toBe(true)
  })

  test("returns true for an empty string", () => {
    expect(isValidUrlComponentEncoding("")).toBe(true)
  })

  test("returns false for invalid percent encoding", () => {
    expect(isValidUrlComponentEncoding("hello%2")).toBe(false)
  })
})
