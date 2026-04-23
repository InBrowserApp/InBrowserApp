import { describe, expect, test } from "vitest"

import {
  buildHtmlColorEntries,
  filterHtmlColorEntries,
  formatRgb,
  getColorCategory,
  isColorFilter,
  matchesColorQuery,
  normalizeColorQuery,
  rgbToHex,
  rgbToHsl,
} from "./color-names"

describe("html color helpers", () => {
  test("converts RGB values to HSL", () => {
    expect(rgbToHsl(128, 128, 128)).toEqual([0, 0, 0.5019607843137255])
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 1, 0.5])
  })

  test("categorizes named colors into visual families", () => {
    expect(getColorCategory(255, 255, 255)).toBe("white")
    expect(getColorCategory(128, 128, 128)).toBe("gray")
    expect(getColorCategory(120, 80, 40)).toBe("brown")
    expect(getColorCategory(255, 0, 0)).toBe("red")
    expect(getColorCategory(255, 165, 0)).toBe("orange")
    expect(getColorCategory(255, 255, 0)).toBe("yellow")
    expect(getColorCategory(0, 128, 0)).toBe("green")
    expect(getColorCategory(0, 255, 255)).toBe("cyan")
    expect(getColorCategory(0, 0, 255)).toBe("blue")
    expect(getColorCategory(138, 43, 226)).toBe("purple")
    expect(getColorCategory(255, 105, 180)).toBe("pink")
  })

  test("formats HEX and RGB labels", () => {
    expect(rgbToHex(240, 248, 255)).toBe("#F0F8FF")
    expect(formatRgb(240, 248, 255)).toBe("rgb(240, 248, 255)")
  })

  test("builds sorted color entries and skips missing values", () => {
    const entries = buildHtmlColorEntries({
      zebra: [120, 80, 40],
      alpha: [255, 255, 255],
      missing: undefined,
    })

    expect(entries).toEqual([
      {
        category: "white",
        hex: "#FFFFFF",
        name: "alpha",
        rgb: [255, 255, 255],
        rgbLabel: "rgb(255, 255, 255)",
      },
      {
        category: "brown",
        hex: "#785028",
        name: "zebra",
        rgb: [120, 80, 40],
        rgbLabel: "rgb(120, 80, 40)",
      },
    ])
  })

  test("normalizes and matches color queries", () => {
    const aliceBlue = buildHtmlColorEntries({
      aliceblue: [240, 248, 255],
    })[0]!

    expect(normalizeColorQuery("  Alice  ")).toBe("alice")
    expect(matchesColorQuery(aliceBlue, "")).toBe(true)
    expect(matchesColorQuery(aliceBlue, "alice")).toBe(true)
    expect(matchesColorQuery(aliceBlue, "#F0F8")).toBe(true)
    expect(matchesColorQuery(aliceBlue, "f0f8ff")).toBe(true)
    expect(matchesColorQuery(aliceBlue, "tomato")).toBe(false)
  })

  test("recognizes valid filters and combines query with category filters", () => {
    const entries = buildHtmlColorEntries({
      red: [255, 0, 0],
      sky: [0, 191, 255],
      grayish: [128, 128, 128],
    })

    expect(isColorFilter("all")).toBe(true)
    expect(isColorFilter("blue")).toBe(true)
    expect(isColorFilter("unknown")).toBe(false)

    expect(
      filterHtmlColorEntries(entries, "", "blue").map((entry) => entry.name)
    ).toEqual(["sky"])
    expect(
      filterHtmlColorEntries(entries, "ff", "all").map((entry) => entry.name)
    ).toEqual(["red", "sky"])
    expect(filterHtmlColorEntries(entries, "zz", "all")).toEqual([])
  })
})
