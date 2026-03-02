import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const addPageMock = vi.fn()
const copyPagesMock = vi.fn()
const saveMock = vi.fn()
const getPageCountMock = vi.fn()

const createMock = vi.fn(async () => ({
  copyPages: copyPagesMock,
  addPage: addPageMock,
  save: saveMock,
}))

const loadMock = vi.fn(async () => ({
  getPageCount: getPageCountMock,
}))

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: createMock,
    load: loadMock,
  },
}))

const postMessageMock = vi.fn()

describe('split-pdf worker', () => {
  beforeEach(() => {
    vi.resetModules()
    addPageMock.mockReset()
    copyPagesMock.mockReset()
    saveMock.mockReset()
    getPageCountMock.mockReset()
    createMock.mockClear()
    loadMock.mockClear()
    postMessageMock.mockReset()

    copyPagesMock.mockResolvedValue(['p'])
    saveMock.mockResolvedValue(new Uint8Array([1, 2, 3]))
    getPageCountMock.mockReturnValue(120)
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
  })

  it('returns single-file result payload', async () => {
    await import('./split-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1, 2, 3],
        segments: [[1, 2, 3]],
        outputMode: 'single',
        multipleMode: 'ranges',
        outputBaseName: 'custom-name',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: true,
      result: {
        kind: 'single',
        file: {
          name: 'custom-name.pdf',
          blob: expect.any(Blob),
        },
      },
    })
  })

  it('returns multiple range files payload', async () => {
    await import('./split-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1, 2, 4, 5],
        segments: [
          [1, 2],
          [4, 5],
        ],
        outputMode: 'multiple',
        multipleMode: 'ranges',
        outputBaseName: 'split-output',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: true,
      result: {
        kind: 'multiple',
        files: [
          {
            name: 'split-output-part-01.pdf',
            blob: expect.any(Blob),
          },
          {
            name: 'split-output-part-02.pdf',
            blob: expect.any(Blob),
          },
        ],
      },
    })
  })

  it('returns multiple page files payload', async () => {
    await import('./split-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [2, 5],
        segments: [[2, 5]],
        outputMode: 'multiple',
        multipleMode: 'pages',
        outputBaseName: 'split-output',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: true,
      result: {
        kind: 'multiple',
        files: [
          {
            name: 'split-output-page-002.pdf',
            blob: expect.any(Blob),
          },
          {
            name: 'split-output-page-005.pdf',
            blob: expect.any(Blob),
          },
        ],
      },
    })
  })

  it('returns encrypted error code when source is encrypted', async () => {
    loadMock.mockRejectedValueOnce(Object.assign(new Error('enc'), { name: 'EncryptedPDFError' }))

    await import('./split-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        segments: [[1]],
        outputMode: 'single',
        multipleMode: 'ranges',
        outputBaseName: 'split-output',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.Encrypted,
    })
  })

  it('returns generic split failure code on unknown error', async () => {
    loadMock.mockRejectedValueOnce(new Error('broken'))

    await import('./split-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [1],
        segments: [[1]],
        outputMode: 'single',
        multipleMode: 'ranges',
        outputBaseName: 'split-output',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.SplitFailed,
    })
  })
})
