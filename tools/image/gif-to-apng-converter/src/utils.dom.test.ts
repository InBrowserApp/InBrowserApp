import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertGifToApng } from './utils/convert-gif-to-apng'
import { createApngZip } from './utils/create-apng-zip'
import type { GifToApngResult } from './types'

const parseGIFMock = vi.hoisted(() => vi.fn())
const decompressFramesMock = vi.hoisted(() => vi.fn())
const encodeMock = vi.hoisted(() => vi.fn())
const optimizeMock = vi.hoisted(() => vi.fn())

vi.mock('gifuct-js', () => ({
  parseGIF: parseGIFMock,
  decompressFrames: decompressFramesMock,
}))

vi.mock('upng-js', () => ({
  encode: encodeMock,
}))

vi.mock('@utils/image', () => ({
  optimizePNG: optimizeMock,
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
  encodeMock.mockReset()
  optimizeMock.mockReset()
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
  return new File([bytes], 'demo.gif', { type: 'image/gif' })
}

function createGifFileFromBytes(bytes: Uint8Array) {
  return new File([bytes], 'demo.gif', { type: 'image/gif' })
}

function createApngBuffer(numFrames = 1, numPlays = 0) {
  const buffer = new ArrayBuffer(8 + 4 + 4 + 8 + 4)
  const view = new DataView(buffer)

  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  signature.forEach((value, index) => view.setUint8(index, value))
  view.setUint32(8, 8)
  view.setUint8(12, 0x61)
  view.setUint8(13, 0x63)
  view.setUint8(14, 0x54)
  view.setUint8(15, 0x4c)
  view.setUint32(16, numFrames)
  view.setUint32(20, numPlays)
  return buffer
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (const value of bytes) {
    crc = CRC_TABLE[(crc ^ value) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i += 1) {
    let crc = i
    for (let j = 0; j < 8; j += 1) {
      crc = (crc & 1) !== 0 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
    table[i] = crc >>> 0
  }
  return table
})()

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

describe('convertGifToApng', () => {
  it('converts gif and applies custom loop count', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(createApngBuffer())

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'custom',
        loopCount: 3,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    expect(result.outputName).toBe('demo.png')
    expect(encodeMock).toHaveBeenCalledWith(expect.any(Array), 2, 2, 0, [50, 25])
    expect(optimizeMock).not.toHaveBeenCalled()

    const buffer = await result.blob.arrayBuffer()
    const view = new DataView(buffer)
    expect(view.getUint32(20)).toBe(3)
    const chunkLength = view.getUint32(8)
    const crcOffset = 8 + 8 + chunkLength
    const expectedCrc = crc32(new Uint8Array(buffer, 12, chunkLength + 4))
    expect(view.getUint32(crcOffset)).toBe(expectedCrc)
  })

  it('defaults to loop count 1 when GIF has no loop info', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(createApngBuffer())

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    const buffer = await result.blob.arrayBuffer()
    const view = new DataView(buffer)
    expect(view.getUint32(20)).toBe(1)
  })

  it('reads loop count from GIF data', async () => {
    const file = createGifFile(4)

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(createApngBuffer())

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    const buffer = await result.blob.arrayBuffer()
    const view = new DataView(buffer)
    expect(view.getUint32(20)).toBe(4)
  })

  it('applies optimization when enabled', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(createApngBuffer())
    optimizeMock.mockResolvedValue(new Blob(['optimized'], { type: 'image/png' }))

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'infinite',
        loopCount: undefined,
        optimize: true,
        optimizeLevel: 4,
      },
      'demo.png',
    )

    expect(optimizeMock).toHaveBeenCalledWith(expect.any(Blob), {
      level: 4,
      interlace: false,
      optimiseAlpha: true,
    })
    expect(result.blob.size).toBeGreaterThan(0)
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
    encodeMock.mockReturnValue(createApngBuffer(2))

    await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    const encodedFrames = encodeMock.mock.calls[0]?.[0] as ArrayBuffer[]
    const secondFrame = new Uint8ClampedArray(encodedFrames[1])
    expect(Array.from(secondFrame.slice(0, 4))).toEqual([255, 0, 0, 255])
    expect(Array.from(secondFrame.slice(4, 8))).toEqual([0, 0, 255, 255])
  })

  it('scales frames when scale is applied', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 4, height: 4 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(createApngBuffer())

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

    await convertGifToApng(
      file,
      {
        scale: 50,
        speed: 1,
        loopMode: 'infinite',
        loopCount: undefined,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    expect(encodeMock).toHaveBeenCalledWith(expect.any(Array), 2, 2, 0, expect.any(Array))
  })

  it('throws for invalid gif header', async () => {
    const file = new File([new Uint8Array([0x00, 0x01])], 'bad.gif', { type: 'image/gif' })

    await expect(
      convertGifToApng(
        file,
        {
          scale: 100,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
          optimize: false,
          optimizeLevel: 2,
        },
        'bad.png',
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
      convertGifToApng(
        file,
        {
          scale: 100,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
          optimize: false,
          optimizeLevel: 2,
        },
        'demo.png',
      ),
    ).rejects.toThrow('INVALID_FRAME')
  })
})

describe('createApngZip', () => {
  it('adds all results to the zip', async () => {
    zipWriterInstances.length = 0

    const results: GifToApngResult[] = [
      {
        file: new File(['a'], 'a.gif', { type: 'image/gif' }),
        blob: new Blob(['a'], { type: 'image/png' }),
        outputName: 'a.png',
        originalWidth: 10,
        originalHeight: 10,
        outputWidth: 10,
        outputHeight: 10,
      },
      {
        file: new File(['b'], 'b.gif', { type: 'image/gif' }),
        blob: new Blob(['b'], { type: 'image/png' }),
        outputName: 'b.png',
        originalWidth: 12,
        originalHeight: 12,
        outputWidth: 12,
        outputHeight: 12,
      },
    ]

    const zipBlob = await createApngZip(results)

    expect(zipBlob).toBeInstanceOf(Blob)
    const zipWriter = zipWriterInstances[0]
    expect(zipWriter?.add).toHaveBeenCalledTimes(2)
    expect(zipWriter?.add).toHaveBeenCalledWith('a.png', expect.any(BlobReaderMock))
    expect(zipWriter?.add).toHaveBeenCalledWith('b.png', expect.any(BlobReaderMock))
  })
})
