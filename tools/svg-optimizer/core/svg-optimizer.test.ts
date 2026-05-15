import { describe, expect, test } from "vitest"

import {
  DEFAULT_OPTIONS,
  assertSvgMarkup,
  buildSvgoConfig,
  calculateMetrics,
  createSvgBlob,
  deriveOptimizedFileName,
  formatByteSize,
  getByteSize,
  isLikelySvgMarkup,
  normalizeSvgText,
} from "./svg-optimizer"

describe("SVG source validation", () => {
  test("accepts direct SVG markup and XML-wrapped SVG markup", () => {
    expect(isLikelySvgMarkup("<svg></svg>")).toBe(true)
    expect(isLikelySvgMarkup('<?xml version="1.0"?><svg></svg>')).toBe(true)
  })

  test("rejects empty or non-SVG markup", () => {
    expect(isLikelySvgMarkup("")).toBe(false)
    expect(isLikelySvgMarkup("<div></div>")).toBe(false)
  })

  test("normalizes and asserts SVG markup", () => {
    expect(normalizeSvgText("  <svg></svg>\n")).toBe("<svg></svg>")
    expect(assertSvgMarkup("  <svg></svg>\n", "Invalid")).toBe("<svg></svg>")
    expect(() => assertSvgMarkup("<div></div>", "Invalid")).toThrow("Invalid")
  })
})

describe("buildSvgoConfig", () => {
  test("builds the default preset with disabled inline styles", () => {
    expect(buildSvgoConfig(DEFAULT_OPTIONS)).toEqual({
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              inlineStyles: false,
            },
          },
        },
      ],
    })
  })

  test("disables unchecked preset plugins and adds removeDimensions", () => {
    expect(
      buildSvgoConfig({
        cleanupIds: false,
        convertColors: false,
        inlineStyles: true,
        multipass: false,
        removeComments: false,
        removeDimensions: true,
        removeMetadata: false,
      })
    ).toEqual({
      multipass: false,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              cleanupIds: false,
              convertColors: false,
              inlineStyles: {},
              removeComments: false,
              removeMetadata: false,
            },
          },
        },
        "removeDimensions",
      ],
    })
  })
})

describe("file and byte helpers", () => {
  test("derives optimized file names", () => {
    expect(deriveOptimizedFileName("icon.svg")).toBe("icon.optimized.svg")
    expect(deriveOptimizedFileName("icon.SVG")).toBe("icon.optimized.svg")
    expect(deriveOptimizedFileName("")).toBe("optimized.optimized.svg")
  })

  test("measures and formats byte sizes", () => {
    expect(getByteSize("abc")).toBe(3)
    expect(formatByteSize(512)).toBe("512 B")
    expect(formatByteSize(1536)).toBe("1.5 KB")
    expect(formatByteSize(2 * 1024 * 1024)).toBe("2.0 MB")
  })

  test("creates SVG blobs with the expected MIME type", () => {
    const blob = createSvgBlob("<svg></svg>")

    expect(blob.type).toBe("image/svg+xml")
    expect(blob.size).toBe(11)
  })

  test("calculates positive, zero, and negative savings", () => {
    expect(calculateMetrics("1234567890", "12345")).toMatchObject({
      optimizedBytes: 5,
      originalBytes: 10,
      savedBytes: 5,
      savedPercent: 50,
    })
    expect(calculateMetrics("", "123")).toMatchObject({
      optimizedBytes: 3,
      originalBytes: 0,
      savedBytes: -3,
      savedPercent: 0,
    })
  })
})
