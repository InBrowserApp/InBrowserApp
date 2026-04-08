import {
  convertYamlToJsonText,
  getConvertYamlToJsonErrorMessage,
} from "./convert-yaml-to-json"

import { describe, expect, test } from "vitest"

describe("getConvertYamlToJsonErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertYamlToJsonErrorMessage(new Error("Invalid YAML payload"))
    ).toBe("Invalid YAML payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertYamlToJsonErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertYamlToJsonText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertYamlToJsonText("   ")).toEqual({
      state: "idle",
      json: "",
    })
  })

  test("converts flat YAML values into JSON", () => {
    const result = convertYamlToJsonText("name: demo\nenabled: true")

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toContain('"name": "demo"')
    expect(result.json).toContain('"enabled": true')
  })

  test("converts nested YAML into formatted JSON", () => {
    const result = convertYamlToJsonText(`title: YAML Example
database:
  ports:
    - 8001
    - 8001
    - 8002
  enabled: true
`)

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toContain('"title": "YAML Example"')
    expect(result.json).toContain('"database": {')
    expect(result.json).toContain('"ports": [')
  })

  test("normalizes empty YAML documents into null", () => {
    expect(convertYamlToJsonText("---")).toEqual({
      state: "converted",
      json: "null",
    })
  })

  test("returns the parse error when the YAML is invalid", () => {
    const result = convertYamlToJsonText("items: [1, 2")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.json).toBe("")
    expect(result.message).toBeTruthy()
  })
})
