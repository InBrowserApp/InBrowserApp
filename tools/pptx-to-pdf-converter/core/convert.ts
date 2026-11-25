import { PDFDocument } from "pdf-lib"
import { loadPresentation, renderSlideImage } from "../presentation"
import { ConversionError, failure } from "./errors"

export type Progress = { page: number; pages: number; saving?: boolean }
export type Result = { pdf: Blob; pages: number }

export async function convert(
  file: File,
  signal: AbortSignal,
  progress: (value: Progress) => void
): Promise<Result> {
  signal.throwIfAborted()
  let source: Awaited<ReturnType<typeof loadPresentation>> | undefined
  let page = 0
  const dispose = () => {
    source?.destroy()
    source = undefined
  }
  try {
    source = await loadPresentation(file, signal)
    signal.throwIfAborted()
    signal.addEventListener("abort", dispose, { once: true })
    await source.waitUntilLayoutComplete()
    signal.throwIfAborted()
    if (source.slideCount < 1) throw new ConversionError("invalid")
    const pages = source.slideCount
    const pdf = await PDFDocument.create()
    for (page = 1; page <= pages; page++) {
      signal.throwIfAborted()
      progress({ page, pages })
      signal.throwIfAborted()
      const width = source.slideWidth / 12_700
      const height = source.slideHeight / 12_700
      const image = await renderSlideImage(
        source,
        page - 1,
        (width * 150) / 72,
        (height * 150) / 72,
        signal
      )
      const bytes = new Uint8Array(await image.arrayBuffer())
      signal.throwIfAborted()
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
