import { describe, expect, test, vi } from "vitest"

import {
  FALLBACK_PARSE_ERROR,
  UNKNOWN_TARGET_ERROR,
  convertCurlToTarget,
} from "./converter"

const mockTarget = {
  id: "mock",
  label: "Mock",
  extension: ".txt",
  highlightLanguage: "plaintext",
  convert: (curlCommand: string) => {
    if (curlCommand.includes("boom")) {
      throw new Error("Boom")
    }

    if (curlCommand.includes("raw")) {
      throw "raw"
    }

    const payload = { echo: curlCommand }
    return [payload, [["WARN", "Check input"]]] as const
  },
}

vi.mock("./targets", () => ({
  getTargetConfig: (id: string) => (id === "mock" ? mockTarget : undefined),
}))

describe("convertCurlToTarget", () => {
  test("returns empty output for blank input", () => {
    const result = convertCurlToTarget("   ", "mock")

    expect(result).toEqual({ output: "", warnings: [] })
  })

  test("stringifies non-string output and formats warnings", () => {
    const result = convertCurlToTarget("curl https://example.com", "mock")

    expect(result.output).toBe(
      JSON.stringify({ echo: "curl https://example.com" }, null, 2)
    )
    expect(result.warnings).toEqual(["[WARN] Check input"])
    expect(result.error).toBeUndefined()
  })

  test("returns an unknown target error when target is missing", () => {
    const result = convertCurlToTarget("curl https://example.com", "missing")

    expect(result.error).toBe(UNKNOWN_TARGET_ERROR)
  })

  test("returns error messages from thrown exceptions", () => {
    const result = convertCurlToTarget("boom", "mock")

    expect(result.output).toBe("")
    expect(result.warnings).toEqual([])
    expect(result.error).toBe("Boom")
  })

  test("uses fallback error for non-Error throws", () => {
    const result = convertCurlToTarget("raw", "mock")

    expect(result.output).toBe("")
    expect(result.warnings).toEqual([])
    expect(result.error).toBe(FALLBACK_PARSE_ERROR)
  })
})
