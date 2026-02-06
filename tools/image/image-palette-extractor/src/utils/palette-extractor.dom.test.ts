import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadImageData, QUALITY_PRESETS } from './palette-extractor'

const originalCreateImageBitmap = globalThis.createImageBitmap
const originalImage = globalThis.Image
const originalGetContext = HTMLCanvasElement.prototype.getContext
const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

const makeImageData = () =>
  typeof ImageData !== 'undefined'
    ? new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1)
    : ({
        data: new Uint8ClampedArray([0, 0, 0, 255]),
        width: 1,
        height: 1,
      } as ImageData)

const makeSvgFile = (svg: string, name = 'icon.svg') =>
  ({
    name,
    type: 'image/svg+xml',
    text: vi.fn().mockResolvedValue(svg),
  }) as unknown as File

const setMockImage = (ImageClass: typeof Image) => {
  vi.stubGlobal('Image', ImageClass)
  const globalWindow = (globalThis as { window?: { Image?: typeof Image } }).window
  if (globalWindow) {
    globalWindow.Image = ImageClass
  }
}

const installSvgImageMock = () => {
  class MockImage {
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

  setMockImage(MockImage as unknown as typeof Image)
}

const installCanvasContextMock = () => {
  const context = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => makeImageData()),
  }
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(context)
  return context
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi.fn(() => makeImageData()),
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
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('palette-extractor', () => {
  it('defines quality presets', () => {
    expect(QUALITY_PRESETS.fast.maxDimension).toBeLessThan(QUALITY_PRESETS.precise.maxDimension)
    expect(QUALITY_PRESETS.balanced.targetSamples).toBeGreaterThan(
      QUALITY_PRESETS.fast.targetSamples,
    )
  })

  it('loads image data from createImageBitmap and scales down', async () => {
    const close = vi.fn()
    const createImageBitmapMock = vi.fn().mockResolvedValue({ width: 200, height: 100, close })
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap =
      createImageBitmapMock

    const context = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => makeImageData()),
    }
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(context)

    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const result = await loadImageData(file, 100)

    expect(createImageBitmapMock).toHaveBeenCalledWith(file)
    expect(result.width).toBe(200)
    expect(result.height).toBe(100)
    expect(context.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 100, 50)
    expect(close).toHaveBeenCalled()
  })

  it('falls back to HTMLImageElement when createImageBitmap fails', async () => {
    const createImageBitmapMock = vi.fn().mockRejectedValue(new Error('fail'))
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap =
      createImageBitmapMock

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

    setMockImage(MockImage as unknown as typeof Image)

    const file = new File(['data'], 'fallback.png', { type: 'image/png' })
    const result = await loadImageData(file, 200)

    expect(createImageBitmapMock).toHaveBeenCalledWith(file)
    expect(result.width).toBe(40)
    expect(result.height).toBe(20)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('uses svg width and height attributes when they are available', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:svg')
    URL.revokeObjectURL = vi.fn()

    installSvgImageMock()
    const context = installCanvasContextMock()

    const file = makeSvgFile('<svg\\swidth="320"\\sheight="180"></svg>', 'size.svg')
    const result = await loadImageData(file, 500)

    expect(result.width).toBe(320)
    expect(result.height).toBe(180)
    expect(context.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 320, 180)
  })

  it('uses viewBox dimensions when width and height are absent', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:viewbox')
    URL.revokeObjectURL = vi.fn()

    installSvgImageMock()

    const file = makeSvgFile('<svg\\sviewBox="0 0 320 200"></svg>', 'viewbox.svg')
    const result = await loadImageData(file, 500)

    expect(result.width).toBe(320)
    expect(result.height).toBe(200)
  })

  it('uses viewBox height when only width is provided', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:viewbox-width')
    URL.revokeObjectURL = vi.fn()

    installSvgImageMock()

    const file = makeSvgFile('<svg\\swidth="120"\\sviewBox="0 0 300 180"></svg>', 'w.svg')
    const result = await loadImageData(file, 500)

    expect(result.width).toBe(120)
    expect(result.height).toBe(180)
  })

  it('uses viewBox width when only height is provided', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:viewbox-height')
    URL.revokeObjectURL = vi.fn()

    installSvgImageMock()

    const file = makeSvgFile('<svg\\sheight="90"\\sviewBox="0 0 300 0"></svg>', 'h.svg')
    const result = await loadImageData(file, 500)

    expect(result.width).toBe(300)
    expect(result.height).toBe(90)
  })

  it('falls back when viewBox does not contain four values', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:bad-viewbox')
    URL.revokeObjectURL = vi.fn()

    installSvgImageMock()

    const file = makeSvgFile('<svg\\sviewBox="0 0 120"></svg>', 'short-viewbox.svg')
    const result = await loadImageData(file, 500)

    expect(result.width).toBe(300)
    expect(result.height).toBe(150)
  })

  it('falls back when svg lengths are malformed', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:malformed')
    URL.revokeObjectURL = vi.fn()

    installSvgImageMock()

    const file = makeSvgFile(
      '<svg\\swidth="abc"\\sheight="."\\sviewBox="0 0 nope 200"></svg>',
      'malformed.svg',
    )
    const result = await loadImageData(file, 500)

    expect(result.width).toBe(300)
    expect(result.height).toBe(150)
  })

  it('falls back when svg dimension parsing fails', async () => {
    const createImageBitmapMock = vi.fn()
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap =
      createImageBitmapMock

    URL.createObjectURL = vi.fn(() => 'blob:svg')
    URL.revokeObjectURL = vi.fn()

    class MockImage {
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

    setMockImage(MockImage as unknown as typeof Image)

    const file = {
      name: 'icon.svgz',
      type: '',
      text: vi.fn().mockRejectedValue(new Error('parse-error')),
    } as unknown as File

    const context = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => makeImageData()),
    }
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(context)

    const result = await loadImageData(file, 400)

    expect(createImageBitmapMock).not.toHaveBeenCalled()
    expect(file.text).toHaveBeenCalled()
    expect(result.width).toBe(300)
    expect(result.height).toBe(150)
    expect(context.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 300, 150)
  })

  it('defaults to fallback size when svg dimensions are invalid', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:svg')
    URL.revokeObjectURL = vi.fn()

    class MockImage {
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

    setMockImage(MockImage as unknown as typeof Image)

    const svg = '<svg width="0" height="0"></svg>'
    const file = new File([svg], 'empty.svg', { type: 'image/svg+xml' })
    ;(file as File & { text: () => Promise<string> }).text = vi.fn().mockResolvedValue(svg)

    const context = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => makeImageData()),
    }
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(context)

    const result = await loadImageData(file, 100)

    expect(result.width).toBe(300)
    expect(result.height).toBe(150)
    expect(context.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0, 100, 50)
  })

  it('returns fallback size when svg tag is missing', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:svg')
    URL.revokeObjectURL = vi.fn()

    class MockImage {
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

    setMockImage(MockImage as unknown as typeof Image)

    const file = makeSvgFile('<div>not svg</div>', 'broken.svg')
    const result = await loadImageData(file, 200)

    expect(result.width).toBe(300)
    expect(result.height).toBe(150)
  })

  it('throws when canvas context is unavailable', async () => {
    const close = vi.fn()
    ;(globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap = vi
      .fn()
      .mockResolvedValue({ width: 10, height: 10, close })

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null)

    const file = new File(['data'], 'broken.png', { type: 'image/png' })

    await expect(loadImageData(file, 10)).rejects.toThrow('canvas')
    expect(close).toHaveBeenCalled()
  })

  it('throws when image fails to load', async () => {
    delete (globalThis as { createImageBitmap?: typeof createImageBitmap }).createImageBitmap

    URL.createObjectURL = vi.fn(() => 'blob:broken')
    URL.revokeObjectURL = vi.fn()

    class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_value: string) {
        this.onerror?.()
      }
    }

    setMockImage(MockImage as unknown as typeof Image)

    const file = new File(['data'], 'broken.png', { type: 'image/png' })

    await expect(loadImageData(file, 50)).rejects.toThrow('image-load')
  })
})
