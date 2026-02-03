import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DesktopBrowserOptions } from './types'

const generateFaviconPNGMock = vi.hoisted(() => vi.fn())
const convertToBlobAsyncMock = vi.hoisted(() => vi.fn())
const optimizeMock = vi.hoisted(() => vi.fn(() => ({ data: '<svg />' })))

vi.mock('./generate-favicon-png', () => ({ generateFaviconPNG: generateFaviconPNGMock }))

vi.mock('@utils/image', async () => {
  const actual = await vi.importActual<typeof import('@utils/image')>('@utils/image')
  return {
    ...actual,
    PngIcoConverter: class {
      convertToBlobAsync = convertToBlobAsyncMock
    },
  }
})

vi.mock('svgo/browser', () => ({ optimize: optimizeMock }))

import { generateFaviconICO } from './generate-favicon-ico'
import { generateFaviconSVG } from './generate-favicon-svg'

const baseOptions: DesktopBrowserOptions = {
  original: false,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  margin: 0,
}

describe('generateFaviconICO', () => {
  beforeEach(() => {
    generateFaviconPNGMock.mockReset()
    convertToBlobAsyncMock.mockReset()
  })

  it('creates an ico from resized pngs', async () => {
    const png = new Blob(['png'], { type: 'image/png' })
    const ico = new Blob(['ico'], { type: 'image/x-icon' })

    generateFaviconPNGMock.mockResolvedValue(new Blob(['resized'], { type: 'image/png' }))
    convertToBlobAsyncMock.mockResolvedValue(ico)

    const result = await generateFaviconICO(png, baseOptions)

    expect(generateFaviconPNGMock.mock.calls.map((call) => call[2])).toEqual([48, 32, 16])
    expect(convertToBlobAsyncMock).toHaveBeenCalledWith([
      { png: expect.any(Blob) },
      { png: expect.any(Blob) },
      { png: expect.any(Blob) },
    ])
    expect(result).toBe(ico)
  })
})

describe('generateFaviconSVG', () => {
  beforeEach(() => {
    optimizeMock.mockClear()
  })

  it('throws when no image is available', async () => {
    await expect(generateFaviconSVG(undefined as unknown as Blob, baseOptions)).rejects.toThrow(
      'image is undefined',
    )
  })

  it('throws when the image is not svg', async () => {
    const png = new Blob(['png'], { type: 'image/png' })
    await expect(generateFaviconSVG(png, baseOptions)).rejects.toThrow('image is not svg')
  })

  it('optimizes svg content and returns a new blob', async () => {
    optimizeMock.mockReturnValue({ data: '<svg>optimized</svg>' })
    const svg = new Blob(['<svg />'], { type: 'image/svg+xml' })

    const result = await generateFaviconSVG(svg, baseOptions)

    expect(optimizeMock).toHaveBeenCalledWith('<svg />', expect.any(Object))
    expect(result.type).toBe('image/svg+xml')
    await expect(result.text()).resolves.toContain('optimized')
  })
})
