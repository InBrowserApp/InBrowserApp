import { describe, expect, test } from "vitest"

import {
  DEFAULT_QUALITY,
  DEFAULT_SVG_DIMENSIONS,
  MAX_OUTPUT_DIMENSION,
  buildSvgDataUrl,
  deriveOutputFileName,
  getOutputExtension,
  getOutputMimeType,
  getSvgDimensions,
  normalizeBackgroundColor,
  normalizeQuality,
  parseSvgLength,
  parseViewBox,
  resolveLockedHeight,
  resolveLockedWidth,
  resolveOutputSize,
  shouldFillBackground,
  shouldShowQuality,
} from "./svg-conversion"

describe("normalizeBackgroundColor", () => {
  test("preserves non-jpeg colors", () => {
    expect(normalizeBackgroundColor("#ffffffcc", "png")).toBe("#ffffffcc")
  })

  test("strips alpha values for jpeg", () => {
    expect(normalizeBackgroundColor("#ffffffcc", "jpeg")).toBe("#ffffff")
  })

  test("leaves standard hex colors untouched for jpeg", () => {
    expect(normalizeBackgroundColor("#ffffff", "jpeg")).toBe("#ffffff")
  })
})

describe("normalizeQuality", () => {
  test("clamps quality into the supported range", () => {
    expect(normalizeQuality(0)).toBe(1)
    expect(normalizeQuality(999)).toBe(100)
  })

  test("falls back when quality is not a number", () => {
    expect(normalizeQuality(Number.NaN)).toBe(DEFAULT_QUALITY)
  })
})

describe("resolveOutputSize", () => {
  test("uses provided width and height when available", () => {
    expect(resolveOutputSize(null, 640, 320)).toEqual({
      height: 320,
      width: 640,
    })
  })

  test("falls back to source or default dimensions", () => {
    expect(resolveOutputSize({ height: 300, width: 600 }, 0, 0)).toEqual({
      height: 1,
      width: 1,
    })
    expect(
      resolveOutputSize(DEFAULT_SVG_DIMENSIONS, Number.NaN, Number.NaN)
    ).toEqual(DEFAULT_SVG_DIMENSIONS)
  })

  test("clamps dimensions into supported limits", () => {
    expect(resolveOutputSize(null, 99999, -10)).toEqual({
      height: 1,
      width: MAX_OUTPUT_DIMENSION,
    })
  })
})

describe("locked dimension helpers", () => {
  test("derives height from width while keeping aspect ratio", () => {
    expect(
      resolveLockedHeight(400, {
        height: 100,
        width: 200,
      })
    ).toBe(200)
  })

  test("derives width from height while keeping aspect ratio", () => {
    expect(
      resolveLockedWidth(300, {
        height: 150,
        width: 450,
      })
    ).toBe(900)
  })

  test("falls back to default dimensions when source dimensions are missing", () => {
    expect(resolveLockedHeight(256, null)).toBe(256)
    expect(resolveLockedWidth(256, null)).toBe(256)
  })
})

describe("output format helpers", () => {
  test("resolves mime types", () => {
    expect(getOutputMimeType("png")).toBe("image/png")
    expect(getOutputMimeType("jpeg")).toBe("image/jpeg")
    expect(getOutputMimeType("webp")).toBe("image/webp")
  })

  test("resolves file extensions", () => {
    expect(getOutputExtension("jpeg")).toBe("jpg")
    expect(getOutputExtension("png")).toBe("png")
  })

  test("controls quality visibility", () => {
    expect(shouldShowQuality("png")).toBe(false)
    expect(shouldShowQuality("jpeg")).toBe(true)
  })

  test("controls background fill behavior", () => {
    expect(shouldFillBackground("jpeg", false)).toBe(true)
    expect(shouldFillBackground("webp", false)).toBe(false)
    expect(shouldFillBackground("png", true)).toBe(true)
  })
})

describe("deriveOutputFileName", () => {
  test("replaces the svg extension and normalizes jpeg", () => {
    expect(deriveOutputFileName("icon.svg", "jpeg")).toBe("icon.jpg")
  })

  test("falls back when the source name has no basename", () => {
    expect(deriveOutputFileName(".svg", "png")).toBe("converted.png")
  })
})

describe("buildSvgDataUrl", () => {
  test("returns a data url", () => {
    expect(buildSvgDataUrl("<svg></svg>")).toContain("data:image/svg+xml")
  })
})

describe("parseSvgLength", () => {
  test("parses px and unitless lengths", () => {
    expect(parseSvgLength("640")).toBe(640)
    expect(parseSvgLength("320px")).toBe(320)
  })

  test("returns null for invalid lengths", () => {
    expect(parseSvgLength(null)).toBeNull()
    expect(parseSvgLength("")).toBeNull()
    expect(parseSvgLength("100%")).toBeNull()
    expect(parseSvgLength("-1")).toBeNull()
    expect(parseSvgLength(".")).toBeNull()
    expect(parseSvgLength("12em")).toBeNull()
  })
})

describe("parseViewBox", () => {
  test("parses valid viewBox values", () => {
    expect(parseViewBox("0 0 1200 630")).toEqual({
      height: 630,
      width: 1200,
    })
  })

  test("returns null for invalid viewBox values", () => {
    expect(parseViewBox(null)).toBeNull()
    expect(parseViewBox("0 0 0 10")).toBeNull()
    expect(parseViewBox("0 0 10")).toBeNull()
    expect(parseViewBox("0 0 a 10")).toBeNull()
  })
})

describe("getSvgDimensions", () => {
  test("reads explicit width and height attributes", () => {
    expect(
      getSvgDimensions('<svg width="640" height="480"></svg>', "INVALID_SVG")
    ).toEqual({
      height: 480,
      width: 640,
    })
  })

  test("uses viewBox when width and height are omitted", () => {
    expect(
      getSvgDimensions('<svg viewBox="0 0 800 600"></svg>', "INVALID_SVG")
    ).toEqual({
      height: 600,
      width: 800,
    })
  })

  test("derives a missing width or height from the viewBox", () => {
    expect(
      getSvgDimensions(
        '<svg height="200" viewBox="0 0 400 100"></svg>',
        "INVALID_SVG"
      )
    ).toEqual({
      height: 200,
      width: 800,
    })
    expect(
      getSvgDimensions(
        '<svg width="150" viewBox="0 0 300 200"></svg>',
        "INVALID_SVG"
      )
    ).toEqual({
      height: 100,
      width: 150,
    })
  })

  test("falls back to default dimensions when svg size cannot be resolved", () => {
    expect(getSvgDimensions("<svg></svg>", "INVALID_SVG")).toEqual(
      DEFAULT_SVG_DIMENSIONS
    )
  })

  test("throws when svg markup is invalid", () => {
    expect(() => getSvgDimensions("<svg", "INVALID_SVG")).toThrow("INVALID_SVG")
    expect(() => getSvgDimensions("<div></div>", "INVALID_SVG")).toThrow(
      "INVALID_SVG"
    )
  })
})
