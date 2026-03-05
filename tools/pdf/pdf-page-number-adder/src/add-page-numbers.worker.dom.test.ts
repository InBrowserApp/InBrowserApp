import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const drawTextMock = vi.fn()
const getSizeMock = vi.fn()
const widthOfTextAtSizeMock = vi.fn()
const embedFontMock = vi.fn()
const saveMock = vi.fn()
const getPagesMock = vi.fn()
const loadMock = vi.fn()
const rgbMock = vi.fn()

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    load: (...args: unknown[]) => loadMock(...args),
  },
  StandardFonts: {
    Helvetica: 'Helvetica',
  },
  rgb: (...args: unknown[]) => rgbMock(...args),
}))

const postMessageMock = vi.fn()

describe('add-page-numbers worker', () => {
  beforeEach(() => {
    vi.resetModules()
    drawTextMock.mockReset()
    getSizeMock.mockReset()
    widthOfTextAtSizeMock.mockReset()
    embedFontMock.mockReset()
    saveMock.mockReset()
    getPagesMock.mockReset()
    loadMock.mockReset()
    rgbMock.mockReset()
    postMessageMock.mockReset()

    getSizeMock.mockReturnValue({ width: 600, height: 800 })
    widthOfTextAtSizeMock.mockImplementation(
      (text: string, size: number) => text.length * size * 0.5,
    )
    embedFontMock.mockResolvedValue({
      widthOfTextAtSize: widthOfTextAtSizeMock,
    })
    saveMock.mockResolvedValue(new Uint8Array([1, 2, 3]))

    getPagesMock.mockReturnValue([
      {
        getSize: getSizeMock,
        drawText: drawTextMock,
      },
      {
        getSize: getSizeMock,
        drawText: drawTextMock,
      },
      {
        getSize: getSizeMock,
        drawText: drawTextMock,
      },
    ])

    loadMock.mockResolvedValue({
      getPages: getPagesMock,
      embedFont: embedFontMock,
      save: saveMock,
    })

    rgbMock.mockReturnValue({ r: 0, g: 0, b: 0 })
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
  })

  it('adds page numbers and posts success payload', async () => {
    await import('./add-page-numbers.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1, 3],
        startNumber: 5,
        format: 'n-total',
        position: 'bottom-right',
        fontSize: 12,
        marginX: 20,
        marginY: 24,
        outputFileName: 'result-name',
      },
    } as MessageEvent)

    expect(drawTextMock).toHaveBeenNthCalledWith(
      1,
      '5/3',
      expect.objectContaining({ size: 12, y: 24 }),
    )
    expect(drawTextMock).toHaveBeenNthCalledWith(
      2,
      '6/3',
      expect.objectContaining({ size: 12, y: 24 }),
    )

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: true,
      result: {
        file: {
          name: 'result-name.pdf',
          blob: expect.any(Blob),
        },
      },
    })
  })

  it('returns encrypted error code for encrypted pdf', async () => {
    loadMock.mockRejectedValueOnce(Object.assign(new Error('enc'), { name: 'EncryptedPDFError' }))

    await import('./add-page-numbers.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        startNumber: 1,
        format: 'n',
        position: 'bottom-center',
        fontSize: 12,
        marginX: 20,
        marginY: 24,
        outputFileName: '',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.Encrypted,
    })
  })

  it('returns generic add failure code', async () => {
    loadMock.mockRejectedValueOnce(new Error('broken'))

    await import('./add-page-numbers.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        startNumber: 1,
        format: 'n',
        position: 'bottom-center',
        fontSize: 12,
        marginX: 20,
        marginY: 24,
        outputFileName: 'x',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.AddFailed,
    })
  })
})
