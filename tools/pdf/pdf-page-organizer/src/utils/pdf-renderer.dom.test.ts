import { beforeEach, describe, expect, it, vi } from 'vitest'

const getDocumentMock = vi.fn()
const globalWorkerOptions: { workerSrc?: string } = {}

vi.mock('pdfjs-dist', () => ({
  getDocument: getDocumentMock,
  GlobalWorkerOptions: globalWorkerOptions,
}))

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: 'worker-url' }))
vi.mock('pdfjs-dist/standard_fonts/FoxitDingbats.pfb?url', () => ({ default: 'font-dingbats-url' }))
vi.mock('pdfjs-dist/standard_fonts/FoxitFixed.pfb?url', () => ({ default: 'font-fixed-url' }))
vi.mock('pdfjs-dist/standard_fonts/FoxitFixedBold.pfb?url', () => ({
  default: 'font-fixed-bold-url',
}))
vi.mock('pdfjs-dist/standard_fonts/FoxitFixedBoldItalic.pfb?url', () => ({
  default: 'font-fixed-bold-italic-url',
}))
vi.mock('pdfjs-dist/standard_fonts/FoxitFixedItalic.pfb?url', () => ({
  default: 'font-fixed-italic-url',
}))
vi.mock('pdfjs-dist/standard_fonts/FoxitSerif.pfb?url', () => ({ default: 'font-serif-url' }))
vi.mock('pdfjs-dist/standard_fonts/FoxitSerifBold.pfb?url', () => ({
  default: 'font-serif-bold-url',
}))
vi.mock('pdfjs-dist/standard_fonts/FoxitSerifBoldItalic.pfb?url', () => ({
  default: 'font-serif-bold-italic-url',
}))
vi.mock('pdfjs-dist/standard_fonts/FoxitSerifItalic.pfb?url', () => ({
  default: 'font-serif-italic-url',
}))
vi.mock('pdfjs-dist/standard_fonts/FoxitSymbol.pfb?url', () => ({ default: 'font-symbol-url' }))
vi.mock('pdfjs-dist/standard_fonts/LiberationSans-Bold.ttf?url', () => ({
  default: 'liberation-bold-url',
}))
vi.mock('pdfjs-dist/standard_fonts/LiberationSans-BoldItalic.ttf?url', () => ({
  default: 'liberation-bold-italic-url',
}))
vi.mock('pdfjs-dist/standard_fonts/LiberationSans-Italic.ttf?url', () => ({
  default: 'liberation-italic-url',
}))
vi.mock('pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf?url', () => ({
  default: 'liberation-regular-url',
}))

type CanvasStub = {
  width: number
  height: number
  getContext: ReturnType<typeof vi.fn>
  toBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void
  remove: ReturnType<typeof vi.fn>
}

const fetchMock = vi.fn()
const createObjectURLMock = vi.fn(() => 'blob:file-url')
const revokeObjectURLMock = vi.fn()
const createElementMock = vi.fn()
const originalCreateElement = document.createElement.bind(document)

const createCanvasStub = (options?: {
  context?: object | null
  blob?: Blob | null
}): CanvasStub => ({
  width: 0,
  height: 0,
  getContext: vi.fn(() =>
    options && 'context' in options ? (options.context as object | null) : {},
  ),
  toBlob: (callback, type, quality) => {
    expect(type).toBe('image/webp')
    expect(quality).toBe(0.88)
    callback(options && 'blob' in options ? (options.blob as Blob | null) : new Blob(['image']))
  },
  remove: vi.fn(),
})

const createPageProxy = () => {
  const cleanup = vi.fn()
  const render = vi.fn(() => ({ promise: Promise.resolve() }))
  const getViewport = vi.fn(({ scale }: { scale: number }) => ({
    width: 200 * scale,
    height: 300 * scale,
  }))

  return {
    cleanup,
    render,
    getViewport,
  }
}

describe('PdfPageRenderer', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    globalWorkerOptions.workerSrc = undefined
    fetchMock.mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(4),
    })
    global.fetch = fetchMock as unknown as typeof fetch
    global.URL.createObjectURL = createObjectURLMock
    global.URL.revokeObjectURL = revokeObjectURLMock
    createElementMock.mockImplementation(() => createCanvasStub())
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return createElementMock() as unknown as HTMLCanvasElement
      }

      return originalCreateElement(tagName)
    })
  })

  it('renders pages, caches by normalized width, loads fonts, and destroys resources', async () => {
    const page = createPageProxy()
    const getPageMock = vi.fn(async () => page)
    const destroyMock = vi.fn(async () => undefined)
    let capturedOptions: Record<string, unknown> | undefined

    getDocumentMock.mockImplementation((options) => {
      capturedOptions = options
      return {
        promise: Promise.resolve({
          getPage: getPageMock,
          destroy: destroyMock,
        }),
      }
    })

    const { PdfPageRenderer } = await import('./pdf-renderer')
    expect(globalWorkerOptions.workerSrc).toBe('worker-url')

    const renderer = new PdfPageRenderer(
      new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
    )
    const firstBlob = await renderer.renderPage(1, 99.6)
    const secondBlob = await renderer.renderPage(1, 120)

    expect(firstBlob).toBeInstanceOf(Blob)
    expect(secondBlob).toBe(firstBlob)
    expect(createObjectURLMock).toHaveBeenCalledTimes(1)
    expect(getDocumentMock).toHaveBeenCalledTimes(1)
    expect(getPageMock).toHaveBeenCalledTimes(1)
    expect(page.getViewport).toHaveBeenCalledWith({ scale: 1 })
    expect(page.render).toHaveBeenCalled()
    expect(page.cleanup).toHaveBeenCalled()

    const StandardFontDataFactory = capturedOptions?.StandardFontDataFactory as {
      new (): { fetch: (request: { filename: string }) => Promise<Uint8Array> }
    }
    const fontFactory = new StandardFontDataFactory()
    await expect(fontFactory.fetch({ filename: 'FoxitSymbol.pfb' })).resolves.toBeInstanceOf(
      Uint8Array,
    )
    expect(fetchMock).toHaveBeenCalledWith('font-symbol-url')

    fetchMock.mockResolvedValueOnce({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    })
    await expect(fontFactory.fetch({ filename: 'LiberationSans-Regular.ttf' })).rejects.toThrow(
      'Failed to load standard font: LiberationSans-Regular.ttf',
    )
    await expect(fontFactory.fetch({ filename: 'Unknown.pfb' })).rejects.toThrow(
      'Unsupported standard font: Unknown.pfb',
    )

    await renderer.destroy()
    expect(destroyMock).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:file-url')
  })

  it('clears cache after canvas-to-blob failures and succeeds on retry', async () => {
    const page = createPageProxy()
    const getPageMock = vi.fn(async () => page)
    let renderAttempt = 0

    createElementMock.mockImplementation(() =>
      createCanvasStub({
        blob: (renderAttempt += 1) === 1 ? null : new Blob(['image']),
      }),
    )
    getDocumentMock.mockReturnValue({
      promise: Promise.resolve({
        getPage: getPageMock,
        destroy: vi.fn(async () => undefined),
      }),
    })

    const { PdfPageRenderer } = await import('./pdf-renderer')
    const renderer = new PdfPageRenderer(
      new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
    )

    await expect(renderer.renderPage(1, 220)).rejects.toThrow('CANVAS_TO_BLOB_FAILED')
    await expect(renderer.renderPage(1, 220)).resolves.toBeInstanceOf(Blob)
    expect(getPageMock).toHaveBeenCalledTimes(2)
  })

  it('propagates canvas context and document loading errors', async () => {
    const loadFailedPromise = Promise.reject(new Error('LOAD_FAILED'))
    void loadFailedPromise.catch(() => undefined)
    getDocumentMock
      .mockReturnValueOnce({
        promise: loadFailedPromise,
      })
      .mockReturnValueOnce({
        promise: Promise.resolve({
          getPage: vi.fn(async () => createPageProxy()),
          destroy: vi.fn(async () => undefined),
        }),
      })

    createElementMock.mockImplementation(() => createCanvasStub({ context: null }))

    const { PdfPageRenderer } = await import('./pdf-renderer')
    const renderer = new PdfPageRenderer(
      new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
    )

    await expect(renderer.renderPage(1, 220)).rejects.toThrow('LOAD_FAILED')
    await expect(renderer.renderPage(1, 220)).rejects.toThrow('CANVAS_CONTEXT_UNAVAILABLE')
    expect(createObjectURLMock).toHaveBeenCalledTimes(2)
  })

  it('destroys cleanly before a document is loaded', async () => {
    const { PdfPageRenderer } = await import('./pdf-renderer')
    const renderer = new PdfPageRenderer(
      new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
    )
    await expect(renderer.destroy()).resolves.toBeUndefined()
  })
})
