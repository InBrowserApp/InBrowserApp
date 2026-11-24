import { getDocument, OPS } from "pdfjs-dist"
import { afterEach, expect, it, vi } from "vitest"
import { encodePng, openOriginalImages } from "./image-export"
import { extractPdfImages } from "./pdf-images"

vi.mock("@workspace/pdf-reader/assets", () => ({ PdfAssets: class {} }))
vi.mock("pdfjs-dist/build/pdf.worker.min.mjs?url", () => ({
  default: "/worker.mjs",
}))
vi.mock("pdfjs-dist", async (importOriginal) => ({
  ...(await importOriginal<typeof import("pdfjs-dist")>()),
  getDocument: vi.fn(),
}))
vi.mock("./image-export", () => ({
  encodePng: vi.fn(),
  openOriginalImages: vi.fn(),
}))

afterEach(() => vi.resetAllMocks())

function mockPdf(pages: ReturnType<typeof mockPage>[]) {
  const getPage = vi.fn(async (page: number) => pages[page - 1])
  const destroy = vi.fn(async () => {})
  vi.mocked(getDocument).mockReturnValue({
    destroy,
    promise: Promise.resolve({ getPage, numPages: pages.length }),
  } as unknown as ReturnType<typeof getDocument>)
  return { destroy, getPage }
}

function mockPage(operations: Array<[number, unknown]>) {
  return {
    objs: { get: vi.fn() },
    commonObjs: { get: vi.fn() },
    cleanup: vi.fn(),
    getOperatorList: vi.fn(async () => ({
      fnArray: operations.map(([op]) => op),
      argsArray: operations.map(([, argument]) => [argument]),
    })),
  }
}

const input = new Blob(["%PDF-"])
const raster = { width: 21, height: 16, ref: "2R" }
const jpg = new Blob(["jpeg"], { type: "image/jpeg" })
const png = new Blob(["png"], { type: "image/png" })

it("finds raster paint operations in page order, preserves the JPEG, and reports partial results", async () => {
  const first = mockPage([
    [OPS.showText, null],
    [OPS.paintImageXObject, "img_1"],
    [OPS.paintInlineImageXObject, { width: 4, height: 3 }],
    [OPS.paintImageXObject, "img_null"],
  ])
  const second = mockPage([
    [OPS.paintImageXObject, "g_img_2"],
    [OPS.paintImageXObject, "g_img_3"],
  ])
  first.objs.get.mockImplementation((id, ready) =>
    ready(id === "img_1" ? raster : null)
  )
  second.commonObjs.get.mockImplementation((id, ready, reject) => {
    if (id === "g_img_2") ready(raster)
    else reject(new Error("image missing"))
  })
  const { destroy } = mockPdf([first, second])
  const onPage = vi.fn()
  vi.mocked(openOriginalImages).mockResolvedValue((ref) =>
    ref === "2R" ? jpg : undefined
  )
  vi.mocked(encodePng).mockResolvedValue(png)

  const result = await extractPdfImages(
    input,
    new AbortController().signal,
    onPage
  )

  expect(result).toEqual({
    images: [
      { blob: jpg, width: 21, height: 16, page: 1, name: "page-1-image-1.jpg" },
      { blob: png, width: 4, height: 3, page: 1, name: "page-1-image-2.png" },
    ],
    skipped: true,
  })
  expect(onPage.mock.calls).toEqual([
    [1, 2],
    [2, 2],
  ])
  expect(encodePng).toHaveBeenCalledTimes(1)
  expect(first.cleanup).toHaveBeenCalledOnce()
  expect(second.cleanup).toHaveBeenCalledOnce()
  expect(destroy).toHaveBeenCalledOnce()
})

it("cancels while waiting for an image from the PDF worker", async () => {
  const page = mockPage([[OPS.paintImageXObject, "img_1"]])
  const { destroy } = mockPdf([page])
  const controller = new AbortController()
  vi.mocked(openOriginalImages).mockResolvedValue(() => undefined)
  page.objs.get.mockImplementation(() =>
    queueMicrotask(() => controller.abort())
  )

  await expect(
    extractPdfImages(input, controller.signal, vi.fn())
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(page.cleanup).toHaveBeenCalledOnce()
  expect(destroy).toHaveBeenCalled()
})
