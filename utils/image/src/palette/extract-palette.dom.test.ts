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
})
