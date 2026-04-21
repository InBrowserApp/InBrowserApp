import { describe, expect, test } from "vitest"

import {
  CATEGORY_SWATCHES,
  COLOR_CATEGORIES,
  COLOR_DATA,
  filterColors,
  formatRgb,
  getColorCategory,
  isColorFilter,
  rgbToHex,
  rgbToHsl,
} from "./html-color-names"

describe("html-color-names core", () => {
  test("categorizes grayscale, white, brown, and hue-driven colors", () => {
    expect(getColorCategory(255, 255, 255)).toBe("white")
    expect(getColorCategory(128, 128, 128)).toBe("gray")
    expect(getColorCategory(160, 82, 45)).toBe("brown")
    expect(getColorCategory(255, 0, 0)).toBe("red")
    expect(getColorCategory(0, 128, 0)).toBe("green")
    expect(getColorCategory(255, 105, 180)).toBe("pink")
  })

  test("converts RGB channels to HSL and hex", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 1, 0.5])
    expect(rgbToHex(255, 165, 0)).toBe("#FFA500")
    expect(formatRgb([70, 130, 180])).toBe("rgb(70, 130, 180)")
  })

  test("exports sorted color data and filter helpers", () => {
    expect(COLOR_CATEGORIES).toContain("blue")
    expect(CATEGORY_SWATCHES.white).toBe("#FFFFFF")
    expect(COLOR_DATA[0]?.name).toBe("aliceblue")
    expect(
      COLOR_DATA.some(
        (entry) =>
          entry.name === "tomato" &&
          entry.hex === "#FF6347" &&
          entry.category === "red"
      )
    ).toBe(true)
    expect(isColorFilter("all")).toBe(true)
    expect(isColorFilter("cyan")).toBe(true)
    expect(isColorFilter("invalid")).toBe(false)

    const steelColors = filterColors(COLOR_DATA, "steel", "all").map(
      (entry) => entry.name
    )
    expect(steelColors).toEqual(["lightsteelblue", "steelblue"])

    const yellowHexMatches = filterColors(COLOR_DATA, "#ff", "yellow")
    expect(yellowHexMatches.length).toBeGreaterThan(0)
    expect(yellowHexMatches.every((entry) => entry.category === "yellow")).toBe(
      true
    )
  })
})
