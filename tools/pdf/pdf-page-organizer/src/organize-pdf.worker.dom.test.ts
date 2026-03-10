import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const setRotationMock = vi.fn()
const addPageMock = vi.fn()
const copyPagesMock = vi.fn()
const saveMock = vi.fn()
const createMock = vi.fn(async () => ({
  copyPages: copyPagesMock,
  addPage: addPageMock,
  save: saveMock,
}))
const loadMock = vi.fn()

vi.mock('pdf-lib', () => ({
  degrees: (value: number) => value,
  PDFDocument: {
    create: createMock,
    load: loadMock,
  },
}))

const postMessageMock = vi.fn()

describe('organize-pdf worker', () => {
  beforeEach(() => {
    vi.resetModules()
    setRotationMock.mockReset()
    addPageMock.mockReset()
    copyPagesMock.mockReset()
    saveMock.mockReset()
    createMock.mockClear()
    loadMock.mockReset()
    postMessageMock.mockReset()

    copyPagesMock.mockResolvedValue([
      { setRotation: setRotationMock },
      { setRotation: setRotationMock },
    ])
    saveMock.mockResolvedValue(new Uint8Array([1, 2, 3]))
    loadMock.mockResolvedValue({})
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
  })

  it('returns organized file payload', async () => {
    await import('./organize-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [
          { sourcePageNumber: 2, rotation: 180 },
          { sourcePageNumber: 1, rotation: 90 },
        ],
        outputFileName: 'organized-output',
      },
    } as MessageEvent)

    expect(copyPagesMock).toHaveBeenCalledWith({}, [1, 0])
    expect(setRotationMock).toHaveBeenNthCalledWith(1, 180)
    expect(setRotationMock).toHaveBeenNthCalledWith(2, 90)
    expect(addPageMock).toHaveBeenCalledTimes(2)
    expect(postMessageMock).toHaveBeenCalledWith({
      ok: true,
      result: {
        file: {
          name: 'organized-output.pdf',
          blob: expect.any(Blob),
        },
      },
    })
  })

  it('maps encrypted and export errors', async () => {
    loadMock.mockRejectedValueOnce(Object.assign(new Error('enc'), { name: 'EncryptedPDFError' }))

    await import('./organize-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [{ sourcePageNumber: 1, rotation: 0 }],
        outputFileName: 'out',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenLastCalledWith({
      ok: false,
      code: PDF_ERROR.Encrypted,
    })

    vi.resetModules()
    loadMock.mockRejectedValueOnce(new Error('broken'))
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
    await import('./organize-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [{ sourcePageNumber: 1, rotation: 0 }],
        outputFileName: 'out',
      },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenLastCalledWith({
      ok: false,
      code: PDF_ERROR.ExportFailed,
    })
  })

  it('skips missing copied pages and normalizes blank output names', async () => {
    copyPagesMock.mockResolvedValueOnce([undefined, { setRotation: setRotationMock }])

    await import('./organize-pdf.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: {
        file: new File(['a'], 'a.pdf', { type: 'application/pdf' }),
        pages: [
          { sourcePageNumber: 1, rotation: 0 },
          { sourcePageNumber: 2, rotation: 180 },
        ],
        outputFileName: '   ',
      },
    } as MessageEvent)

    expect(addPageMock).toHaveBeenCalledTimes(1)
    expect(postMessageMock).toHaveBeenLastCalledWith({
      ok: true,
      result: {
        file: {
          name: 'organized.pdf',
          blob: expect.any(Blob),
        },
      },
    })
  })
})
