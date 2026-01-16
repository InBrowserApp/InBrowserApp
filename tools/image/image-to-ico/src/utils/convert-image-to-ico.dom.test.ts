import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convertImageToIco } from './convert-image-to-ico'
import { optimizePNG } from '@utils/image'

const { convertToBlobAsyncMock, optimizePNGMock } = vi.hoisted(() => ({
  convertToBlobAsyncMock: vi.fn(),
  optimizePNGMock: vi.fn(async (blob: Blob) => blob),
}))

vi.mock('@utils/image', async () => {
  const actual = await vi.importActual<typeof import('@utils/image')>('@utils/image')

  return {
    ...actual,
    optimizePNG: optimizePNGMock,
    PngIcoConverter: class {
      convertToBlobAsync = convertToBlobAsyncMock
    },
  }
})

const originalToBlob =
  typeof HTMLCanvasElement.prototype.toBlob === 'function'
    ? HTMLCanvasElement.prototype.toBlob
    : undefined

let getContextSpy: ReturnType<typeof vi.fn> | null = null
let toBlobSpy: ReturnType<typeof vi.fn> | null = null

let contextMock: {
  fillStyle: string
  fillRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
  imageSmoothingEnabled: boolean
  imageSmoothingQuality: string
} | null = null

let nextImageBehavior: 'load' | 'error' = 'load'
let nextImageSize = { width: 64, height: 32 }
let nextNaturalSize = { width: 64, height: 32 }

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  naturalWidth = nextNaturalSize.width
  naturalHeight = nextNaturalSize.height
  width = nextImageSize.width
  height = nextImageSize.height

  set src(_value: string) {
    if (nextImageBehavior === 'error') {
      this.onerror?.()
    } else {
      this.onload?.()
    }
  }
}

beforeEach(() => {
  convertToBlobAsyncMock.mockReset()
  optimizePNGMock.mockReset()
  convertToBlobAsyncMock.mockResolvedValue(new Blob(['ico'], { type: 'image/x-icon' }))

  nextImageBehavior = 'load'
  nextImageSize = { width: 64, height: 32 }
  nextNaturalSize = { width: 64, height: 32 }

  vi.stubGlobal('Image', MockImage)

  contextMock = {
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    imageSmoothingEnabled: false,
    imageSmoothingQuality: '',
  }

  getContextSpy = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(contextMock as unknown as CanvasRenderingContext2D) as unknown as ReturnType<
    typeof vi.fn
  >

  if (originalToBlob) {
    toBlobSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation((callback: BlobCallback) => {
        callback(new Blob(['png'], { type: 'image/png' }))
      }) as unknown as ReturnType<typeof vi.fn>
  } else {
    const toBlobSpyFn = vi.fn() as unknown as (...args: unknown[]) => void
    toBlobSpy = toBlobSpyFn as unknown as ReturnType<typeof vi.fn>
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: BlobCallback) => {
        toBlobSpyFn(callback)
        callback(new Blob(['png'], { type: 'image/png' }))
      },
      writable: true,
    })
  }

  const url = URL as Partial<typeof URL>
  if (!url.createObjectURL) {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:mock'),
      writable: true,
    })
  }
  if (!url.revokeObjectURL) {
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(() => undefined),
      writable: true,
    })
  }
})

afterEach(() => {
  getContextSpy?.mockRestore()
  toBlobSpy?.mockRestore()
  vi.unstubAllGlobals()

  if (!originalToBlob) {
    delete (HTMLCanvasElement.prototype as { toBlob?: unknown }).toBlob
  }
})

describe('convertImageToIco', () => {
  it('throws when size exceeds maximum', async () => {
    await expect(
      convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
        sizes: [512],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: false,
      }),
    ).rejects.toThrow('INVALID_SIZE')
  })

  it('throws when no sizes are selected', async () => {
    await expect(
      convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
        sizes: [],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: false,
      }),
    ).rejects.toThrow('NO_SIZES_SELECTED')
  })

  it('generates an ICO with background and optimization', async () => {
    const result = await convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
      sizes: [32, 16, 16, Number.NaN, -5],
      padding: 10,
      backgroundEnabled: true,
      backgroundColor: '#00ff00',
      optimize: true,
    })

    expect(result).toBeInstanceOf(Blob)
    expect(convertToBlobAsyncMock).toHaveBeenCalledTimes(1)
    expect(convertToBlobAsyncMock.mock.calls[0]?.[0]).toHaveLength(2)
    expect(optimizePNG).toHaveBeenCalledTimes(2)
    expect(contextMock?.fillRect).toHaveBeenCalled()
  })

  it('falls back to rendered dimensions when natural size is missing', async () => {
    nextNaturalSize = { width: 0, height: 0 }
    nextImageSize = { width: 80, height: 40 }

    await convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
      sizes: [32],
      padding: Number.NaN,
      backgroundEnabled: false,
      backgroundColor: '#ffffff',
      optimize: false,
    })

    expect(contextMock?.drawImage).toHaveBeenCalled()
  })

  it('skips optimization when disabled', async () => {
    await convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
      sizes: [16],
      padding: 0,
      backgroundEnabled: false,
      backgroundColor: '#ffffff',
      optimize: false,
    })

    expect(optimizePNG).not.toHaveBeenCalled()
  })

  it('throws when the image fails to load', async () => {
    nextImageBehavior = 'error'

    await expect(
      convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
        sizes: [16],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: false,
      }),
    ).rejects.toThrow('INVALID_IMAGE')
  })

  it('throws when the image has no dimensions', async () => {
    nextNaturalSize = { width: 0, height: 0 }
    nextImageSize = { width: 0, height: 0 }

    await expect(
      convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
        sizes: [16],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: false,
      }),
    ).rejects.toThrow('INVALID_IMAGE')
  })

  it('throws when canvas context is unavailable', async () => {
    getContextSpy?.mockReturnValueOnce(null)

    await expect(
      convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
        sizes: [16],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: false,
      }),
    ).rejects.toThrow('CANVAS_CONTEXT_UNAVAILABLE')
  })

  it('throws when PNG conversion fails', async () => {
    if (originalToBlob) {
      toBlobSpy?.mockImplementationOnce((callback: BlobCallback) => {
        callback(null)
      })
    } else {
      const original = HTMLCanvasElement.prototype.toBlob
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: (callback: BlobCallback) => {
          callback(null)
        },
        writable: true,
      })
      try {
        await expect(
          convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
            sizes: [16],
            padding: 0,
            backgroundEnabled: false,
            backgroundColor: '#ffffff',
            optimize: false,
          }),
        ).rejects.toThrow('IMAGE_CONVERSION_FAILED')
      } finally {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: original,
          writable: true,
        })
      }

      return
    }

    await expect(
      convertImageToIco(new Blob(['png'], { type: 'image/png' }), {
        sizes: [16],
        padding: 0,
        backgroundEnabled: false,
        backgroundColor: '#ffffff',
        optimize: false,
      }),
    ).rejects.toThrow('IMAGE_CONVERSION_FAILED')
  })
})
