import { describe, expect, test } from "vitest"

import {
  convertTomlToYamlText,
  getConvertTomlToYamlErrorMessage,
} from "./convert-toml-to-yaml"

describe("getConvertTomlToYamlErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertTomlToYamlErrorMessage(new Error("Invalid TOML payload"))
    ).toBe("Invalid TOML payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertTomlToYamlErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertTomlToYamlText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertTomlToYamlText("   ")).toEqual({
      state: "idle",
      yaml: "",
    })
  })

  test("converts flat TOML values into YAML", () => {
    expect(convertTomlToYamlText('name = "demo"\nenabled = true')).toEqual({
      state: "converted",
      yaml: "name: demo\nenabled: true\n",
    })
  })

  test("converts nested tables and arrays into YAML", () => {
    const result = convertTomlToYamlText(`title = "TOML Example"

[database]
ports = [8001, 8001, 8002]
enabled = true
`)

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.yaml).toContain("title: TOML Example")
    expect(result.yaml).toContain("database:")
    expect(result.yaml).toContain("ports:")
  })

  test("returns the parse error when the TOML is invalid", () => {
    const result = convertTomlToYamlText("[")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.yaml).toBe("")
    expect(result.message).toBeTruthy()
  })
})
