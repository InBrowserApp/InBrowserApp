import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertGifToAnimatedWebp } from './utils/convert-gif-to-animated-webp'
import { createWebpZip } from './utils/create-webp-zip'
import type { GifToAnimatedWebpResult } from './types'

const parseGIFMock = vi.hoisted(() => vi.fn())
const decompressFramesMock = vi.hoisted(() => vi.fn())
const encodeFramesMock = vi.hoisted(() => vi.fn())
const waitRuntimeMock = vi.hoisted(() => vi.fn())

vi.mock('gifuct-js', () => ({
  parseGIF: parseGIFMock,
  decompressFrames: decompressFramesMock,
}))

vi.mock('webpxmux/dist/webpxmux', () => ({
  default: vi.fn(() => ({
    encodeFrames: encodeFramesMock,
    waitRuntime: waitRuntimeMock,
  })),
}))

vi.mock('webpxmux/dist/webpxmux.wasm?url', () => ({
  default: 'webpxmux.wasm',
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

const originalGetContext = HTMLCanvasElement.prototype.getContext
const originalImageData = globalThis.ImageData

beforeEach(() => {
  parseGIFMock.mockReset()
  decompressFramesMock.mockReset()
  encodeFramesMock.mockReset()
  waitRuntimeMock.mockResolvedValue(undefined)
})

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext
  if (originalImageData) {
    globalThis.ImageData = originalImageData
  } else {
    delete (globalThis as { ImageData?: typeof ImageData }).ImageData
  }
})

function createGifBytes(loopCount?: number) {
  const bytes = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]
  if (typeof loopCount === 'number') {
    const label = 'NETSCAPE2.0'
    bytes.push(0x21, 0xff, 0x0b)
    for (const char of label) {
      bytes.push(char.charCodeAt(0))
    }
    bytes.push(0x03, 0x01, loopCount & 0xff, (loopCount >> 8) & 0xff, 0x00)
  }
  return new Uint8Array(bytes)
}

function createGifBytesWithBackground() {
  return new Uint8Array([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0x00, 0x00,
    0x00, 0xff, 0x00,
  ])
}

function createGifFile(loopCount?: number) {
  const bytes = createGifBytes(loopCount)
  return new File([bytes.buffer as ArrayBuffer], 'demo.gif', { type: 'image/gif' })
}

function createGifFileFromBytes(bytes: Uint8Array) {
  return new File([bytes.buffer as ArrayBuffer], 'demo.gif', { type: 'image/gif' })
}

function createFrames() {
  const patch = new Uint8ClampedArray([
    255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
  ])
  return [
    {
      patch,
      dims: { top: 0, left: 0, width: 2, height: 2 },
      delay: 50,
      disposalType: 1,
    },
    {
      patch,
      dims: { top: 0, left: 0, width: 2, height: 2 },
      delay: 25,
      disposalType: 2,
    },
  ]
}

describe('convertGifToAnimatedWebp', () => {
  it('converts gif and applies custom loop count', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeFramesMock.mockResolvedValue(new Uint8Array([1, 2, 3]))

    const result = await convertGifToAnimatedWebp(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'custom',
        loopCount: 3,
      },
      'demo.webp',
    )

    expect(result.outputName).toBe('demo.webp')
    expect(waitRuntimeMock).toHaveBeenCalledTimes(1)
    expect(encodeFramesMock).toHaveBeenCalledTimes(1)

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as {
      loopCount: number
      width: number
      height: number
      frameCount: number
      frames: Array<{ duration: number; rgba: Uint32Array }>
    }
    expect(framesArg.loopCount).toBe(3)
    expect(framesArg.width).toBe(2)
    expect(framesArg.height).toBe(2)
    expect(framesArg.frameCount).toBe(2)
    expect(framesArg.frames[0]?.duration).toBe(50)
    expect(framesArg.frames[0]?.rgba).toBeInstanceOf(Uint32Array)
    expect(result.blob.type).toBe('image/webp')
  })

  it('defaults to loop count 1 when GIF has no loop info', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeFramesMock.mockResolvedValue(new Uint8Array([1]))

    await convertGifToAnimatedWebp(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
      },
      'demo.webp',
    )

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { loopCount: number }
    expect(framesArg.loopCount).toBe(1)
  })

  it('reads loop count from GIF data', async () => {
    const file = createGifFile(4)

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeFramesMock.mockResolvedValue(new Uint8Array([1]))

    await convertGifToAnimatedWebp(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
      },
      'demo.webp',
    )

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { loopCount: number }
    expect(framesArg.loopCount).toBe(4)
  })

  it('clears to gif background color for disposal type 2', async () => {
    const file = createGifFileFromBytes(createGifBytesWithBackground())

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 1 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([0, 255, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
        delay: 10,
        disposalType: 2,
      },
      {
        patch: new Uint8ClampedArray([0, 0, 255, 255]),
        dims: { top: 0, left: 1, width: 1, height: 1 },
        delay: 10,
        disposalType: 1,
      },
    ])
    encodeFramesMock.mockResolvedValue(new Uint8Array([1]))

    await convertGifToAnimatedWebp(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
      },
      'demo.webp',
    )

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as {
      frames: Array<{ rgba: Uint32Array }>
    }
    const secondFrame = framesArg.frames[1]?.rgba
    expect(secondFrame?.[0]).toBe(0xff0000ff)
  })

  it('scales frames when scale is applied', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 4, height: 4 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeFramesMock.mockResolvedValue(new Uint8Array([1]))

    class MockImageData {
      data: Uint8ClampedArray
      width: number
      height: number
      constructor(data: Uint8ClampedArray, width: number, height: number) {
        this.data = data
        this.width = width
        this.height = height
      }
    }

    globalThis.ImageData = MockImageData as unknown as typeof ImageData

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      putImageData: vi.fn(),
      drawImage: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([0, 0, 0, 255]),
        width: 2,
        height: 2,
      })),
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    })

    await convertGifToAnimatedWebp(
      file,
      {
        scale: 50,
        speed: 1,
        loopMode: 'infinite',
        loopCount: undefined,
      },
      'demo.webp',
    )

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { width: number; height: number }
    expect(framesArg.width).toBe(2)
    expect(framesArg.height).toBe(2)
  })

  it('throws for invalid gif header', async () => {
    const file = new File([new Uint8Array([0x00, 0x01])], 'bad.gif', { type: 'image/gif' })

    await expect(
      convertGifToAnimatedWebp(
        file,
        {
          scale: 100,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
        },
        'bad.webp',
      ),
    ).rejects.toThrow('INVALID_GIF')
  })

  it('throws for invalid frames', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue([
      { patch: undefined, dims: { top: 0, left: 0, width: 2, height: 2 }, delay: 10 },
    ])

    await expect(
      convertGifToAnimatedWebp(
        file,
        {
          scale: 100,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
        },
        'demo.webp',
      ),
    ).rejects.toThrow('INVALID_FRAME')
  })
})

describe('createWebpZip', () => {
  it('adds all results to the zip', async () => {
    zipWriterInstances.length = 0

    const results: GifToAnimatedWebpResult[] = [
      {
        file: new File(['a'], 'a.gif', { type: 'image/gif' }),
        blob: new Blob(['a'], { type: 'image/webp' }),
        outputName: 'a.webp',
        originalWidth: 10,
        originalHeight: 10,
        outputWidth: 10,
        outputHeight: 10,
      },
      {
        file: new File(['b'], 'b.gif', { type: 'image/gif' }),
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
