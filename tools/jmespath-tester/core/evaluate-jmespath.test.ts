import { afterEach, describe, expect, test, vi } from "vitest"

import {
  countJmespathResults,
  evaluateJmespathText,
  formatJmespathResult,
  parseJsonText,
} from "./evaluate-jmespath"

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

describe("countJmespathResults", () => {
  test("counts arrays by length", () => {
    expect(countJmespathResults(["a", "b", "c"])).toBe(3)
  })

  test("counts scalar values as one", () => {
    expect(countJmespathResults("value")).toBe(1)
  })

  test("counts nullish values as zero", () => {
    expect(countJmespathResults(null)).toBe(0)
    expect(countJmespathResults(undefined)).toBe(0)
  })
})

describe("formatJmespathResult", () => {
  test("formats defined values as pretty JSON", () => {
    expect(formatJmespathResult({ ok: true })).toBe('{\n  "ok": true\n}')
  })

  test("formats undefined results as null", () => {
    expect(formatJmespathResult(undefined)).toBe("null")
  })
})

describe("evaluateJmespathText", () => {
  test("returns empty until both inputs have content", () => {
    expect(evaluateJmespathText("", "people[*].last")).toEqual({
      state: "empty",
    })
    expect(evaluateJmespathText("{}", "")).toEqual({
      state: "empty",
    })
  })

  test("returns a json error when the JSON input is invalid", () => {
    const result = evaluateJmespathText("{", "people[*].last")

    expect(result.state).toBe("json-error")
    if (result.state === "json-error") {
      expect(result.error.length).toBeGreaterThan(0)
    }
  })

  test("returns a query error when the JMESPath expression is invalid", () => {
    const result = evaluateJmespathText('{"people":[]}', "[")

    expect(result.state).toBe("query-error")
    if (result.state === "query-error") {
      expect(result.error.length).toBeGreaterThan(0)
    }
  })

  test("returns a formatted result and count when evaluation succeeds", () => {
    const result = evaluateJmespathText(
      '{"people":[{"last":"Smith"},{"last":"Jones"}]}',
      "people[*].last"
    )

    expect(result).toEqual({
      state: "ready",
      result: ["Smith", "Jones"],
      resultCount: 2,
      formattedResult: '[\n  "Smith",\n  "Jones"\n]',
    })
  })

  test("treats undefined query results as zero-count null output", () => {
    const result = evaluateJmespathText('{"people":[]}', "people[0].last")

    expect(result).toEqual({
      state: "ready",
      result: null,
      resultCount: 0,
      formattedResult: "null",
    })
  })
})
