import { describe, expect, test } from "vitest"

import {
  buildUrlFromDraft,
  compactQueryEntries,
  countPathSegments,
  countQueryEntries,
  getHostDisplay,
  getOriginDisplay,
  parseUrlToDraft,
  sanitizePathname,
  sanitizeProtocol,
} from "./url-builder"

describe("url-builder core", () => {
  test("parses a full URL into decoded draft fields", () => {
    const result = parseUrlToDraft(
      "https://marina:teal%20waves@example.com:8443/products/blue%20mug" +
        "?ref=homepage&coupon=APRIL24#customer%20reviews"
    )

    expect(result).toEqual({
      ok: true,
      draft: {
        protocol: "https",
        username: "marina",
        password: "teal waves",
        hostname: "example.com",
        port: "8443",
        pathname: "/products/blue mug",
        fragment: "customer reviews",
        queryEntries: [
          { key: "ref", value: "homepage" },
          { key: "coupon", value: "APRIL24" },
        ],
      },
    })
  })

  test("rejects empty and invalid URLs", () => {
    expect(parseUrlToDraft("")).toEqual({
      ok: false,
      error: "invalid-url",
    })
    expect(parseUrlToDraft("not a url")).toEqual({
      ok: false,
      error: "invalid-url",
    })
  })

  test("builds a URL from editable fields and preserves duplicate params", () => {
    expect(
      buildUrlFromDraft({
        protocol: "https:",
        username: "marina",
        password: "sea salt",
        hostname: "example.com",
        port: "8443",
        pathname: "products/blue mug",
        fragment: "details",
        queryEntries: [
          { key: "tag", value: "coffee beans" },
          { key: "tag", value: "featured" },
          { key: "", value: "" },
        ],
      })
    ).toEqual({
      ok: true,
      url:
        "https://marina:sea%20salt@example.com:8443/products/blue%20mug" +
        "?tag=coffee+beans&tag=featured#details",
    })
  })

  test("validates missing protocol, hostname, and bad ports", () => {
    expect(
      buildUrlFromDraft({
        protocol: "",
        username: "",
        password: "",
        hostname: "example.com",
        port: "",
        pathname: "/",
        fragment: "",
        queryEntries: [],
      })
    ).toEqual({ ok: false, error: "missing-protocol" })

    expect(
      buildUrlFromDraft({
        protocol: "https",
        username: "",
        password: "",
        hostname: "",
        port: "",
        pathname: "/",
        fragment: "",
        queryEntries: [],
      })
    ).toEqual({ ok: false, error: "missing-hostname" })

    expect(
      buildUrlFromDraft({
        protocol: "https",
        username: "",
        password: "",
        hostname: "example.com",
        port: "70000",
        pathname: "/",
        fragment: "",
        queryEntries: [],
      })
    ).toEqual({ ok: false, error: "invalid-port" })
  })

  test("surfaces invalid draft values that the URL constructor rejects", () => {
    expect(
      buildUrlFromDraft({
        protocol: "https",
        username: "",
        password: "",
        hostname: "bad host name",
        port: "",
        pathname: "/",
        fragment: "",
        queryEntries: [],
      })
    ).toEqual({ ok: false, error: "invalid-url" })
  })

  test("sanitizes helpers and derives display metrics", () => {
    expect(sanitizeProtocol(" HTTPS: ")).toBe("https")
    expect(sanitizePathname("docs/api")).toBe("/docs/api")
    expect(sanitizePathname("")).toBe("/")
    expect(
      compactQueryEntries([
        { key: "", value: "" },
        { key: "page", value: "1" },
      ])
    ).toEqual([{ key: "page", value: "1" }])
    expect(countPathSegments("/docs/api/v1")).toBe(3)
    expect(countQueryEntries([{ key: "", value: "" }])).toBe(0)

    const draft = {
      protocol: "https",
      username: "",
      password: "",
      hostname: "example.com",
      port: "8443",
      pathname: "/docs/api/v1",
      fragment: "",
      queryEntries: [{ key: "page", value: "1" }],
    } as const

    expect(getHostDisplay(draft)).toBe("example.com:8443")
    expect(getOriginDisplay(draft)).toBe("https://example.com:8443")
    expect(getHostDisplay({ ...draft, hostname: "", port: "" })).toBe("—")
    expect(getOriginDisplay({ ...draft, protocol: "", hostname: "" })).toBe("—")
  })
})
