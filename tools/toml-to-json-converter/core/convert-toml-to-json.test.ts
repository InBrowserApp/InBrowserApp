import {
  convertTomlToJsonText,
  getConvertTomlToJsonErrorMessage,
} from "./convert-toml-to-json"

import { describe, expect, test } from "vitest"

describe("getConvertTomlToJsonErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertTomlToJsonErrorMessage(new Error("Invalid TOML payload"))
    ).toBe("Invalid TOML payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertTomlToJsonErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertTomlToJsonText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertTomlToJsonText("   ")).toEqual({
      state: "idle",
      json: "",
    })
  })

  test("converts flat TOML values into JSON", () => {
    const result = convertTomlToJsonText('name = "demo"\nenabled = true')

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toContain('"name": "demo"')
    expect(result.json).toContain('"enabled": true')
  })

  test("converts nested tables and arrays into formatted JSON", () => {
    const result = convertTomlToJsonText(`title = "TOML Example"

[database]
ports = [8001, 8001, 8002]
enabled = true
`)

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toContain('"title": "TOML Example"')
    expect(result.json).toContain('"database": {')
    expect(result.json).toContain('"ports": [')
  })

  test("returns the parse error when the TOML is invalid", () => {
    const result = convertTomlToJsonText("[")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.json).toBe("")
    expect(result.message).toBeTruthy()
  })
})
