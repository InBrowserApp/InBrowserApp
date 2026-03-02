import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OPS } from 'pdfjs-dist'
import { extractPdfText } from './extract-pdf-text'

const { loadPdfDocumentMock } = vi.hoisted(() => ({
  loadPdfDocumentMock: vi.fn(),
}))

vi.mock('./pdfjs', () => ({
  loadPdfDocument: loadPdfDocumentMock,
}))

function createPage(options: {
  items: Array<{ str: string; hasEOL?: boolean }>
  operations?: number[]
}) {
  return {
    getTextContent: vi.fn().mockResolvedValue({ items: options.items }),
    getOperatorList: vi.fn().mockResolvedValue({ fnArray: options.operations ?? [] }),
    cleanup: vi.fn(),
  }
}

describe('extractPdfText', () => {
  beforeEach(() => {
    loadPdfDocumentMock.mockReset()
  })

  it('extracts text and page statistics', async () => {
    const page1 = createPage({
      items: [{ str: 'Hello' }, { str: 'world', hasEOL: true }, { str: 'From PDF' }],
    })

    const page2 = createPage({
      items: [],
      operations: [OPS.paintImageXObject],
    })

    const documentProxy = {
      numPages: 2,
      getPage: vi.fn().mockResolvedValueOnce(page1).mockResolvedValueOnce(page2),
      destroy: vi.fn().mockResolvedValue(undefined),
    }

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.resolve(documentProxy),
      destroy: vi.fn().mockResolvedValue(undefined),
    })

    const file = new File(['dummy-pdf'], 'sample.pdf', { type: 'application/pdf' })
    const result = await extractPdfText(file)

    expect(result.pageCount).toBe(2)
    expect(result.emptyTextPages).toBe(1)
    expect(result.likelyScannedPages).toBe(1)
    expect(result.pages[0]).toMatchObject({
      pageNumber: 1,
      text: 'Hello world\nFrom PDF',
      likelyScanned: false,
    })
    expect(result.pages[1]).toMatchObject({
      pageNumber: 2,
      text: '',
      likelyScanned: true,
    })
    expect(result.text).toContain('# Page 1')
    expect(result.text).toContain('# Page 2')
    expect(page1.cleanup).toHaveBeenCalledOnce()
    expect(page2.cleanup).toHaveBeenCalledOnce()
    expect(documentProxy.destroy).toHaveBeenCalledOnce()
  })

  it('destroys loading task when opening pdf fails', async () => {
    const taskDestroy = vi.fn().mockResolvedValue(undefined)

    loadPdfDocumentMock.mockReturnValue({
      promise: Promise.reject(new Error('load failed')),
      destroy: taskDestroy,
    })

    const file = new File(['dummy-pdf'], 'broken.pdf', { type: 'application/pdf' })
    await expect(extractPdfText(file)).rejects.toThrow('load failed')
    expect(taskDestroy).toHaveBeenCalledOnce()
  })
})
