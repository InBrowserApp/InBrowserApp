import { withOcrWorker } from "@workspace/ocr-models/worker"
import { openPdfDocument } from "@workspace/pdf-reader/document"
import { PDFDocument, PDFName } from "pdf-lib"
import { beforeEach, expect, it, vi } from "vitest"

import { convertPdf } from "./convert"
import type { Worker } from "tesseract.js"

vi.mock("@workspace/ocr-models/worker", () => ({ withOcrWorker: vi.fn() }))
vi.mock("@workspace/pdf-reader/document", () => ({ openPdfDocument: vi.fn() }))
vi.mock("pdfjs-dist", () => ({ AnnotationMode: { DISABLE: 0 } }))

const open = vi.mocked(openPdfDocument)
const startOcr = vi.mocked(withOcrWorker)
const recognize = vi.fn()

function page(pageNumber: number, text = "") {
  return {
    pageNumber,
    getTextContent: vi.fn().mockResolvedValue({ items: [{ str: text }] }),
    getViewport: ({ scale }: { scale: number }) => ({
      width: 100 * scale,
      height: 200 * scale,
      convertToPdfPoint: (x: number, y: number) => [
        17 + y / scale,
        29 + x / scale,
      ],
    }),
    render: vi.fn(() => ({
      promise: Promise.resolve(),
      cancel: vi.fn(),
    })),
    cleanup: vi.fn(),
  }
}

function mockReader(pages: ReturnType<typeof page>[]) {
  const task = {
    promise: Promise.resolve({
      numPages: pages.length,
      getPage: vi.fn((number: number) => Promise.resolve(pages[number - 1])),
    }),
    destroy: vi.fn().mockResolvedValue(undefined),
  }
  open.mockReturnValue(task as unknown as ReturnType<typeof openPdfDocument>)
  return task
}

function options(signal = new AbortController().signal) {
  return {
    language: "eng" as const,
    includeEnglish: false,
    signal,
    onProgress: vi.fn(),
  }
}

async function documentWithPages(count: number) {
  const document = await PDFDocument.create()
  for (let i = 0; i < count; i += 1) document.addPage([100, 200])
  return document
}

beforeEach(() => {
  vi.resetAllMocks()
  startOcr.mockImplementation(async (_, __, ___, onProgress, run) => {
    onProgress(0.5)
    return run({ recognize } as unknown as Worker)
  })
})

it("adds the text PDF only to scanned pages and keeps the original page dimensions and rotation", async () => {
  const scanned = page(2)
  const existing = page(1, "Existing invoice")
  const task = mockReader([existing, scanned])
  const original = await documentWithPages(2)
  original.getPage(0).drawText("Existing invoice")
  const layer = await documentWithPages(1)
  layer.getPage(0).drawText("New invoice")
  recognize.mockResolvedValue({
    data: { text: "New invoice", pdf: await layer.save() },
  })
  const file = new File([new Uint8Array(await original.save())], "mixed.pdf")
  const config = options()

  const result = await convertPdf(file, config)
  expect(result.status).toBe("ready")
  if (result.status !== "ready") throw new Error("Expected a converted PDF")
  const output = await PDFDocument.load(await result.blob.arrayBuffer())
  expect(output.getPages().map((page) => page.getSize())).toEqual([
    { width: 100, height: 200 },
    { width: 100, height: 200 },
  ])
  expect(
    output.getPage(0).node.Resources()?.get(PDFName.of("XObject"))?.toString()
  ).toBe("<<\n>>")
  expect(
    output.getPage(1).node.Resources()?.get(PDFName.of("XObject"))?.toString()
  ).toContain("/EmbeddedPdfPage")
  expect(result.skippedPages).toBe(true)
  expect(existing.render).not.toHaveBeenCalled()
  expect(scanned.render).toHaveBeenCalledOnce()
  expect(scanned.cleanup).toHaveBeenCalledOnce()
  expect(startOcr).toHaveBeenCalledOnce()
  expect(task.destroy).toHaveBeenCalledOnce()
  expect(config.onProgress).toHaveBeenCalledWith(
    expect.objectContaining({ stage: "pageProgress", page: 2, total: 2 })
  )
})

it("keeps PDFs with existing text without loading OCR models", async () => {
  mockReader([page(1, "Searchable")])
  await expect(
    convertPdf(new File([], "scan.pdf"), options())
  ).resolves.toEqual({ status: "alreadySearchable" })
  expect(startOcr).not.toHaveBeenCalled()
})

it("keeps an original with no recognized text", async () => {
  mockReader([page(1)])
  recognize.mockResolvedValue({ data: { text: "   ", pdf: null } })
  await expect(
    convertPdf(new File([], "blank.pdf"), options())
  ).resolves.toEqual({ status: "noText" })
})

it.each([
  ["PasswordException", "encryptedPdf"],
  ["InvalidPDFException", "invalidPdf"],
])("reports %s without loading OCR", async (name, status) => {
  const task = mockReader([])
  task.promise = Promise.reject(Object.assign(new Error(name), { name }))
  await expect(convertPdf(new File([], "bad.pdf"), options())).resolves.toEqual(
    { status }
  )
  expect(task.destroy).toHaveBeenCalledOnce()
  expect(startOcr).not.toHaveBeenCalled()
})

it("cancels a PDF reader that leaves a page request pending", async () => {
  const task = mockReader([])
  const pdf = await task.promise
  pdf.getPage.mockReturnValue(new Promise(() => {}))
  pdf.numPages = 1
  const controller = new AbortController()
  const result = convertPdf(
    new File([], "scan.pdf"),
    options(controller.signal)
  )
  await Promise.all([
    expect(result).rejects.toMatchObject({ name: "AbortError" }),
    vi
      .waitFor(() => expect(pdf.getPage).toHaveBeenCalledOnce())
      .then(() => {
        controller.abort()
      }),
  ])
  expect(task.destroy).toHaveBeenCalledOnce()
})
