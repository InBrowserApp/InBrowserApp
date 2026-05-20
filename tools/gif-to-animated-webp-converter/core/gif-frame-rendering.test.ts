import { describe, expect, test } from "vitest"

import {
  DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS,
  DEFAULT_OUTPUT_NAME,
  calculateScaledDimensions,
  clearFrameRect,
  fillCanvas,
  isGifBytes,
  isSupportedGifFile,
  normalizeFrameDelay,
  normalizeGifToAnimatedWebpOptions,
  readGifBackgroundColor,
  resolveAnimatedWebpOutputName,
  resolveGifBackgroundColor,
  resolveUniqueAnimatedWebpOutputName,
} from "./gif-frame-rendering"

describe("normalizeGifToAnimatedWebpOptions", () => {
  test("uses defaults for missing or invalid values", () => {
    expect(normalizeGifToAnimatedWebpOptions({})).toEqual(
      DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS
    )
    expect(
      normalizeGifToAnimatedWebpOptions({
        loopCount: Number.NaN,
        loopMode: "unknown" as never,
        scale: Number.POSITIVE_INFINITY,
        speed: Number.NaN,
      })
    ).toEqual(DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS)
  })

  test("rounds and clamps numeric values", () => {
    expect(
      normalizeGifToAnimatedWebpOptions({
        loopCount: 2.6,
        loopMode: "custom",
        scale: 149.4,
        speed: 1.236,
      })
    ).toEqual({
      loopCount: 3,
      loopMode: "custom",
      scale: 149,
      speed: 1.24,
    })
    expect(
      normalizeGifToAnimatedWebpOptions({
        loopCount: -2,
        scale: 1,
        speed: 0.01,
      })
    ).toMatchObject({ loopCount: 1, scale: 10, speed: 0.25 })
    expect(
      normalizeGifToAnimatedWebpOptions({
        loopCount: 2000,
        loopMode: "infinite",
        scale: 1000,
        speed: 99,
      })
    ).toEqual({
      loopCount: 1000,
      loopMode: "infinite",
      scale: 400,
      speed: 4,
    })
  })
})

describe("GIF input helpers", () => {
  test("detects GIF files by MIME type or extension", () => {
    expect(isSupportedGifFile({ name: "clip.bin", type: "image/gif" })).toBe(
      true
    )
    expect(isSupportedGifFile({ name: "clip.GIF", type: "" })).toBe(true)
    expect(isSupportedGifFile({ name: "clip.png", type: "image/png" })).toBe(
      false
    )
  })

  test("checks GIF magic bytes", () => {
    expect(isGifBytes(new Uint8Array([0x47, 0x49, 0x46, 0x38]))).toBe(true)
    expect(isGifBytes(new Uint8Array([0x47, 0x49]))).toBe(false)
    expect(isGifBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(false)
  })
})

describe("output names", () => {
  test("normalizes output names", () => {
    expect(resolveAnimatedWebpOutputName("clip.gif")).toBe("clip.webp")
    expect(resolveAnimatedWebpOutputName("clip")).toBe("clip.webp")
    expect(resolveAnimatedWebpOutputName(" folder/clip.gif ")).toBe(
      "folder_clip.webp"
    )
    expect(resolveAnimatedWebpOutputName("")).toBe(DEFAULT_OUTPUT_NAME)
  })

  test("deduplicates output names", () => {
    const nameCounts = new Map<string, number>()

    expect(resolveUniqueAnimatedWebpOutputName("clip.gif", nameCounts)).toBe(
      "clip.webp"
    )
    expect(resolveUniqueAnimatedWebpOutputName("clip.png", nameCounts)).toBe(
      "clip-2.webp"
    )
  })
})

describe("dimensions and delays", () => {
  test("scales dimensions with a one-pixel minimum", () => {
    expect(calculateScaledDimensions(640, 480, 50)).toEqual({
      height: 240,
      width: 320,
    })
    expect(calculateScaledDimensions(2, 2, 10)).toEqual({
      height: 1,
      width: 1,
    })
  })

  test("rejects invalid source dimensions", () => {
    expect(() => calculateScaledDimensions(0, 10, 100)).toThrowError(
      "INVALID_GIF"
    )
    expect(() => calculateScaledDimensions(10, Number.NaN, 100)).toThrowError(
      "INVALID_GIF"
    )
  })

  test("normalizes frame delays with speed", () => {
    expect(normalizeFrameDelay(80, 2)).toBe(40)
    expect(normalizeFrameDelay(0, 99)).toBe(25)
    expect(normalizeFrameDelay(1, 4)).toBe(10)
  })
})

describe("GIF background color", () => {
  test("reads a global background color", () => {
    const bytes = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 1, 0, 1, 0, 0x80, 1, 0, 1, 2, 3, 4, 5,
      6,
    ])

    expect(readGifBackgroundColor(bytes)).toEqual({
      a: 255,
      b: 6,
      g: 5,
      r: 4,
    })
  })

  test("falls back when the color table is missing or invalid", () => {
    expect(readGifBackgroundColor(new Uint8Array([0x47]))).toBeNull()
    expect(readGifBackgroundColor(new Uint8Array(13))).toBeNull()

    const invalidIndex = new Uint8Array(19)
    invalidIndex[10] = 0x80
    invalidIndex[11] = 3
    expect(readGifBackgroundColor(invalidIndex)).toBeNull()

    const truncated = new Uint8Array(14)
    truncated[10] = 0x80
    expect(readGifBackgroundColor(truncated)).toBeNull()
    expect(resolveGifBackgroundColor(truncated)).toEqual({
      a: 0,
      b: 0,
      g: 0,
      r: 0,
    })
  })
})

describe("canvas helpers", () => {
  test("fills and clears pixels", () => {
    const canvas = new Uint8ClampedArray(2 * 2 * 4)
    const red = { a: 255, b: 0, g: 0, r: 255 }
    const transparent = { a: 0, b: 0, g: 0, r: 0 }

    fillCanvas(canvas, transparent)
    expect(Array.from(canvas)).toEqual(Array.from(new Uint8ClampedArray(16)))

    fillCanvas(canvas, red)
    expect(canvas[0]).toBe(255)
    expect(canvas[3]).toBe(255)

    clearFrameRect(
      canvas,
      2,
      2,
      { height: 1, left: 0, top: 0, width: 1 },
      transparent
    )
    expect(Array.from(canvas.slice(0, 4))).toEqual([0, 0, 0, 0])
    expect(Array.from(canvas.slice(4, 8))).toEqual([255, 0, 0, 255])
  })
})
