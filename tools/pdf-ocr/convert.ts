import { withOcrWorker } from "@workspace/ocr-models/worker"
import { openPdfDocument } from "@workspace/pdf-reader/document"
import { renderPdfScan, withLoadedPdf } from "@workspace/pdf-reader/conversion"
import { PDFDocument } from "pdf-lib"

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
  | { status: "invalidPdf" }
  | { status: "encryptedPdf" }

// Request word geometry for models whose native text-only PDF needs ordering
// adjustments. Vertical writing keeps Tesseract's native vertical layout.
const normalizedModels = new Set<Language>([
  "ara",
  "chi_sim",
  "chi_tra",
  "div",
  "fas",
  "heb",
  "jpn",
  "pus",
  "syr",
  "uig",
  "urd",
  "yid",
])

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
  return withLoadedPdf(
    task,
    signal,
    async (pdf, waitForRead): Promise<Result> => {
      const canvas = document.createElement("canvas")
      let output: PDFDocument | undefined
      let skippedPages = false

      async function readPage(page: PDFPageProxy, worker: Worker) {
        const viewport = await renderPdfScan(page, canvas, signal)
        const { data } = await worker.recognize(
          canvas,
          { pdfTextOnly: true },
          { text: true, pdf: true, blocks: normalizedModels.has(language) }
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
          canvas.height,
          data.blocks
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
      const result = await output.save({ updateFieldAppearances: false })
      signal.throwIfAborted()
      return {
        status: "ready",
        blob: new Blob([new Uint8Array(result)], { type: "application/pdf" }),
        skippedPages,
      }
    }
  ).catch((error: unknown): Result => {
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
  })
}
