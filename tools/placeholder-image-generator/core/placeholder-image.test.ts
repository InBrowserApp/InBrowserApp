import { describe, expect, test } from "vitest"

import {
  DEFAULT_PLACEHOLDER_OPTIONS,
  MAX_DIMENSION,
  MAX_FONT_SIZE,
  PLACEHOLDER_PRESETS,
  PLACEHOLDER_SCALES,
  buildPlaceholderFilename,
  buildPlaceholderPreviewDataUri,
  buildPlaceholderSvgMarkup,
  escapeXml,
  normalizePlaceholderOptions,
  normalizePlaceholderScale,
  resolvePlaceholderFontSize,
  resolvePlaceholderText,
} from "./placeholder-image"

describe("normalizePlaceholderOptions", () => {
  test("clamps numeric values into supported ranges", () => {
    expect(
      normalizePlaceholderOptions({
        fontSize: 999,
        gradientAngle: 725,
        height: -50,
        width: 99999,
      })
    ).toMatchObject({
      fontSize: MAX_FONT_SIZE,
      gradientAngle: 5,
      height: 1,
      width: MAX_DIMENSION,
    })
  })

  test("falls back to defaults when values are omitted", () => {
    expect(normalizePlaceholderOptions({})).toEqual(DEFAULT_PLACEHOLDER_OPTIONS)
  })

  test("coerces zero dimensions to the minimum supported size", () => {
    expect(
      normalizePlaceholderOptions({
        height: 0,
        width: 0,
      })
    ).toMatchObject({
      height: 1,
      width: 1,
    })
  })
})

describe("normalizePlaceholderScale", () => {
  test("normalizes scales into 1x, 2x, or 3x", () => {
    expect(PLACEHOLDER_SCALES.map(normalizePlaceholderScale)).toEqual([1, 2, 3])
    expect(normalizePlaceholderScale(0)).toBe(1)
    expect(normalizePlaceholderScale(9)).toBe(3)
  })
})

describe("placeholder text helpers", () => {
  test("uses dimensions when custom text is empty", () => {
    expect(resolvePlaceholderText(DEFAULT_PLACEHOLDER_OPTIONS)).toBe(
      "800 × 600"
    )
  })

  test("uses trimmed custom text when provided", () => {
    expect(
      resolvePlaceholderText({
        ...DEFAULT_PLACEHOLDER_OPTIONS,
        text: "  Hero banner  ",
      })
    ).toBe("Hero banner")
  })

  test("uses explicit font size when provided", () => {
    expect(
      resolvePlaceholderFontSize({
        ...DEFAULT_PLACEHOLDER_OPTIONS,
        fontSize: 42,
      })
    ).toBe(42)
  })

  test("derives font size from the smallest dimension when unset", () => {
    expect(resolvePlaceholderFontSize(DEFAULT_PLACEHOLDER_OPTIONS)).toBe(75)
  })
})

describe("escapeXml", () => {
  test("escapes xml-sensitive characters", () => {
    expect(escapeXml(`<hero & "quote" 'single'>`)).toBe(
      "&lt;hero &amp; &quot;quote&quot; &#39;single&#39;&gt;"
    )
  })
})

describe("buildPlaceholderSvgMarkup", () => {
  test("builds solid background svg markup", () => {
    expect(
      buildPlaceholderSvgMarkup({
        backgroundColor: "#000000",
      })
    ).toContain(`fill="#000000"`)
  })

  test("builds linear gradient svg markup", () => {
    expect(
      buildPlaceholderSvgMarkup({
        backgroundType: "linear-gradient",
      })
    ).toContain("<linearGradient")
  })

  test("builds radial gradient svg markup", () => {
    expect(
      buildPlaceholderSvgMarkup({
        backgroundType: "radial-gradient",
      })
    ).toContain("<radialGradient")
  })

  test("scales the exported dimensions", () => {
    expect(buildPlaceholderSvgMarkup({}, 2)).toContain(
      `width="1600" height="1200"`
    )
  })
})

describe("buildPlaceholderPreviewDataUri", () => {
  test("returns an svg data uri", () => {
    expect(buildPlaceholderPreviewDataUri({})).toContain("data:image/svg+xml")
  })
})

describe("buildPlaceholderFilename", () => {
  test("uses jpg extension for jpeg exports", () => {
    expect(buildPlaceholderFilename({}, "jpeg")).toBe("placeholder-800x600.jpg")
  })

  test("adds retina suffixes for scaled exports", () => {
    expect(buildPlaceholderFilename({}, "png", 3)).toBe(
      "placeholder-800x600@3x.png"
    )
  })
})

describe("PLACEHOLDER_PRESETS", () => {
  test("includes the expected preset ids", () => {
    expect(PLACEHOLDER_PRESETS.map((preset) => preset.id)).toEqual([
      "hd",
      "full-hd",
      "square",
      "story",
      "cover",
      "banner",
    ])
  })
})
