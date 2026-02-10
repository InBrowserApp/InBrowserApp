import { describe, expect, it } from 'vitest'
import { extractPalette } from './extract-palette'

function createImageData(data: Uint8ClampedArray, width: number, height: number): ImageData {
  if (typeof ImageData !== 'undefined') {
    return new ImageData(data as ImageDataArray, width, height)
  }
  return { data, width, height } as ImageData
}

describe('extractPalette', () => {
  it('extracts palette colors from image data', () => {
    const data = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255])
    const imageData = createImageData(data, 2, 1)

    const result = extractPalette(imageData, { colorCount: 2 })

    expect(result.totalPixels).toBe(2)
    expect(result.colors.length).toBe(2)
    const total = result.colors.reduce((sum, color) => sum + color.count, 0)
    expect(total).toBe(2)
  })

  it('ignores transparent pixels when enabled', () => {
    const data = new Uint8ClampedArray([0, 0, 255, 255, 255, 0, 0, 0])
    const imageData = createImageData(data, 2, 1)

    const result = extractPalette(imageData, { colorCount: 2, ignoreTransparent: true })

    expect(result.totalPixels).toBe(1)
    expect(result.colors.length).toBe(1)
  })

  it('includes transparent pixels when disabled', () => {
    const data = new Uint8ClampedArray([0, 0, 255, 255, 255, 0, 0, 0])
    const imageData = createImageData(data, 2, 1)

    const result = extractPalette(imageData, { colorCount: 2, ignoreTransparent: false })

    expect(result.totalPixels).toBe(2)
    expect(result.colors.length).toBeGreaterThan(0)
  })

  it('returns an empty result when all sampled pixels are transparent', () => {
    const data = new Uint8ClampedArray([20, 30, 40, 0, 50, 60, 70, 8])
    const imageData = createImageData(data, 2, 1)

    const result = extractPalette(imageData, {
      colorCount: 4,
      ignoreTransparent: true,
      alphaThreshold: 8,
    })

    expect(result.totalPixels).toBe(0)
    expect(result.colors).toEqual([])
  })

  it('clamps option values and keeps low alpha colors above threshold', () => {
    const data = new Uint8ClampedArray([20, 30, 40, 1, 200, 30, 40, 255, 220, 30, 40, 0])
    const imageData = createImageData(data, 3, 1)

    const result = extractPalette(imageData, {
      colorCount: 0,
      sampleStride: 0,
      ignoreTransparent: true,
      alphaThreshold: 0,
    })

    expect(result.totalPixels).toBe(2)
    expect(result.colors).toHaveLength(1)
    expect(result.colors[0]?.count).toBe(2)
  })

  it('splits red-dominant ranges when quantizing', () => {
    const data = new Uint8ClampedArray([
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
    ])
    const imageData = createImageData(data, 6, 1)

    const result = extractPalette(imageData, {
      colorCount: 2,
      sampleStride: 1,
      ignoreTransparent: false,
    })

    expect(result.totalPixels).toBe(6)
    expect(result.colors).toHaveLength(2)

    const reds = result.colors.map((color) => color.r).sort((a, b) => a - b)
    expect(reds[0]).toBeLessThan(100)
    expect(reds[1]).toBeGreaterThan(150)
  })

  it('handles sparse image channel data by falling back to zero-filled channels', () => {
    const malformedImageData = {
      data: {
        length: 4,
        0: 255,
      } as unknown as Uint8ClampedArray,
      width: 1,
      height: 1,
    } as unknown as ImageData

    const result = extractPalette(malformedImageData, {
      colorCount: 4,
      ignoreTransparent: false,
    })

    expect(result.totalPixels).toBe(1)
    expect(result.colors).toHaveLength(1)
    expect(result.colors[0]?.count).toBe(1)
  })

  it('handles heavily skewed buckets when splitting by median', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255])
    const imageData = createImageData(data, 3, 1)

    const result = extractPalette(imageData, {
      colorCount: 2,
      sampleStride: 1,
      ignoreTransparent: false,
    })

    expect(result.totalPixels).toBe(3)
    expect(result.colors).toHaveLength(2)
    expect(result.colors.map((color) => color.count).sort((a, b) => a - b)).toEqual([1, 2])
  })

  it('keeps stable output when all samples quantize to one bucket', () => {
    const data = new Uint8ClampedArray([120, 120, 120, 255, 121, 121, 121, 255])
    const imageData = createImageData(data, 2, 1)

    const result = extractPalette(imageData, {
      colorCount: 8,
      sampleStride: 1,
      ignoreTransparent: false,
    })

    expect(result.totalPixels).toBe(2)
    expect(result.colors).toHaveLength(1)
    expect(result.colors[0]?.count).toBe(2)
  })

  it('supports single-color inputs even when requesting many colors', () => {
    const data = new Uint8ClampedArray([120, 64, 32, 255])
    const imageData = createImageData(data, 1, 1)

    const result = extractPalette(imageData, {
      colorCount: 16,
      ignoreTransparent: false,
    })

    expect(result.totalPixels).toBe(1)
    expect(result.colors).toHaveLength(1)
    expect(result.colors[0]?.count).toBe(1)
  })
})
