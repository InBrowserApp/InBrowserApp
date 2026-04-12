import { describe, expect, test } from "vitest"

import {
  ASCII_ART_ALIGNS,
  ASCII_ART_FONT_DEFINITIONS,
  clampWidth,
  createMetrics,
  normalizeAlign,
  normalizeAsciiArtOptions,
  normalizeFont,
  renderAsciiArt,
} from "./ascii-art"

describe("ascii-art helpers", () => {
  test("normalizes fonts, alignment, and width bounds", () => {
    expect(ASCII_ART_ALIGNS).toEqual(["left", "center", "right"])
    expect(ASCII_ART_FONT_DEFINITIONS.map((font) => font.value)).toContain(
      "Standard"
    )
    expect(normalizeFont("Small")).toBe("Small")
    expect(normalizeFont("Unknown")).toBe("Standard")
    expect(normalizeAlign("right")).toBe("right")
    expect(normalizeAlign("sideways")).toBe("left")
    expect(clampWidth("invalid")).toBe(100)
    expect(clampWidth(12)).toBe(40)
    expect(clampWidth(500)).toBe(160)
    expect(clampWidth("72")).toBe(72)
  })

  test("fills missing option fields with defaults", () => {
    expect(normalizeAsciiArtOptions()).toEqual({
      font: "Standard",
      align: "left",
      width: 100,
    })

    expect(
      normalizeAsciiArtOptions({
        font: undefined,
        align: undefined,
        width: undefined,
      })
    ).toEqual({
      font: "Standard",
      align: "left",
      width: 100,
    })
  })

  test("builds metrics for empty and rendered output", () => {
    expect(
      createMetrics("", {
        font: "Standard",
        align: "left",
        width: 90,
      })
    ).toEqual({
      font: "Standard",
      align: "left",
      configuredWidth: 90,
      lineCount: 0,
      maxLineWidth: 0,
      charCount: 0,
    })

    expect(
      createMetrics("ab\ncdef", {
        font: "Small",
        align: "center",
        width: 80,
      })
    ).toEqual({
      font: "Small",
      align: "center",
      configuredWidth: 80,
      lineCount: 2,
      maxLineWidth: 4,
      charCount: 7,
    })
  })
})

describe("renderAsciiArt", () => {
  test("returns empty output for blank input", () => {
    const result = renderAsciiArt("   \n\t", {
      font: "Standard",
      align: "left",
      width: 88,
    })

    expect(result.output).toBe("")
    expect(result.metrics.lineCount).toBe(0)
    expect(result.metrics.configuredWidth).toBe(88)
  })

  test("renders multi-line banners and preserves blank lines", () => {
    const result = renderAsciiArt("A\n\nB", {
      font: "Small",
      align: "left",
      width: 80,
    })

    expect(result.output).toContain("\n\n")
    expect(result.metrics.lineCount).toBeGreaterThan(0)
    expect(result.metrics.maxLineWidth).toBeGreaterThan(0)
    expect(result.metrics.charCount).toBe(result.output.length)
  })

  test("applies right and center alignment padding", () => {
    const right = renderAsciiArt("Hi", {
      font: "Small",
      align: "right",
      width: 80,
    })
    const center = renderAsciiArt("Hi", {
      font: "Small",
      align: "center",
      width: 80,
    })

    const firstRightLine = right.output.split("\n").find((line) => line.trim())
    const firstCenterLine = center.output
      .split("\n")
      .find((line) => line.trim())

    expect(firstRightLine?.startsWith(" ")).toBe(true)
    expect(firstCenterLine?.startsWith(" ")).toBe(true)
    expect(firstRightLine?.match(/^ */)?.[0].length).toBeGreaterThan(
      firstCenterLine?.match(/^ */)?.[0].length ?? 0
    )
  })

  test("normalizes partial options before rendering", () => {
    const options = normalizeAsciiArtOptions({
      font: "Ghost" as const,
      align: "center",
      width: 42,
    })

    const result = renderAsciiArt("Ship", options)

    expect(result.metrics.font).toBe("Ghost")
    expect(result.metrics.align).toBe("center")
    expect(result.metrics.configuredWidth).toBe(42)
    expect(result.output.length).toBeGreaterThan(0)
  })
})
