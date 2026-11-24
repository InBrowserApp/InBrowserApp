import { PDFDocument } from "pdf-lib"
import { openComic } from "./archive"
import { ConversionError, conversionFailure } from "./errors"
import { rasterize } from "./rasterize"
import type { PdfResult, Progress } from "./pdf-types"

export async function convertPdf(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<PdfResult> {
  const comic = await openComic(file, signal)
  try {
    signal.throwIfAborted()
    if (!comic.pages.length) throw new ConversionError({ code: "empty" })
    const document = await PDFDocument.create()
    const total = comic.pages.length
    for (const [index, page] of comic.pages.entries()) {
      signal.throwIfAborted()
      const position = { page: index + 1, name: page.name }
      progress({ ...position, total, saving: false })
      try {
        if (page.status !== "unchecked" && page.status !== "ready")
          throw new ConversionError({ code: page.status })
        const blob = await comic.read(index, signal)
        signal.throwIfAborted()
        const image = await rasterize(blob)
        signal.throwIfAborted()
        const embedded = await document.embedPng(image.bytes)
        // One common long edge keeps every PDF page within normal PDF bounds,
        // regardless of source DPI or pixel size, without resampling artwork.
        const scale = 842 / Math.max(image.width, image.height)
        const width = image.width * scale
        const height = image.height * scale
        document.addPage([width, height]).drawImage(embedded, {
          x: 0,
          y: 0,
          width,
          height,
        })
        await embedded.embed()
      } catch (reason) {
        signal.throwIfAborted()
        const error = conversionFailure(reason)
        throw new ConversionError({
          ...position,
          code: error.code === "damaged" ? "damagedPage" : error.code,
        })
      }
    }
    progress({ page: total, total, name: "", saving: true })
    signal.throwIfAborted()
    const bytes = await document.save()
    signal.throwIfAborted()
    return {
      pdf: new Blob([bytes.slice()], { type: "application/pdf" }),
      names: comic.pages.map((page) => page.name),
    }
  } finally {
    await comic.dispose()
  }
}
