import { beforeEach, describe, expect, test, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  toMockWarn: vi.fn((curlCommand: string) => {
    if (curlCommand.includes("boom")) {
      throw new Error("Boom")
    }

    if (curlCommand.includes("raw")) {
      throw "raw"
    }

    return [{ echo: curlCommand }, [["WARN", "Check input"]]] as const
  }),
  toStringWarn: vi.fn(() => ["plain text", []] as const),
}))

vi.mock("curlconverter", () => ({
  toMockWarn: mocks.toMockWarn,
  toStringWarn: mocks.toStringWarn,
}))

vi.mock("./targets", () => ({
  getTargetConfig: (id: string) => {
    if (id === "mock") {
      return {
        id: "mock",
        label: "Mock",
        extension: ".txt",
        highlightLanguage: "plaintext",
        runtimeKey: "toMockWarn",
      }
    }

    if (id === "transformed") {
      return {
        id: "transformed",
        label: "Transformed",
        extension: ".txt",
        highlightLanguage: "plaintext",
        runtimeKey: "toStringWarn",
        transform: (code: string) => `wrapped:${code}`,
      }
    }

    if (id === "missing-runtime") {
      return {
        id: "missing-runtime",
        label: "Missing runtime",
        extension: ".txt",
        highlightLanguage: "plaintext",
        runtimeKey: "toMissingWarn",
      }
    }

    return undefined
  },
}))

import {
  FALLBACK_PARSE_ERROR,
  UNKNOWN_TARGET_ERROR,
  convertCurlToTarget,
} from "./converter"

beforeEach(() => {
  mocks.toMockWarn.mockClear()
  mocks.toStringWarn.mockClear()
})

describe("convertCurlToTarget", () => {
  test("returns empty output for blank input", async () => {
    const result = await convertCurlToTarget("   ", "mock")

    expect(result).toEqual({ output: "", warnings: [] })
    expect(mocks.toMockWarn).not.toHaveBeenCalled()
  })

  test("stringifies non-string output and formats warnings", async () => {
    const result = await convertCurlToTarget("curl https://example.com", "mock")

    expect(result.output).toBe(
      JSON.stringify({ echo: "curl https://example.com" }, null, 2)
    )
    expect(result.warnings).toEqual(["[WARN] Check input"])
    expect(result.error).toBeUndefined()
  })

  test("applies target transforms to string results", async () => {
    const result = await convertCurlToTarget(
      "curl https://example.com",
      "transformed"
    )

    expect(result.output).toBe("wrapped:plain text")
    expect(result.warnings).toEqual([])
  })

  test("returns an unknown target error when target is missing", async () => {
    const result = await convertCurlToTarget(
      "curl https://example.com",
      "missing"
    )

    expect(result.error).toBe(UNKNOWN_TARGET_ERROR)
  })

  test("returns an unknown target error when the runtime converter is missing", async () => {
    const result = await convertCurlToTarget(
      "curl https://example.com",
      "missing-runtime"
    )

    expect(result.error).toBe(UNKNOWN_TARGET_ERROR)
  })

  test("returns error messages from thrown exceptions", async () => {
    const result = await convertCurlToTarget("boom", "mock")

    expect(result.output).toBe("")
    expect(result.warnings).toEqual([])
    expect(result.error).toBe("Boom")
  })

  test("uses fallback error for non-Error throws", async () => {
    const result = await convertCurlToTarget("raw", "mock")

    expect(result.output).toBe("")
    expect(result.warnings).toEqual([])
    expect(result.error).toBe(FALLBACK_PARSE_ERROR)
  })
})
