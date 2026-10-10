// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { strToU8, zipSync } from "fflate"
import { PDFDocument } from "pdf-lib"
import { convert } from "./convert"

const mocks = vi.hoisted(() => ({ load: vi.fn() }))
vi.mock("@silurus/ooxml/pptx", () => ({
  PptxPresentation: { load: mocks.load },
}))
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
  slideCount: 2,
  slideWidth: 9144000,
  slideHeight: 5143500,
  isHidden: vi.fn((index: number) => index === 1),
  waitUntilLayoutComplete: vi.fn(),
  renderSlide: vi.fn(),
  destroy: vi.fn(),
}
function input() {
  const bytes = zipSync({
    "[Content_Types].xml": strToU8("<Types/>"),
    "ppt/presentation.xml": strToU8(
      '<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>'
    ),
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
  source.slideCount = 2
  source.slideWidth = 9144000
  source.slideHeight = 5143500
  source.waitUntilLayoutComplete.mockResolvedValue(undefined)
  source.renderSlide.mockResolvedValue(undefined)
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

test("exports every slide, including hidden slides, in order at source dimensions and 150 DPI", async () => {
  const progress = vi.fn()
  const result = await run(progress)
  const pdf = await PDFDocument.load(await result.pdf.arrayBuffer())
  expect(result.pages).toBe(2)
  expect(pdf.getPages().map((p) => p.getSize())).toEqual([
    { width: 720, height: 405 },
    { width: 720, height: 405 },
  ])
  expect(source.renderSlide).toHaveBeenNthCalledWith(
    1,
    expect.any(HTMLCanvasElement),
    0,
    expect.objectContaining({
      width: 1500,
      dpr: 1,
      skipMediaControls: true,
      failOnError: true,
      imageResources: {
        strategy: "strict",
        decodedByteBudget: 64 * 1024 * 1024,
      },
    })
  )
  expect(source.renderSlide).toHaveBeenNthCalledWith(
    2,
    expect.any(HTMLCanvasElement),
    1,
    expect.objectContaining({ width: 1500 })
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
test("rejects empty presentations instead of producing an empty PDF", async () => {
  source.slideCount = 0
  await expect(run()).rejects.toMatchObject({ code: "invalid", page: 0 })
  expect(source.renderSlide).not.toHaveBeenCalled()
  expect(source.destroy).toHaveBeenCalledOnce()
})
test("preserves a portrait presentation's physical page dimensions", async () => {
  source.slideWidth = 5143500
  source.slideHeight = 9144000
  const result = await run()
  const pdf = await PDFDocument.load(await result.pdf.arrayBuffer())
  expect(pdf.getPage(0).getSize()).toEqual({ width: 405, height: 720 })
})
test.each(["size", "too-wide", "pixels", "context", "blob", "allocation"])(
  "reports real %s resource failures and releases canvases",
  async (type) => {
    if (type === "size") source.slideWidth = 0
    if (type === "too-wide") source.slideWidth = 5000 * 12700
    if (type === "pixels") source.slideWidth = source.slideHeight = 2500 * 12700
    if (type === "context")
      vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)
    if (type === "blob")
      vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementation(
        (callback) => callback(null)
      )
    if (type === "allocation")
      source.renderSlide.mockRejectedValue(new RangeError("allocation failed"))
    await expect(run()).rejects.toMatchObject({ code: "resource", page: 1 })
    expect(source.destroy).toHaveBeenCalledOnce()
  }
)
test("does not publish partial PDFs when a later page fails", async () => {
  source.renderSlide
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
  source.renderSlide.mockImplementation(async () => {
    controller.abort()
  })
  await expect(run()).rejects.toMatchObject({ name: "AbortError" })
  expect(source.destroy).toHaveBeenCalledOnce()
  expect(source.renderSlide).toHaveBeenCalledOnce()
})
test("cancels at page progress without rendering another page", async () => {
  await expect(run(() => controller.abort())).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(source.destroy).toHaveBeenCalledOnce()
  expect(source.renderSlide).not.toHaveBeenCalled()
})
