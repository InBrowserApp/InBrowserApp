import { describe, expect, it } from "vitest"

import {
  CSS_KEYWORDS,
  formatCmyk,
  formatHex,
  formatHsl,
  formatHsv,
  formatHwb,
  formatKeyword,
  formatLab,
  formatLch,
  formatRgb,
  parseCmykColor,
  parseHexColor,
  parseHslColor,
  parseHsvColor,
  parseHwbColor,
  parseKeywordColor,
  parseLabColor,
  parseLchColor,
  parseRgbColor,
} from "./color"
import {
  clampAlpha,
  clampChannel,
  formatAlpha,
  formatDecimal,
  parseAlpha,
  parseHue,
  parsePercentage,
  parseRgbChannel,
  parseStrictNumber,
  splitArgs,
  splitFunctionalArgs,
  toRgba,
} from "./shared"

describe("shared helpers", () => {
  it("clamps and formats numeric helper values", () => {
    expect(clampChannel(-5)).toBe(0)
    expect(clampChannel(12.6)).toBe(13)
    expect(clampChannel(999)).toBe(255)
    expect(clampAlpha(-1)).toBe(0)
    expect(clampAlpha(1.5)).toBe(1)
    expect(formatAlpha(0.3339)).toBe("0.334")
    expect(formatDecimal(12.34)).toBe("12.3")
    expect(toRgba([], 2)).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  })

  it("parses helper argument fragments", () => {
    expect(parseStrictNumber("")).toBeNull()
    expect(parseStrictNumber(".5")).toBe(0.5)
    expect(splitArgs("1, 2 3")).toEqual(["1", "2", "3"])
    expect(splitFunctionalArgs("10 20 30 0.5")).toEqual({
      parts: ["10", "20", "30"],
      alpha: "0.5",
    })
    expect(splitFunctionalArgs("10 20 30 / 50%")).toEqual({
      parts: ["10", "20", "30"],
      alpha: "50%",
    })
    expect(parseAlpha(null)).toBe(1)
    expect(parseAlpha("%")).toBeNull()
    expect(parseAlpha("150%")).toBe(1)
    expect(parseHue("nope")).toBeNull()
    expect(parseHue("1turn")).toBe(360)
    expect(parsePercentage("%")).toBeNull()
    expect(parsePercentage("12.5%")).toBe(12.5)
    expect(parseRgbChannel("%")).toBeNull()
    expect(parseRgbChannel("50%")).toBe(127.5)
  })
})

describe("formatters", () => {
  it("formats hex, rgb, hsl, hsv, hwb, lab, lch, cmyk, and keyword values", () => {
    const rgba = { r: 17, g: 34, b: 51, a: 0.5 }

    expect(formatHex(rgba)).toBe("#112233")
    expect(formatHex(rgba, true)).toBe("#11223380")
    expect(formatRgb(rgba)).toBe("rgb(17, 34, 51)")
    expect(formatRgb(rgba, true)).toBe("rgba(17, 34, 51, 0.5)")
    expect(formatHsl(rgba)).toBe("hsl(210, 50%, 13%)")
    expect(formatHsl(rgba, true)).toBe("hsla(210, 50%, 13%, 0.5)")
    expect(formatHsv(rgba)).toBe("hsv(210, 67%, 20%)")
    expect(formatHsv(rgba, true)).toBe("hsva(210, 67%, 20%, 0.5)")
    expect(formatHwb(rgba)).toBe("hwb(210, 7%, 80%)")
    expect(formatLab(rgba)).toBe("lab(12.6, -0.8, -13.3)")
    expect(formatLch(rgba)).toBe("lch(12.6, 13.3, 266.6)")
    expect(formatCmyk(rgba)).toBe("cmyk(67%, 33%, 0%, 80%)")
    expect(formatKeyword({ r: 255, g: 0, b: 0, a: 1 })).toBe("red")
  })
})

describe("parseHexColor", () => {
  it("parses short and long hex values with optional alpha", () => {
    expect(parseHexColor("#abc")).toEqual({ r: 170, g: 187, b: 204, a: 1 })
    expect(parseHexColor("#abcd")).toEqual({
      r: 170,
      g: 187,
      b: 204,
      a: 0.8666666666666667,
    })
    expect(parseHexColor("112233")).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseHexColor("#11223380")).toEqual({
      r: 17,
      g: 34,
      b: 51,
      a: 0.5019607843137255,
    })
  })

  it("rejects invalid hex strings", () => {
    expect(parseHexColor("#12")).toBeNull()
    expect(parseHexColor("#gggggg")).toBeNull()
  })
})

describe("parseRgbColor", () => {
  it("parses rgb and rgba inputs with commas, spaces, percentages, and slash alpha", () => {
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
    expect(parseRgbColor("rgb(0 128 255 / 25%)")).toEqual({
      r: 0,
      g: 128,
      b: 255,
      a: 0.25,
    })
    expect(parseRgbColor("rgba(0 128 255 0.25)")).toEqual({
      r: 0,
      g: 128,
      b: 255,
      a: 0.25,
    })
  })

  it("rejects invalid rgb inputs", () => {
    expect(parseRgbColor("rgb(10, 20)")).toBeNull()
    expect(parseRgbColor("rgb(aa, 20, 30)")).toBeNull()
    expect(parseRgbColor("rgb(% 0 0)")).toBeNull()
    expect(parseRgbColor("rgb(10 20 30 / )")).toBeNull()
    expect(parseRgbColor("rgb(10 20 30 / nope)")).toBeNull()
    expect(parseRgbColor("not-rgb")).toBeNull()
  })
})

describe("parseHslColor", () => {
  it("parses hsl values across supported hue units", () => {
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
    expect(turn).toEqual({ r: 64, g: 191, b: 191, a: 0.25 })

    const grad = parseHslColor("hsl(100grad 100% 50%)")
    expect(grad).toEqual(parseHslColor("hsl(90 100% 50%)"))

    const rad = parseHslColor("hsl(3.1415926rad 100% 50%)")
    expect(rad).toEqual({ r: 0, g: 255, b: 255, a: 1 })

    expect(parseHslColor("hsl(120 50 50)")).toEqual({
      r: 64,
      g: 191,
      b: 64,
      a: 1,
    })
  })

  it("rejects invalid hsl inputs", () => {
    expect(parseHslColor("hsl(0, 50%)")).toBeNull()
    expect(parseHslColor("hsl(bad 50% 50%)")).toBeNull()
    expect(parseHslColor("hsl(0 foo 50%)")).toBeNull()
    expect(parseHslColor("hsla(0 100% 50% / nope)")).toBeNull()
    expect(parseHslColor("not-hsl")).toBeNull()
  })
})

describe("parseHsvColor", () => {
  it("parses hsv values with and without alpha", () => {
    expect(parseHsvColor("hsv(0, 100%, 100%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
    expect(parseHsvColor("hsva(240 100% 100% / 50%)")).toEqual({
      r: 0,
      g: 0,
      b: 255,
      a: 0.5,
    })
  })

  it("rejects invalid hsv inputs", () => {
    expect(parseHsvColor("hsv(0 100%)")).toBeNull()
    expect(parseHsvColor("hsv(nope 100% 100%)")).toBeNull()
    expect(parseHsvColor("not-hsv")).toBeNull()
  })
})

describe("parseHwbColor", () => {
  it("parses hwb values", () => {
    expect(parseHwbColor("hwb(0, 0%, 0%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
    expect(parseHwbColor("hwb(180 10% 10%)")).toEqual({
      r: 26,
      g: 230,
      b: 230,
      a: 1,
    })
  })

  it("rejects invalid hwb inputs", () => {
    expect(parseHwbColor("hwb(0 0%)")).toBeNull()
    expect(parseHwbColor("hwb(nope 10% 10%)")).toBeNull()
    expect(parseHwbColor("not-hwb")).toBeNull()
  })
})

describe("parseLabColor", () => {
  it("parses lab values", () => {
    expect(parseLabColor("lab(53.2, 80.1, 67.2)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
  })

  it("rejects invalid lab values", () => {
    expect(parseLabColor("lab(120, 1, 1)")).toBeNull()
    expect(parseLabColor("lab(nope, 1, 1)")).toBeNull()
    expect(parseLabColor("lab(50, 1)")).toBeNull()
    expect(parseLabColor("not-lab")).toBeNull()
  })
})

describe("parseLchColor", () => {
  it("parses lch values", () => {
    expect(parseLchColor("lch(53.2, 104.5, 40.1)")).toEqual({
      r: 255,
      g: 1,
      b: 0,
      a: 1,
    })
  })

  it("rejects invalid lch values", () => {
    expect(parseLchColor("lch(101, 10, 10)")).toBeNull()
    expect(parseLchColor("lch(50, -1, 10)")).toBeNull()
    expect(parseLchColor("lch(50, 10, 400)")).toBeNull()
    expect(parseLchColor("lch(50, 10)")).toBeNull()
    expect(parseLchColor("not-lch")).toBeNull()
  })
})

describe("parseCmykColor", () => {
  it("parses cmyk values", () => {
    expect(parseCmykColor("cmyk(0%, 100%, 100%, 0%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    })
  })

  it("rejects invalid cmyk values", () => {
    expect(parseCmykColor("cmyk(10, 10, 10)")).toBeNull()
    expect(parseCmykColor("cmyk(10, 10, 10, 120)")).toBeNull()
    expect(parseCmykColor("not-cmyk")).toBeNull()
  })
})

describe("keywords", () => {
  it("parses known keywords and rejects unknown ones", () => {
    expect(parseKeywordColor("Red")).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseKeywordColor("not-a-keyword")).toBeNull()
    expect(CSS_KEYWORDS[0]).toBe("aliceblue")
  })
})
