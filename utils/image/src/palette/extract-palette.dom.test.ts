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
