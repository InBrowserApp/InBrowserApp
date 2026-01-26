import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { rasterizeSvg } from './raster'

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  set src(_value: string) {
    this.onload?.()
  }
}

const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>'

let getContextSpy: ReturnType<typeof vi.fn> | null = null
let contextMock: {
  fillStyle: string
  fillRect: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
} | null = null

const originalToBlob =
  typeof HTMLCanvasElement.prototype.toBlob === 'function'
    ? HTMLCanvasElement.prototype.toBlob
    : undefined

beforeEach(() => {
  vi.stubGlobal('Image', MockImage)
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:mock'),
    revokeObjectURL: vi.fn(),
  })

  contextMock = {
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  }

  getContextSpy = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(contextMock as unknown as CanvasRenderingContext2D) as unknown as ReturnType<
    typeof vi.fn
  >

  if (originalToBlob) {
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback: BlobCallback) => {
      callback(new Blob(['ok'], { type: 'image/png' }))
    })
  } else {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: BlobCallback) => {
        callback(new Blob(['ok'], { type: 'image/png' }))
      },
      writable: true,
    })
  }
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()

  if (!originalToBlob) {
    delete (HTMLCanvasElement.prototype as { toBlob?: unknown }).toBlob
  }
})

describe('rasterizeSvg', () => {
  it('renders SVG to a raster blob', async () => {
    const result = await rasterizeSvg({
      svg: svgMarkup,
      width: 10,
      height: 10,
      scale: 2,
      format: 'png',
    })

    expect(result).toBeInstanceOf(Blob)
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('throws when canvas context is missing', async () => {
    if (!getContextSpy) return
    getContextSpy.mockReturnValueOnce(null)

    await expect(
      rasterizeSvg({
        svg: svgMarkup,
        width: 10,
        height: 10,
        scale: 1,
        format: 'png',
      }),
    ).rejects.toThrow('Canvas context unavailable')
  })
})
