import { describe, expect, test } from "vitest"

import {
  convertYamlToTomlText,
  getConvertYamlToTomlErrorMessage,
} from "./convert-yaml-to-toml"

describe("getConvertYamlToTomlErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertYamlToTomlErrorMessage(new Error("Invalid YAML payload"))
    ).toBe("Invalid YAML payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertYamlToTomlErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertYamlToTomlText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertYamlToTomlText("   ")).toEqual({
      state: "idle",
      toml: "",
    })
  })

  test("converts flat YAML values into TOML", () => {
    const result = convertYamlToTomlText("name: demo\nenabled: true")

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.toml).toContain('name = "demo"')
    expect(result.toml).toContain("enabled = true")
  })

  test("converts nested YAML into TOML sections", () => {
    const result = convertYamlToTomlText(`title: YAML Example
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

    expect(result.toml).toContain('title = "YAML Example"')
    expect(result.toml).toContain("[database]")
    expect(result.toml).toContain("ports")
  })

  test("returns the parse error when the YAML is invalid", () => {
    const result = convertYamlToTomlText("items: [1, 2")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.toml).toBe("")
    expect(result.message).toBeTruthy()
  })
})
