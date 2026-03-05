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
  it('sets worker source and forwards getDocument options', async () => {
    const { loadPdfDocument } = await import('./pdfjs')

    const data = new Uint8Array([1, 2, 3])
    const task = loadPdfDocument(data)

    expect(globalWorkerOptions.workerSrc).toBe('mock-worker-url')
    expect(getDocumentMock).toHaveBeenCalledOnce()
    const firstCall = getDocumentMock.mock.calls[0]
    expect(firstCall?.[0]).toMatchObject({
      useSystemFonts: true,
    })
    expect(firstCall?.[0].data).toEqual(data)
    expect(task).toBeDefined()
  })
})
