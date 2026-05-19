import { describe, expect, test } from "vitest"

import {
  backgroundRadiusToPixels,
  blobToUint8,
  clampBackgroundRadius,
  RASTER_MIME_TYPE,
} from "./render-bitmap"

describe("clampBackgroundRadius", () => {
  test("returns 0 for non-finite input", () => {
    expect(clampBackgroundRadius(Number.NaN)).toBe(0)
    expect(clampBackgroundRadius(Number.POSITIVE_INFINITY)).toBe(0)
  })

  test("clamps negative values to 0", () => {
    expect(clampBackgroundRadius(-10)).toBe(0)
  })

  test("clamps values above 100 to 100", () => {
    expect(clampBackgroundRadius(150)).toBe(100)
  })

  test("passes through values in [0, 100]", () => {
    expect(clampBackgroundRadius(0)).toBe(0)
    expect(clampBackgroundRadius(50)).toBe(50)
    expect(clampBackgroundRadius(100)).toBe(100)
  })
})

describe("backgroundRadiusToPixels", () => {
  test("converts a percentage radius to pixel inset given a size", () => {
    expect(backgroundRadiusToPixels(0, 100)).toBe(0)
    expect(backgroundRadiusToPixels(50, 100)).toBe(25)
    expect(backgroundRadiusToPixels(100, 100)).toBe(50)
  })

  test("respects clamping for out-of-range values", () => {
    expect(backgroundRadiusToPixels(-10, 200)).toBe(0)
    expect(backgroundRadiusToPixels(150, 200)).toBe(100)
  })
})

describe("blobToUint8", () => {
  test("converts a Blob to a Uint8Array preserving bytes", async () => {
    const source = new Uint8Array([1, 2, 3, 4])
    const blob = new Blob([source])
    const result = await blobToUint8(blob)
    expect(Array.from(result)).toEqual([1, 2, 3, 4])
  })
})

describe("RASTER_MIME_TYPE", () => {
  test("targets the PNG mime", () => {
    expect(RASTER_MIME_TYPE).toBe("image/png")
  })
})
