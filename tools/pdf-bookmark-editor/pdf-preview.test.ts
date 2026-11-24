import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist"
import { afterEach, expect, test, vi } from "vitest"
import { PdfAssets } from "@workspace/pdf-reader/assets"
import { openPreview, renderPreview } from "./pdf-preview"

vi.mock("@workspace/pdf-reader/assets", () => ({ PdfAssets: class {} }))
vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: {},
}))
vi.mock("pdfjs-dist/build/pdf.worker.min.mjs?url", () => ({
  default: "/pdf.worker.mjs",
}))

afterEach(() => {
  vi.resetAllMocks()
  vi.unstubAllGlobals()
})

test.each([
  { isolated: false, worker: "/pdf.worker.mjs" },
  { isolated: true, worker: "/pdf.worker.mjs?isolated=1" },
])(
  "opens with same-origin assets and destroys the local worker on replacement",
  async ({ isolated, worker }) => {
    vi.stubGlobal("crossOriginIsolated", isolated)
    const controller = new AbortController()
    const pdf = {} as PDFDocumentProxy
    const destroy = vi.fn().mockResolvedValue(undefined)
    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(pdf),
      destroy,
    } as unknown as ReturnType<typeof getDocument>)
    expect(
      await openPreview(new File(["PDF"], "guide.pdf"), controller.signal)
    ).toBe(pdf)
    expect(GlobalWorkerOptions.workerSrc).toBe(worker)
    expect(getDocument).toHaveBeenCalledWith({
      data: new TextEncoder().encode("PDF"),
      BinaryDataFactory: PdfAssets,
      useWorkerFetch: false,
    })
    controller.abort()
    expect(destroy).toHaveBeenCalledOnce()
  }
)

test("renders a bounded canvas and cleans up the page", async () => {
  const cleanup = vi.fn()
  const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }))
  const getPage = vi.fn().mockResolvedValue({
    getViewport: ({ scale }: { scale: number }) => ({
      width: 400 * scale,
      height: 800 * scale,
    }),
    render,
    cleanup,
  })
  const canvas = await renderPreview(
    { getPage } as unknown as PDFDocumentProxy,
    3,
    new AbortController().signal
  )
  expect(getPage).toHaveBeenCalledWith(3)
  expect([canvas.width, canvas.height]).toEqual([600, 1200])
  expect(render).toHaveBeenCalledWith({
    canvas,
    viewport: { width: 600, height: 1200 },
  })
  expect(cleanup).toHaveBeenCalledOnce()
})

test("cancels an obsolete render when the user switches pages", async () => {
  const controller = new AbortController()
  const cleanup = vi.fn()
  const { promise, reject } = Promise.withResolvers<void>()
  const cancel = vi.fn(() => reject(new Error("canceled")))
  const render = vi.fn(() => ({ promise, cancel }))
  const getPage = vi.fn().mockResolvedValue({
    getViewport: () => ({ width: 400, height: 800 }),
    render,
    cleanup,
  })
  const preview = renderPreview(
    { getPage } as unknown as PDFDocumentProxy,
    3,
    controller.signal
  )
  await vi.waitFor(() => expect(render).toHaveBeenCalledOnce())
  controller.abort()
  await expect(preview).rejects.toThrow("canceled")
  expect(cancel).toHaveBeenCalledOnce()
  expect(cleanup).toHaveBeenCalledOnce()
})
