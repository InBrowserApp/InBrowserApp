import { describe, expect, test } from "vitest"

import {
  formatParsedCookieData,
  getDownloadFileName,
  parseCookieData,
  parseCookieHeader,
  parseSetCookieHeaders,
} from "./cookie"

describe("parseCookieHeader", () => {
  test("parses cookie header values and quoted values", () => {
    const result = parseCookieHeader(
      'Cookie: session=abc123; theme=light; pref="a=b"; empty='
    )

    expect(result.type).toBe("cookie")
    expect(result.cookies).toEqual([
      { name: "session", value: "abc123" },
      { name: "theme", value: "light" },
      { name: "pref", value: "a=b" },
      { name: "empty", value: "" },
    ])
    expect(result.invalid).toEqual([])
  })

  test("parses cookies across lines without header prefixes", () => {
    const result = parseCookieHeader("token; a=1\nb=2; =bad")

    expect(result.cookies).toEqual([
      { name: "a", value: "1" },
      { name: "b", value: "2" },
    ])
    expect(result.invalid).toEqual(["token", "=bad"])
  })

  test("ignores non-cookie header lines when Cookie prefixes exist", () => {
    const result = parseCookieHeader(
      "Accept-Language: en;q=0.5\nCookie: a=1; b=2"
    )

    expect(result.cookies).toEqual([
      { name: "a", value: "1" },
      { name: "b", value: "2" },
    ])
    expect(result.invalid).toEqual([])
  })

  test("skips empty cookie headers and segments", () => {
    const result = parseCookieHeader("Cookie:\nCookie: a=1;; b=2; ")

    expect(result.cookies).toEqual([
      { name: "a", value: "1" },
      { name: "b", value: "2" },
    ])
    expect(result.invalid).toEqual([])
  })

  test("returns empty results for empty input", () => {
    expect(parseCookieHeader("")).toEqual({
      type: "cookie",
      cookies: [],
      invalid: [],
    })
  })
})

describe("parseSetCookieHeaders", () => {
  test("parses set-cookie attributes and normalizes keys", () => {
    const result = parseSetCookieHeaders(
      "Set-Cookie: id=1; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Wed, 21 Oct 2015 07:28:00 GMT"
    )

    expect(result.type).toBe("set-cookie")
    expect(result.cookies).toEqual([
      {
        name: "id",
        value: "1",
        attributes: {
          path: "/",
          httponly: true,
          secure: true,
          samesite: "Lax",
          expires: "Wed, 21 Oct 2015 07:28:00 GMT",
        },
      },
    ])
    expect(result.invalid).toEqual([])
  })

  test("parses multiple set-cookie headers and ignores other lines", () => {
    const result = parseSetCookieHeaders(
      "Host: example.com\nSet-Cookie: a=1; Secure\nSet-Cookie: b=2; Max-Age=3600"
    )

    expect(result.cookies).toEqual([
      { name: "a", value: "1", attributes: { secure: true } },
      { name: "b", value: "2", attributes: { "max-age": "3600" } },
    ])
    expect(result.invalid).toEqual([])
  })

  test("parses set-cookie headers without a prefix", () => {
    const result = parseSetCookieHeaders("theme=light; Max-Age=3600")

    expect(result.cookies).toEqual([
      { name: "theme", value: "light", attributes: { "max-age": "3600" } },
    ])
  })

  test("skips empty set-cookie values and attributes", () => {
    const result = parseSetCookieHeaders(
      "Set-Cookie: ; Path=/\nSet-Cookie: a=1;; Secure"
    )

    expect(result.cookies).toEqual([
      { name: "a", value: "1", attributes: { secure: true } },
    ])
    expect(result.invalid).toEqual([])
  })

  test("collects invalid entries and malformed attributes", () => {
    const result = parseSetCookieHeaders(
      "Set-Cookie: token\nSet-Cookie: a=1; =oops\nSet-Cookie:"
    )

    expect(result.cookies).toEqual([{ name: "a", value: "1", attributes: {} }])
    expect(result.invalid).toEqual(["token", "=oops"])
  })

  test("returns empty results for empty input", () => {
    expect(parseSetCookieHeaders("")).toEqual({
      type: "set-cookie",
      cookies: [],
      invalid: [],
    })
  })
})

describe("parseCookieData", () => {
  test("dispatches cookie parsing", () => {
    expect(parseCookieData("cookie", "Cookie: a=1").cookies).toEqual([
      { name: "a", value: "1" },
    ])
  })

  test("dispatches set-cookie parsing", () => {
    expect(
      parseCookieData("set-cookie", "Set-Cookie: a=1; Secure").cookies
    ).toEqual([{ name: "a", value: "1", attributes: { secure: true } }])
  })
})

describe("formatParsedCookieData", () => {
  test("formats parsed output as indented JSON", () => {
    expect(
      formatParsedCookieData({
        type: "cookie",
        cookies: [{ name: "a", value: "1" }],
        invalid: [],
      })
    ).toContain('"cookies": [')
  })
})

describe("getDownloadFileName", () => {
  test("returns the cookie download name", () => {
    expect(getDownloadFileName("cookie")).toBe("cookies.json")
  })

  test("returns the set-cookie download name", () => {
    expect(getDownloadFileName("set-cookie")).toBe("set-cookie.json")
  })
})
