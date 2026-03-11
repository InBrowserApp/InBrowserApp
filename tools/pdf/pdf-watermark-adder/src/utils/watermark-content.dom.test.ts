import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isSupportedWatermarkImageFile,
  normalizeTextLines,
  normalizeWatermarkImageFile,
} from './watermark-content'

type BitmapLike = {
  width: number
  height: number
  close?: () => void
}

type CanvasContextStub = {
  clearRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
}

const originalCreateElement = document.createElement.bind(document)
const originalImage = globalThis.Image
const originalCreateImageBitmap = globalThis.createImageBitmap
const globalWithImageBitmap = globalThis as typeof globalThis & {
  createImageBitmap?: typeof createImageBitmap
}

const installCanvas = ({
  blob = new Blob(['png'], { type: 'image/png' }),
  context = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
  },
}: {
  blob?: Blob | null
  context?: CanvasContextStub | null
}) => {
  const getContext = vi.fn(() => context)
  const toBlob = vi.fn((callback: BlobCallback) => callback(blob))

  vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
    if (tagName === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext,
        toBlob,
      } as unknown as HTMLCanvasElement
    }

    return originalCreateElement(tagName)
  }) as typeof document.createElement)

  return {
    getContext,
    toBlob,
    clearRect: context?.clearRect,
    drawImage: context?.drawImage,
  }
}

const installImageClass = ({
  naturalWidth = 32,
  naturalHeight = 24,
  shouldLoad = true,
}: {
  naturalWidth?: number
  naturalHeight?: number
  shouldLoad?: boolean
}) => {
  class MockImage {
    onload: null | (() => void) = null
    onerror: null | (() => void) = null
    naturalWidth = naturalWidth
    naturalHeight = naturalHeight

    set src(_value: string) {
      queueMicrotask(() => {
        if (shouldLoad) {
          this.onload?.()
          return
        }

        this.onerror?.()
      })
    }
  }

  globalThis.Image = MockImage as unknown as typeof Image
}

const setCreateImageBitmap = (implementation?: (file: File) => Promise<BitmapLike>) => {
  if (!implementation) {
    Reflect.deleteProperty(globalWithImageBitmap, 'createImageBitmap')
    return
  }

  globalWithImageBitmap.createImageBitmap = vi.fn(
    implementation,
  ) as unknown as typeof createImageBitmap
}

afterEach(() => {
  vi.restoreAllMocks()

  if (originalCreateImageBitmap) {
    globalThis.createImageBitmap = originalCreateImageBitmap
  } else {
    Reflect.deleteProperty(globalWithImageBitmap, 'createImageBitmap')
  }

  globalThis.Image = originalImage
})

describe('watermark-content', () => {
  it('normalizes multiline text input', () => {
    expect(normalizeTextLines(['  A', 'B  ', 'C', '', ''].join('\n'))).toEqual([
      'A',
      'B',
      'C',
      '',
      '',
    ])
    expect(normalizeTextLines(['   ', ''].join('\n'))).toEqual([])
  })

  it('accepts browser-readable image files and rejects unrelated files', () => {
    expect(
      isSupportedWatermarkImageFile(new File(['img'], 'seal.webp', { type: 'image/webp' })),
    ).toBe(true)
    expect(isSupportedWatermarkImageFile(new File(['img'], 'seal.svg', { type: '' }))).toBe(true)
    expect(
      isSupportedWatermarkImageFile(new File(['txt'], 'notes.txt', { type: 'text/plain' })),
    ).toBe(false)
  })

  it('returns PNG and JPEG files without conversion', async () => {
    const pngFile = new File(['png'], 'logo.png', { type: 'image/png' })
    const jpegFile = new File(['jpg'], 'photo.jpg', { type: 'image/jpeg' })

    await expect(normalizeWatermarkImageFile(pngFile)).resolves.toBe(pngFile)
    await expect(normalizeWatermarkImageFile(jpegFile)).resolves.toBe(jpegFile)
  })

  it('converts unsupported image formats with createImageBitmap and closes the bitmap', async () => {
    const close = vi.fn()
    setCreateImageBitmap(async () => ({
      width: 48,
      height: 20,
      close,
    }))
    const canvas = installCanvas({})

    const result = await normalizeWatermarkImageFile(
      new File(['gif'], 'badge.gif', { type: 'image/gif' }),
    )

    expect(result.name).toBe('badge.png')
    expect(result.type).toBe('image/png')
    expect(canvas.clearRect).toHaveBeenCalledWith(0, 0, 48, 20)
    expect(canvas.drawImage).toHaveBeenCalled()
    expect(close).toHaveBeenCalledOnce()
  })

  it('falls back to an HTMLImageElement when createImageBitmap rejects', async () => {
    setCreateImageBitmap(async () => {
      throw new Error('bitmap-failed')
    })
    installImageClass({ naturalWidth: 60, naturalHeight: 30 })
    const canvas = installCanvas({})
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:image')
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    const result = await normalizeWatermarkImageFile(
      new File(['svg'], 'diagram.svg', { type: 'image/svg+xml' }),
    )

    expect(result.name).toBe('diagram.png')
    expect(createObjectUrlSpy).toHaveBeenCalledOnce()
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:image')
    expect(canvas.drawImage).toHaveBeenCalled()
  })

  it('uses a fallback file name when conversion removes the original extension', async () => {
    setCreateImageBitmap(async () => ({ width: 24, height: 24 }))
    installCanvas({})

    const result = await normalizeWatermarkImageFile(
      new File(['gif'], '   ', { type: 'image/gif' }),
    )

    expect(result.name).toBe('watermark.png')
  })

  it('rejects when the browser cannot load the image for fallback conversion', async () => {
    setCreateImageBitmap(async () => {
      throw new Error('bitmap-failed')
    })
    installImageClass({ shouldLoad: false })
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:image')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    await expect(
      normalizeWatermarkImageFile(new File(['svg'], 'diagram.svg', { type: 'image/svg+xml' })),
    ).rejects.toThrow('watermark-image-load-failed')
  })

  it('rejects when the decoded image dimensions are invalid', async () => {
    const close = vi.fn()
    setCreateImageBitmap(async () => ({ width: 0, height: 16, close }))

    await expect(
      normalizeWatermarkImageFile(new File(['gif'], 'badge.gif', { type: 'image/gif' })),
    ).rejects.toThrow('watermark-image-invalid-dimensions')
    expect(close).toHaveBeenCalledOnce()
  })

  it('rejects when the canvas context is unavailable', async () => {
    setCreateImageBitmap(async () => ({ width: 16, height: 16 }))
    installCanvas({ context: null })

    await expect(
      normalizeWatermarkImageFile(new File(['gif'], 'badge.gif', { type: 'image/gif' })),
    ).rejects.toThrow('watermark-image-context-unavailable')
  })

  it('rejects when the converted image blob cannot be created', async () => {
    setCreateImageBitmap(async () => ({ width: 16, height: 16 }))
    installCanvas({ blob: null })

    await expect(
      normalizeWatermarkImageFile(new File(['tiff'], 'badge.tiff', { type: 'image/tiff' })),
    ).rejects.toThrow('watermark-image-convert-failed')
  })
})
