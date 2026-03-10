import workerURL from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import foxitDingbats from 'pdfjs-dist/standard_fonts/FoxitDingbats.pfb?url'
import foxitFixed from 'pdfjs-dist/standard_fonts/FoxitFixed.pfb?url'
import foxitFixedBold from 'pdfjs-dist/standard_fonts/FoxitFixedBold.pfb?url'
import foxitFixedBoldItalic from 'pdfjs-dist/standard_fonts/FoxitFixedBoldItalic.pfb?url'
import foxitFixedItalic from 'pdfjs-dist/standard_fonts/FoxitFixedItalic.pfb?url'
import foxitSerif from 'pdfjs-dist/standard_fonts/FoxitSerif.pfb?url'
import foxitSerifBold from 'pdfjs-dist/standard_fonts/FoxitSerifBold.pfb?url'
import foxitSerifBoldItalic from 'pdfjs-dist/standard_fonts/FoxitSerifBoldItalic.pfb?url'
import foxitSerifItalic from 'pdfjs-dist/standard_fonts/FoxitSerifItalic.pfb?url'
import foxitSymbol from 'pdfjs-dist/standard_fonts/FoxitSymbol.pfb?url'
import liberationSansBold from 'pdfjs-dist/standard_fonts/LiberationSans-Bold.ttf?url'
import liberationSansBoldItalic from 'pdfjs-dist/standard_fonts/LiberationSans-BoldItalic.ttf?url'
import liberationSansItalic from 'pdfjs-dist/standard_fonts/LiberationSans-Italic.ttf?url'
import liberationSansRegular from 'pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf?url'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'

const MIN_RENDER_WIDTH = 120

GlobalWorkerOptions.workerSrc = workerURL

const standardFontURLMap: Record<string, string> = {
  'FoxitDingbats.pfb': foxitDingbats,
  'FoxitFixed.pfb': foxitFixed,
  'FoxitFixedBold.pfb': foxitFixedBold,
  'FoxitFixedBoldItalic.pfb': foxitFixedBoldItalic,
  'FoxitFixedItalic.pfb': foxitFixedItalic,
  'FoxitSerif.pfb': foxitSerif,
  'FoxitSerifBold.pfb': foxitSerifBold,
  'FoxitSerifBoldItalic.pfb': foxitSerifBoldItalic,
  'FoxitSerifItalic.pfb': foxitSerifItalic,
  'FoxitSymbol.pfb': foxitSymbol,
  'LiberationSans-Bold.ttf': liberationSansBold,
  'LiberationSans-BoldItalic.ttf': liberationSansBoldItalic,
  'LiberationSans-Italic.ttf': liberationSansItalic,
  'LiberationSans-Regular.ttf': liberationSansRegular,
}

class PdfJsStandardFontDataFactory {
  async fetch(request: { filename: string }): Promise<Uint8Array> {
    const fontURL = standardFontURLMap[request.filename]

    if (!fontURL) {
      throw new Error(`Unsupported standard font: ${request.filename}`)
    }

    const response = await fetch(fontURL)
    if (!response.ok) {
      throw new Error(`Failed to load standard font: ${request.filename}`)
    }

    return new Uint8Array(await response.arrayBuffer())
  }
}

const loadPdfDocument = (url: string): PDFDocumentLoadingTask =>
  getDocument({
    url,
    StandardFontDataFactory: PdfJsStandardFontDataFactory,
    useSystemFonts: true,
  })

const canvasToBlob = async (canvas: HTMLCanvasElement): Promise<Blob> =>
  await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_TO_BLOB_FAILED'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      0.88,
    )
  })

export class PdfPageRenderer {
  private readonly file: File

  private fileURL: string | null = null

  private documentPromise: Promise<PDFDocumentProxy> | null = null

  private cache = new Map<string, Promise<Blob>>()

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

  async renderPage(pageNumber: number, width: number): Promise<Blob> {
    const normalizedWidth = Math.max(MIN_RENDER_WIDTH, Math.round(width))
    const cacheKey = `${pageNumber}-${normalizedWidth}`
    const cached = this.cache.get(cacheKey)

    if (cached) {
      return cached
    }

    const renderPromise = this.renderPageRaw(pageNumber, normalizedWidth).catch(
      (error: unknown) => {
        this.cache.delete(cacheKey)
        throw error
      },
    )

    this.cache.set(cacheKey, renderPromise)
    return renderPromise
  }

  private async renderPageRaw(pageNumber: number, width: number): Promise<Blob> {
    const documentProxy = await this.getDocument()
    const page = await documentProxy.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })
    const scale = width / Math.max(1, viewport.width)
    const scaledViewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')

    canvas.width = Math.max(1, Math.round(scaledViewport.width))
    canvas.height = Math.max(1, Math.round(scaledViewport.height))

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
    }

    await page.render({
      canvas,
      canvasContext: context,
      viewport: scaledViewport,
    }).promise

    const blob = await canvasToBlob(canvas)
    page.cleanup()
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
    this.cache.clear()
  }
}
