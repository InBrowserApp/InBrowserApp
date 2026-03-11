import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const drawTextMock = vi.fn()
const drawImageMock = vi.fn()
const getSizeMock = vi.fn()
const widthOfTextAtSizeMock = vi.fn()
const embedFontMock = vi.fn()
const embedPngMock = vi.fn()
const embedJpgMock = vi.fn()
const saveMock = vi.fn()
const getPageMock = vi.fn()
const loadMock = vi.fn()
const rgbMock = vi.fn()
const degreesMock = vi.fn((value: number) => ({ angle: value }))

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    load: (...args: unknown[]) => loadMock(...args),
  },
  StandardFonts: {
    Helvetica: 'Helvetica',
    TimesRoman: 'TimesRoman',
  },
  degrees: (value: number) => degreesMock(value),
  rgb: (red: number, green: number, blue: number) => rgbMock(red, green, blue),
}))

const postMessageMock = vi.fn()

describe('apply-watermark worker', () => {
  beforeEach(() => {
    vi.resetModules()
    drawTextMock.mockReset()
    drawImageMock.mockReset()
    getSizeMock.mockReset()
    widthOfTextAtSizeMock.mockReset()
    embedFontMock.mockReset()
    embedPngMock.mockReset()
    embedJpgMock.mockReset()
    saveMock.mockReset()
    getPageMock.mockReset()
    loadMock.mockReset()
    rgbMock.mockReset()
    degreesMock.mockClear()
    postMessageMock.mockReset()

    getSizeMock.mockReturnValue({ width: 600, height: 800 })
    widthOfTextAtSizeMock.mockImplementation(
      (text: string, size: number) => text.length * size * 0.5,
    )
    embedFontMock.mockResolvedValue({
      widthOfTextAtSize: widthOfTextAtSizeMock,
    })
    embedPngMock.mockResolvedValue({
      width: 400,
      height: 200,
    })
    embedJpgMock.mockResolvedValue({
      width: 400,
      height: 200,
    })
    saveMock.mockResolvedValue(new Uint8Array([1, 2, 3]))

    const page = {
      getSize: getSizeMock,
      drawText: drawTextMock,
      drawImage: drawImageMock,
    }

    getPageMock.mockImplementation(() => page)

    loadMock.mockResolvedValue({
      getPage: getPageMock,
      embedFont: embedFontMock,
      embedPng: embedPngMock,
      embedJpg: embedJpgMock,
      save: saveMock,
    })

    rgbMock.mockReturnValue({ r: 0, g: 0, b: 0 })
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
  })

  it('adds text watermark and posts success payload', async () => {
    await import('./apply-watermark.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        mode: 'text',
        text: 'CONFIDENTIAL',
        fontFamily: 'serif',
        fontSize: 48,
        color: '#336699',
        opacity: 20,
        rotation: -35,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        imageFile: null,
        imageScale: 28,
        outputFileName: 'result-name',
      },
    } as MessageEvent)

    expect(embedFontMock).toHaveBeenCalledWith('TimesRoman')
    expect(drawTextMock).toHaveBeenCalledWith(
      'CONFIDENTIAL',
      expect.objectContaining({
        size: 48,
        opacity: 0.2,
        rotate: { angle: -35 },
      }),
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

  it('adds image watermark with png embedding', async () => {
    await import('./apply-watermark.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1, 2],
        mode: 'image',
        text: '',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 55,
        rotation: 15,
        position: 'top-right',
        offsetX: 4,
        offsetY: -8,
        imageFile: new File(['img'], 'logo.png', { type: 'image/png' }),
        imageScale: 25,
        outputFileName: '',
      },
    } as MessageEvent)

    expect(embedPngMock).toHaveBeenCalled()
    expect(drawImageMock).toHaveBeenCalledWith(
      expect.objectContaining({ width: 400, height: 200 }),
      expect.objectContaining({
        width: 150,
        height: 75,
        opacity: 0.55,
        rotate: { angle: 15 },
      }),
    )
  })

  it('returns invalid image code for unsupported image files', async () => {
    await import('./apply-watermark.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        mode: 'image',
        text: '',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 20,
        rotation: 0,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        imageFile: new File(['gif'], 'logo.gif', { type: 'image/gif' }),
        imageScale: 30,
        outputFileName: '',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.InvalidImage,
    })
  })

  it('returns encrypted error code for encrypted pdf', async () => {
    loadMock.mockRejectedValueOnce(Object.assign(new Error('enc'), { name: 'EncryptedPDFError' }))

    await import('./apply-watermark.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        mode: 'text',
        text: 'x',
        fontFamily: 'sans-serif',
        fontSize: 24,
        color: '#000000',
        opacity: 20,
        rotation: 0,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        imageFile: null,
        imageScale: 30,
        outputFileName: '',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.Encrypted,
    })
  })
})
