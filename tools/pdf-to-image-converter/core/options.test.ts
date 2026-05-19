import { describe, expect, test } from "vitest"

import {
  DEFAULT_DPI,
  DEFAULT_QUALITY,
  DEFAULT_RENDER_OPTIONS,
  MAX_DPI,
  MAX_QUALITY,
  MIN_DPI,
  MIN_QUALITY,
  clampDpi,
  clampQuality,
  dpiToScale,
  getExtension,
  getMimeType,
  isImageFormat,
  normalizeRenderOptions,
  shouldUseQuality,
} from "./options"

describe("PDF to image options", () => {
  test("recognizes supported output formats", () => {
    expect(isImageFormat("png")).toBe(true)
    expect(isImageFormat("jpeg")).toBe(true)
    expect(isImageFormat("webp")).toBe(true)
    expect(isImageFormat("gif")).toBe(false)
  })

  test("maps formats to MIME types and file extensions", () => {
    expect(getMimeType("png")).toBe("image/png")
    expect(getMimeType("jpeg")).toBe("image/jpeg")
    expect(getMimeType("webp")).toBe("image/webp")
    expect(getExtension("png")).toBe("png")
    expect(getExtension("jpeg")).toBe("jpg")
    expect(getExtension("webp")).toBe("webp")
  })

  test("clamps DPI to the supported render range", () => {
    expect(clampDpi(Number.NaN)).toBe(DEFAULT_DPI)
    expect(clampDpi(MIN_DPI - 20)).toBe(MIN_DPI)
    expect(clampDpi(MAX_DPI + 20)).toBe(MAX_DPI)
    expect(clampDpi(143.6)).toBe(144)
    expect(dpiToScale(144)).toBe(2)
  })

  test("clamps quality only for lossy formats", () => {
    expect(shouldUseQuality("png")).toBe(false)
    expect(shouldUseQuality("jpeg")).toBe(true)
    expect(shouldUseQuality("webp")).toBe(true)
    expect(clampQuality(Number.NaN)).toBe(DEFAULT_QUALITY)
    expect(clampQuality(MIN_QUALITY - 1)).toBe(MIN_QUALITY)
    expect(clampQuality(MAX_QUALITY + 1)).toBe(MAX_QUALITY)
    expect(clampQuality(0.73)).toBe(0.73)
  })

  test("normalizes partial render options", () => {
    expect(normalizeRenderOptions()).toEqual(DEFAULT_RENDER_OPTIONS)
    expect(
      normalizeRenderOptions({
        dpi: 1000,
        format: "jpeg",
        quality: 0.5,
      })
    ).toEqual({
      dpi: MAX_DPI,
      format: "jpeg",
      quality: 0.5,
    })
    expect(
      normalizeRenderOptions({
        format: "webp",
      })
    ).toEqual({
      dpi: DEFAULT_DPI,
      format: "webp",
      quality: DEFAULT_QUALITY,
    })
    expect(
      normalizeRenderOptions({
        dpi: 300,
        format: "png",
        quality: 0.2,
      })
    ).toEqual({
      dpi: 300,
      format: "png",
      quality: DEFAULT_QUALITY,
    })
    expect(
      normalizeRenderOptions({
        format: "invalid" as "png",
      })
    ).toEqual(DEFAULT_RENDER_OPTIONS)
  })
})
