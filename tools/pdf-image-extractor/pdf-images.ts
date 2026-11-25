import { PdfAssets } from "@workspace/pdf-reader/assets"
import { getPageImage } from "@workspace/pdf-reader/original-images"
import {
  AnnotationMode,
  getDocument,
  GlobalWorkerOptions,
  OPS,
} from "pdfjs-dist"
// oxlint-disable-next-line import/default -- Vite creates the default export for ?url assets.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { encodePng, openOriginalImages } from "./image-export"
import type { PdfRaster } from "./image-export"

export type ExtractedImage = {
  blob: Blob
  width: number
  height: number
  page: number
  name: string
}

export type Extraction = {
  images: ExtractedImage[]
  skipped: boolean
}

export async function extractPdfImages(
  file: Blob,
  signal: AbortSignal,
  onPage: (page: number, total: number) => void
): Promise<Extraction> {
  const data = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  GlobalWorkerOptions.workerSrc = workerUrl
  const task = getDocument({
    data: data.slice(),
    BinaryDataFactory: PdfAssets,
    useWorkerFetch: false,
    isOffscreenCanvasSupported: false,
    isImageDecoderSupported: false,
    disableFontFace: true,
    verbosity: 0,
  })
  let closing: Promise<void> | undefined
  const close = () => (closing ??= task.destroy().catch(() => {}))
  const abort = () => void close()
  signal.addEventListener("abort", abort, { once: true })

  try {
    const pdf = await task.promise
    let originalImages: ReturnType<typeof openOriginalImages> | undefined
    const images: ExtractedImage[] = []
    const seen = new Set<string>()
    let skipped = false

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      signal.throwIfAborted()
      onPage(pageNumber, pdf.numPages)
      const page = await pdf.getPage(pageNumber)
      try {
        const { fnArray, argsArray } = await page.getOperatorList({
          annotationMode: AnnotationMode.DISABLE,
        })
        for (const [index, op] of fnArray.entries()) {
          signal.throwIfAborted()
          if (
            op !== OPS.paintImageXObject &&
            op !== OPS.paintInlineImageXObject
          )
            continue
          try {
            const [argument, storedWidth, storedHeight] = argsArray[index] as [
              string | PdfRaster,
              number?,
              number?,
            ]
            const raster =
              typeof argument === "string"
                ? await getPageImage(page, argument, signal)
                : argument
            if (!raster) {
              skipped = true
              continue
            }
            if (raster.ref && seen.has(raster.ref)) continue
            const original = raster.ref
              ? (await (originalImages ??= openOriginalImages(data)))(
                  raster.ref
                )
              : undefined
            const width = storedWidth ?? raster.width
            const height = storedHeight ?? raster.height
            const blob = original ?? (await encodePng(raster, width, height))
            const extension = original ? "jpg" : "png"
            images.push({
              blob,
              width,
              height,
              page: pageNumber,
              name: `page-${pageNumber}-image-${images.length + 1}.${extension}`,
            })
            if (raster.ref) seen.add(raster.ref)
          } catch {
            signal.throwIfAborted()
            skipped = true
          }
        }
      } finally {
        page.cleanup()
      }
    }
    signal.throwIfAborted()
    return { images, skipped }
  } finally {
    signal.removeEventListener("abort", abort)
    await close()
  }
}
