import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertImageToWebp } from './utils/convert-image-to-webp'
import { createWebpZip } from './utils/create-webp-zip'
import type { WebpConversionResult } from './types'

const encodeMock = vi.hoisted(() => vi.fn())

vi.mock('@jsquash/webp', () => ({
  encode: encodeMock,
}))

const zipWriterInstances: Array<{ add: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn> }> = []

class BlobWriterMock {
  getData = vi.fn().mockResolvedValue(new Blob(['zip']))
}

class BlobReaderMock {
  constructor(readonly blob: Blob) {
    void blob
  }
}

class ZipWriterMock {
  add = vi.fn().mockResolvedValue(undefined)
  close = vi.fn().mockResolvedValue(undefined)

  constructor() {
    zipWriterInstances.push(this)
  }
}

vi.mock('@zip.js/zip.js', () => ({
  BlobWriter: BlobWriterMock,
  BlobReader: BlobReaderMock,
  ZipWriter: ZipWriterMock,
}))

const originalCreateImageBitmap = globalThis.createImageBitmap
const originalImage = globalThis.Image
const originalGetContext = HTMLCanvasElement.prototype.getContext
const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

describe('convertImageToWebp', () => {
  beforeEach(() => {
    encodeMock.mockReset()
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
      drawImage: vi.fn(),
      getImageData: vi.fn(() =>
        typeof ImageData !== 'undefined'
          ? new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1)
          : ({ data: new Uint8ClampedArray([0, 0, 0, 255]), width: 1, height: 1 } as ImageData),
      ),
    })
  })

  afterEach(() => {
    if (originalCreateImageBitmap) {
      globalThis.createImageBitmap = originalCreateImageBitmap
    } else {
      delete (globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap
    }
    globalThis.Image = originalImage
    HTMLCanvasElement.prototype.getContext = originalGetContext
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('converts using createImageBitmap', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockResolvedValue({
      width: 100,
      height: 50,
      close: vi.fn(),
    })

    encodeMock.mockResolvedValueOnce(new Uint8Array([1, 2, 3]).buffer)

    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const result = await convertImageToWebp(file, { scale: 50 }, 'photo.webp')

    expect(encodeMock).toHaveBeenCalledTimes(1)
    expect(result.outputWidth).toBe(50)
    expect(result.outputHeight).toBe(25)
    expect(result.outputName).toBe('photo.webp')
  })

  it('falls back to HTMLImageElement when createImageBitmap is unavailable', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = undefined
    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()

    class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      naturalWidth = 40
      naturalHeight = 20
      width = 40
      height = 20
      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = MockImage as unknown as typeof Image

    encodeMock.mockResolvedValueOnce(new Uint8Array([1, 2, 3]).buffer)

    const file = new File(['data'], 'fallback.png', { type: 'image/png' })
    const result = await convertImageToWebp(file, { scale: 100 }, 'fallback.webp')

    expect(result.outputWidth).toBe(40)
    expect(result.outputHeight).toBe(20)
  })

  it('throws when canvas context is unavailable', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockResolvedValue({
      width: 10,
      height: 10,
      close: vi.fn(),
    })

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    const file = new File(['data'], 'broken.png', { type: 'image/png' })

    await expect(convertImageToWebp(file, { scale: 100 }, 'broken.webp')).rejects.toThrow(
      'CANVAS_CONTEXT_UNAVAILABLE',
    )
  })
})

describe('createWebpZip', () => {
  it('adds all results to the zip', async () => {
    zipWriterInstances.length = 0

    const results: WebpConversionResult[] = [
      {
        file: new File(['a'], 'a.png', { type: 'image/png' }),
        blob: new Blob(['a'], { type: 'image/webp' }),
        outputName: 'a.webp',
        originalWidth: 10,
        originalHeight: 10,
        outputWidth: 10,
        outputHeight: 10,
      },
      {
        file: new File(['b'], 'b.png', { type: 'image/png' }),
        blob: new Blob(['b'], { type: 'image/webp' }),
        outputName: 'b.webp',
        originalWidth: 12,
        originalHeight: 12,
        outputWidth: 12,
        outputHeight: 12,
      },
    ]

    const zipBlob = await createWebpZip(results)

    expect(zipBlob).toBeInstanceOf(Blob)
    const zipWriter = zipWriterInstances[0]
    expect(zipWriter?.add).toHaveBeenCalledTimes(2)
    expect(zipWriter?.add).toHaveBeenCalledWith('a.webp', expect.any(BlobReaderMock))
    expect(zipWriter?.add).toHaveBeenCalledWith('b.webp', expect.any(BlobReaderMock))
  })
})
