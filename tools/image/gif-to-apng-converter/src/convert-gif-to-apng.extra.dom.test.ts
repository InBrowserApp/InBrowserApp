import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertGifToApng } from './utils/convert-gif-to-apng'

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

function createGifBytes() {
  return new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
}

function createGifBytesWithTruncatedBackgroundTable() {
  return new Uint8Array([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80, 0x01, 0x00, 0xff, 0x00, 0x00,
  ])
}

function createGifFileFromBytes(bytes: Uint8Array) {
  return new File([bytes.buffer as ArrayBuffer], 'demo.gif', { type: 'image/gif' })
}

function createGifFile() {
  return createGifFileFromBytes(createGifBytes())
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

function createApngBufferWithoutChunkCrc(numFrames = 1, numPlays = 0) {
  const buffer = new ArrayBuffer(8 + 4 + 4 + 8)
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

function createPngBufferWithChunk(type: string) {
  const buffer = new ArrayBuffer(20)
  const view = new DataView(buffer)

  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  signature.forEach((value, index) => view.setUint8(index, value))
  view.setUint32(8, 0)
  view.setUint8(12, type.charCodeAt(0))
  view.setUint8(13, type.charCodeAt(1))
  view.setUint8(14, type.charCodeAt(2))
  view.setUint8(15, type.charCodeAt(3))
  view.setUint32(16, 0)

  return buffer
}

type LoopExtensionOptions = {
  identifier?: string
  subBlockSize?: number
  control?: number
  loopCount?: number
}

function createLoopExtension({
  identifier = 'NETSCAPE2.0',
  subBlockSize = 3,
  control = 1,
  loopCount = 1,
}: LoopExtensionOptions = {}) {
  const bytes = [0x21, 0xff, 0x0b]
  for (const char of identifier.slice(0, 11)) {
    bytes.push(char.charCodeAt(0))
  }
  bytes.push(subBlockSize, control, loopCount & 0xff, (loopCount >> 8) & 0xff, 0x00)
  return new Uint8Array(bytes)
}

function mergeBytes(...parts: Uint8Array[]) {
  const totalLength = parts.reduce((total, part) => total + part.length, 0)
  const output = new Uint8Array(totalLength)
  let offset = 0

  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }

  return output
}

describe('convertGifToApng extra branches', () => {
  it('throws when decompressed frames are empty', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue([])

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
    ).rejects.toThrow('EMPTY_GIF')
  })

  it('uses frame dimensions when gif metadata dimensions are missing', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray(3 * 2 * 4).fill(255),
        dims: { top: 0, left: 0, width: 3, height: 2 },
        delay: 10,
      },
    ])
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

    expect(result.originalWidth).toBe(3)
    expect(result.originalHeight).toBe(2)
    expect(encodeMock).toHaveBeenCalledWith(expect.any(Array), 3, 2, 0, [10])
  })

  it('falls back to minimum dimensions before rejecting invalid frames', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: undefined,
        delay: 10,
      },
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

  it('uses default disposal and skips missing patch alpha bytes', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 1, height: 1 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray(),
        dims: { top: 0, left: 0, width: 1, height: 1 },
        delay: 10,
      },
    ])
    encodeMock.mockReturnValue(createApngBuffer())

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

    const encodedFrames = encodeMock.mock.calls[0]?.[0] as ArrayBuffer[] | undefined
    const firstFrame = new Uint8ClampedArray(encodedFrames?.[0] ?? new ArrayBuffer(0))
    expect(Array.from(firstFrame.slice(0, 4))).toEqual([0, 0, 0, 0])
  })

  it('normalizes invalid scale, speed, and custom loop count values', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 0, height: 0 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
        delay: 0,
        disposalType: 1,
      },
    ])
    encodeMock.mockReturnValue(createApngBuffer())

    const result = await convertGifToApng(
      file,
      {
        scale: 0,
        speed: 0,
        loopMode: 'custom',
        loopCount: 0,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    expect(encodeMock).toHaveBeenCalledWith(expect.any(Array), 1, 1, 0, [100])

    const buffer = await result.blob.arrayBuffer()
    const view = new DataView(buffer)
    expect(view.getUint32(20)).toBe(1)
  })

  it('defaults custom loop counts to one when count is omitted', async () => {
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

  it('normalizes optimize levels when optimization is enabled', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(createApngBuffer())
    optimizeMock.mockResolvedValue(new Blob(['optimized'], { type: 'image/png' }))

    await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: true,
        optimizeLevel: Number.NaN,
      },
      'nan.png',
    )
    await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: true,
        optimizeLevel: 9,
      },
      'high.png',
    )
    await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'inherit',
        loopCount: undefined,
        optimize: true,
        optimizeLevel: -3,
      },
      'low.png',
    )

    expect(optimizeMock).toHaveBeenNthCalledWith(
      1,
      expect.any(Blob),
      expect.objectContaining({ level: 2 }),
    )
    expect(optimizeMock).toHaveBeenNthCalledWith(
      2,
      expect.any(Blob),
      expect.objectContaining({ level: 6 }),
    )
    expect(optimizeMock).toHaveBeenNthCalledWith(
      3,
      expect.any(Blob),
      expect.objectContaining({ level: 0 }),
    )
  })

  it('restores disposal type 3 snapshots and skips transparent pixels', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 1, height: 1 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
        delay: 10,
        disposalType: 3,
      },
      {
        patch: new Uint8ClampedArray([0, 0, 255, 0]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
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

    const encodedFrames = encodeMock.mock.calls[0]?.[0] as ArrayBuffer[] | undefined
    const secondFrame = new Uint8ClampedArray(encodedFrames?.[1] ?? new ArrayBuffer(0))
    expect(Array.from(secondFrame.slice(0, 4))).toEqual([0, 0, 0, 0])
  })

  it('throws when the source canvas context is unavailable during scaling', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 4, height: 4 } })
    decompressFramesMock.mockReturnValue(createFrames())
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    await expect(
      convertGifToApng(
        file,
        {
          scale: 50,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
          optimize: false,
          optimizeLevel: 2,
        },
        'demo.png',
      ),
    ).rejects.toThrow('CANVAS_CONTEXT_UNAVAILABLE')
  })

  it('throws when the target canvas context is unavailable during scaling', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 4, height: 4 } })
    decompressFramesMock.mockReturnValue(createFrames())
    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(null)

    await expect(
      convertGifToApng(
        file,
        {
          scale: 50,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
          optimize: false,
          optimizeLevel: 2,
        },
        'demo.png',
      ),
    ).rejects.toThrow('CANVAS_CONTEXT_UNAVAILABLE')
  })

  it('skips malformed loop extensions and reads ANIMEXTS loop count', async () => {
    const bytes = mergeBytes(
      createGifBytes(),
      createLoopExtension({ identifier: 'WRONGNAME00' }),
      createLoopExtension({ identifier: 'NETSCAPE2.0', subBlockSize: 2 }),
      createLoopExtension({ identifier: 'NETSCAPE2.0', control: 2 }),
      createLoopExtension({ identifier: 'ANIMEXTS1.0', loopCount: 7 }),
    )
    const file = createGifFileFromBytes(bytes)

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
    expect(view.getUint32(20)).toBe(7)
  })

  it('falls back to transparent background when color table bytes are truncated', async () => {
    const file = createGifFileFromBytes(createGifBytesWithTruncatedBackgroundTable())

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

    const encodedFrames = encodeMock.mock.calls[0]?.[0] as ArrayBuffer[] | undefined
    const secondFrame = new Uint8ClampedArray(encodedFrames?.[1] ?? new ArrayBuffer(0))
    expect(Array.from(secondFrame.slice(0, 4))).toEqual([0, 0, 0, 0])
  })

  it('falls back to transparent background when metadata is malformed', async () => {
    const malformedBackgroundBytes = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80, 0x03, 0x00, 0xff, 0x00,
      0x00, 0x00, 0xff, 0x00,
    ])
    const file = createGifFileFromBytes(malformedBackgroundBytes)

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

    const encodedFrames = encodeMock.mock.calls[0]?.[0] as ArrayBuffer[] | undefined
    const secondFrame = new Uint8ClampedArray(encodedFrames?.[1] ?? new ArrayBuffer(0))
    expect(Array.from(secondFrame.slice(0, 4))).toEqual([0, 0, 0, 0])
  })

  it('keeps encoded data unchanged when acTL chunk is missing', async () => {
    const file = createGifFile()
    const raw = new Uint8Array([1, 2, 3, 4]).buffer

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(raw)

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'infinite',
        loopCount: undefined,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    const output = await result.blob.arrayBuffer()
    expect(new Uint8Array(output)).toEqual(new Uint8Array(raw))
  })

  it('updates loop metadata when the acTL chunk has no crc bytes', async () => {
    const file = createGifFile()
    const raw = createApngBufferWithoutChunkCrc()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(raw)

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'custom',
        loopCount: 5,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    const output = await result.blob.arrayBuffer()
    const view = new DataView(output)
    expect(view.getUint32(20)).toBe(5)
  })

  it('walks non-acTL chunks when applying loop metadata', async () => {
    const file = createGifFile()
    const raw = createPngBufferWithChunk('IDAT')

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue(createFrames())
    encodeMock.mockReturnValue(raw)

    const result = await convertGifToApng(
      file,
      {
        scale: 100,
        speed: 1,
        loopMode: 'infinite',
        loopCount: undefined,
        optimize: false,
        optimizeLevel: 2,
      },
      'demo.png',
    )

    const output = await result.blob.arrayBuffer()
    expect(new Uint8Array(output)).toEqual(new Uint8Array(raw))
  })
})
