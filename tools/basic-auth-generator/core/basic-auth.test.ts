import { describe, expect, test } from "vitest"

import {
  createBasicAuthCurlCommand,
  createBasicAuthHeader,
  createBasicAuthToken,
} from "./basic-auth"

describe("createBasicAuthToken", () => {
  test("encodes standard ASCII credentials", () => {
    expect(createBasicAuthToken("Aladdin", "open sesame")).toBe(
      "QWxhZGRpbjpvcGVuIHNlc2FtZQ=="
    )
  })

  test("encodes Unicode credentials", () => {
    expect(createBasicAuthToken("你好", "密碼")).toBe("5L2g5aW9OuWvhueivA==")
  })

  test("returns an empty string when both fields are empty", () => {
    expect(createBasicAuthToken("", "")).toBe("")
  })

  test("allows an empty username when a password is present", () => {
    expect(createBasicAuthToken("", "secret")).toBe("OnNlY3JldA==")
  })
})

describe("createBasicAuthHeader", () => {
  test("prefixes the encoded token with Basic", () => {
    expect(createBasicAuthHeader("Aladdin", "open sesame")).toBe(
      "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="
    )
  })

  test("returns an empty string when no credentials are provided", () => {
    expect(createBasicAuthHeader("", "")).toBe("")
  })
})

describe("createBasicAuthCurlCommand", () => {
  test("creates a curl command with the Authorization header", () => {
    expect(
      createBasicAuthCurlCommand(
        "https://api.example.com/protected",
        "Aladdin",
        "open sesame"
      )
    ).toBe(
      'curl -H "Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==" https://api.example.com/protected'
    )
  })

  test("returns an empty string when no credentials are provided", () => {
    expect(createBasicAuthCurlCommand("https://api.example.com", "", "")).toBe(
      ""
    )
  })
})
