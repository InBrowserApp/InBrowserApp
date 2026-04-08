import {
  DEFAULT_JSON_TO_XML_OPTIONS,
  clampIndentSize,
  convertJsonToXmlText,
  getConvertJsonToXmlErrorMessage,
  isValidXmlElementName,
  normalizeJsonToXmlOptions,
} from "./convert-json-to-xml"

import { describe, expect, test } from "vitest"

describe("clampIndentSize", () => {
  test("falls back to the default indent size for invalid values", () => {
    expect(clampIndentSize(undefined)).toBe(
      DEFAULT_JSON_TO_XML_OPTIONS.indentSize
    )
    expect(clampIndentSize(Number.NaN)).toBe(
      DEFAULT_JSON_TO_XML_OPTIONS.indentSize
    )
  })

  test("clamps values into the supported range", () => {
    expect(clampIndentSize(-2)).toBe(0)
    expect(clampIndentSize(2.6)).toBe(3)
    expect(clampIndentSize(20)).toBe(8)
  })
})

describe("normalizeJsonToXmlOptions", () => {
  test("merges stored values with defaults", () => {
    expect(
      normalizeJsonToXmlOptions({
        rootElementName: "payload",
        includeXmlDeclaration: false,
      })
    ).toEqual({
      rootElementName: "payload",
      arrayItemTag: "item",
      indentSize: 2,
      includeXmlDeclaration: false,
      fullTagEmptyElement: false,
    })
  })
})

describe("isValidXmlElementName", () => {
  test("accepts conservative XML-safe names", () => {
    expect(isValidXmlElementName("root")).toBe(true)
    expect(isValidXmlElementName("_item.2")).toBe(true)
  })

  test("rejects invalid XML tag names", () => {
    expect(isValidXmlElementName("123root")).toBe(false)
    expect(isValidXmlElementName("bad tag")).toBe(false)
  })
})

describe("getConvertJsonToXmlErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertJsonToXmlErrorMessage(new Error("Invalid JSON payload"))
    ).toBe("Invalid JSON payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertJsonToXmlErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertJsonToXmlText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertJsonToXmlText("   ")).toEqual({
      state: "idle",
      xml: "",
    })
  })

  test("converts nested JSON values into XML with declaration and indentation", () => {
    const result = convertJsonToXmlText(`{
      "project": {
        "name": "demo",
        "enabled": true,
        "languages": ["en", "fr"],
        "owner": {
          "email": null
        }
      }
    }`)

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(result.xml).toContain("<root>")
    expect(result.xml).toContain("  <project>")
    expect(result.xml).toContain("<name>demo</name>")
    expect(result.xml).toContain("<item>en</item>")
    expect(result.xml).toContain("<email />")
  })

  test("supports compact output and expanded empty elements", () => {
    const result = convertJsonToXmlText('{"name":null,"items":[1,2]}', {
      rootElementName: "payload",
      arrayItemTag: "entry",
      indentSize: 0,
      includeXmlDeclaration: false,
      fullTagEmptyElement: true,
    })

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.xml).toBe(
      "<payload><name></name><items><entry>1</entry><entry>2</entry></items></payload>"
    )
  })

  test("renders empty arrays and objects as empty elements", () => {
    const result = convertJsonToXmlText('{"items":[],"config":{}}', {
      includeXmlDeclaration: false,
    })

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.xml).toContain("<items />")
    expect(result.xml).toContain("<config />")
  })

  test("falls back to a property element for invalid JSON keys", () => {
    const result = convertJsonToXmlText('{"first name":"Ada"}', {
      includeXmlDeclaration: false,
    })

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.xml).toContain('<property name="first name">Ada</property>')
  })

  test("returns an option error for invalid root element names", () => {
    const result = convertJsonToXmlText('{"name":"demo"}', {
      rootElementName: "123 root",
    })

    expect(result).toEqual({
      state: "error",
      xml: "",
      errorCode: "invalid-root-element-name",
      message:
        "Root element names must start with a letter or underscore and use only letters, numbers, dots, hyphens, or underscores.",
    })
  })

  test("returns an option error for invalid array item tags", () => {
    const result = convertJsonToXmlText('{"items":[1]}', {
      arrayItemTag: "bad tag",
    })

    expect(result).toEqual({
      state: "error",
      xml: "",
      errorCode: "invalid-array-item-tag",
      message:
        "Array item tags must start with a letter or underscore and use only letters, numbers, dots, hyphens, or underscores.",
    })
  })

  test("returns the parse error when the JSON is invalid", () => {
    const result = convertJsonToXmlText("{")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.xml).toBe("")
    expect(result.errorCode).toBe("invalid-json")
    expect(result.message).toBeTruthy()
  })
})
