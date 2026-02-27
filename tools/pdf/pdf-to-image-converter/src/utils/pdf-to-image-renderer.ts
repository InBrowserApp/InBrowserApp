import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import { dpiToScale } from './dpi'
import { loadPdfDocument } from './pdfjs'
import { getMimeType, shouldUseQuality } from './mime'
import type { PdfPageImage, RenderPageOptions } from '../types'

function createRenderKey(page: number, options: RenderPageOptions): string {
  return `${page}-${options.dpi}-${options.format}-${options.quality}`
}

async function canvasToBlob(canvas: HTMLCanvasElement, options: RenderPageOptions): Promise<Blob> {
  const mimeType = getMimeType(options.format)

  return await new Promise((resolve, reject) => {
    const quality = shouldUseQuality(options.format) ? options.quality : undefined
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_TO_BLOB_FAILED'))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality,
    )
  })
}

export class PdfToImageRenderer {
  private readonly file: File

  private documentPromise: Promise<PDFDocumentProxy> | null = null

  private pageCache = new Map<string, Promise<PdfPageImage>>()

  private fileURL: string | null = null

  constructor(file: File) {
    this.file = file
  }

  private async getDocument(): Promise<PDFDocumentProxy> {
    if (this.documentPromise) {
      return this.documentPromise
    }

    this.fileURL = URL.createObjectURL(this.file)
    const loadingTask = loadPdfDocument(this.fileURL)

    this.documentPromise = loadingTask.promise.catch((error: unknown) => {
      this.documentPromise = null
      throw error
    })

    return this.documentPromise
  }

  async getNumPages(): Promise<number> {
    const documentProxy = await this.getDocument()
    return documentProxy.numPages
  }

  async renderPage(page: number, options: RenderPageOptions): Promise<PdfPageImage> {
    const cacheKey = createRenderKey(page, options)
    const cachedPromise = this.pageCache.get(cacheKey)
    if (cachedPromise) {
      return cachedPromise
    }

    const renderPromise = this.renderPageRaw(page, options).catch((error: unknown) => {
      this.pageCache.delete(cacheKey)
      throw error
    })

    this.pageCache.set(cacheKey, renderPromise)
    return renderPromise
  }

  private async renderPageRaw(page: number, options: RenderPageOptions): Promise<PdfPageImage> {
    const documentProxy = await this.getDocument()
    const pdfPage = await documentProxy.getPage(page)
    const scale = dpiToScale(options.dpi)
    const viewport = pdfPage.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(viewport.width))
    canvas.height = Math.max(1, Math.round(viewport.height))

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
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
      page,
      width: canvas.width,
      height: canvas.height,
      blob,
      dpi: options.dpi,
      format: options.format,
      quality: options.quality,
    }
  }

  async destroy(): Promise<void> {
    if (this.documentPromise) {
      const documentProxy = await this.documentPromise.catch(() => null)
      await documentProxy?.destroy()
    }

    if (this.fileURL) {
      URL.revokeObjectURL(this.fileURL)
      this.fileURL = null
    }

    this.documentPromise = null
    this.pageCache.clear()
  }
}
