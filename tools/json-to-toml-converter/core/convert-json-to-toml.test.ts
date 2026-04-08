import {
  convertJsonToTomlText,
  getConvertJsonToTomlErrorMessage,
} from "./convert-json-to-toml"

import { describe, expect, test } from "vitest"

describe("getConvertJsonToTomlErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertJsonToTomlErrorMessage(new Error("Invalid JSON payload"))
    ).toBe("Invalid JSON payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertJsonToTomlErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertJsonToTomlText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertJsonToTomlText("   ")).toEqual({
      state: "idle",
      toml: "",
    })
  })

  test("converts flat JSON values into TOML", () => {
    const result = convertJsonToTomlText('{"name":"demo","enabled":true}')

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.toml).toContain('name = "demo"')
    expect(result.toml).toContain("enabled = true")
  })

  test("converts nested objects and arrays into TOML sections", () => {
    const result = convertJsonToTomlText(`{
      "title": "TOML Example",
      "database": {
        "ports": [8001, 8001, 8002]
      }
    }`)

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.toml).toContain('title = "TOML Example"')
    expect(result.toml).toContain("[database]")
    expect(result.toml).toContain("ports")
  })

  test("returns the parse error when the JSON is invalid", () => {
    const result = convertJsonToTomlText("{")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.toml).toBe("")
    expect(result.message).toBeTruthy()
  })
})
