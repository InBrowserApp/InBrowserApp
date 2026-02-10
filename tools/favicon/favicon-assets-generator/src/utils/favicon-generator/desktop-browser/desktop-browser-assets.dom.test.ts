import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getHTMLCode } from './get-html-code'
import type { DesktopBrowserOptions } from './types'

const generateFaviconICO = vi.hoisted(() => vi.fn(async () => new Blob(['ico'])))
const generateFaviconSVG = vi.hoisted(() => vi.fn(async () => new Blob(['svg'])))
const generateFaviconPNG = vi.hoisted(() =>
  vi.fn(
    async (_image: Blob, _options: DesktopBrowserOptions, size: number) =>
      new Blob([String(size)], { type: 'image/png' }),
  ),
)

vi.mock('./generate-favicon-ico', () => ({ generateFaviconICO }))
vi.mock('./generate-favicon-svg', () => ({ generateFaviconSVG }))
vi.mock('./generate-favicon-png', () => ({ generateFaviconPNG }))

let generateAssets: typeof import('./generate-assets').generateAssets

beforeAll(async () => {
  ;({ generateAssets } = await import('./generate-assets'))
})

const baseOptions: DesktopBrowserOptions = {
  original: true,
  background: false,
  backgroundColor: '#ffffff',
  backgroundRadius: 0,
  margin: 0,
}

describe('desktop-browser utilities', () => {
  beforeEach(() => {
    generateFaviconICO.mockClear()
    generateFaviconSVG.mockClear()
    generateFaviconPNG.mockClear()
  })

  it('returns empty html when no image is provided', () => {
    expect(getHTMLCode(undefined, baseOptions)).toBe('')
  })

  it('returns svg html when original svg is used', () => {
    const svg = new Blob(['<svg />'], { type: 'image/svg+xml' })
    const html = getHTMLCode(svg, { ...baseOptions, original: true })
    expect(html).toContain('favicon.svg')
    expect(html).toContain('image/svg+xml')
  })

  it('returns png html when raster image is used', () => {
    const png = new Blob(['png'], { type: 'image/png' })
    const html = getHTMLCode(png, { ...baseOptions, original: false })
    expect(html).toContain('favicon-32x32.png')
    expect(html).toContain('favicon-16x16.png')
  })

  it('generates svg assets when original svg is used', async () => {
    const svg = new Blob(['<svg />'], { type: 'image/svg+xml' })
    const files = await generateAssets(svg, { ...baseOptions, original: true })

    expect(files.map((file) => file.name)).toEqual(['favicon.ico', 'favicon.svg'])
    expect(generateFaviconSVG).toHaveBeenCalledTimes(1)
    expect(generateFaviconPNG).not.toHaveBeenCalled()
  })

  it('generates png assets when raster image is used', async () => {
    const png = new Blob(['png'], { type: 'image/png' })
    const files = await generateAssets(png, { ...baseOptions, original: false })

    expect(files.map((file) => file.name)).toEqual([
      'favicon.ico',
      'favicon-32x32.png',
      'favicon-16x16.png',
    ])
    expect(generateFaviconPNG).toHaveBeenCalledWith(png, expect.any(Object), 32)
    expect(generateFaviconPNG).toHaveBeenCalledWith(png, expect.any(Object), 16)
  })

  it('throws when image is undefined', async () => {
    await expect(generateAssets(undefined, baseOptions)).rejects.toThrow('image is undefined')
  })
})
