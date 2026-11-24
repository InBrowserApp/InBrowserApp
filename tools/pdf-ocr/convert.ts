import { withOcrWorker } from "@workspace/ocr-models/worker"
import { openPdfDocument } from "@workspace/pdf-reader/document"
import { PDFDocument } from "pdf-lib"
import { AnnotationMode } from "pdfjs-dist"

import { addTextLayer } from "./text-layer"
import type { Language } from "@workspace/ocr-models/languages"
import type { PDFPageProxy } from "pdfjs-dist"
import type { Worker } from "tesseract.js"

export type Progress =
  | { stage: "opening" | "loading" | "saving" }
  | { stage: "pageProgress"; page: number; total: number; fraction: number }

export type Result =
  | { status: "ready"; blob: Blob; skippedPages: boolean }
  | { status: "alreadySearchable" | "noText" }
  | { status: "invalidPdf" | "encryptedPdf" }

type Options = {
  language: Language
  includeEnglish: boolean
  signal: AbortSignal
  onProgress: (progress: Progress) => void
}

export async function convertPdf(
  file: File,
  { language, includeEnglish, signal, onProgress }: Options
): Promise<Result> {
  signal.throwIfAborted()
  onProgress({ stage: "opening" })
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  // PDF.js transfers its buffer to the reader worker.
  const task = openPdfDocument(bytes.slice())
  let rejectRead!: (reason: unknown) => void
  const cancelledRead = new Promise<never>((_, reject) => {
    rejectRead = reject
  })
  // PDF.js can leave document and text requests pending after worker shutdown.
  const waitForRead = <T>(request: Promise<T>) =>
    Promise.race([request, cancelledRead])
  let stopping: Promise<void> | undefined
  const stopReading = () => {
    rejectRead(signal.reason)
    stopping = task.destroy().catch(() => {})
  }
  signal.addEventListener("abort", stopReading, { once: true })

  try {
    const pdf = await waitForRead(task.promise)
    const canvas = document.createElement("canvas")
    let output: PDFDocument | undefined
    let skippedPages = false

    async function readPage(page: PDFPageProxy, worker: Worker) {
      const base = page.getViewport({ scale: 1 })
      // Aim for about 250 DPI and keep the raster within browser canvas limits.
      const scale = Math.min(
        250 / 72,
        4096 / Math.max(base.width, base.height),
        Math.sqrt(12_000_000 / (base.width * base.height))
      )
      const viewport = page.getViewport({ scale })
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const render = page.render({
        canvas,
        viewport,
        annotationMode: AnnotationMode.DISABLE,
      })
      const cancelRender = () => render.cancel()
      signal.addEventListener("abort", cancelRender, { once: true })
      try {
        await render.promise
      } finally {
        signal.removeEventListener("abort", cancelRender)
      }
      signal.throwIfAborted()
      const { data } = await worker.recognize(
        canvas,
        { pdfTextOnly: true },
        { text: true, pdf: true }
      )
      signal.throwIfAborted()
      if (!data.text.trim() || !data.pdf) return

      // Only parse the editable copy if there is a text layer to attach.
      output ??= await PDFDocument.load(bytes, { updateMetadata: false })
      await addTextLayer(
        output,
        output.getPage(page.pageNumber - 1),
        new Uint8Array(data.pdf),
        viewport,
        canvas.width,
        canvas.height
      )
    }

    // Initialize Tesseract only after finding the first page without text.
    // Leave pages with existing text alone, including previous OCR results.
    let pageNumber = 1
    const reportPage = (fraction: number) =>
      onProgress({
        stage: "pageProgress",
        page: pageNumber,
        total: pdf.numPages,
        fraction,
      })
    async function* pagesWithoutText() {
      for (; pageNumber <= pdf.numPages; pageNumber += 1) {
        signal.throwIfAborted()
        reportPage(0)
        const page = await waitForRead(pdf.getPage(pageNumber))
        try {
          const { items } = await waitForRead(page.getTextContent())
          signal.throwIfAborted()
          if (items.some((item) => "str" in item && item.str.trim())) {
            skippedPages = true
          } else {
            yield page
          }
        } finally {
          page.cleanup()
        }
      }
    }

    const pages = pagesWithoutText()
    try {
      let next = await pages.next()
      if (!next.done) {
        onProgress({ stage: "loading" })
        await withOcrWorker(
          language,
          includeEnglish,
          signal,
          reportPage,
          async (worker) => {
            reportPage(0)
            while (!next.done) {
              await readPage(next.value, worker)
              next = await pages.next()
            }
          }
        )
      }
    } finally {
      canvas.width = canvas.height = 0
      await pages.return(undefined)
    }

    signal.throwIfAborted()
    if (!output)
      return { status: skippedPages ? "alreadySearchable" : "noText" }
    onProgress({ stage: "saving" })
    const result = await output.save()
    signal.throwIfAborted()
    return {
      status: "ready",
      blob: new Blob([new Uint8Array(result)], { type: "application/pdf" }),
      skippedPages,
    }
  } catch (error) {
    signal.throwIfAborted()
    if (error instanceof Error) {
      if (
        error.name === "PasswordException" ||
        error.name === "EncryptedPDFError"
      ) {
        return { status: "encryptedPdf" }
      }
      if (error.name === "InvalidPDFException") return { status: "invalidPdf" }
    }
    throw error
  } finally {
    signal.removeEventListener("abort", stopReading)
    await (stopping ?? task.destroy())
  }
}
