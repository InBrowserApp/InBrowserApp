import { dpiToScale, getMimeType, shouldUseQuality } from "../core/options"

import type { RenderPageOptions } from "../core/options"
import type { PdfPageImage } from "./types"

type PdfJsModule = typeof import("./pdfjs")
type LoadedPdfDocument = Awaited<
  ReturnType<PdfJsModule["loadPdfDocument"]>["promise"]
>

function createRenderKey(page: number, options: RenderPageOptions) {
  return `${page}-${options.dpi}-${options.format}-${options.quality}`
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  options: RenderPageOptions
) {
  const quality = shouldUseQuality(options.format) ? options.quality : undefined

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("CANVAS_TO_BLOB_FAILED"))
          return
        }

        resolve(blob)
      },
      getMimeType(options.format),
      quality
    )
  })
}

class PdfToImageRenderer {
  private readonly file: File
  private documentPromise: Promise<LoadedPdfDocument> | null = null
  private readonly pageCache = new Map<string, Promise<PdfPageImage>>()
  private fileUrl: string | null = null

  constructor(file: File) {
    this.file = file
  }

  private async getDocument() {
    if (this.documentPromise) {
      return this.documentPromise
    }

    this.fileUrl = URL.createObjectURL(this.file)
    const { loadPdfDocument } = await import("./pdfjs")
    const loadingTask = loadPdfDocument(this.fileUrl)
    this.documentPromise = loadingTask.promise.catch((error: unknown) => {
      this.documentPromise = null
      throw error
    })

    return this.documentPromise
  }

  async getNumPages() {
    const documentProxy = await this.getDocument()
    return documentProxy.numPages
  }

  async renderPage(page: number, options: RenderPageOptions) {
    const cacheKey = createRenderKey(page, options)
    const cachedPromise = this.pageCache.get(cacheKey)

    if (cachedPromise) {
      return cachedPromise
    }

    const renderPromise = this.renderPageRaw(page, options).catch(
      (error: unknown) => {
        this.pageCache.delete(cacheKey)
        throw error
      }
    )
    this.pageCache.set(cacheKey, renderPromise)

    return renderPromise
  }

  private async renderPageRaw(page: number, options: RenderPageOptions) {
    const documentProxy = await this.getDocument()
    const pdfPage = await documentProxy.getPage(page)
    const viewport = pdfPage.getViewport({ scale: dpiToScale(options.dpi) })
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(viewport.width))
    canvas.height = Math.max(1, Math.round(viewport.height))

    const context = canvas.getContext("2d", { alpha: false })

    if (!context) {
      throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
    }

    const renderTask = pdfPage.render({
      canvas,
      canvasContext: context,
      viewport,
    })

    await renderTask.promise
    const blob = await canvasToBlob(canvas, options)
    pdfPage.cleanup()
    canvas.remove()

    return {
      blob,
      dpi: options.dpi,
      format: options.format,
      height: canvas.height,
      page,
      quality: options.quality,
      width: canvas.width,
    } satisfies PdfPageImage
  }

  async destroy() {
    if (this.documentPromise) {
      const documentProxy = await this.documentPromise.catch(() => null)
      await documentProxy?.destroy()
    }

    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl)
      this.fileUrl = null
    }

    this.documentPromise = null
    this.pageCache.clear()
  }
}

export { PdfToImageRenderer }
