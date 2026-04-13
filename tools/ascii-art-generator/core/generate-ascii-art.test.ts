import figlet from "figlet"
import standard from "figlet/importable-fonts/Standard.js"
import { describe, expect, test } from "vitest"

import {
  extractFontName,
  extractFontNames,
  registerFont,
  renderAsciiArt,
} from "./generate-ascii-art"

// Register the Standard font so renderAsciiArt can use it
figlet.parseFont("Standard", standard)

describe("extractFontName", () => {
  test("extracts name from a typical glob path", () => {
    expect(
      extractFontName("../../node_modules/figlet/importable-fonts/Standard.js")
    ).toBe("Standard")
  })

  test("extracts name from a path with hyphens", () => {
    expect(
      extractFontName("../../node_modules/figlet/importable-fonts/3D-ASCII.js")
    ).toBe("3D-ASCII")
  })

  test("returns undefined for a path without a .js file", () => {
    expect(extractFontName("/some/directory/")).toBeUndefined()
  })

  test("returns undefined for an empty string", () => {
    expect(extractFontName("")).toBeUndefined()
  })
})

describe("extractFontNames", () => {
  test("extracts and sorts font names", () => {
    const paths = [
      "../../node_modules/figlet/importable-fonts/Slant.js",
      "../../node_modules/figlet/importable-fonts/Banner.js",
      "../../node_modules/figlet/importable-fonts/Standard.js",
    ]
    expect(extractFontNames(paths)).toEqual(["Banner", "Slant", "Standard"])
  })

  test("filters out invalid paths", () => {
    const paths = [
      "../../node_modules/figlet/importable-fonts/Standard.js",
      "/invalid/path/",
      "",
    ]
    expect(extractFontNames(paths)).toEqual(["Standard"])
  })

  test("returns an empty array for empty input", () => {
    expect(extractFontNames([])).toEqual([])
  })
})

describe("registerFont", () => {
  test("registers a font that can be used by renderAsciiArt", () => {
    registerFont("TestStandard", standard)
    const result = renderAsciiArt("Hi", "TestStandard")
    expect(result).toContain("|")
    expect(result.length).toBeGreaterThan(0)
  })
})

describe("renderAsciiArt", () => {
  test("returns empty string for empty input", () => {
    expect(renderAsciiArt("", "Standard")).toBe("")
  })

  test("returns empty string for whitespace-only input", () => {
    expect(renderAsciiArt("   ", "Standard")).toBe("")
    expect(renderAsciiArt("\n\t", "Standard")).toBe("")
  })

  test("generates ASCII art for simple text", () => {
    const result = renderAsciiArt("Hi", "Standard")
    expect(result).toContain("_")
    expect(result).toContain("|")
    expect(result.length).toBeGreaterThan(10)
  })

  test("generates multi-line output", () => {
    const result = renderAsciiArt("A", "Standard")
    const lines = result.split("\n")
    expect(lines.length).toBeGreaterThan(1)
  })

  test("generates different output for different text", () => {
    const a = renderAsciiArt("A", "Standard")
    const b = renderAsciiArt("B", "Standard")
    expect(a).not.toBe(b)
  })

  test("produces consistent output for same input", () => {
    const first = renderAsciiArt("Test", "Standard")
    const second = renderAsciiArt("Test", "Standard")
    expect(first).toBe(second)
  })

  test("handles special characters", () => {
    const result = renderAsciiArt("!@#", "Standard")
    expect(result.length).toBeGreaterThan(0)
  })
})
