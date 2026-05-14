import { describe, expect, it } from "vitest"

import {
  clampChannel,
  createSwatches,
  formatHsl,
  formatPercent,
  formatRgb,
  getContrastColor,
  rgbToHex,
  rgbToHsl,
  sortSwatches,
} from "./color"

describe("color helpers", () => {
  it("formats rgb and hex values with clamped channels", () => {
    expect(clampChannel(260.4)).toBe(255)
    expect(clampChannel(-4)).toBe(0)
    expect(rgbToHex(255, 127.5, -10)).toBe("#FF8000")
    expect(formatRgb(1.2, 2.5, 3.6)).toBe("rgb(1, 3, 4)")
  })

  it("converts primary, gray, and bright colors to hsl", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 })
    expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 })
    expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 })
    expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 })
    expect(formatHsl(255, 192, 203)).toBe("hsl(350, 100%, 88%)")
  })

  it("chooses readable contrast colors", () => {
    expect(getContrastColor(255, 255, 255)).toBe("#111111")
    expect(getContrastColor(20, 20, 20)).toBe("#ffffff")
  })

  it("creates and sorts palette swatches", () => {
    const swatches = createSwatches(
      [
        { r: 0, g: 0, b: 255, count: 2 },
        { r: 255, g: 0, b: 0, count: 5 },
        { r: 255, g: 255, b: 255, count: 1 },
      ],
      8
    )

    expect(swatches[0]).toMatchObject({
      hex: "#0000FF",
      ratio: 0.25,
      rgb: "rgb(0, 0, 255)",
    })
    expect(createSwatches([], 0)).toEqual([])
    expect(
      sortSwatches(swatches, "dominance").map((color) => color.hex)
    ).toEqual(["#FF0000", "#0000FF", "#FFFFFF"])
    expect(sortSwatches(swatches, "hue").map((color) => color.hex)).toEqual([
      "#FF0000",
      "#FFFFFF",
      "#0000FF",
    ])
    expect(
      sortSwatches(swatches, "lightness").map((color) => color.hex)
    ).toEqual(["#FF0000", "#0000FF", "#FFFFFF"])

    const tieSorted = sortSwatches(
      [
        { ...swatches[0]!, count: 1, hue: 10, lightness: 50 },
        { ...swatches[1]!, count: 3, hue: 10, lightness: 50 },
      ],
      "lightness"
    )
    expect(tieSorted[0]?.count).toBe(3)
  })

  it("formats percentages for labels", () => {
    expect(formatPercent(0.004)).toBe("<1%")
    expect(formatPercent(0.25)).toBe("25%")
  })
})
