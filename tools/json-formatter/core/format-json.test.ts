import { describe, expect, test, vi } from "vitest"

import {
  DEFAULT_INDENT_SIZE,
  MAX_INDENT_SIZE,
  MIN_INDENT_SIZE,
  clampIndentSize,
  formatJsonText,
  getFormatJsonErrorMessage,
} from "./format-json"

describe("clampIndentSize", () => {
  test("returns the default indent for non-finite values", () => {
    expect(clampIndentSize(Number.NaN)).toBe(DEFAULT_INDENT_SIZE)
  })

  test("clamps values below the minimum", () => {
    expect(clampIndentSize(0)).toBe(MIN_INDENT_SIZE)
  })

  test("clamps values above the maximum", () => {
    expect(clampIndentSize(99)).toBe(MAX_INDENT_SIZE)
  })

  test("rounds finite values before clamping", () => {
    expect(clampIndentSize(3.6)).toBe(4)
  })
})

describe("getFormatJsonErrorMessage", () => {
  test("returns the message from Error instances", () => {
    expect(getFormatJsonErrorMessage(new Error("boom"))).toBe("boom")
  })

  test("falls back to an unknown error label for non-errors", () => {
    expect(getFormatJsonErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("formatJsonText", () => {
  test("returns idle for empty input", () => {
    expect(formatJsonText("   ")).toEqual({
      state: "idle",
      formatted: "",
    })
  })

  test("formats valid JSON with the requested indentation", () => {
    expect(formatJsonText('{"hello":"world"}', 4)).toEqual({
      state: "formatted",
      formatted: '{\n    "hello": "world"\n}',
    })
  })

  test("clamps indentation while formatting", () => {
    expect(formatJsonText('{"hello":"world"}', 0)).toEqual({
      state: "formatted",
      formatted: '{\n "hello": "world"\n}',
    })
  })

  test("returns an error state for invalid JSON", () => {
    expect(formatJsonText("{")).toEqual({
      state: "error",
      formatted: "",
      message:
        "Expected property name or '}' in JSON at position 1 (line 1 column 2)",
    })
  })

  test("uses the unknown error fallback when JSON.parse throws a non-error", () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, "parse")
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === "__boom__") {
          throw "boom"
        }

        return originalParse(...args)
      })

    expect(formatJsonText("__boom__")).toEqual({
      state: "error",
      formatted: "",
      message: "Unknown error",
    })

    parseSpy.mockRestore()
  })
})
