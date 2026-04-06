import { describe, expect, test } from "vitest"

import {
  calculateOutputDimensions,
  clampDimension,
  replaceFileExtension,
  resolveOutputMimeType,
} from "./resize-image"

import type { ImageDimensions, ResizeOptions } from "./resize-image"

const baseOptions: ResizeOptions = {
  width: 800,
  height: 600,
  keepAspectRatio: true,
  allowUpscale: false,
  algorithm: "high-quality",
  outputFormat: "auto",
  quality: 92,
}

function dims(width: number, height: number): ImageDimensions {
  return { width, height }
}

describe("clampDimension", () => {
  test("returns value when valid", () => {
    expect(clampDimension(100)).toBe(100)
  })

  test("rounds to nearest integer", () => {
    expect(clampDimension(99.6)).toBe(100)
    expect(clampDimension(99.4)).toBe(99)
  })

  test("clamps zero to 1", () => {
    expect(clampDimension(0)).toBe(1)
  })

  test("clamps negative to 1", () => {
    expect(clampDimension(-50)).toBe(1)
  })

  test("clamps NaN to 1", () => {
    expect(clampDimension(NaN)).toBe(1)
  })
})

describe("resolveOutputMimeType", () => {
  test("returns image/png for png format", () => {
    expect(resolveOutputMimeType("image/jpeg", "png")).toBe("image/png")
  })

  test("returns image/jpeg for jpeg format", () => {
    expect(resolveOutputMimeType("image/png", "jpeg")).toBe("image/jpeg")
  })

  test("returns image/webp for webp format", () => {
    expect(resolveOutputMimeType("image/png", "webp")).toBe("image/webp")
  })

  test("returns source type for auto when supported", () => {
    expect(resolveOutputMimeType("image/jpeg", "auto")).toBe("image/jpeg")
    expect(resolveOutputMimeType("image/png", "auto")).toBe("image/png")
    expect(resolveOutputMimeType("image/webp", "auto")).toBe("image/webp")
  })

  test("defaults to image/png for auto with unsupported type", () => {
    expect(resolveOutputMimeType("image/bmp", "auto")).toBe("image/png")
    expect(resolveOutputMimeType("image/gif", "auto")).toBe("image/png")
  })
})

describe("replaceFileExtension", () => {
  test("replaces extension for jpeg", () => {
    expect(replaceFileExtension("photo.png", "image/jpeg")).toBe("photo.jpg")
  })

  test("replaces extension for webp", () => {
    expect(replaceFileExtension("photo.png", "image/webp")).toBe("photo.webp")
  })

  test("replaces extension for png", () => {
    expect(replaceFileExtension("photo.jpg", "image/png")).toBe("photo.png")
  })

  test("handles filename without extension", () => {
    expect(replaceFileExtension("photo", "image/png")).toBe("photo.png")
  })

  test("handles empty filename", () => {
    expect(replaceFileExtension("", "image/png")).toBe("image.png")
  })

  test("handles multiple dots in filename", () => {
    expect(replaceFileExtension("my.photo.v2.png", "image/jpeg")).toBe(
      "my.photo.v2.jpg"
    )
  })
})

describe("calculateOutputDimensions", () => {
  test("downscales keeping aspect ratio", () => {
    const result = calculateOutputDimensions(dims(1920, 1080), {
      ...baseOptions,
      width: 960,
      height: 540,
    })
    expect(result).toEqual({ width: 960, height: 540 })
  })

  test("clamps to source size when upscale disabled", () => {
    const result = calculateOutputDimensions(dims(400, 300), {
      ...baseOptions,
      width: 800,
      height: 600,
    })
    expect(result.width).toBeLessThanOrEqual(400)
    expect(result.height).toBeLessThanOrEqual(300)
  })

  test("allows upscale when enabled", () => {
    const result = calculateOutputDimensions(dims(400, 300), {
      ...baseOptions,
      width: 800,
      height: 600,
      allowUpscale: true,
    })
    expect(result.width).toBe(800)
    expect(result.height).toBe(600)
  })

  test("respects aspect ratio with landscape source", () => {
    const result = calculateOutputDimensions(dims(1920, 1080), {
      ...baseOptions,
      width: 500,
      height: 500,
      allowUpscale: true,
    })
    expect(result.width).toBe(500)
    expect(result.height).toBe(281)
  })

  test("respects aspect ratio with portrait source", () => {
    const result = calculateOutputDimensions(dims(1080, 1920), {
      ...baseOptions,
      width: 500,
      height: 500,
      allowUpscale: true,
    })
    expect(result.height).toBe(500)
    expect(result.width).toBe(281)
  })

  test("no aspect ratio: uses exact dimensions", () => {
    const result = calculateOutputDimensions(dims(1920, 1080), {
      ...baseOptions,
      width: 300,
      height: 200,
      keepAspectRatio: false,
    })
    expect(result).toEqual({ width: 300, height: 200 })
  })

  test("no aspect ratio: clamps to source when no upscale", () => {
    const result = calculateOutputDimensions(dims(400, 300), {
      ...baseOptions,
      width: 800,
      height: 600,
      keepAspectRatio: false,
    })
    expect(result).toEqual({ width: 400, height: 300 })
  })

  test("no aspect ratio: allows upscale when enabled", () => {
    const result = calculateOutputDimensions(dims(400, 300), {
      ...baseOptions,
      width: 800,
      height: 600,
      keepAspectRatio: false,
      allowUpscale: true,
    })
    expect(result).toEqual({ width: 800, height: 600 })
  })

  test("clamps zero dimensions to 1", () => {
    const result = calculateOutputDimensions(dims(100, 100), {
      ...baseOptions,
      width: 0,
      height: 0,
      allowUpscale: true,
    })
    expect(result.width).toBeGreaterThanOrEqual(1)
    expect(result.height).toBeGreaterThanOrEqual(1)
  })

  test("height-constrained aspect ratio", () => {
    const result = calculateOutputDimensions(dims(1000, 2000), {
      ...baseOptions,
      width: 1000,
      height: 500,
      allowUpscale: true,
    })
    expect(result.height).toBe(500)
    expect(result.width).toBe(250)
  })
})
