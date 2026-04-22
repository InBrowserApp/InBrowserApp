import { describe, expect, test } from "vitest"

import {
  buildUrlFromDraft,
  describeUrl,
  getExampleUrl,
  listExampleUrls,
  parseUrlInput,
} from "./url"

describe("parseUrlInput", () => {
  test("parses and decodes a complete URL", () => {
    const result = parseUrlInput(
      "https://user%20name:pa%24s@example.com:8080/a%20b/c?x=hello%20world&x=%2F#frag%20ment"
    )

    expect(result).toEqual({
      ok: true,
      normalizedUrl:
        "https://user%20name:pa%24s@example.com:8080/a%20b/c?x=hello%20world&x=%2F#frag%20ment",
      draft: {
        protocol: "https",
        username: "user name",
        password: "pa$s",
        hostname: "example.com",
        port: "8080",
        pathname: "/a b/c",
        hash: "frag ment",
        queryParams: [
          { key: "x", value: "hello world" },
          { key: "x", value: "/" },
        ],
      },
    })
  })

  test("rejects empty, relative, and malformed input", () => {
    expect(parseUrlInput("")).toEqual({
      ok: false,
      code: "empty-input",
    })
    expect(parseUrlInput("/docs/getting-started")).toEqual({
      ok: false,
      code: "relative-url",
    })
    expect(parseUrlInput("https://exa mple.com")).toEqual({
      ok: false,
      code: "invalid-url",
    })
  })

  test("keeps undecodable encoded fragments as-is instead of throwing", () => {
    const result = parseUrlInput("https://example.com/%E0%A4%A")

    expect(result).toEqual({
      ok: true,
      normalizedUrl: "https://example.com/%E0%A4%A",
      draft: {
        protocol: "https",
        username: "",
        password: "",
        hostname: "example.com",
        port: "",
        pathname: "/%E0%A4%A",
        hash: "",
        queryParams: [],
      },
    })
  })
})

describe("buildUrlFromDraft", () => {
  test("encodes a draft back into a normalized URL", () => {
    const result = buildUrlFromDraft({
      protocol: "HTTPS",
      username: "user name",
      password: "pa$s",
      hostname: "example.com",
      port: "8443",
      pathname: "reports/q1 summary",
      hash: "#growth plan",
      queryParams: [
        { key: "utm_source", value: "email blast" },
        { key: "utm_source", value: "retention" },
        { key: "view", value: "table/grid" },
      ],
    })

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.normalizedUrl).toBe(
      "https://user%20name:pa$s@example.com:8443/reports/q1%20summary?utm_source=email+blast&utm_source=retention&view=table%2Fgrid#growth%20plan"
    )
  })

  test("builds root URLs when path and query are blank", () => {
    const result = buildUrlFromDraft({
      protocol: "https",
      username: "",
      password: "",
      hostname: "example.com",
      port: "",
      pathname: "   ",
      hash: "",
      queryParams: [],
    })

    expect(result).toEqual({
      ok: true,
      normalizedUrl: "https://example.com/",
      url: new URL("https://example.com/"),
    })
  })

  test("keeps leading slashes and username-only authority intact", () => {
    const result = buildUrlFromDraft({
      protocol: "https",
      username: "alexa",
      password: "",
      hostname: "example.com",
      port: "",
      pathname: "/already/normalized",
      hash: "",
      queryParams: [],
    })

    expect(result).toEqual({
      ok: true,
      normalizedUrl: "https://alexa@example.com/already/normalized",
      url: new URL("https://alexa@example.com/already/normalized"),
    })
  })

  test("reports field-level validation errors", () => {
    expect(
      buildUrlFromDraft({
        protocol: "",
        username: "",
        password: "",
        hostname: "example.com",
        port: "",
        pathname: "/",
        hash: "",
        queryParams: [],
      })
    ).toEqual({ ok: false, code: "missing-protocol" })

    expect(
      buildUrlFromDraft({
        protocol: "http/",
        username: "",
        password: "",
        hostname: "example.com",
        port: "",
        pathname: "/",
        hash: "",
        queryParams: [],
      })
    ).toEqual({ ok: false, code: "invalid-protocol" })

    expect(
      buildUrlFromDraft({
        protocol: "https",
        username: "",
        password: "",
        hostname: "",
        port: "",
        pathname: "/",
        hash: "",
        queryParams: [],
      })
    ).toEqual({ ok: false, code: "missing-hostname" })

    expect(
      buildUrlFromDraft({
        protocol: "https",
        username: "",
        password: "",
        hostname: "example.com",
        port: "70000",
        pathname: "/",
        hash: "",
        queryParams: [],
      })
    ).toEqual({ ok: false, code: "invalid-port" })

    expect(
      buildUrlFromDraft({
        protocol: "https",
        username: "",
        password: "",
        hostname: "example.com",
        port: "abc",
        pathname: "/",
        hash: "",
        queryParams: [],
      })
    ).toEqual({ ok: false, code: "invalid-port" })
  })
})

describe("describeUrl", () => {
  test("summarizes the important URL diagnostics", () => {
    const diagnostics = describeUrl(
      "https://alexa:pa55word@example.com:8443/reports/q1-summary?sort=asc&format=json#growth"
    )

    expect(diagnostics).toEqual({
      origin: "https://example.com:8443",
      authority: "alexa:pa55word@example.com:8443",
      protocol: "https",
      hash: "growth",
      queryCount: 2,
      pathSegments: ["reports", "q1-summary"],
    })
  })

  test("describes URL objects and URLs without credentials", () => {
    expect(
      describeUrl(new URL("https://alexa@example.com/already/normalized"))
    ).toEqual({
      origin: "https://example.com",
      authority: "alexa@example.com",
      protocol: "https",
      hash: "",
      queryCount: 0,
      pathSegments: ["already", "normalized"],
    })

    expect(describeUrl("https://example.com/")).toEqual({
      origin: "https://example.com",
      authority: "example.com",
      protocol: "https",
      hash: "",
      queryCount: 0,
      pathSegments: [],
    })
  })
})

describe("example helpers", () => {
  test("returns stable example URLs", () => {
    expect(getExampleUrl("api")).toBe(
      "https://api.example.com:8443/v1/search?q=openai&limit=25#response"
    )
    expect(Object.keys(listExampleUrls())).toEqual(["api", "auth", "campaign"])
  })
})
