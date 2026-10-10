import { getDocument } from "@ofdjs/viewer"
import type { Diagnostic, OFDDocument, OFDPage } from "@ofdjs/viewer"
import { PDFDocument } from "pdf-lib"
import { documentCount } from "./archive"
import { ConversionError, failure } from "./errors"

export type Progress = {
  document: number
  documents: number
  page: number
  pages: number
  saving?: boolean
}
export type Result = {
  pdf: Blob
  documents: number
  positions: { document: number; page: number }[]
  substitutedFonts: boolean
}

function diagnostics(items: Diagnostic[]) {
  let fonts = false
  for (const item of items) {
    if (item.code === "SIGNATURE_UNSUPPORTED")
      throw new ConversionError("signature")
    if (item.code.startsWith("FONT_")) fonts = true
    else if (
      item.code !== "MULTI_DOCUMENT" &&
      item.code !== "MISSING_DEFAULT_PAGE_AREA"
    )
      throw new ConversionError("unsupported")
  }
  return fonts
}

async function rasterize(page: OFDPage, signal: AbortSignal) {
  const canvas = document.createElement("canvas")
  try {
    const context = canvas.getContext("2d")
    if (!context) throw new ConversionError("resource")
    const task = page.render({
      canvasContext: context,
      viewport: page.getViewport({ scale: 150 / 96 }),
      pixelRatio: 1,
      background: "#ffffff",
      signal,
    })
    try {
      await task.promise
    } finally {
      task.cancel()
    }
    signal.throwIfAborted()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    )
    signal.throwIfAborted()
    if (!blob) throw new ConversionError("resource")
    const bytes = new Uint8Array(await blob.arrayBuffer())
    signal.throwIfAborted()
    return bytes
  } finally {
    canvas.width = canvas.height = 0
  }
}

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<Result> {
  signal.throwIfAborted()
  const bytes = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const documents = documentCount(bytes)
  const pdf = await PDFDocument.create()
  const positions: Result["positions"] = []
  let substitutedFonts = false
  for (let index = 0; index < documents; index++) {
    signal.throwIfAborted()
    let source: OFDDocument | undefined
    let pageNumber = 0
    try {
      source = await getDocument(bytes, {
        documentIndex: index,
        signal,
        maxFileSize: Infinity,
        maxUncompressedSize: Infinity,
        maxEntries: Infinity,
      })
      signal.throwIfAborted()
      substitutedFonts = diagnostics(source.diagnostics) || substitutedFonts
      for (pageNumber = 1; pageNumber <= source.numPages; pageNumber++) {
        signal.throwIfAborted()
        progress({
          document: index + 1,
          documents,
          page: pageNumber,
          pages: source.numPages,
        })
        const page = await source.getPage(pageNumber)
        signal.throwIfAborted()
        const image = await rasterize(page, signal)
        // Render completion can still report omitted images or graphics.
        substitutedFonts = diagnostics(source.diagnostics) || substitutedFonts
        const width = (page.physicalBox[2] * 72) / 25.4
        const height = (page.physicalBox[3] * 72) / 25.4
        const embedded = await pdf.embedPng(image)
        signal.throwIfAborted()
        pdf.addPage([width, height]).drawImage(embedded, {
          x: 0,
          y: 0,
          width,
          height,
        })
        await embedded.embed()
        positions.push({ document: index + 1, page: pageNumber })
        // Give cancellation and progress updates a turn between pages.
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    } catch (reason) {
      signal.throwIfAborted()
      throw new ConversionError(failure(reason).code, index + 1, pageNumber)
    } finally {
      source?.destroy()
    }
  }
  signal.throwIfAborted()
  progress({ document: documents, documents, page: 0, pages: 0, saving: true })
  const output = await pdf.save()
  signal.throwIfAborted()
  return {
    pdf: new Blob([output.slice()], { type: "application/pdf" }),
    documents,
    positions,
    substitutedFonts,
  }
}
