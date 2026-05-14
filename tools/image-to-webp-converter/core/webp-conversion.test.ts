import { describe, expect, test } from "vitest"

import {
  DEFAULT_WEBP_NAME,
  DEFAULT_WEBP_OPTIONS,
  calculateResizeDimensions,
  isSupportedInputImage,
  normalizeWebpOptions,
  resolveUniqueWebpOutputName,
  resolveWebpOutputName,
} from "./webp-conversion"

describe("normalizeWebpOptions", () => {
  test("uses defaults when options are omitted", () => {
    expect(normalizeWebpOptions({})).toEqual(DEFAULT_WEBP_OPTIONS)
  })

  test("rounds and clamps quality and scale values", () => {
    expect(normalizeWebpOptions({ quality: 82.6, scale: 149.4 })).toEqual({
      quality: 83,
      scale: 149,
    })
    expect(normalizeWebpOptions({ quality: -10, scale: 1 })).toEqual({
      quality: 1,
      scale: 10,
    })
    expect(normalizeWebpOptions({ quality: 200, scale: 900 })).toEqual({
      quality: 100,
      scale: 400,
    })
  })

  test("falls back when values are not finite", () => {
    expect(
      normalizeWebpOptions({
        quality: Number.NaN,
        scale: Number.POSITIVE_INFINITY,
      })
    ).toEqual(DEFAULT_WEBP_OPTIONS)
  })
})

describe("isSupportedInputImage", () => {
  test("accepts browser-provided image MIME types", () => {
    expect(
      isSupportedInputImage({
        name: "photo.unknown",
        type: "image/jpeg",
      })
    ).toBe(true)
  })

  test("falls back to known image extensions", () => {
    expect(
      isSupportedInputImage({
        name: "illustration.svgz",
        type: "",
      })
    ).toBe(true)
  })

  test("rejects unsupported files", () => {
    expect(
      isSupportedInputImage({
        name: "notes.txt",
        type: "text/plain",
      })
    ).toBe(false)
    expect(
      isSupportedInputImage({
        name: "README.",
        type: "",
      })
    ).toBe(false)
  })
})

describe("resolveWebpOutputName", () => {
  test("replaces a source extension with webp", () => {
    expect(resolveWebpOutputName("photo.jpeg")).toBe("photo.webp")
  })

  test("adds webp when no source extension exists", () => {
    expect(resolveWebpOutputName("photo")).toBe("photo.webp")
  })

  test("sanitizes path separators and handles empty names", () => {
    expect(resolveWebpOutputName(" folder/photo.png ")).toBe(
      "folder_photo.webp"
    )
    expect(resolveWebpOutputName("")).toBe(DEFAULT_WEBP_NAME)
  })

  test("preserves dotfile-style names before appending webp", () => {
    expect(resolveWebpOutputName(".source")).toBe(".source.webp")
  })
})

describe("resolveUniqueWebpOutputName", () => {
  test("adds a numeric suffix for duplicate output names", () => {
    const nameCounts = new Map<string, number>()

    expect(resolveUniqueWebpOutputName("photo.png", nameCounts)).toBe(
      "photo.webp"
    )
    expect(resolveUniqueWebpOutputName("photo.jpg", nameCounts)).toBe(
      "photo-2.webp"
    )
    expect(resolveUniqueWebpOutputName("photo.gif", nameCounts)).toBe(
      "photo-3.webp"
    )
  })
})

describe("calculateResizeDimensions", () => {
  test("scales image dimensions and keeps at least one output pixel", () => {
    expect(calculateResizeDimensions(800, 600, 50)).toEqual({
      height: 300,
      width: 400,
    })
    expect(calculateResizeDimensions(2, 2, 10)).toEqual({
      height: 1,
      width: 1,
    })
  })

  test("clamps invalid scale through option normalization", () => {
    expect(calculateResizeDimensions(100, 50, 1000)).toEqual({
      height: 200,
      width: 400,
    })
  })

  test("rejects invalid source dimensions", () => {
    expect(() => calculateResizeDimensions(0, 20, 100)).toThrowError(
      "INVALID_IMAGE"
    )
    expect(() => calculateResizeDimensions(20, Number.NaN, 100)).toThrowError(
      "INVALID_IMAGE"
    )
  })
})
