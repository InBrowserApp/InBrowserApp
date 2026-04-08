import { describe, expect, test, vi } from "vitest"

import {
  convertJsonToYamlText,
  getConvertJsonToYamlErrorMessage,
} from "./convert-json-to-yaml"

describe("getConvertJsonToYamlErrorMessage", () => {
  test("returns the message from Error instances", () => {
    expect(getConvertJsonToYamlErrorMessage(new Error("boom"))).toBe("boom")
  })

  test("falls back to an unknown error label for non-errors", () => {
    expect(getConvertJsonToYamlErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertJsonToYamlText", () => {
  test("returns idle for empty input", () => {
    expect(convertJsonToYamlText("   ")).toEqual({
      state: "idle",
      yaml: "",
    })
  })

  test("converts valid JSON into YAML", () => {
    expect(convertJsonToYamlText('{"hello":"world","items":[1,2]}')).toEqual({
      state: "converted",
      yaml: "hello: world\nitems:\n  - 1\n  - 2\n",
    })
  })

  test("returns an error state for invalid JSON", () => {
    expect(convertJsonToYamlText("{")).toEqual({
      state: "error",
      yaml: "",
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

    expect(convertJsonToYamlText("__boom__")).toEqual({
      state: "error",
      yaml: "",
      message: "Unknown error",
    })

    parseSpy.mockRestore()
  })
})
