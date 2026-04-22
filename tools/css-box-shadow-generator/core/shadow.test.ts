import { describe, expect, it } from "vitest"

import {
  DEFAULT_SHADOW_CONFIG,
  buildBoxShadow,
  formatShadowLayer,
  getAlphaPercentage,
  getOpaqueHexColor,
  normalizeShadowConfig,
  parseHexColor,
  rgbaToHex,
  updateHexAlpha,
  updateHexColorRgb,
} from "./shadow"

describe("parseHexColor", () => {
  it("parses shorthand and full hex values", () => {
    expect(parseHexColor("#123")).toEqual({
      r: 17,
      g: 34,
      b: 51,
      a: 1,
    })
    expect(parseHexColor("#1234")).toMatchObject({
      r: 17,
      g: 34,
      b: 51,
    })
    expect(parseHexColor("#1234")?.a).toBeCloseTo(0.267, 2)
    expect(parseHexColor("#12345678")).toMatchObject({
      r: 18,
      g: 52,
      b: 86,
    })
    expect(parseHexColor("#12345678")?.a).toBeCloseTo(0.471, 2)
  })

  it("returns null for invalid values", () => {
    expect(parseHexColor("")).toBeNull()
    expect(parseHexColor("#12")).toBeNull()
    expect(parseHexColor("#gggggg")).toBeNull()
  })
})

describe("rgbaToHex", () => {
  it("formats rgb and rgba output", () => {
    expect(rgbaToHex({ r: 18, g: 52, b: 86, a: 1 }, false)).toBe("#123456")
    expect(rgbaToHex({ r: 18, g: 52, b: 86, a: 0.5 }, true)).toBe("#12345680")
  })
})

describe("formatShadowLayer", () => {
  it("formats a layer into CSS", () => {
    expect(
      formatShadowLayer({
        offsetX: 0,
        offsetY: 12,
        blur: 40,
        spread: -8,
        color: "#00000040",
        inset: true,
      })
    ).toBe("inset 0px 12px 40px -8px rgba(0, 0, 0, 0.251)")
  })
})

describe("buildBoxShadow", () => {
  it("joins multiple layers and handles empty arrays", () => {
    expect(buildBoxShadow([])).toBe("none")
    expect(
      buildBoxShadow([
        DEFAULT_SHADOW_CONFIG,
        {
          offsetX: 0,
          offsetY: 1,
          blur: 2,
          spread: 3,
          color: "#FF000080",
          inset: false,
        },
      ])
    ).toBe(
      "0px 8px 24px 0px rgba(0, 0, 0, 0.2), 0px 1px 2px 3px rgba(255, 0, 0, 0.502)"
    )
  })
})

describe("color helpers", () => {
  it("returns fallback values for invalid input", () => {
    expect(getOpaqueHexColor("oops")).toBe("#000000")
    expect(getAlphaPercentage("oops")).toBe(20)
  })

  it("preserves alpha when updating rgb and preserves rgb when updating alpha", () => {
    expect(updateHexColorRgb("#12345680", "#ABCDEF")).toBe("#ABCDEF80")
    expect(updateHexAlpha("#12345680", 12)).toBe("#1234561F")
    expect(updateHexAlpha("#12345680", 120)).toBe("#123456FF")
  })
})

describe("normalizeShadowConfig", () => {
  it("coerces invalid values to defaults and keeps valid values", () => {
    expect(
      normalizeShadowConfig({
        offsetX: 10.4,
        offsetY: Number.NaN,
        blur: -4,
        spread: 5.6,
        color: "#ABCDEF",
        inset: true,
      })
    ).toEqual({
      offsetX: 10,
      offsetY: 8,
      blur: 0,
      spread: 6,
      color: "#ABCDEF",
      inset: true,
    })
  })
})
