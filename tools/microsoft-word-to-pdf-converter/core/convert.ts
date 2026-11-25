import { DocxDocument } from "@silurus/ooxml/docx"
import { math } from "@silurus/ooxml/math"
import { threeD } from "@silurus/ooxml/three-d"
import { regionMap } from "@silurus/ooxml/region-map"
import { chartEx } from "@silurus/ooxml/chart-ex"
import { tiff } from "@silurus/ooxml/tiff"
import {
  imageResources,
  maximumPageZoom,
  officeLoadOptions,
} from "@workspace/document-reader"
import { PDFDocument } from "pdf-lib"
import { inspectArchive } from "./archive"
import { ConversionError, failure } from "./errors"

export type Progress = { page: number; pages: number; saving?: boolean }
export type Result = { pdf: Blob; pages: number }

async function rasterize(
  source: DocxDocument,
  index: number,
  width: number,
  height: number,
  signal: AbortSignal
) {
  // Check the actual 150 DPI allocation rather than allowing the renderer to
  // silently clamp it and produce a lower-resolution page.
  if (maximumPageZoom(width, height) < 1) throw new ConversionError("resource")
  const canvas = document.createElement("canvas")
  try {
    await source.renderPage(canvas, index, {
      width,
      dpr: 1,
      imageResources,
      showTrackedChanges: false,
    })
    signal.throwIfAborted()
    const context = canvas.getContext("2d")
    if (!context) throw new ConversionError("resource")
    context.globalCompositeOperation = "destination-over"
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
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
  let source: DocxDocument | undefined
  let page = 0
  const dispose = () => {
    source?.destroy()
    source = undefined
  }
  try {
    const data = await file.arrayBuffer()
    signal.throwIfAborted()
    inspectArchive(data)
    source = await DocxDocument.load(data, {
      ...officeLoadOptions,
      math,
      threeD,
      regionMap,
      chartEx,
      tiff,
    })
    signal.throwIfAborted()
    signal.addEventListener("abort", dispose, { once: true })
    await source.waitUntilLayoutComplete()
    signal.throwIfAborted()
    if (source.document.parseError || source.pageCount < 1)
      throw new ConversionError("invalid")
    const pages = source.pageCount
    const pdf = await PDFDocument.create()
    for (page = 1; page <= pages; page++) {
      signal.throwIfAborted()
      progress({ page, pages })
      signal.throwIfAborted()
      const { widthPt: width, heightPt: height } = source.pageSize(page - 1)
      const bytes = await rasterize(
        source,
        page - 1,
        (width * 150) / 72,
        (height * 150) / 72,
        signal
      )
      const embedded = await pdf.embedPng(bytes)
      signal.throwIfAborted()
      pdf.addPage([width, height]).drawImage(embedded, {
        x: 0,
        y: 0,
        width,
        height,
      })
      await embedded.embed()
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    signal.throwIfAborted()
    progress({ page: pages, pages, saving: true })
    const output = await pdf.save()
    signal.throwIfAborted()
    return {
      pdf: new Blob([output.slice()], { type: "application/pdf" }),
      pages,
    }
  } catch (reason) {
    signal.throwIfAborted()
    throw new ConversionError(failure(reason).code, page)
  } finally {
    signal.removeEventListener("abort", dispose)
    dispose()
  }
}
