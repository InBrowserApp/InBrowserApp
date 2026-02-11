import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from './pdf-errors'

const addPageMock = vi.fn()
const copyPagesMock = vi.fn()
const saveMock = vi.fn()
const getPageIndicesMock = vi.fn()

const createMock = vi.fn(async () => ({
  copyPages: copyPagesMock,
  addPage: addPageMock,
  save: saveMock,
}))
const loadMock = vi.fn(async () => ({
  getPageIndices: getPageIndicesMock,
}))

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: createMock,
    load: loadMock,
  },
}))

const postMessageMock = vi.fn()

describe('merge-pdfs worker', () => {
  beforeEach(() => {
    vi.resetModules()
    addPageMock.mockReset()
    copyPagesMock.mockReset()
    saveMock.mockReset()
    getPageIndicesMock.mockReset()
    createMock.mockClear()
    loadMock.mockClear()
    postMessageMock.mockReset()

    copyPagesMock.mockResolvedValue(['page-1', 'page-2'])
    saveMock.mockResolvedValue(new Uint8Array([1, 2, 3]))
    getPageIndicesMock.mockReturnValue([0, 1])
    ;(globalThis as unknown as { self: { postMessage: typeof postMessageMock } }).self = {
      postMessage: postMessageMock,
    }
  })

  it('merges all pages and posts success payload', async () => {
    await import('./merge-pdfs.worker')

    const files = [
      new File(['a'], 'a.pdf', { type: 'application/pdf' }),
      new File(['b'], 'b.pdf', { type: 'application/pdf' }),
    ]

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: { files },
    } as MessageEvent)

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(loadMock).toHaveBeenCalledTimes(2)
    expect(copyPagesMock).toHaveBeenCalledTimes(2)
    expect(addPageMock).toHaveBeenCalledTimes(4)
    expect(saveMock).toHaveBeenCalledTimes(1)

    const payload = postMessageMock.mock.calls[0]?.[0]
    expect(payload.ok).toBe(true)
    expect(payload.blob).toBeInstanceOf(Blob)
    expect(payload.blob.type).toBe('application/pdf')
  })

  it('posts encrypted error when source PDF is encrypted', async () => {
    loadMock.mockRejectedValueOnce(Object.assign(new Error('enc'), { name: 'EncryptedPDFError' }))

    await import('./merge-pdfs.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: { files: [new File(['a'], 'enc.pdf', { type: 'application/pdf' })] },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.Encrypted,
    })
  })

  it('posts generic error for unknown failure', async () => {
    loadMock.mockRejectedValueOnce(new Error('unknown'))

    await import('./merge-pdfs.worker')

    await (
      globalThis as unknown as {
        self: { onmessage: (event: MessageEvent) => Promise<void> }
      }
    ).self.onmessage({
      data: { files: [new File(['a'], 'bad.pdf', { type: 'application/pdf' })] },
    } as MessageEvent)

    expect(postMessageMock).toHaveBeenCalledWith({
      ok: false,
      code: PDF_ERROR.MergeFailed,
    })
  })
})
