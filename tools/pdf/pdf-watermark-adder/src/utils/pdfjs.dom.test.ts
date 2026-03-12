import { describe, expect, it, vi } from 'vitest'

const getDocumentMock = vi.fn(() => ({
  promise: Promise.resolve({}),
  destroy: vi.fn(),
}))

const globalWorkerOptions = {
  workerSrc: '',
}

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'mock-worker-url',
}))

vi.mock('pdfjs-dist', () => ({
  getDocument: getDocumentMock,
  GlobalWorkerOptions: globalWorkerOptions,
}))

describe('pdfjs loader', () => {
  it('sets the worker source and forwards the load options', async () => {
    const { loadPdfDocument } = await import('./pdfjs')

    const data = new Uint8Array([1, 2, 3])
    const task = loadPdfDocument(data)

    expect(globalWorkerOptions.workerSrc).toBe('mock-worker-url')
    expect(getDocumentMock).toHaveBeenCalledOnce()
    expect(getDocumentMock).toHaveBeenCalledWith({
      data,
      useSystemFonts: true,
    })
    expect(task).toBeDefined()
  })
})
