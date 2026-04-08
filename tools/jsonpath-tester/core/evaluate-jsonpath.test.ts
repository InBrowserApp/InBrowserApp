import { afterEach, describe, expect, test, vi } from "vitest"

import {
  countJsonpathMatches,
  evaluateJsonpathText,
  formatJsonpathResults,
  parseJsonText,
} from "./evaluate-jsonpath"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("parseJsonText", () => {
  test("returns an error for blank input", () => {
    const parsed = parseJsonText("   ")

    expect("error" in parsed && parsed.error.length > 0).toBe(true)
  })

  test("parses valid JSON", () => {
    expect(parseJsonText('{"name":"Ada"}')).toEqual({
      value: { name: "Ada" },
    })
  })

  test("returns an error for invalid JSON", () => {
    const parsed = parseJsonText("{")

    expect("error" in parsed && parsed.error.length > 0).toBe(true)
  })

  test("stringifies non-Error parse failures", () => {
    vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw "broken-json"
    })

    expect(parseJsonText('{"name":"Ada"}')).toEqual({
      error: "broken-json",
    })
  })
})

describe("countJsonpathMatches", () => {
  test("counts matches by array length", () => {
    expect(countJsonpathMatches(["a", "b", "c"])).toBe(3)
  })

  test("returns zero when there are no matches", () => {
    expect(countJsonpathMatches([])).toBe(0)
  })
})

describe("formatJsonpathResults", () => {
  test("formats arrays as pretty JSON", () => {
    expect(formatJsonpathResults(["Ada", "Grace"])).toBe(
      '[\n  "Ada",\n  "Grace"\n]'
    )
  })
})

describe("evaluateJsonpathText", () => {
  test("returns empty until both inputs have content", () => {
    expect(evaluateJsonpathText("", "$.store.book[*].author")).toEqual({
      state: "empty",
    })
    expect(evaluateJsonpathText("{}", "")).toEqual({
      state: "empty",
    })
  })

  test("returns a json error when the JSON input is invalid", () => {
    const result = evaluateJsonpathText("{", "$.store.book[*].author")

    expect(result.state).toBe("json-error")
    if (result.state === "json-error") {
      expect(result.error.length).toBeGreaterThan(0)
    }
  })

  test("returns a query error when the JSONPath expression is invalid", () => {
    const result = evaluateJsonpathText(
      '{"store":{"book":[{"price":12.99}]}}',
      "$.store.book[?(@.price < )]"
    )

    expect(result.state).toBe("query-error")
    if (result.state === "query-error") {
      expect(result.error.length).toBeGreaterThan(0)
    }
  })

  test("returns formatted values and paths when evaluation succeeds", () => {
    const result = evaluateJsonpathText(
      '{"store":{"book":[{"author":"Nigel Rees"},{"author":"Evelyn Waugh"}]}}',
      "$.store.book[*].author"
    )

    expect(result).toEqual({
      state: "ready",
      values: ["Nigel Rees", "Evelyn Waugh"],
      paths: [
        "$['store']['book'][0]['author']",
        "$['store']['book'][1]['author']",
      ],
      matchCount: 2,
      formattedValues: '[\n  "Nigel Rees",\n  "Evelyn Waugh"\n]',
      formattedPaths:
        "[\n  \"$['store']['book'][0]['author']\",\n  \"$['store']['book'][1]['author']\"\n]",
    })
  })

  test("returns empty arrays when the query matches nothing", () => {
    const result = evaluateJsonpathText(
      '{"store":{"book":[{"price":12.99}]}}',
      "$.store.book[?(@.price < 10)].title"
    )

    expect(result).toEqual({
      state: "ready",
      values: [],
      paths: [],
      matchCount: 0,
      formattedValues: "[]",
      formattedPaths: "[]",
    })
  })
})
