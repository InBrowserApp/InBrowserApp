import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RenderPageOptions } from '../types'
import { PdfToImageRenderer } from './pdf-to-image-renderer'

const loadPdfDocumentMock = vi.fn()

vi.mock('./pdfjs', () => ({
  loadPdfDocument: (...args: unknown[]) => loadPdfDocumentMock(...args),
}))

describe('PdfToImageRenderer', () => {
  const defaultOptions: RenderPageOptions = {
    dpi: 144,
    format: 'png',
    quality: 0.9,
  }

  const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })

  const mockPage = {
    getViewport: vi.fn(() => ({ width: 120, height: 80 })),
    render: vi.fn(() => ({ promise: Promise.resolve() })),
    cleanup: vi.fn(),
  }

  const mockDocument = {
    numPages: 3,
    getPage: vi.fn(async () => mockPage),
    destroy: vi.fn(async () => undefined),
  }

  const originalCreateElement = document.createElement.bind(document)
  const createElementSpy = vi.spyOn(document, 'createElement')
  const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL')
  const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

  beforeEach(() => {
    vi.clearAllMocks()

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(mockDocument),
    })

    createObjectURLSpy.mockReturnValue('blob:pdf')
    revokeObjectURLSpy.mockImplementation(() => undefined)

    createElementSpy.mockImplementation((tagName: string) => {
      if (tagName !== 'canvas') {
        return originalCreateElement(tagName)
      }

      const canvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({ fillRect: vi.fn() })),
        toBlob: vi.fn((callback: BlobCallback) => {
          callback(new Blob(['ok'], { type: 'image/png' }))
        }),
        remove: vi.fn(),
      }

      return canvas as unknown as HTMLElement
    })
  })

  afterEach(() => {
    createElementSpy.mockReset()
  })

  it('loads page count and renders page image', async () => {
    const renderer = new PdfToImageRenderer(file)

    expect(await renderer.getNumPages()).toBe(3)
    const image = await renderer.renderPage(1, defaultOptions)

    expect(loadPdfDocumentMock).toHaveBeenCalledWith('blob:pdf')
    expect(mockDocument.getPage).toHaveBeenCalledWith(1)
    expect(image.page).toBe(1)
    expect(image.width).toBe(120)
    expect(image.height).toBe(80)
    expect(image.blob).toBeInstanceOf(Blob)
  })

  it('reuses cached render result for same page options', async () => {
    const renderer = new PdfToImageRenderer(file)

    const first = await renderer.renderPage(2, defaultOptions)
    const second = await renderer.renderPage(2, defaultOptions)

    expect(first).toBe(second)
    expect(mockDocument.getPage).toHaveBeenCalledTimes(1)
  })

  it('throws when canvas context is unavailable', async () => {
    createElementSpy.mockImplementation((tagName: string) => {
      if (tagName !== 'canvas') {
        return originalCreateElement(tagName)
      }

      return {
        width: 0,
        height: 0,
        getContext: vi.fn(() => null),
        toBlob: vi.fn(),
        remove: vi.fn(),
      } as unknown as HTMLElement
    })

    const renderer = new PdfToImageRenderer(file)

    await expect(renderer.renderPage(1, defaultOptions)).rejects.toThrow(
      'CANVAS_CONTEXT_UNAVAILABLE',
    )
  })

  it('throws when canvas toBlob fails', async () => {
    createElementSpy.mockImplementation((tagName: string) => {
      if (tagName !== 'canvas') {
        return originalCreateElement(tagName)
      }

      return {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({ fillRect: vi.fn() })),
        toBlob: vi.fn((callback: BlobCallback) => {
          callback(null)
        }),
        remove: vi.fn(),
      } as unknown as HTMLElement
    })

    const renderer = new PdfToImageRenderer(file)

    await expect(renderer.renderPage(1, defaultOptions)).rejects.toThrow('CANVAS_TO_BLOB_FAILED')
  })

  it('destroys pdf document and revokes object url', async () => {
    const renderer = new PdfToImageRenderer(file)

    await renderer.getNumPages()
    await renderer.destroy()

    expect(mockDocument.destroy).toHaveBeenCalledOnce()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:pdf')
  })
})
