// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { strToU8, zipSync } from "fflate"
import { PDFDocument } from "pdf-lib"
import { convert } from "./convert"

const mocks = vi.hoisted(() => ({ load: vi.fn() }))
vi.mock("@silurus/ooxml/docx", () => ({ DocxDocument: { load: mocks.load } }))
vi.mock("@silurus/ooxml/math", () => ({ math: {} }))
vi.mock("@silurus/ooxml/three-d", () => ({ threeD: {} }))
vi.mock("@silurus/ooxml/region-map", () => ({ regionMap: {} }))
vi.mock("@silurus/ooxml/chart-ex", () => ({ chartEx: {} }))
vi.mock("@silurus/ooxml/tiff", () => ({ tiff: {} }))
const png = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDZsAAAAASUVORK5CYII="
  ),
  (c) => c.charCodeAt(0)
)
let controller: AbortController
let canvases: HTMLCanvasElement[]
const source = {
  pageCount: 2,
  document: {} as { parseError?: string },
  waitUntilLayoutComplete: vi.fn(),
  pageSize: vi.fn(),
  renderPage: vi.fn(),
  destroy: vi.fn(),
}
function input() {
  const bytes = zipSync({
    "[Content_Types].xml": strToU8("<Types/>"),
    "word/document.xml": strToU8("<document/>"),
  })
  // jsdom's File lacks arrayBuffer; preserve actual zipped bytes for preflight.
  return { arrayBuffer: async () => bytes.slice().buffer } as File
}
const run = (progress: Parameters<typeof convert>[2] = vi.fn()) =>
  convert(input(), controller.signal, progress)
beforeEach(() => {
  vi.resetAllMocks()
  controller = new AbortController()
  canvases = []
  source.pageCount = 2
  source.document = {}
  source.pageSize.mockImplementation((index) =>
    index === 0
      ? { widthPt: 612, heightPt: 792 }
      : { widthPt: 792, heightPt: 612 }
  )
  source.waitUntilLayoutComplete.mockResolvedValue(undefined)
  source.renderPage.mockResolvedValue(undefined)
  mocks.load.mockResolvedValue(source)
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    function (this: HTMLCanvasElement) {
      canvases.push(this)
      return { fillRect: vi.fn() } as unknown as CanvasRenderingContext2D
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => callback(new globalThis.Blob([png], { type: "image/png" }))
  )
})
afterEach(() => vi.restoreAllMocks())

test("exports all pages in original order and dimensions at 150 DPI with offline optional renderers", async () => {
  const progress = vi.fn()
  const result = await run(progress)
  const pdf = await PDFDocument.load(await result.pdf.arrayBuffer())
  expect(result.pages).toBe(2)
  expect(pdf.getPages().map((p) => p.getSize())).toEqual([
    { width: 612, height: 792 },
    { width: 792, height: 612 },
  ])
  expect(source.renderPage).toHaveBeenNthCalledWith(
    1,
    expect.any(HTMLCanvasElement),
    0,
    expect.objectContaining({
      width: 1275,
      dpr: 1,
      showTrackedChanges: false,
      imageResources: {
        strategy: "strict",
        decodedByteBudget: 64 * 1024 * 1024,
      },
    })
  )
  expect(source.renderPage).toHaveBeenNthCalledWith(
    2,
    expect.any(HTMLCanvasElement),
    1,
    expect.objectContaining({ width: 1650 })
  )
  expect(mocks.load).toHaveBeenCalledWith(
    expect.any(ArrayBuffer),
    expect.objectContaining({
      useGoogleFonts: false,
      mode: "main",
      math: {},
      threeD: {},
      regionMap: {},
      chartEx: {},
      tiff: {},
    })
  )
  expect(source.waitUntilLayoutComplete).toHaveBeenCalledOnce()
  expect(progress).toHaveBeenLastCalledWith({ page: 2, pages: 2, saving: true })
  expect(source.destroy).toHaveBeenCalledOnce()
  expect(
    canvases.every((canvas) => canvas.width === 0 && canvas.height === 0)
  ).toBe(true)
})
test.each(["parse", "empty"])(
  "rejects %s documents rather than exporting an error or blank page",
  async (type) => {
    if (type === "parse") source.document.parseError = "private parser error"
    else source.pageCount = 0
    await expect(run()).rejects.toMatchObject({ code: "invalid", page: 0 })
    expect(source.renderPage).not.toHaveBeenCalled()
    expect(source.destroy).toHaveBeenCalledOnce()
  }
)
test.each(["size", "too-wide", "pixels", "context", "blob", "allocation"])(
  "reports real %s resource failures and releases canvases",
  async (type) => {
    if (type === "size")
      source.pageSize.mockReturnValue({ widthPt: 0, heightPt: 100 })
    if (type === "too-wide")
      source.pageSize.mockReturnValue({ widthPt: 5000, heightPt: 100 })
    if (type === "pixels")
      source.pageSize.mockReturnValue({ widthPt: 2500, heightPt: 2500 })
    if (type === "context")
      vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)
    if (type === "blob")
      vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementation(
        (callback) => callback(null)
      )
    if (type === "allocation")
      source.renderPage.mockRejectedValue(new RangeError("allocation failed"))
    await expect(run()).rejects.toMatchObject({ code: "resource", page: 1 })
    expect(source.destroy).toHaveBeenCalledOnce()
  }
)
test("does not publish partial PDFs when a later page fails", async () => {
  source.renderPage
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error("image could not be decoded"))
  await expect(run()).rejects.toMatchObject({ code: "invalid", page: 2 })
  expect(source.destroy).toHaveBeenCalledOnce()
  expect(canvases[0]!.width).toBe(0)
})
test("destroys documents that arrive after cancellation; ignores unfinished loads", async () => {
  mocks.load.mockImplementationOnce(async () => {
    controller.abort()
    return source
  })
  await expect(run()).rejects.toMatchObject({ name: "AbortError" })
  expect(source.destroy).toHaveBeenCalledOnce()
  controller = new AbortController()
  mocks.load.mockRejectedValueOnce(new Error("bad package"))
  await expect(run()).rejects.toMatchObject({ code: "invalid", page: 0 })
})
test("does not start when cancelled before reading", async () => {
  controller.abort()
  await expect(run()).rejects.toMatchObject({ name: "AbortError" })
  expect(mocks.load).not.toHaveBeenCalled()
})
test("cancels during rendering and destroys the document once", async () => {
  source.renderPage.mockImplementation(async () => {
    controller.abort()
  })
  await expect(run()).rejects.toMatchObject({ name: "AbortError" })
  expect(source.destroy).toHaveBeenCalledOnce()
  expect(source.renderPage).toHaveBeenCalledOnce()
})
test("cancels at page progress without rendering another page", async () => {
  await expect(run(() => controller.abort())).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(source.destroy).toHaveBeenCalledOnce()
  expect(source.renderPage).not.toHaveBeenCalled()
})
