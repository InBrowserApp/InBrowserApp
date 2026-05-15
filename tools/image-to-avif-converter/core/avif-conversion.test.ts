import { describe, expect, test } from "vitest"

import {
  DEFAULT_AVIF_NAME,
  DEFAULT_AVIF_OPTIONS,
  buildAvifEncodeOptions,
  calculateResizeDimensions,
  isSupportedInputImage,
  normalizeAvifOptions,
  resolveUniqueAvifOutputName,
  resolveAvifOutputName,
} from "./avif-conversion"

describe("normalizeAvifOptions", () => {
  test("uses defaults when options are omitted", () => {
    expect(normalizeAvifOptions({})).toEqual(DEFAULT_AVIF_OPTIONS)
  })

  test("rounds and clamps quality, scale, and speed values", () => {
    expect(
      normalizeAvifOptions({ quality: 82.6, scale: 149.4, speed: 3.7 })
    ).toEqual({
      lossless: false,
      quality: 83,
      scale: 149,
      speed: 4,
    })
    expect(normalizeAvifOptions({ quality: -10, scale: 1, speed: -1 })).toEqual(
      {
        lossless: false,
        quality: 0,
        scale: 10,
        speed: 0,
      }
    )
    expect(
      normalizeAvifOptions({ quality: 200, scale: 900, speed: 99 })
    ).toEqual({
      lossless: false,
      quality: 100,
      scale: 400,
      speed: 10,
    })
  })

  test("preserves lossless mode", () => {
    expect(normalizeAvifOptions({ lossless: true })).toEqual({
      ...DEFAULT_AVIF_OPTIONS,
      lossless: true,
    })
  })

  test("builds jsquash encode options", () => {
    expect(
      buildAvifEncodeOptions({
        lossless: true,
        quality: 90,
        speed: 2,
      })
    ).toEqual({
      bitDepth: 8,
      lossless: true,
      quality: 90,
      speed: 2,
    })
  })

  test("falls back when values are not finite", () => {
    expect(
      normalizeAvifOptions({
        quality: Number.NaN,
        scale: Number.POSITIVE_INFINITY,
        speed: Number.NEGATIVE_INFINITY,
      })
    ).toEqual(DEFAULT_AVIF_OPTIONS)
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

describe("resolveAvifOutputName", () => {
  test("replaces a source extension with avif", () => {
    expect(resolveAvifOutputName("photo.jpeg")).toBe("photo.avif")
  })

  test("adds avif when no source extension exists", () => {
    expect(resolveAvifOutputName("photo")).toBe("photo.avif")
  })

  test("sanitizes path separators and handles empty names", () => {
    expect(resolveAvifOutputName(" folder/photo.png ")).toBe(
      "folder_photo.avif"
    )
    expect(resolveAvifOutputName("")).toBe(DEFAULT_AVIF_NAME)
  })

  test("preserves dotfile-style names before appending avif", () => {
    expect(resolveAvifOutputName(".source")).toBe(".source.avif")
  })
})

describe("resolveUniqueAvifOutputName", () => {
  test("adds a numeric suffix for duplicate output names", () => {
    const nameCounts = new Map<string, number>()

    expect(resolveUniqueAvifOutputName("photo.png", nameCounts)).toBe(
      "photo.avif"
    )
    expect(resolveUniqueAvifOutputName("photo.jpg", nameCounts)).toBe(
      "photo-2.avif"
    )
    expect(resolveUniqueAvifOutputName("photo.gif", nameCounts)).toBe(
      "photo-3.avif"
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
