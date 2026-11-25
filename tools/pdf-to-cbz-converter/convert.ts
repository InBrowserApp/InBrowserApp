import { createCbzWriter } from "@workspace/comic/cbz"
import { openPdfDocument } from "@workspace/pdf-reader/document"
import {
  getPageImage,
  openOriginalImages,
} from "@workspace/pdf-reader/original-images"
import { BlobReader } from "@zip.js/zip.js"
import { orientation } from "exifr"
import { AnnotationMode, PasswordException } from "pdfjs-dist"
import type { PDFPageProxy } from "pdfjs-dist"
import { fullPageImage } from "./page-image"
import { ConversionError } from "./types"
import type { Progress, Result } from "./types"

async function renderPage(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
  nativeWidth?: number
) {
  const base = page.getViewport({ scale: 1 })
  const scale = Math.min(
    nativeWidth ? nativeWidth / base.width : 180 / 72,
    4096 / Math.max(base.width, base.height),
    Math.sqrt(12_000_000 / (base.width * base.height))
  )
  const viewport = page.getViewport({ scale })
  canvas.width = Math.max(1, Math.round(viewport.width))
  canvas.height = Math.max(1, Math.round(viewport.height))
  const render = page.render({
    canvas,
    viewport,
    annotationMode: AnnotationMode.ENABLE,
  })
  const cancel = () => render.cancel()
  signal.addEventListener("abort", cancel, { once: true })
  try {
    await render.promise
  } finally {
    signal.removeEventListener("abort", cancel)
  }
  signal.throwIfAborted()
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Could not encode PDF page."))
      },
      "image/jpeg",
      0.94
    )
  })
}

export async function convert(
  file: File,
  signal: AbortSignal,
  onProgress: (progress: Progress) => void
): Promise<Result> {
  const data = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const task = openPdfDocument(data)
  let rejectRead!: (reason: unknown) => void
  const canceled = new Promise<never>((_, reject) => {
    rejectRead = reject
  })
  const wait = <T>(request: Promise<T>) => Promise.race([request, canceled])
  let closing: Promise<void> | undefined
  const close = () => (closing ??= task.destroy().catch(() => {}))
  const abort = () => {
    rejectRead(signal.reason)
    void close()
  }
  signal.addEventListener("abort", abort, { once: true })
  try {
    const pdf = await wait(task.promise).catch((error: unknown) => {
      signal.throwIfAborted()
      throw new ConversionError(
        error instanceof PasswordException ? "encrypted" : "invalid"
      )
    })
    const total = pdf.numPages
    if (!total) throw new ConversionError("invalid")
    const canvas = document.createElement("canvas")
    const zip = createCbzWriter()
    const filename = (page: number) =>
      `page-${String(page).padStart(Math.max(4, String(total).length), "0")}.jpg`
    let original: ReturnType<typeof openOriginalImages> | undefined
    let reused = 0
    let cover: Blob | null = null
    async function getOriginal(page: PDFPageProxy, id: string) {
      try {
        const raster = await getPageImage(page, id, signal)
        if (!raster?.ref) return
        original ??= file
          .arrayBuffer()
          .then((bytes) => openOriginalImages(new Uint8Array(bytes)))
        const image = (await wait(original))(raster.ref)
        if (!image) return
        // The PDF display and an image reader can apply EXIF orientation
        // differently. Render the page when that tag changes orientation.
        const tag = await wait(orientation(image))
        return tag === undefined || tag === 1 ? image : undefined
      } catch {
        signal.throwIfAborted()
        return undefined
      }
    }
    try {
      for (let index = 1; index <= total; index++) {
        signal.throwIfAborted()
        onProgress({ page: index, total })
        let page: PDFPageProxy | undefined
        try {
          const current = await wait(pdf.getPage(index))
          page = current
          const candidate = await wait(fullPageImage(current))
          const jpeg = candidate
            ? await getOriginal(current, candidate.id)
            : undefined
          if (jpeg) reused++
          const image =
            jpeg ??
            (await renderPage(current, canvas, signal, candidate?.width))
          await zip.add(filename(index), new BlobReader(image), { signal })
          cover ??= image
        } catch {
          signal.throwIfAborted()
          throw new ConversionError("pageError", index)
        } finally {
          page?.cleanup()
        }
      }
      onProgress("saving")
    } catch (error) {
      await zip.close().catch(() => {})
      throw error
    }
    const cbz = await zip.close()
    signal.throwIfAborted()
    return {
      cbz,
      total,
      first: filename(1),
      last: filename(total),
      cover,
      reused,
    }
  } finally {
    signal.removeEventListener("abort", abort)
    await close()
  }
}
