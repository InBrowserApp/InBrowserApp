import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateOutputDimensions, imageResizeAlgorithms, resizeImage } from './resize-image'
import type { ResizeOptions } from '../types'

const originalToBlob = HTMLCanvasElement.prototype.toBlob

class MockBitmap {
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  close() {
    return undefined
  }
}

describe('calculateOutputDimensions', () => {
  it('keeps aspect ratio when requested', () => {
    const result = calculateOutputDimensions(
      { width: 4000, height: 2000 },
      {
        width: 1000,
        height: 1000,
        keepAspectRatio: true,
        allowUpscale: true,
      },
    )

    expect(result).toEqual({ width: 1000, height: 500 })
  })

  it('uses exact dimensions when aspect ratio is disabled', () => {
    const result = calculateOutputDimensions(
      { width: 1200, height: 800 },
      {
        width: 600,
        height: 333,
        keepAspectRatio: false,
        allowUpscale: true,
      },
    )

    expect(result).toEqual({ width: 600, height: 333 })
  })

  it('prevents upscaling when disabled', () => {
    const result = calculateOutputDimensions(
      { width: 1200, height: 800 },
      {
        width: 2400,
        height: 1600,
        keepAspectRatio: true,
        allowUpscale: false,
      },
    )

    expect(result).toEqual({ width: 1200, height: 800 })
  })
})

describe('resizeImage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => new MockBitmap(40, 20)),
    )

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
      drawImage: vi.fn(),
      getImageData: vi.fn(() => new ImageData(40, 20)),
      createImageData: vi.fn((width: number, height: number) => new ImageData(width, height)),
      putImageData: vi.fn(),
    } as unknown as CanvasRenderingContext2D)

    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback: BlobCallback) => {
      callback(new Blob(['resized'], { type: 'image/jpeg' }))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()

    if (originalToBlob) {
      HTMLCanvasElement.prototype.toBlob = originalToBlob
    }
  })

  it('resizes image using browser-high algorithm', async () => {
    const file = new File(['image'], 'sample.png', { type: 'image/png' })

    const options: ResizeOptions = {
      width: 20,
      height: 20,
      keepAspectRatio: true,
      allowUpscale: true,
      algorithm: 'browser-high',
      outputFormat: 'jpeg',
      quality: 80,
    }

    const result = await resizeImage(file, options)

    expect(result.outputWidth).toBe(20)
    expect(result.outputHeight).toBe(10)
    expect(result.outputName).toBe('sample.jpg')
    expect(result.mimeType).toBe('image/jpeg')
    expect(result.blob.type).toBe('image/jpeg')
  })

  it('throws when canvas context is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValueOnce(null)

    const file = new File(['image'], 'sample.png', { type: 'image/png' })

    const options: ResizeOptions = {
      width: 20,
      height: 20,
      keepAspectRatio: false,
      allowUpscale: true,
      algorithm: 'nearest',
      outputFormat: 'png',
      quality: 80,
    }

    await expect(resizeImage(file, options)).rejects.toThrow('CANVAS_CONTEXT_UNAVAILABLE')
  })

  it('supports explicit algorithm list metadata', () => {
    expect(imageResizeAlgorithms.map((item) => item.value)).toEqual([
      'browser-high',
      'bicubic',
      'bilinear',
      'lanczos3',
      'nearest',
    ])
  })
})
