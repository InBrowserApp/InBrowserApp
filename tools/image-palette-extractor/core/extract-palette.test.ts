import { describe, expect, it } from "vitest"

import { extractPalette } from "./extract-palette"
import { quantizeHistogram } from "./median-cut"

function createImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number
) {
  if (typeof ImageData !== "undefined") {
    return new ImageData(data as ImageDataArray, width, height)
  }

  return { data, width, height } as ImageData
}

describe("extractPalette", () => {
  it("extracts dominant colors from image data", () => {
    const imageData = createImageData(
      Uint8ClampedArray.from([
        255, 0, 0, 255, 255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
      ]),
      4,
      1
    )

    const result = extractPalette(imageData, { colorCount: 3 })

    expect(result.totalPixels).toBe(4)
    expect(result.colors.length).toBeGreaterThan(1)
    expect(result.colors.reduce((sum, color) => sum + color.count, 0)).toBe(4)
    expect(result.colors[0]?.count).toBeGreaterThanOrEqual(2)
  })

  it("ignores transparent pixels by default", () => {
    const imageData = createImageData(
      Uint8ClampedArray.from([0, 0, 255, 255, 255, 0, 0, 0]),
      2,
      1
    )

    const result = extractPalette(imageData, { colorCount: 2 })

    expect(result.totalPixels).toBe(1)
    expect(result.colors).toHaveLength(1)
  })

  it("includes transparent pixels when filtering is disabled", () => {
    const imageData = createImageData(
      Uint8ClampedArray.from([0, 0, 255, 255, 255, 0, 0, 0]),
      2,
      1
    )

    const result = extractPalette(imageData, {
      colorCount: 2,
      ignoreTransparent: false,
    })

    expect(result.totalPixels).toBe(2)
    expect(result.colors.length).toBeGreaterThan(0)
  })

  it("returns an empty palette when every sampled pixel is transparent", () => {
    const imageData = createImageData(
      Uint8ClampedArray.from([20, 30, 40, 0, 50, 60, 70, 8]),
      2,
      1
    )

    const result = extractPalette(imageData, {
      alphaThreshold: 8,
      colorCount: 4,
      ignoreTransparent: true,
    })

    expect(result).toEqual({ colors: [], totalPixels: 0 })
  })

  it("clamps option values and keeps alpha above threshold zero", () => {
    const imageData = createImageData(
      Uint8ClampedArray.from([20, 30, 40, 1, 200, 30, 40, 255, 220, 30, 40, 0]),
      3,
      1
    )

    const result = extractPalette(imageData, {
      alphaThreshold: 0,
      colorCount: 0,
      ignoreTransparent: true,
      sampleStride: 0,
    })

    expect(result.totalPixels).toBe(2)
    expect(result.colors).toHaveLength(1)
    expect(result.colors[0]?.count).toBe(2)
  })

  it("uses sample stride when building the histogram", () => {
    const imageData = createImageData(
      Uint8ClampedArray.from([
        255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255,
      ]),
      4,
      1
    )

    const result = extractPalette(imageData, {
      colorCount: 4,
      ignoreTransparent: false,
      sampleStride: 2,
    })

    expect(result.totalPixels).toBe(2)
  })

  it("splits red, green, and blue dominant ranges", () => {
    const red = createImageData(
      Uint8ClampedArray.from([
        0, 0, 0, 255, 0, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
      ]),
      4,
      1
    )
    const green = createImageData(
      Uint8ClampedArray.from([
        0, 0, 0, 255, 0, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255,
      ]),
      4,
      1
    )
    const blue = createImageData(
      Uint8ClampedArray.from([
        0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 255, 255, 0, 0, 255, 255,
      ]),
      4,
      1
    )

    expect(
      extractPalette(red, { colorCount: 2, ignoreTransparent: false }).colors
    ).toHaveLength(2)
    expect(
      extractPalette(green, { colorCount: 2, ignoreTransparent: false }).colors
    ).toHaveLength(2)
    expect(
      extractPalette(blue, { colorCount: 2, ignoreTransparent: false }).colors
    ).toHaveLength(2)
  })

  it("keeps stable output for single-bucket and sparse channel data", () => {
    const singleBucket = createImageData(
      Uint8ClampedArray.from([120, 120, 120, 255, 121, 121, 121, 255]),
      2,
      1
    )
    const sparse = {
      data: {
        length: 4,
      } as unknown as Uint8ClampedArray,
      height: 1,
      width: 1,
    } as ImageData

    expect(
      extractPalette(singleBucket, {
        colorCount: 8,
        ignoreTransparent: false,
      }).colors
    ).toHaveLength(1)
    expect(
      extractPalette(
        createImageData(Uint8ClampedArray.from([120, 64, 32, 255]), 1, 1),
        {
          colorCount: 8,
          ignoreTransparent: false,
        }
      ).colors
    ).toHaveLength(1)
    expect(
      extractPalette(sparse, {
        colorCount: 4,
        ignoreTransparent: false,
      }).colors[0]?.count
    ).toBe(1)
  })

  it("handles empty histograms and skewed median cuts", () => {
    expect(quantizeHistogram(new Uint32Array(1 << 15), 4)).toEqual([])

    const skewed = createImageData(
      Uint8ClampedArray.from([
        0, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
      ]),
      4,
      1
    )
    const result = extractPalette(skewed, {
      colorCount: 2,
      ignoreTransparent: false,
    })

    expect(
      result.colors.map((color) => color.count).sort((a, b) => a - b)
    ).toEqual([1, 3])
  })
})
