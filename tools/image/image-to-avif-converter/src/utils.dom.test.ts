import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { convertImageToAvif } from './utils/convert-image-to-avif'
import { createAvifZip } from './utils/create-avif-zip'
import { encodeAvifWithWorker } from './utils/encode-avif-with-worker'

const avifEncodeMock = vi.hoisted(() => vi.fn())

type WorkerResponse = { ok: true; buffer: ArrayBuffer } | { ok: false; code: string }

class MockWorker {
  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

let lastWorker: MockWorker | null = null

vi.mock('./utils/encode-avif.worker.ts?worker', () => ({
  default: class {
    constructor() {
      lastWorker = new MockWorker()
      return lastWorker
    }
  },
}))

vi.mock('@jsquash/avif', () => ({
  encode: avifEncodeMock,
}))

const zipWriterInstances: Array<{
  add: ReturnType<typeof vi.fn>
  close: ReturnType<typeof vi.fn>
}> = []

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
const originalImageData = globalThis.ImageData

async function settle() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('convertImageToAvif', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
      drawImage: vi.fn(),
      getImageData: vi.fn(() =>
        typeof ImageData !== 'undefined'
          ? new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1)
          : ({
              data: new Uint8ClampedArray([0, 0, 0, 255]),
              width: 1,
              height: 1,
            } as ImageData),
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

  it('encodes through the worker wrapper and builds an AVIF result', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockResolvedValue({
        width: 100,
        height: 50,
        close: vi.fn(),
      })

    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const promise = convertImageToAvif(
      file,
      {
        scale: 50,
        quality: 90,
        speed: 3,
        lossless: false,
        alphaQuality: 70,
        denoiseLevel: 2,
        sharpness: 1,
        subsample: '444',
        tune: 'ssim',
        enableSharpYuv: true,
      },
      'photo.avif',
    )

    await settle()
    expect(lastWorker?.postMessage).toHaveBeenCalledTimes(1)
    const request = lastWorker?.postMessage.mock.calls[0]?.[0]
    expect(request.options).toMatchObject({
      quality: 90,
      speed: 3,
      lossless: false,
      qualityAlpha: 70,
      denoiseLevel: 2,
      sharpness: 1,
      subsample: 2,
      tune: 2,
      enableSharpYUV: true,
      bitDepth: 8,
    })

    lastWorker?.onmessage?.({
      data: { ok: true, buffer: new Uint8Array([1, 2, 3]).buffer },
    } as MessageEvent<WorkerResponse>)

    const result = await promise
    expect(result.outputWidth).toBe(50)
    expect(result.outputHeight).toBe(25)
    expect(result.outputName).toBe('photo.avif')
    expect(result.blob.type).toBe('image/avif')
  })

  it('falls back to HTMLImageElement when createImageBitmap is unavailable', async () => {
    delete (globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap
    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()

    class MockImageElement {
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

    globalThis.Image = MockImageElement as unknown as typeof Image

    const promise = convertImageToAvif(
      new File(['data'], 'fallback.png', { type: 'image/png' }),
      { scale: 100, quality: 75, speed: 6, lossless: true },
      'fallback.avif',
    )

    await settle()
    lastWorker?.onmessage?.({
      data: { ok: true, buffer: new Uint8Array([1, 2, 3]).buffer },
    } as MessageEvent<WorkerResponse>)

    const result = await promise
    expect(result.outputWidth).toBe(40)
    expect(result.outputHeight).toBe(20)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('falls back when createImageBitmap rejects and maps 4:2:2 PSNR tuning', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockRejectedValueOnce(new Error('decode failed'))
    URL.createObjectURL = vi.fn(() => 'blob:reject')
    URL.revokeObjectURL = vi.fn()

    class RejectingBitmapFallbackImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      naturalWidth = 0
      naturalHeight = 0
      width = 0
      height = 0

      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = RejectingBitmapFallbackImage as unknown as typeof Image

    const promise = convertImageToAvif(
      new File(['data'], 'reject.png', { type: 'image/png' }),
      {
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
        subsample: '422',
        tune: 'psnr',
      },
      'reject.avif',
    )

    await settle()
    await settle()
    const request = lastWorker?.postMessage.mock.calls[0]?.[0]
    expect(request.options).toMatchObject({
      quality: 75,
      speed: 6,
      lossless: false,
      subsample: 1,
      tune: 1,
      bitDepth: 8,
    })

    lastWorker?.onmessage?.({
      data: { ok: true, buffer: new Uint8Array([1, 2, 3]).buffer },
    } as MessageEvent<WorkerResponse>)

    const result = await promise
    expect(result.originalWidth).toBe(1)
    expect(result.originalHeight).toBe(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:reject')
  })

  it('maps default AVIF advanced selections to the codec defaults', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockResolvedValue({
        width: 20,
        height: 10,
        close: vi.fn(),
      })

    const promise = convertImageToAvif(
      new File(['data'], 'default-options.png', { type: 'image/png' }),
      {
        scale: Number.NaN,
        quality: Number.POSITIVE_INFINITY,
        speed: Number.NEGATIVE_INFINITY,
        lossless: false,
        alphaQuality: Number.NaN,
        denoiseLevel: Number.NaN,
        sharpness: Number.NaN,
        subsample: '420',
        tune: 'auto',
      },
      'default-options.avif',
    )

    await settle()
    const request = lastWorker?.postMessage.mock.calls[0]?.[0]
    expect(request.options).toMatchObject({
      quality: 75,
      speed: 6,
      lossless: false,
      subsample: 0,
      tune: 0,
      bitDepth: 8,
    })
    expect(request.options).not.toHaveProperty('qualityAlpha')
    expect(request.options).not.toHaveProperty('denoiseLevel')
    expect(request.options).not.toHaveProperty('sharpness')

    lastWorker?.onmessage?.({
      data: { ok: true, buffer: new Uint8Array([1, 2, 3]).buffer },
    } as MessageEvent<WorkerResponse>)

    const result = await promise
    expect(result.outputWidth).toBe(20)
    expect(result.outputHeight).toBe(10)
  })

  it('throws when the canvas context is unavailable', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockResolvedValue({
        width: 10,
        height: 10,
        close: vi.fn(),
      })
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    await expect(
      convertImageToAvif(
        new File(['data'], 'broken.png', { type: 'image/png' }),
        { scale: 100, quality: 75, speed: 6, lossless: false },
        'broken.avif',
      ),
    ).rejects.toThrow('CANVAS_CONTEXT_UNAVAILABLE')
  })

  it('throws when the image cannot be loaded', async () => {
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = undefined
    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()

    class BrokenImageElement {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      set src(_value: string) {
        this.onerror?.()
      }
    }

    globalThis.Image = BrokenImageElement as unknown as typeof Image

    await expect(
      convertImageToAvif(
        new File(['data'], 'broken.png', { type: 'image/png' }),
        { scale: 100, quality: 75, speed: 6, lossless: false },
        'broken.avif',
      ),
    ).rejects.toThrow('INVALID_IMAGE')
  })
})

describe('createAvifZip', () => {
  it('adds every converted file to the archive', async () => {
    zipWriterInstances.length = 0

    const zipBlob = await createAvifZip([
      {
        file: new File(['a'], 'a.png', { type: 'image/png' }),
        blob: new Blob(['a'], { type: 'image/avif' }),
        outputName: 'a.avif',
        originalWidth: 10,
        originalHeight: 10,
        outputWidth: 10,
        outputHeight: 10,
      },
      {
        file: new File(['b'], 'b.png', { type: 'image/png' }),
        blob: new Blob(['b'], { type: 'image/avif' }),
        outputName: 'b.avif',
        originalWidth: 12,
        originalHeight: 12,
        outputWidth: 12,
        outputHeight: 12,
      },
    ])

    expect(zipBlob).toBeInstanceOf(Blob)
    expect(zipWriterInstances[0]?.add).toHaveBeenCalledWith('a.avif', expect.any(BlobReaderMock))
    expect(zipWriterInstances[0]?.add).toHaveBeenCalledWith('b.avif', expect.any(BlobReaderMock))
  })
})

describe('encodeAvifWithWorker', () => {
  beforeEach(() => {
    lastWorker = null
    ;(window as unknown as { Worker: unknown }).Worker = class {}
  })

  it('rejects when workers are unavailable', async () => {
    ;(window as unknown as { Worker: unknown }).Worker = undefined

    await expect(
      encodeAvifWithWorker({
        pixels: new Uint8Array([0, 0, 0, 255]).buffer,
        width: 1,
        height: 1,
        options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
      }),
    ).rejects.toThrow('WORKER_UNSUPPORTED')
  })

  it('resolves and rejects based on worker messages', async () => {
    const successPromise = encodeAvifWithWorker({
      pixels: new Uint8Array([0, 0, 0, 255]).buffer,
      width: 1,
      height: 1,
      options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
    })

    lastWorker?.onmessage?.({
      data: { ok: true, buffer: new Uint8Array([1]).buffer },
    } as MessageEvent<WorkerResponse>)

    await expect(successPromise).resolves.toBeInstanceOf(ArrayBuffer)

    const failurePromise = encodeAvifWithWorker({
      pixels: new Uint8Array([0, 0, 0, 255]).buffer,
      width: 1,
      height: 1,
      options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
    })

    lastWorker?.onmessage?.({
      data: { ok: false, code: 'ENCODE_FAILED' },
    } as MessageEvent<WorkerResponse>)

    await expect(failurePromise).rejects.toThrow('ENCODE_FAILED')
  })

  it('rejects when the worker throws', async () => {
    const promise = encodeAvifWithWorker({
      pixels: new Uint8Array([0, 0, 0, 255]).buffer,
      width: 1,
      height: 1,
      options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
    })

    lastWorker?.onerror?.({ error: new Error('boom') } as ErrorEvent)
    await expect(promise).rejects.toThrow('ENCODE_FAILED')
  })
})

describe('encode-avif.worker', () => {
  afterEach(() => {
    vi.resetModules()
    ;(globalThis as { self?: unknown }).self = undefined
    ;(globalThis as { ImageData?: typeof ImageData }).ImageData = originalImageData
  })

  it('encodes pixels and posts the resulting buffer', async () => {
    const ImageDataStub = class {
      constructor(
        readonly data: Uint8ClampedArray,
        readonly width: number,
        readonly height: number,
      ) {}
    }
    const workerScope = {
      postMessage: vi.fn(),
      onmessage: null as ((event: MessageEvent) => void) | null,
    }
    ;(globalThis as { ImageData?: unknown }).ImageData = ImageDataStub
    ;(globalThis as { self?: unknown }).self = workerScope
    avifEncodeMock.mockResolvedValueOnce(new Uint8Array([1, 2, 3]))

    await import('./utils/encode-avif.worker')

    await workerScope.onmessage?.({
      data: {
        pixels: new Uint8Array([0, 0, 0, 255]).buffer,
        width: 1,
        height: 1,
        options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
      },
    } as MessageEvent)

    expect(workerScope.postMessage).toHaveBeenCalledWith(
      { ok: true, buffer: expect.any(ArrayBuffer) },
      [expect.any(ArrayBuffer)],
    )
  })

  it('reuses an ArrayBuffer result without slicing it', async () => {
    const ImageDataStub = class {
      constructor(
        readonly data: Uint8ClampedArray,
        readonly width: number,
        readonly height: number,
      ) {}
    }
    const workerScope = {
      postMessage: vi.fn(),
      onmessage: null as ((event: MessageEvent) => void) | null,
    }
    const buffer = new Uint8Array([9, 8, 7]).buffer
    ;(globalThis as { ImageData?: unknown }).ImageData = ImageDataStub
    ;(globalThis as { self?: unknown }).self = workerScope
    avifEncodeMock.mockResolvedValueOnce(buffer)

    await import('./utils/encode-avif.worker')

    await workerScope.onmessage?.({
      data: {
        pixels: new Uint8Array([0, 0, 0, 255]).buffer,
        width: 1,
        height: 1,
        options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
      },
    } as MessageEvent)

    expect(workerScope.postMessage).toHaveBeenCalledWith({ ok: true, buffer }, [buffer])
  })

  it('posts an encode failure when the codec throws', async () => {
    const ImageDataStub = class {
      constructor(
        readonly data: Uint8ClampedArray,
        readonly width: number,
        readonly height: number,
      ) {}
    }
    const workerScope = {
      postMessage: vi.fn(),
      onmessage: null as ((event: MessageEvent) => void) | null,
    }
    ;(globalThis as { ImageData?: unknown }).ImageData = ImageDataStub
    ;(globalThis as { self?: unknown }).self = workerScope
    avifEncodeMock.mockRejectedValueOnce(new Error('boom'))

    await import('./utils/encode-avif.worker')

    await workerScope.onmessage?.({
      data: {
        pixels: new Uint8Array([0, 0, 0, 255]).buffer,
        width: 1,
        height: 1,
        options: { quality: 75, speed: 6, lossless: false, bitDepth: 8 },
      },
    } as MessageEvent)

    expect(workerScope.postMessage).toHaveBeenCalledWith({ ok: false, code: 'ENCODE_FAILED' })
  })
})
