import { describe, expect, test } from "vitest"

import {
  filterStatusCodes,
  normalizeStatusCodeQuery,
  type HttpStatusCodeFilter,
} from "./http-status-code-lookup"

const fixtureCodes = [
  {
    code: 100,
    name: "Continue",
    category: "informational",
    description: "Continue sending the request body.",
  },
  {
    code: 200,
    name: "OK",
    category: "success",
    description: "The request has succeeded.",
    common: true,
  },
  {
    code: 301,
    name: "Moved Permanently",
    category: "redirection",
    description: "The resource moved permanently.",
  },
  {
    code: 404,
    name: "Not Found",
    category: "client-error",
    description: "The requested resource could not be found.",
    common: true,
  },
  {
    code: 503,
    name: "Service Unavailable",
    category: "server-error",
    description: "The server is unavailable.",
    common: true,
  },
] as const

describe("normalizeStatusCodeQuery", () => {
  test("trims whitespace and lowercases the query", () => {
    expect(normalizeStatusCodeQuery("  Not Found ")).toBe("not found")
  })
})

describe("filterStatusCodes", () => {
  test("returns every entry when the search query is blank", () => {
    expect(filterStatusCodes(fixtureCodes, "   ", "all")).toEqual(fixtureCodes)
  })

  test.each([
    ["common", [200, 404, 503]],
    ["informational", [100]],
    ["success", [200]],
    ["redirection", [301]],
    ["client-error", [404]],
    ["server-error", [503]],
  ] satisfies ReadonlyArray<[HttpStatusCodeFilter, number[]]>)(
    "filters the %s category",
    (filter, expectedCodes) => {
      expect(
        filterStatusCodes(fixtureCodes, "", filter).map((code) => code.code)
      ).toEqual(expectedCodes)
    }
  )

  test("matches status codes by code, name, and description", () => {
    expect(
      filterStatusCodes(fixtureCodes, "404", "all").map((code) => code.code)
    ).toEqual([404])
    expect(
      filterStatusCodes(fixtureCodes, "moved", "all").map((code) => code.code)
    ).toEqual([301])
    expect(
      filterStatusCodes(fixtureCodes, "server is unavailable", "all").map(
        (code) => code.code
      )
    ).toEqual([503])
  })

  test("applies search after the active filter", () => {
    expect(
      filterStatusCodes(fixtureCodes, "service", "common").map(
        (code) => code.code
      )
    ).toEqual([503])
  })
})
