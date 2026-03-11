import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CropRect, ExportOptions, ImageSource } from '../types'

const { loadImageElementMock } = vi.hoisted(() => ({
  loadImageElementMock: vi.fn(),
}))

vi.mock('./load-image', () => ({
  loadImageElement: (...args: unknown[]) => loadImageElementMock(...args),
}))

import { cropImage, isLossyOutputFormat } from './crop-image'

type FakeCanvasContext = {
  fillStyle: string
  fillRect: ReturnType<typeof vi.fn>
  clearRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
}

type FakeCanvas = {
  width: number
  height: number
  getContext: ReturnType<typeof vi.fn>
  toBlob: ReturnType<typeof vi.fn>
}

const originalCreateElement = document.createElement.bind(document)

let context: FakeCanvasContext
let canvas: FakeCanvas

const source: ImageSource = {
  file: new File(['image'], 'avatar.png', { type: 'image/png' }),
  width: 1000,
  height: 800,
  mimeType: 'image/png',
  extension: 'png',
  hasAlpha: true,
}

const cropRect: CropRect = {
  x: 0.1,
  y: 0.2,
  width: 0.5,
  height: 0.25,
}

const exportOptions: ExportOptions = {
  format: 'original',
  quality: 92,
  background: '#ffffff',
  targetWidth: null,
  targetHeight: null,
}

beforeEach(() => {
  context = {
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    drawImage: vi.fn(),
  }

  canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob: vi.fn((callback: BlobCallback, type?: string, quality?: number) => {
      void quality
      callback(new Blob(['cropped'], { type: type ?? 'image/png' }))
    }),
  }

  loadImageElementMock.mockReset()
  loadImageElementMock.mockResolvedValue({ width: 1000, height: 800 })
  vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
    if (tagName === 'canvas') {
      return canvas as unknown as HTMLCanvasElement
    }

    return originalCreateElement(tagName)
  }) as typeof document.createElement)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('crop-image', () => {
  it('detects lossy output formats', () => {
    expect(isLossyOutputFormat('image/png', 'original')).toBe(false)
    expect(isLossyOutputFormat('image/jpeg', 'original')).toBe(true)
    expect(isLossyOutputFormat('image/png', 'jpeg')).toBe(true)
    expect(isLossyOutputFormat('image/png', 'webp')).toBe(true)
  })

  it('crops images with the original png output format', async () => {
    const result = await cropImage(source, cropRect, exportOptions)

    expect(loadImageElementMock).toHaveBeenCalledWith(source.file)
    expect(canvas.width).toBe(500)
    expect(canvas.height).toBe(200)
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 500, 200)
    expect(context.fillRect).not.toHaveBeenCalled()
    expect(context.drawImage).toHaveBeenCalledWith(
      { width: 1000, height: 800 },
      100,
      160,
      500,
      200,
      0,
      0,
      500,
      200,
    )
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', undefined)
    expect(result).toMatchObject({
      outputName: 'avatar.cropped.png',
      outputWidth: 500,
      outputHeight: 200,
      outputMimeType: 'image/png',
      cropWidth: 500,
      cropHeight: 200,
    })
    expect(result.blob.type).toBe('image/png')
  })

  it('fills the jpeg background and respects export sizing and quality', async () => {
    const result = await cropImage(source, cropRect, {
      ...exportOptions,
      format: 'jpeg',
      quality: 80,
      background: '#123456',
      targetWidth: 300,
      targetHeight: 120,
    })

    expect(canvas.width).toBe(300)
    expect(canvas.height).toBe(120)
    expect(context.fillStyle).toBe('#123456')
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 300, 120)
    expect(context.clearRect).not.toHaveBeenCalled()
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8)
    expect(result.outputName).toBe('avatar.cropped.jpg')
    expect(result.outputMimeType).toBe('image/jpeg')
    expect(result.outputWidth).toBe(300)
    expect(result.outputHeight).toBe(120)
  })

  it('supports explicit png and webp exports', async () => {
    const pngResult = await cropImage(
      {
        ...source,
        file: new File(['image'], '.jpeg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
        extension: 'jpeg',
        hasAlpha: false,
      },
      cropRect,
      {
        ...exportOptions,
        format: 'png',
      },
    )

    expect(pngResult.outputMimeType).toBe('image/png')
    expect(pngResult.outputName).toBe('image.cropped.png')

    const webpResult = await cropImage(source, cropRect, {
      ...exportOptions,
      format: 'webp',
      quality: 70,
    })

    expect(canvas.toBlob).toHaveBeenLastCalledWith(expect.any(Function), 'image/webp', 0.7)
    expect(webpResult.outputMimeType).toBe('image/webp')
    expect(webpResult.outputName).toBe('avatar.cropped.webp')
  })

  it('falls back to png when the original mime type is not a supported export type', async () => {
    const unsupportedSource: ImageSource = {
      ...source,
      file: new File(['image'], 'animation.gif', { type: 'image/gif' }),
      mimeType: 'image/gif',
      extension: 'gif',
      hasAlpha: true,
    }

    const result = await cropImage(unsupportedSource, cropRect, exportOptions)
    expect(result.outputMimeType).toBe('image/png')
    expect(result.outputName).toBe('animation.cropped.png')
  })

  it('throws when the output is larger than browser-safe limits', async () => {
    await expect(
      cropImage(source, cropRect, {
        ...exportOptions,
        targetWidth: 20_000,
        targetHeight: 20,
      }),
    ).rejects.toThrow('OUTPUT_TOO_LARGE')

    expect(loadImageElementMock).not.toHaveBeenCalled()
  })

  it('throws when the canvas context is unavailable', async () => {
    canvas.getContext.mockReturnValueOnce(null)

    await expect(cropImage(source, cropRect, exportOptions)).rejects.toThrow('CANVAS_UNAVAILABLE')
  })

  it('throws when the export blob cannot be created', async () => {
    canvas.toBlob.mockImplementationOnce((callback: BlobCallback) => {
      callback(null)
    })

    await expect(cropImage(source, cropRect, exportOptions)).rejects.toThrow('EXPORT_FAILED')
  })
})
