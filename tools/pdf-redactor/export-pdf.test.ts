import { PDFDocument, PDFName } from "pdf-lib"
import { afterEach, expect, test, vi } from "vitest"

import { exportPdf } from "./export-pdf"
import { rectangle, relativePoint } from "./geometry"
import type { PDFDocumentProxy } from "pdfjs-dist"

const png = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDfMtJQAAAABJRU5ErkJggg=="
  ),
  (character) => character.charCodeAt(0)
)

function fakePage(width: number, height: number) {
  return {
    getViewport: vi.fn(() => ({ width, height })),
    render: vi.fn(() => ({ promise: Promise.resolve() })),
    cleanup: vi.fn(),
  }
}

function canvasMocks(image: Blob | null) {
  const context = { fillStyle: "", fillRect: vi.fn() }
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => callback(image)
  )
  return context
}

afterEach(() => vi.restoreAllMocks())

test("normalizes drags in either direction and clips outside the page", () => {
  const bounds = { left: 100, top: 150, width: 200, height: 400 }
  const end = relativePoint(92, 600, bounds)
  const start = relativePoint(250, 250, bounds)
  expect(rectangle(start, end)).toEqual({
    left: 0,
    top: 0.25,
    right: 0.75,
    bottom: 1,
  })
})

test("paints outward-rounded boxes and builds new image-only pages in order", async () => {
  const first = fakePage(110, 200)
  const second = fakePage(220, 100)
  const source = {
    numPages: 2,
    getPage: vi.fn(async (number: number) => (number === 1 ? first : second)),
  }
  const context = canvasMocks(new Blob([png], { type: "image/png" }))
  const onProgress = vi.fn()
  const bytes = await exportPdf(
    source as unknown as PDFDocumentProxy,
    { 2: [{ left: 0.101, top: 0.103, right: 0.299, bottom: 0.808 }] },
    onProgress
  )
  const pdf = await PDFDocument.load(bytes)
  const pages = pdf.getPages()
  expect(pages.map((page) => page.getSize())).toEqual([
    { width: 110, height: 200 },
    { width: 220, height: 100 },
  ])
  expect(context.fillStyle).toBe("#000")
  expect(context.fillRect.mock.calls).toEqual([[66, 30, 132, 213]])
  expect(source.getPage.mock.calls).toEqual([[1], [2]])
  expect(onProgress.mock.calls).toEqual([[1], [2]])
  for (const page of pages) {
    expect(page.node.Annots()?.size() ?? 0).toBe(0)
    expect(page.node.Resources()?.lookup(PDFName.of("XObject"))).toBeDefined()
  }
  expect(first.cleanup).toHaveBeenCalledOnce()
  expect(second.cleanup).toHaveBeenCalledOnce()
})

test("fails the export and cleans up when a page cannot be encoded", async () => {
  const page = fakePage(10_000, 9000)
  const source = { numPages: 1, getPage: vi.fn(async () => page) }
  canvasMocks(null)
  await expect(
    exportPdf(source as unknown as PDFDocumentProxy, {}, vi.fn())
  ).rejects.toThrow("Could not encode PDF page")
  expect(page.cleanup).toHaveBeenCalledOnce()
  expect(page.render).toHaveBeenCalledWith(
    expect.objectContaining({
      transform: [0.3651, 0, 0, 0.3651111111111111, 0, 0],
    })
  )
})
