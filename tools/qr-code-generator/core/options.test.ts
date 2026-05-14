import { describe, expect, it } from "vitest"

import {
  DEFAULT_QR_GENERATOR_OPTIONS,
  getRenderableQrPayload,
  normalizeQrGeneratorOptions,
  parseStoredQrGeneratorOptions,
  toQrRenderOptions,
} from "./options"

describe("normalizeQrGeneratorOptions", () => {
  it("uses defaults for invalid values", () => {
    expect(
      normalizeQrGeneratorOptions({
        darkColor: "black",
        errorCorrectionLevel: "X" as never,
        lightColor: "#fff",
        margin: -10,
        size: 40,
      })
    ).toEqual({
      ...DEFAULT_QR_GENERATOR_OPTIONS,
      margin: 0,
      size: 128,
    })
  })

  it("uses defaults for invalid value types", () => {
    expect(
      normalizeQrGeneratorOptions({
        darkColor: null as never,
        errorCorrectionLevel: null as never,
        lightColor: 12 as never,
        margin: Number.NaN,
        size: "large" as never,
      })
    ).toEqual(DEFAULT_QR_GENERATOR_OPTIONS)
  })

  it("normalizes valid values", () => {
    expect(
      normalizeQrGeneratorOptions({
        darkColor: "#ABCDEF",
        errorCorrectionLevel: "H",
        lightColor: "#123456",
        margin: 5.6,
        size: 777.4,
      })
    ).toEqual({
      darkColor: "#abcdef",
      errorCorrectionLevel: "H",
      lightColor: "#123456",
      margin: 6,
      size: 777,
    })
  })
})

describe("parseStoredQrGeneratorOptions", () => {
  it("returns normalized options from stored JSON", () => {
    expect(
      parseStoredQrGeneratorOptions(
        JSON.stringify({
          darkColor: "#000000",
          errorCorrectionLevel: "Q",
          lightColor: "#ffffff",
          margin: 4,
          size: 512,
        })
      )
    ).toEqual({
      darkColor: "#000000",
      errorCorrectionLevel: "Q",
      lightColor: "#ffffff",
      margin: 4,
      size: 512,
    })
  })

  it("returns null for missing or invalid stored JSON", () => {
    expect(parseStoredQrGeneratorOptions(null)).toBeNull()
    expect(parseStoredQrGeneratorOptions("{")).toBeNull()
  })
})

describe("QR render helpers", () => {
  it("uses a space for empty QR payloads", () => {
    expect(getRenderableQrPayload("")).toBe(" ")
    expect(getRenderableQrPayload("hello")).toBe("hello")
  })

  it("maps normalized options to qrcode render options", () => {
    expect(toQrRenderOptions(DEFAULT_QR_GENERATOR_OPTIONS)).toEqual({
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
    })
  })
})
