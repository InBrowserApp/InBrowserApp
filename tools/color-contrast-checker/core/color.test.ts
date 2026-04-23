import { describe, expect, it } from "vitest"

import {
  blendOver,
  clampAlpha,
  clampChannel,
  contrastRatio,
  parseColor,
  parseHexColor,
  parseHslColor,
  parseRgbColor,
  relativeLuminance,
  resolveContrastColors,
  rgbaToHex,
  toCssRgba,
} from "./color"

describe("clamp helpers", () => {
  it("clamps channels into the 0-255 range", () => {
    expect(clampChannel(-1)).toBe(0)
    expect(clampChannel(12.6)).toBe(13)
    expect(clampChannel(400)).toBe(255)
  })

  it("clamps alpha into the 0-1 range", () => {
    expect(clampAlpha(-0.2)).toBe(0)
    expect(clampAlpha(0.25)).toBe(0.25)
    expect(clampAlpha(1.4)).toBe(1)
  })
})

describe("parseHexColor", () => {
  it("parses short and long hex values, including alpha", () => {
    expect(parseHexColor("#abc")).toEqual({ r: 170, g: 187, b: 204, a: 1 })
    expect(parseHexColor("#abcd")).toEqual({
      r: 170,
      g: 187,
      b: 204,
      a: 0.8666666666666667,
    })
    expect(parseHexColor("#112233")).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseHexColor("#11223380")).toEqual({
      r: 17,
      g: 34,
      b: 51,
      a: 0.5019607843137255,
    })
  })

  it("returns null for invalid hex strings", () => {
    expect(parseHexColor("#12")).toBeNull()
    expect(parseHexColor("#gggggg")).toBeNull()
  })
})

describe("parseRgbColor", () => {
  it("parses rgb and rgba values in comma and space syntax", () => {
    expect(parseRgbColor("rgb(255, 0, 0)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
    expect(parseRgbColor("rgba(100%, 0%, 0%, 50%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 0.5,
    })
    expect(parseRgbColor("rgb(0 0 0 / 50%)")).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0.5,
    })
    expect(parseRgbColor("rgba(0 128 255 0.25)")).toEqual({
      r: 0,
      g: 128,
      b: 255,
      a: 0.25,
    })
    expect(parseRgbColor("rgb(10 20 30 / )")).toEqual({
      r: 10,
      g: 20,
      b: 30,
      a: 1,
    })
  })

  it("returns null for invalid rgb strings", () => {
    expect(parseRgbColor("rgb(10, 20)")).toBeNull()
    expect(parseRgbColor("rgb(aa, 20, 30)")).toBeNull()
    expect(parseRgbColor("rgb(% 0 0)")).toBeNull()
    expect(parseRgbColor("rgb(10 20 30 / %)")).toBeNull()
    expect(parseRgbColor("rgb(10 20 30 / nope)")).toBeNull()
  })
})

describe("parseHslColor", () => {
  it("parses hsl values with multiple angle units", () => {
    expect(parseHslColor("hsl(0, 100%, 50%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
    expect(parseHslColor("hsla(120deg, 100%, 25%, 0.5)")).toEqual({
      r: 0,
      g: 128,
      b: 0,
      a: 0.5,
    })

    const turn = parseHslColor("hsl(0.5turn 50% 50% / 25%)")
    expect(turn).not.toBeNull()
    expect(turn?.a).toBe(0.25)

    expect(parseHslColor("hsl(3.1415926rad 100% 50%)")).not.toBeNull()
    expect(parseHslColor("hsl(100grad 100% 50%)")).toEqual(
      parseHslColor("hsl(90 100% 50%)")
    )

    const noPercent = parseHslColor("hsl(120 50 50)")
    expect(noPercent).not.toBeNull()
    expect(noPercent?.a).toBe(1)
  })

  it("returns null for invalid hsl values", () => {
    expect(parseHslColor("hsl(0, 50%)")).toBeNull()
    expect(parseHslColor("hsl(bad 50% 50%)")).toBeNull()
    expect(parseHslColor("hsl(0 foo 50%)")).toBeNull()
    expect(parseHslColor("hsl(0 50% foo)")).toBeNull()
    expect(parseHslColor("hsla(0 100% 50% / %)")).toBeNull()
    expect(parseHslColor("hsl(,,)")).toBeNull()
  })
})

describe("parseColor", () => {
  it("parses named colors, transparent, and other formats", () => {
    expect(parseColor("red")).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseColor("transparent")).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    expect(parseColor("#112233")).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseColor("rgb(10, 20, 30)")).toEqual({
      r: 10,
      g: 20,
      b: 30,
      a: 1,
    })
    expect(parseColor("hsl(0, 100%, 50%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
  })

  it("returns null for empty and unknown values", () => {
    expect(parseColor("")).toBeNull()
    expect(parseColor("not-a-color")).toBeNull()
  })
})

describe("formatters", () => {
  it("formats rgba values as hex with or without alpha", () => {
    expect(rgbaToHex({ r: 17, g: 34, b: 51, a: 0.5 })).toBe("#112233")
    expect(rgbaToHex({ r: 17, g: 34, b: 51, a: 0.5 }, true)).toBe("#11223380")
  })

  it("formats css rgba output with trimmed alpha precision", () => {
    expect(toCssRgba({ r: 1, g: 2, b: 3, a: 0.33333 })).toBe(
      "rgba(1, 2, 3, 0.333)"
    )
  })
})

describe("contrast calculations", () => {
  it("blends transparent colors and resolves opaque contrast colors", () => {
    expect(
      blendOver({ r: 0, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 0 })
    ).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    })

    const resolved = resolveContrastColors(
      { r: 255, g: 0, b: 0, a: 0.5 },
      { r: 0, g: 0, b: 0, a: 0.5 }
    )

    expect(resolved.foreground.a).toBe(1)
    expect(resolved.background.a).toBe(1)
  })

  it("computes relative luminance and contrast ratios", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBeCloseTo(0, 6)
    expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(
      1,
      6
    )
    expect(
      contrastRatio(
        { r: 0, g: 0, b: 0, a: 1 },
        { r: 255, g: 255, b: 255, a: 1 }
      )
    ).toBeCloseTo(21, 4)
  })
})
