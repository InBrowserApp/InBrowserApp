import { OPS } from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/pdf'
import { loadPdfDocument } from './pdfjs'

export type PdfTextPage = {
  pageNumber: number
  text: string
  characterCount: number
  wordCount: number
  likelyScanned: boolean
}

export type PdfTextExtractionResult = {
  pageCount: number
  emptyTextPages: number
  likelyScannedPages: number
  pages: PdfTextPage[]
  text: string
}

const imagePaintOperations = new Set<number>([
  OPS.paintImageMaskXObject,
  OPS.paintImageMaskXObjectGroup,
  OPS.paintImageXObject,
  OPS.paintInlineImageXObject,
  OPS.paintInlineImageXObjectGroup,
  OPS.paintImageXObjectRepeat,
  OPS.paintImageMaskXObjectRepeat,
  OPS.paintSolidColorImageMask,
])

const normalizePageText = (value: string): string =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const countWords = (value: string): number => value.match(/\S+/g)?.length ?? 0

function isTextItem(item: unknown): item is { str: string; hasEOL?: boolean } {
  if (!item || typeof item !== 'object') return false
  if (!('str' in item)) return false
  return typeof item.str === 'string'
}

async function getPageText(page: PDFPageProxy): Promise<string> {
  const textContent = await page.getTextContent({
    disableNormalization: false,
    includeMarkedContent: false,
  })

  const chunks: string[] = []

  for (const item of textContent.items) {
    if (!isTextItem(item)) continue

    if (item.str) {
      chunks.push(item.str)
    }

    if (item.hasEOL) {
      chunks.push('\n')
    } else {
      chunks.push(' ')
    }
  }

  return normalizePageText(chunks.join(''))
}

async function pageHasImageContent(page: PDFPageProxy): Promise<boolean> {
  const operatorList = await page.getOperatorList()
  return operatorList.fnArray.some((operation) => imagePaintOperations.has(operation))
}

function toOutputText(pages: PdfTextPage[]): string {
  return pages
    .map((page) => {
      if (!page.text) {
        return `# Page ${page.pageNumber}`
      }

      return `# Page ${page.pageNumber}\n${page.text}`
    })
    .join('\n\n')
}

export async function extractPdfText(file: File): Promise<PdfTextExtractionResult> {
  const pdfData = new Uint8Array(await file.arrayBuffer())
  const loadingTask = loadPdfDocument(pdfData)
  let documentProxy: PDFDocumentProxy | null = null

  try {
    documentProxy = await loadingTask.promise
    const pages: PdfTextPage[] = []

    for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
      const page = await documentProxy.getPage(pageNumber)
      try {
        const text = await getPageText(page)
        const likelyScanned = !text && (await pageHasImageContent(page))

        pages.push({
          pageNumber,
          text,
          characterCount: text.length,
          wordCount: countWords(text),
          likelyScanned,
        })
      } finally {
        page.cleanup()
      }
    }

    const emptyTextPages = pages.filter((page) => !page.text).length
    const likelyScannedPages = pages.filter((page) => page.likelyScanned).length

    return {
      pageCount: pages.length,
      emptyTextPages,
      likelyScannedPages,
      pages,
      text: toOutputText(pages),
    }
  } finally {
    if (documentProxy) {
      await documentProxy.destroy()
    } else {
      await loadingTask.destroy()
    }
  }
}
