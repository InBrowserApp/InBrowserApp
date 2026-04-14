import { describe, expect, test } from "vitest"

import { decodeBasicAuthHeader } from "./basic-auth"

describe("decodeBasicAuthHeader", () => {
  test("returns empty state for blank input", () => {
    expect(decodeBasicAuthHeader("   ")).toEqual({
      ok: false,
      code: "empty",
    })
  })

  test("decodes a standard Basic header", () => {
    expect(decodeBasicAuthHeader("Basic dXNlcjpwYXNz")).toEqual({
      ok: true,
      username: "user",
      password: "pass",
    })
  })

  test("accepts a full Authorization header line and preserves password colons", () => {
    expect(
      decodeBasicAuthHeader("Authorization: BASIC dXNlcjpwYXNzOndpdGg6Y29sb25z")
    ).toEqual({
      ok: true,
      username: "user",
      password: "pass:with:colons",
    })
  })

  test("supports utf-8 credentials", () => {
    expect(decodeBasicAuthHeader("Basic 5L2g5aW9OuWvhueggQ==")).toEqual({
      ok: true,
      username: "你好",
      password: "密码",
    })
  })

  test("keeps the whole decoded value as username when there is no colon", () => {
    expect(decodeBasicAuthHeader("Basic YWRtaW4=")).toEqual({
      ok: true,
      username: "admin",
      password: "",
    })
  })

  test("rejects non-basic headers", () => {
    expect(decodeBasicAuthHeader("Bearer token")).toEqual({
      ok: false,
      code: "invalid-header",
    })
  })

  test("rejects invalid base64 tokens", () => {
    expect(decodeBasicAuthHeader("Basic !!!")).toEqual({
      ok: false,
      code: "invalid-base64",
    })
  })
})
