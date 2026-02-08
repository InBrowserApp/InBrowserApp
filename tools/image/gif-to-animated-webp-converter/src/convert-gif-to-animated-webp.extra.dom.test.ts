import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertGifToAnimatedWebp } from './utils/convert-gif-to-animated-webp'

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

function createGifBytes() {
  return new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
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

describe('convertGifToAnimatedWebp extra branches', () => {
  it('throws when decompressed frames are empty', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 2, height: 2 } })
    decompressFramesMock.mockReturnValue([])

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
    ).rejects.toThrow('EMPTY_GIF')
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
    encodeFramesMock.mockResolvedValue(new Uint8Array([1]))

    await convertGifToAnimatedWebp(
      file,
      {
        scale: 0,
        speed: 0,
        loopMode: 'custom',
        loopCount: 0,
      },
      'demo.webp',
    )

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as {
      loopCount: number
      width: number
      height: number
      frames: Array<{ duration: number }>
    }

    expect(framesArg.width).toBe(1)
    expect(framesArg.height).toBe(1)
    expect(framesArg.loopCount).toBe(1)
    expect(framesArg.frames[0]?.duration).toBe(100)
  })

  it('uses frame dimensions when logical screen metadata is missing', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
        delay: 10,
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

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { width: number; height: number }
    expect(framesArg.width).toBe(1)
    expect(framesArg.height).toBe(1)
  })

  it('falls back to minimum dimensions before surfacing invalid frame errors', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        delay: 10,
      },
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

  it('defaults custom loop count to 1 when the provided value is not finite', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 1, height: 1 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
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
        loopMode: 'custom',
        loopCount: Number.NaN,
      },
      'demo.webp',
    )

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { loopCount: number }
    expect(framesArg.loopCount).toBe(1)
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
    expect(framesArg.frames[1]?.rgba[0]).toBe(0)
  })

  it('throws when the source canvas context is unavailable during scaling', async () => {
    const file = createGifFile()

    parseGIFMock.mockReturnValue({ lsd: { width: 4, height: 4 } })
    decompressFramesMock.mockReturnValue(createFrames())
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    await expect(
      convertGifToAnimatedWebp(
        file,
        {
          scale: 50,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
        },
        'demo.webp',
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
      convertGifToAnimatedWebp(
        file,
        {
          scale: 50,
          speed: 1,
          loopMode: 'inherit',
          loopCount: undefined,
        },
        'demo.webp',
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
    expect(framesArg.loopCount).toBe(7)
  })

  it('falls back to transparent background when metadata is malformed', async () => {
    const malformedBackgroundBytes = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80, 0x03, 0x00, 0xff, 0x00,
      0x00, 0x00, 0xff, 0x00,
    ])
    const file = createGifFileFromBytes(malformedBackgroundBytes)

    parseGIFMock.mockReturnValue({ lsd: { width: 1, height: 1 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
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

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { bgColor: number }
    expect(framesArg.bgColor).toBe(0)
  })

  it('falls back to transparent background when the global color table is truncated', async () => {
    const truncatedBackgroundBytes = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x87, 0x00, 0x00, 0xff, 0x00,
      0x00,
    ])
    const file = createGifFileFromBytes(truncatedBackgroundBytes)

    parseGIFMock.mockReturnValue({ lsd: { width: 1, height: 1 } })
    decompressFramesMock.mockReturnValue([
      {
        patch: new Uint8ClampedArray([255, 0, 0, 255]),
        dims: { top: 0, left: 0, width: 1, height: 1 },
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

    const framesArg = encodeFramesMock.mock.calls[0]?.[0] as { bgColor: number }
    expect(framesArg.bgColor).toBe(0)
  })
})
