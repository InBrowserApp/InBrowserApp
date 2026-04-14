import standard from "figlet/importable-fonts/Standard.js"
import { describe, expect, test } from "vitest"

import {
  ASCII_ART_ALIGNS,
  DEFAULT_OPTIONS,
  clampWidth,
  extractFontName,
  extractFontNames,
  normalizeAlign,
  normalizeAsciiArtOptions,
  registerFont,
  renderAsciiArt,
} from "./generate-ascii-art"

registerFont("Standard", standard)

describe("font helpers", () => {
  test("extracts single font names from import paths", () => {
    expect(
      extractFontName("../../node_modules/figlet/importable-fonts/Standard.js")
    ).toBe("Standard")
    expect(
      extractFontName("../../node_modules/figlet/importable-fonts/3D-ASCII.js")
    ).toBe("3D-ASCII")
    expect(extractFontName("/invalid/path")).toBeUndefined()
    expect(extractFontName("")).toBeUndefined()
  })

  test("extracts and sorts font names from glob paths", () => {
    expect(
      extractFontNames([
        "../../node_modules/figlet/importable-fonts/Slant.js",
        "../../node_modules/figlet/importable-fonts/Banner.js",
        "/invalid/path",
      ])
    ).toEqual(["Banner", "Slant"])
    expect(extractFontNames([])).toEqual([])
  })
})

describe("option helpers", () => {
  test("normalizes align and width values", () => {
    expect(ASCII_ART_ALIGNS).toEqual(["left", "center", "right"])
    expect(DEFAULT_OPTIONS).toEqual({
      font: "Standard",
      align: "left",
      width: 100,
    })
    expect(normalizeAlign("center")).toBe("center")
    expect(normalizeAlign("sideways")).toBe("left")
    expect(clampWidth("invalid")).toBe(100)
    expect(clampWidth(12)).toBe(40)
    expect(clampWidth(500)).toBe(160)
    expect(clampWidth("72")).toBe(72)
  })

  test("fills missing fields with defaults", () => {
    expect(normalizeAsciiArtOptions()).toEqual(DEFAULT_OPTIONS)
    expect(
      normalizeAsciiArtOptions({
        font: "",
        align: undefined,
        width: undefined,
      })
    ).toEqual(DEFAULT_OPTIONS)
    expect(
      normalizeAsciiArtOptions({
        font: "Ghost",
        align: "right",
        width: 84,
      })
    ).toEqual({
      font: "Ghost",
      align: "right",
      width: 84,
    })
  })
})

describe("renderAsciiArt", () => {
  test("returns empty output for blank text", () => {
    expect(renderAsciiArt("", DEFAULT_OPTIONS)).toBe("")
    expect(renderAsciiArt("   \n\t", DEFAULT_OPTIONS)).toBe("")
  })

  test("renders ascii art for simple input", () => {
    const result = renderAsciiArt("Hi", DEFAULT_OPTIONS)

    expect(result).toContain("_")
    expect(result).toContain("|")
    expect(result.length).toBeGreaterThan(10)
  })

  test("preserves blank lines across multi-line input", () => {
    const result = renderAsciiArt("A\n\nB", DEFAULT_OPTIONS)

    expect(result).toContain("\n\n")
  })

  test("applies center and right alignment padding", () => {
    const centered = renderAsciiArt("Hi", {
      font: "Standard",
      align: "center",
      width: 120,
    })
    const rightAligned = renderAsciiArt("Hi", {
      font: "Standard",
      align: "right",
      width: 120,
    })

    const firstCenteredLine = centered.split("\n").find((line) => line.trim())
    const firstRightLine = rightAligned.split("\n").find((line) => line.trim())

    expect(firstCenteredLine?.startsWith(" ")).toBe(true)
    expect(firstRightLine?.startsWith(" ")).toBe(true)
    expect(firstRightLine?.match(/^ */)?.[0].length).toBeGreaterThan(
      firstCenteredLine?.match(/^ */)?.[0].length ?? 0
    )
  })
})
