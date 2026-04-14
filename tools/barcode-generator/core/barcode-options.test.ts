import { describe, expect, test } from "vitest"

import {
  BARCODE_FORMATS,
  DEFAULT_BARCODE_GENERATOR_OPTIONS,
  getRenderableBarcodeText,
  normalizeBarcodeGeneratorOptions,
  parseStoredBarcodeGeneratorOptions,
  toJsBarcodeOptions,
} from "./barcode-options"

describe("barcode options", () => {
  test("exposes the supported barcode formats", () => {
    expect(BARCODE_FORMATS).toContain("CODE128")
    expect(BARCODE_FORMATS).toContain("EAN13")
    expect(BARCODE_FORMATS).toContain("CODE93")
  })

  test("normalizes partial values and falls back for invalid input", () => {
    expect(
      normalizeBarcodeGeneratorOptions({
        background: "#ABCDEF",
        displayValue: false,
        fontSize: 200,
        format: "NOT_REAL" as never,
        height: 10,
        lineColor: "#123456",
        margin: -4,
        text: "demo",
        textAlign: "left",
        textPosition: "top",
        width: 99,
      })
    ).toEqual({
      background: "#abcdef",
      displayValue: false,
      fontSize: 48,
      format: DEFAULT_BARCODE_GENERATOR_OPTIONS.format,
      height: 20,
      lineColor: "#123456",
      margin: 0,
      text: "demo",
      textAlign: "left",
      textPosition: "top",
      width: 8,
    })
  })

  test("falls back when values are missing or malformed", () => {
    expect(
      normalizeBarcodeGeneratorOptions({
        background: "#fff",
        displayValue: "yes" as never,
        fontSize: Number.NaN,
        format: "EAN13",
        height: Infinity,
        lineColor: "#000000ff",
        margin: undefined,
        text: 42 as never,
        textAlign: "middle" as never,
        textPosition: "middle" as never,
        width: null as never,
      })
    ).toEqual({
      ...DEFAULT_BARCODE_GENERATOR_OPTIONS,
      format: "EAN13",
    })
  })

  test("parses stored JSON and returns normalized values", () => {
    expect(
      parseStoredBarcodeGeneratorOptions(
        JSON.stringify({
          text: "persisted",
          width: 4.6,
          lineColor: "#112233",
        })
      )
    ).toEqual({
      ...DEFAULT_BARCODE_GENERATOR_OPTIONS,
      lineColor: "#112233",
      text: "persisted",
      width: 5,
    })
  })

  test("returns null for missing or invalid stored JSON", () => {
    expect(parseStoredBarcodeGeneratorOptions(null)).toBeNull()
    expect(parseStoredBarcodeGeneratorOptions("{invalid")).toBeNull()
  })

  test("maps empty text to a render-safe placeholder", () => {
    expect(getRenderableBarcodeText("")).toBe(" ")
    expect(getRenderableBarcodeText("12345")).toBe("12345")
  })

  test("maps options to JsBarcode-compatible values", () => {
    expect(
      toJsBarcodeOptions({
        ...DEFAULT_BARCODE_GENERATOR_OPTIONS,
        background: "#abcdef",
        displayValue: false,
        fontSize: 18,
        format: "EAN13",
        height: 120,
        lineColor: "#123456",
        margin: 4,
        textAlign: "right",
        textPosition: "top",
        width: 3,
      })
    ).toEqual({
      background: "#abcdef",
      displayValue: false,
      fontSize: 18,
      format: "EAN13",
      height: 120,
      lineColor: "#123456",
      margin: 4,
      textAlign: "right",
      textPosition: "top",
      width: 3,
    })
  })
})
