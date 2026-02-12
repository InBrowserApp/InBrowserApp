import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PdfJsStandardFontDataFactory } from './pdfjs-standard-font-data-factory'

const fetchMock = vi.fn<typeof fetch>()

vi.stubGlobal('fetch', fetchMock)

describe('PdfJsStandardFontDataFactory', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('fetches known standard font files', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer,
    } as Response)

    const factory = new PdfJsStandardFontDataFactory()
    const bytes = await factory.fetch({ filename: 'FoxitDingbats.pfb' })

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(Array.from(bytes)).toEqual([1, 2, 3])
  })

  it('throws when font is unsupported', async () => {
    const factory = new PdfJsStandardFontDataFactory()

    await expect(factory.fetch({ filename: 'unknown.ttf' })).rejects.toThrow(
      'Unsupported standard font',
    )
  })

  it('throws when fetch fails', async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response)
    const factory = new PdfJsStandardFontDataFactory()

    await expect(factory.fetch({ filename: 'FoxitFixed.pfb' })).rejects.toThrow(
      'Failed to load standard font',
    )
  })
})
