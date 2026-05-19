import { GlobalWorkerOptions, getDocument } from "pdfjs-dist"

import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import type { PdfPagePreview } from "./types"

const PREVIEW_MAX_WIDTH = 220
const PREVIEW_MAX_HEIGHT = 300
const MAX_PIXEL_RATIO = 2
const PDF_WORKER_URL = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString()

function configurePdfWorker() {
  if (GlobalWorkerOptions.workerSrc !== PDF_WORKER_URL) {
    GlobalWorkerOptions.workerSrc = PDF_WORKER_URL
  }
}

function assertNotAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException("Rendering aborted", "AbortError")
  }
}

function getRenderScale(page: PDFPageProxy) {
  const viewport = page.getViewport({ scale: 1 })
  return Math.min(
    PREVIEW_MAX_WIDTH / viewport.width,
    PREVIEW_MAX_HEIGHT / viewport.height,
    1
  )
}

async function renderPagePreview(
  page: PDFPageProxy,
  pageNumber: number,
  signal?: AbortSignal
): Promise<PdfPagePreview> {
  assertNotAborted(signal)

  const scale = getRenderScale(page)
  const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, MAX_PIXEL_RATIO)
  const viewport = page.getViewport({ scale: scale * pixelRatio })
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("CANVAS_UNAVAILABLE")
  }

  canvas.width = Math.max(1, Math.ceil(viewport.width))
  canvas.height = Math.max(1, Math.ceil(viewport.height))
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)

  const renderTask = page.render({
    canvas,
    canvasContext: context,
    viewport,
  })

  await renderTask.promise
  assertNotAborted(signal)

  const displayViewport = page.getViewport({ scale })
  const preview = {
    dataUrl: canvas.toDataURL("image/jpeg", 0.84),
    height: Math.round(displayViewport.height),
    pageNumber,
    width: Math.round(displayViewport.width),
  }

  page.cleanup()
  return preview
}

async function destroyDocument(document: PDFDocumentProxy | null) {
  if (document) {
    await document.destroy()
  }
}

async function renderPdfPagePreviews(
  file: File,
  signal?: AbortSignal
): Promise<readonly PdfPagePreview[]> {
  configurePdfWorker()
  assertNotAborted(signal)

  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = getDocument({ data })
  let document: PDFDocumentProxy | null = null

  try {
    document = await loadingTask.promise
    const previews: PdfPagePreview[] = []

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      assertNotAborted(signal)
      const page = await document.getPage(pageNumber)
      previews.push(await renderPagePreview(page, pageNumber, signal))
    }

    return previews
  } catch (error) {
    if (signal?.aborted) {
      await loadingTask.destroy()
    }

    throw error
  } finally {
    await destroyDocument(document)
  }
}

export { renderPdfPagePreviews }
