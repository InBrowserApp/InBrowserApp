import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { DesktopBrowserOptions } from './desktop-browser/types'
import type { iOSWebClipOptions } from './ios-web-clip/types'
import type { PWAOptions } from './pwa/types'
import { generateFaviconPNG } from './desktop-browser/generate-favicon-png'
import { generateOutput as generateIosOutput } from './ios-web-clip/generate-output'
import { generatePWAMaskablePNG } from './pwa/generate-pwa-maskable-png'
import { generatePWAPNG } from './pwa/generate-pwa-png'

const getImageSizeMock = vi.hoisted(() => vi.fn())
const optimizePNGMock = vi.hoisted(() => vi.fn(async (blob: Blob) => blob))

vi.mock('@utils/image', async () => {
  const actual = await vi.importActual<typeof import('@utils/image')>('@utils/image')
  return {
    ...actual,
    getImageSize: getImageSizeMock,
    optimizePNG: optimizePNGMock,
  }
})

const originalToBlob =
  typeof HTMLCanvasElement.prototype.toBlob === 'function'
    ? HTMLCanvasElement.prototype.toBlob
    : undefined

const originalCreateObjectURL = (URL as { createObjectURL?: typeof URL.createObjectURL })
  .createObjectURL

let getContextSpy: ReturnType<typeof vi.fn> | null = null
let toBlobSpy: ReturnType<typeof vi.fn> | null = null
let createObjectURLSpy: ReturnType<typeof vi.fn> | null = null
let contextMock: {
  fillStyle: string
  roundRect: ReturnType<typeof vi.fn>
  fillRect: ReturnType<typeof vi.fn>
  fill: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
} | null = null

let nextImageBehavior: 'load' | 'error' = 'load'

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  set src(_value: string) {
    Promise.resolve().then(() => {
      if (nextImageBehavior === 'error') {
        this.onerror?.()
      } else {
        this.onload?.()
      }
    })
  }
}

const baseDesktopOptions: DesktopBrowserOptions = {
  original: false,
  background: true,
  backgroundColor: '#112233',
  backgroundRadius: 20,
  margin: 10,
}

const basePwaOptions: PWAOptions = {
  background: true,
  backgroundColor: '#334455',
  backgroundRadius: 10,
  maskable: true,
  maskableBackgroundColor: '#556677',
  maskableMargin: 12,
  margin: 8,
}

const baseIosOptions: iOSWebClipOptions = {
  backgroundColor: '#778899',
  margin: 8,
}

beforeEach(() => {
  getImageSizeMock.mockReset()
  optimizePNGMock.mockReset()

  getImageSizeMock.mockResolvedValue({ width: 40, height: 20 })
  optimizePNGMock.mockImplementation(async (blob: Blob) => blob)

  nextImageBehavior = 'load'

  vi.stubGlobal('Image', MockImage)

  contextMock = {
    fillStyle: '',
    roundRect: vi.fn(),
    fillRect: vi.fn(),
    fill: vi.fn(),
    drawImage: vi.fn(),
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

  if (originalCreateObjectURL) {
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
  } else {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:mock'),
      writable: true,
    })
  }
})

afterEach(() => {
  getContextSpy?.mockRestore()
  toBlobSpy?.mockRestore()
  createObjectURLSpy?.mockRestore()

  vi.unstubAllGlobals()

  if (!originalToBlob) {
    delete (HTMLCanvasElement.prototype as { toBlob?: unknown }).toBlob
  }

  if (!originalCreateObjectURL) {
    delete (URL as { createObjectURL?: unknown }).createObjectURL
  }
})

describe('raster output generators', () => {
  it('generates a favicon png using option image', async () => {
    const image = new Blob(['favicon'], { type: 'image/png' })
    const options = { ...baseDesktopOptions, image }

    const result = await generateFaviconPNG(undefined, options, 64)

    expect(getImageSizeMock).toHaveBeenCalledWith(image)
    expect(contextMock?.roundRect).toHaveBeenCalled()
    expect(contextMock?.drawImage).toHaveBeenCalled()
    expect(optimizePNGMock).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Blob)
  })

  it('throws when favicon image is missing', async () => {
    await expect(
      generateFaviconPNG(undefined, { ...baseDesktopOptions, image: undefined }, 32),
    ).rejects.toThrow('image is undefined')
  })

  it('generates a pwa png and handles load errors', async () => {
    const image = new Blob(['pwa'], { type: 'image/png' })
    const options = { ...basePwaOptions, image }

    nextImageBehavior = 'error'

    await expect(generatePWAPNG(image, options, 96)).rejects.toThrow('Image failed to load')

    nextImageBehavior = 'load'
    const result = await generatePWAPNG(image, options, 96)

    expect(optimizePNGMock).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Blob)
  })

  it('generates a maskable pwa png from maskable image', async () => {
    const maskableImage = new Blob(['maskable'], { type: 'image/png' })
    const options = { ...basePwaOptions, maskableImage }

    const result = await generatePWAMaskablePNG(undefined, options, 128)

    expect(getImageSizeMock).toHaveBeenCalledWith(maskableImage)
    expect(contextMock?.fillRect).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Blob)
  })

  it('throws when maskable image is missing', async () => {
    await expect(
      generatePWAMaskablePNG(undefined, { ...basePwaOptions, maskableImage: undefined }, 128),
    ).rejects.toThrow('image is undefined')
  })

  it('generates iOS web clip output using options image', async () => {
    const image = new Blob(['ios'], { type: 'image/png' })
    const options = { ...baseIosOptions, image }

    const result = await generateIosOutput(undefined, options)

    expect(getImageSizeMock).toHaveBeenCalledWith(image)
    expect(contextMock?.fillRect).toHaveBeenCalled()
    expect(optimizePNGMock).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Blob)
  })

  it('throws when iOS output image is missing', async () => {
    await expect(
      generateIosOutput(undefined, { ...baseIosOptions, image: undefined }),
    ).rejects.toThrow('image is undefined')
  })
})
