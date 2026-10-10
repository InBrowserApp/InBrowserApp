import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { strToU8, zipSync } from "fflate"
import { PDFDocument } from "pdf-lib"
import { convert } from "./convert"

const mocks = vi.hoisted(() => ({ open: vi.fn() }))
vi.mock("@ofdjs/viewer", () => ({ getDocument: mocks.open }))
const png = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDZsAAAAASUVORK5CYII="
  ),
  (c) => c.charCodeAt(0)
)
let controller: AbortController
let canvases: HTMLCanvasElement[]
let documents: ReturnType<typeof source>[]
function source(width = 210, height = 297) {
  const page = {
    physicalBox: [0, 0, width, height],
    getViewport: vi.fn(() => ({ width: 100, height: 200 })),
    render: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })),
  }
  return {
    numPages: 1,
    diagnostics: [] as { code: string; message: string }[],
    getPage: vi.fn(async () => page),
    destroy: vi.fn(),
    page,
  }
}
function input(count = 1) {
  const bytes = zipSync({
    "OFD.xml": strToU8(`<OFD>${"<DocBody/>".repeat(count)}</OFD>`),
  })
  return new File([bytes], "input.ofd")
}
const run = (count = 1, progress = vi.fn()) =>
  convert(input(count), controller.signal, progress)
beforeEach(() => {
  controller = new AbortController()
  canvases = []
  documents = [source(), source(297, 210)]
  mocks.open.mockImplementation(
    async (_data, options) => documents[options.documentIndex]
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    function (this: HTMLCanvasElement) {
      canvases.push(this)
      return {} as CanvasRenderingContext2D
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => callback(new Blob([png], { type: "image/png" }))
  )
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

test("exports every document in order with original dimensions and image-only PDF pages", async () => {
  documents[0]!.numPages = 2
  documents[0]!.diagnostics = [
    { code: "MULTI_DOCUMENT", message: "" },
    { code: "MISSING_DEFAULT_PAGE_AREA", message: "" },
  ]
  const progress = vi.fn()
  const result = await run(2, progress)
  const pdf = await PDFDocument.load(await result.pdf.arrayBuffer())
  expect(pdf.getPageCount()).toBe(3)
  expect(pdf.getPages().map((p) => p.getSize())).toEqual([
    { width: (210 * 72) / 25.4, height: (297 * 72) / 25.4 },
    { width: (210 * 72) / 25.4, height: (297 * 72) / 25.4 },
    { width: (297 * 72) / 25.4, height: (210 * 72) / 25.4 },
  ])
  expect(result.positions).toEqual([
    { document: 1, page: 1 },
    { document: 1, page: 2 },
    { document: 2, page: 1 },
  ])
  expect(result.documents).toBe(2)
  expect(result.substitutedFonts).toBe(false)
  expect(progress).toHaveBeenLastCalledWith(
    expect.objectContaining({ saving: true })
  )
  expect(mocks.open).toHaveBeenCalledWith(
    expect.any(Uint8Array),
    expect.objectContaining({
      maxFileSize: Infinity,
      maxUncompressedSize: Infinity,
      maxEntries: Infinity,
      documentIndex: 1,
    })
  )
  for (const doc of documents) {
    expect(doc.destroy).toHaveBeenCalledOnce()
    expect(doc.page.getViewport).toHaveBeenCalledWith({ scale: 150 / 96 })
    expect(doc.page.render).toHaveBeenCalledWith(
      expect.objectContaining({
        pixelRatio: 1,
        background: "#ffffff",
        signal: controller.signal,
      })
    )
  }
  expect(canvases.every((c) => c.width === 0 && c.height === 0)).toBe(true)
})
test("reports font substitutions discovered during rendering without losing an earlier warning", async () => {
  documents[0]!.page.render.mockImplementation(() => {
    documents[0]!.diagnostics.push({ code: "FONT_DECODE", message: "private" })
    return { promise: Promise.resolve(), cancel: vi.fn() }
  })
  expect((await run(2)).substitutedFonts).toBe(true)
})
test.each(["SIGNATURE_UNSUPPORTED", "MISSING_RESOURCE", "UNKNOWN_GRAPHICS"])(
  "rejects %s before rendering or publishing partial output",
  async (code) => {
    documents[1]!.diagnostics.push({ code, message: "private" })
    await expect(run(2)).rejects.toMatchObject({
      code: code === "SIGNATURE_UNSUPPORTED" ? "signature" : "unsupported",
      document: 2,
      page: 0,
    })
    expect(documents[0]!.destroy).toHaveBeenCalledOnce()
    expect(documents[1]!.destroy).toHaveBeenCalledOnce()
  }
)
test("checks omissions reported after a resolved render task", async () => {
  documents[0]!.page.render.mockImplementation(() => {
    documents[0]!.diagnostics.push({ code: "IMAGE_DECODE", message: "private" })
    return { promise: Promise.resolve(), cancel: vi.fn() }
  })
  await expect(run()).rejects.toMatchObject({
    code: "unsupported",
    document: 1,
    page: 1,
  })
})
test("cleans canvases and tasks on render rejection", async () => {
  const cancel = vi.fn()
  documents[0]!.page.render.mockReturnValue({
    promise: Promise.reject(new Error("bad render")),
    cancel,
  })
  await expect(run()).rejects.toMatchObject({ code: "invalid", page: 1 })
  expect(cancel).toHaveBeenCalledOnce()
  expect(canvases[0]!.width).toBe(0)
  expect(documents[0]!.destroy).toHaveBeenCalledOnce()
})
test.each(["context", "blob", "allocation"])(
  "reports real %s resource failures",
  async (type) => {
    if (type === "context")
      vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(
        null
      )
    if (type === "blob")
      vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
        (callback) => callback(null)
      )
    if (type === "allocation")
      documents[0]!.getPage.mockRejectedValueOnce(
        new Error("Canvas pixel budget exceeded")
      )
    await expect(run()).rejects.toMatchObject({
      code: "resource",
      document: 1,
      page: 1,
    })
    expect(documents[0]!.destroy).toHaveBeenCalledOnce()
  }
)
test("destroys a document returned after cancellation and ignores unfinished engine opening", async () => {
  mocks.open.mockImplementationOnce(async () => {
    controller.abort()
    return documents[0]
  })
  await expect(run()).rejects.toMatchObject({ name: "AbortError" })
  expect(documents[0]!.destroy).toHaveBeenCalledOnce()
  controller = new AbortController()
  mocks.open.mockRejectedValueOnce(new Error("bad archive"))
  await expect(run()).rejects.toMatchObject({ code: "invalid", page: 0 })
})
test("does not start when already cancelled", async () => {
  controller.abort()
  await expect(run()).rejects.toMatchObject({ name: "AbortError" })
  expect(mocks.open).not.toHaveBeenCalled()
})
test("cancels between pages without saving a partial PDF", async () => {
  documents[0]!.numPages = 3
  const progress = vi.fn(() => controller.abort())
  await expect(run(1, progress)).rejects.toMatchObject({ name: "AbortError" })
  expect(progress).toHaveBeenCalledOnce()
  expect(documents[0]!.destroy).toHaveBeenCalledOnce()
})
