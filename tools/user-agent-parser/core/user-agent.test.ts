import { describe, expect, test } from "vitest"

import {
  normalizeUserAgentResult,
  parseUserAgent,
  stringifyUserAgentResult,
} from "./user-agent"

describe("parseUserAgent", () => {
  test("returns null for empty input", () => {
    expect(parseUserAgent("   ")).toBeNull()
  })

  test("parses a desktop chrome user agent", () => {
    const result = parseUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    )

    expect(result).toEqual({
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      browser: {
        name: "Chrome",
        version: "115.0.0.0",
        major: "115",
      },
      os: {
        name: "Windows",
        version: "10",
      },
      engine: {
        name: "Blink",
        version: "115.0.0.0",
      },
      device: {
        type: undefined,
        vendor: undefined,
        model: undefined,
      },
      cpu: {
        architecture: "amd64",
      },
    })
  })

  test("normalizes missing ua with the input fallback", () => {
    const result = normalizeUserAgentResult(
      {
        ua: "",
        browser: {},
        engine: {},
        os: {},
        device: {},
        cpu: {},
      } as never,
      "Fallback UA"
    )

    expect(result.ua).toBe("Fallback UA")
  })

  test("stringifies a parsed result as readable json", () => {
    const result = parseUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
    )

    expect(stringifyUserAgentResult(result!)).toContain('"browser"')
    expect(stringifyUserAgentResult(result!)).toContain('"Mobile Safari"')
    expect(stringifyUserAgentResult(result!)).toContain('"iPhone"')
  })
})
