import { describe, expect, it, vi } from 'vitest'

const getDocumentMock = vi.fn((_options: { url: string; useSystemFonts: boolean }) => ({
  promise: Promise.resolve({}),
}))
const globalWorkerOptions = { workerSrc: '' }

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

    const task = loadPdfDocument('blob:abc')

    expect(globalWorkerOptions.workerSrc).toBe('mock-worker-url')
    expect(getDocumentMock).toHaveBeenCalledOnce()

    const firstCall = getDocumentMock.mock.calls[0]
    expect(firstCall).toBeDefined()
    expect(firstCall?.[0]).toMatchObject({
      url: 'blob:abc',
      useSystemFonts: true,
    })
    expect(task).toBeDefined()
  })
})
