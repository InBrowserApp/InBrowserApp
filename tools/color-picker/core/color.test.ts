import { describe, expect, it } from "vitest"

import {
  clampAlpha,
  clampChannel,
  formatAlphaPercent,
  formatCmyk,
  formatHsl,
  formatHsv,
  formatRgb,
  parseHexToRgba,
  rgbaToHex,
  toCssRgba,
} from "./color"

describe("color picker color helpers", () => {
  it("clamps color channels and alpha", () => {
    expect(clampChannel(-10)).toBe(0)
    expect(clampChannel(12.6)).toBe(13)
    expect(clampChannel(999)).toBe(255)
    expect(clampAlpha(-0.5)).toBe(0)
    expect(clampAlpha(0.25)).toBe(0.25)
    expect(clampAlpha(2)).toBe(1)
  })

  it("parses short and long hex strings", () => {
    expect(parseHexToRgba("#abc")).toEqual({ r: 170, g: 187, b: 204, a: 1 })
    expect(parseHexToRgba("#abcd")).toEqual({
      r: 170,
      g: 187,
      b: 204,
      a: 0.8666666666666667,
    })
    expect(parseHexToRgba("112233")).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseHexToRgba("#11223380")).toEqual({
      r: 17,
      g: 34,
      b: 51,
      a: 0.5019607843137255,
    })
  })

  it("rejects invalid hex strings", () => {
    expect(parseHexToRgba("#12")).toBeNull()
    expect(parseHexToRgba("#gggggg")).toBeNull()
  })

  it("formats rgba values into copy-friendly strings", () => {
    const rgba = { r: 17, g: 34, b: 51, a: 0.5 }

    expect(rgbaToHex(rgba, false)).toBe("#112233")
    expect(rgbaToHex(rgba, true)).toBe("#11223380")
    expect(formatRgb(rgba, false)).toBe("rgb(17, 34, 51)")
    expect(formatRgb(rgba, true)).toBe("rgba(17, 34, 51, 0.5)")
    expect(formatHsl(rgba, false)).toBe("hsl(210, 50%, 13%)")
    expect(formatHsl(rgba, true)).toBe("hsla(210, 50%, 13%, 0.5)")
    expect(formatHsv(rgba, false)).toBe("hsv(210, 67%, 20%)")
    expect(formatHsv(rgba, true)).toBe("hsva(210, 67%, 20%, 0.5)")
    expect(formatCmyk(rgba)).toBe("cmyk(67%, 33%, 0%, 80%)")
    expect(formatAlphaPercent(rgba.a)).toBe("50%")
    expect(toCssRgba(rgba)).toBe("rgba(17, 34, 51, 0.5)")
  })
})
