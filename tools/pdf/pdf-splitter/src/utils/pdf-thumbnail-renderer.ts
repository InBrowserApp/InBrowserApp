import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import { loadPdfDocument } from './pdfjs'

const MIN_THUMBNAIL_WIDTH = 120

const canvasToBlob = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_TO_BLOB_FAILED'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      0.85,
    )
  })
}

export class PdfThumbnailRenderer {
  private readonly file: File

  private fileURL: string | null = null

  private documentPromise: Promise<PDFDocumentProxy> | null = null

  private thumbnailCache = new Map<string, Promise<Blob>>()

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

  async getPageCount(): Promise<number> {
    const documentProxy = await this.getDocument()
    return documentProxy.numPages
  }

  async renderPage(page: number, width: number): Promise<Blob> {
    const normalizedWidth = Math.max(MIN_THUMBNAIL_WIDTH, Math.round(width))
    const cacheKey = `${page}-${normalizedWidth}`
    const cached = this.thumbnailCache.get(cacheKey)

    if (cached) {
      return cached
    }

    const renderPromise = this.renderPageRaw(page, normalizedWidth).catch((error: unknown) => {
      this.thumbnailCache.delete(cacheKey)
      throw error
    })

    this.thumbnailCache.set(cacheKey, renderPromise)
    return renderPromise
  }

  private async renderPageRaw(page: number, width: number): Promise<Blob> {
    const documentProxy = await this.getDocument()
    const pdfPage = await documentProxy.getPage(page)
    const viewport = pdfPage.getViewport({ scale: 1 })

    const scale = width / Math.max(1, viewport.width)
    const scaledViewport = pdfPage.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(scaledViewport.width))
    canvas.height = Math.max(1, Math.round(scaledViewport.height))

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
    }

    const renderTask = pdfPage.render({
      canvas,
      canvasContext: context,
      viewport: scaledViewport,
    })

    await renderTask.promise
    const blob = await canvasToBlob(canvas)

    pdfPage.cleanup()
    canvas.remove()

    return blob
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
    this.thumbnailCache.clear()
  }
}
