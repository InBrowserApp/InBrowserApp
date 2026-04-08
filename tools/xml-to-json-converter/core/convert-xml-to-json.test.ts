import { describe, expect, test } from "vitest"

import {
  DEFAULT_XML_TO_JSON_OPTIONS,
  clampIndentSize,
  convertXmlToJsonText,
  getConvertXmlToJsonErrorMessage,
  normalizeXmlToJsonOptions,
} from "./convert-xml-to-json"

describe("clampIndentSize", () => {
  test("falls back to the default indent size for invalid values", () => {
    expect(clampIndentSize(undefined)).toBe(
      DEFAULT_XML_TO_JSON_OPTIONS.indentSize
    )
    expect(clampIndentSize(Number.NaN)).toBe(
      DEFAULT_XML_TO_JSON_OPTIONS.indentSize
    )
  })

  test("clamps values into the supported range", () => {
    expect(clampIndentSize(-2)).toBe(0)
    expect(clampIndentSize(2.6)).toBe(3)
    expect(clampIndentSize(20)).toBe(8)
  })
})

describe("normalizeXmlToJsonOptions", () => {
  test("merges stored values with defaults", () => {
    expect(
      normalizeXmlToJsonOptions({
        compact: false,
        ignoreAttributes: true,
        nativeType: true,
      })
    ).toEqual({
      compact: false,
      ignoreDeclaration: false,
      ignoreInstruction: false,
      ignoreAttributes: true,
      ignoreText: false,
      ignoreCdata: false,
      ignoreDoctype: false,
      ignoreComment: false,
      trim: false,
      nativeType: true,
      alwaysArray: false,
      alwaysChildren: false,
      indentSize: 2,
    })
  })
})

describe("getConvertXmlToJsonErrorMessage", () => {
  test("returns the error message for Error instances", () => {
    expect(
      getConvertXmlToJsonErrorMessage(new Error("Invalid XML payload"))
    ).toBe("Invalid XML payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertXmlToJsonErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertXmlToJsonText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertXmlToJsonText("   ")).toEqual({
      state: "idle",
      json: "",
    })
  })

  test("converts XML into formatted JSON with the default compact output", () => {
    const result = convertXmlToJsonText(`<?xml version="1.0" encoding="utf-8"?>
<note importance="high" logged="true">
  <title>Happy</title>
  <todo>Work</todo>
  <todo>Play</todo>
</note>`)

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toContain(`"_declaration"`)
    expect(result.json).toContain(`"note"`)
    expect(result.json).toContain(`"_attributes"`)
    expect(result.json).toContain(`"title"`)
    expect(result.json).toContain(`"todo"`)
  })

  test("supports compact export options that remove the declaration and attributes", () => {
    const result = convertXmlToJsonText(
      `<?xml version="1.0" encoding="utf-8"?>
<note importance="high"><title>Happy</title></note>`,
      {
        ignoreDeclaration: true,
        ignoreAttributes: true,
        indentSize: 0,
      }
    )

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toBe('{"note":{"title":{"_text":"Happy"}}}')
  })

  test("supports non-compact output when requested", () => {
    const result = convertXmlToJsonText("<root><value>1</value></root>", {
      compact: false,
      ignoreDeclaration: true,
      indentSize: 0,
    })

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toContain(`"elements"`)
    expect(result.json).toContain(`"type":"element"`)
    expect(result.json).not.toContain(`"_declaration"`)
  })

  test("returns the parse error when the XML is invalid", () => {
    const result = convertXmlToJsonText("<root>")

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.json).toBe("")
    expect(result.message).toBeTruthy()
  })
})
