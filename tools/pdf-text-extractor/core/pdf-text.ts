type PdfTextItemLike = Readonly<{
  hasEOL?: boolean
  str: string
}>

type PdfTextContentLike = Readonly<{
  items: readonly unknown[]
}>

type PdfOperatorListLike = Readonly<{
  fnArray: readonly number[]
}>

type PdfPageProxyLike = Readonly<{
  cleanup: () => void
  getOperatorList: () => Promise<PdfOperatorListLike>
  getTextContent: (options: {
    disableNormalization: boolean
    includeMarkedContent: boolean
  }) => Promise<PdfTextContentLike>
}>

type PdfDocumentProxyLike = Readonly<{
  destroy: () => Promise<void> | void
  getPage: (pageNumber: number) => Promise<PdfPageProxyLike>
  numPages: number
}>

type PdfDocumentLoadingTaskLike = Readonly<{
  destroy: () => Promise<void> | void
  promise: Promise<PdfDocumentProxyLike>
}>

type PdfDocumentLoader = (data: Uint8Array) => PdfDocumentLoadingTaskLike

type PdfTextExtractionOptions = Readonly<{
  imagePaintOperations: ReadonlySet<number>
  loadPdfDocument: PdfDocumentLoader
}>

type PdfTextPage = Readonly<{
  characterCount: number
  likelyScanned: boolean
  pageNumber: number
  text: string
  wordCount: number
}>

type PdfTextExtractionResult = Readonly<{
  characterCount: number
  emptyTextPages: number
  likelyScannedPages: number
  pageCount: number
  pages: readonly PdfTextPage[]
  text: string
  textPages: number
  wordCount: number
}>

const PDF_EXTENSION = /\.pdf$/i
const DEFAULT_TEXT_FILE_NAME = "extracted-text.txt"

function isPdfFile(file: Pick<File, "name" | "type">) {
  return file.type === "application/pdf" || PDF_EXTENSION.test(file.name)
}

function formatBytes(bytes: number, locale = "en") {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ["KB", "MB", "GB"] as const
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const precision = value >= 10 ? 1 : 2
  const formattedValue = new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(value)

  return `${formattedValue} ${units[unitIndex]}`
}

function createTextDownloadFileName(fileName: string) {
  const withoutControlCharacters = Array.from(fileName, (character) =>
    character.charCodeAt(0) < 32 ? "-" : character
  ).join("")
  const baseName = withoutControlCharacters
    .replace(/\.pdf$/i, "")
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()

  return baseName ? `${baseName}.txt` : DEFAULT_TEXT_FILE_NAME
}

function normalizePageText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function countWords(value: string) {
  return value.match(/\S+/g)?.length ?? 0
}

function isTextItem(item: unknown): item is PdfTextItemLike {
  if (!item || typeof item !== "object" || !("str" in item)) {
    return false
  }

  return typeof item.str === "string"
}

async function getPageText(page: PdfPageProxyLike) {
  const textContent = await page.getTextContent({
    disableNormalization: false,
    includeMarkedContent: false,
  })
  const chunks: string[] = []

  for (const item of textContent.items) {
    if (!isTextItem(item)) {
      continue
    }

    if (item.str) {
      chunks.push(item.str)
    }

    chunks.push(item.hasEOL ? "\n" : " ")
  }

  return normalizePageText(chunks.join(""))
}

async function pageHasImageContent(
  page: PdfPageProxyLike,
  imagePaintOperations: ReadonlySet<number>
) {
  const operatorList = await page.getOperatorList()
  return operatorList.fnArray.some((operation) =>
    imagePaintOperations.has(operation)
  )
}

function toOutputText(pages: readonly PdfTextPage[]) {
  return pages
    .map((page) => page.text)
    .filter((text) => text.length > 0)
    .join("\n\n")
}

function isPdfPasswordError(error: unknown) {
  return error instanceof Error && error.name === "PasswordException"
}

async function extractPdfText(
  file: File,
  { imagePaintOperations, loadPdfDocument }: PdfTextExtractionOptions
): Promise<PdfTextExtractionResult> {
  const pdfData = new Uint8Array(await file.arrayBuffer())
  const loadingTask = loadPdfDocument(pdfData)
  let documentProxy: PdfDocumentProxyLike | null = null

  try {
    documentProxy = await loadingTask.promise
    const pages: PdfTextPage[] = []

    for (
      let pageNumber = 1;
      pageNumber <= documentProxy.numPages;
      pageNumber += 1
    ) {
      const page = await documentProxy.getPage(pageNumber)

      try {
        const text = await getPageText(page)
        const likelyScanned =
          text.length === 0 &&
          (await pageHasImageContent(page, imagePaintOperations))

        pages.push({
          characterCount: text.length,
          likelyScanned,
          pageNumber,
          text,
          wordCount: countWords(text),
        })
      } finally {
        page.cleanup()
      }
    }

    const text = toOutputText(pages)
    const emptyTextPages = pages.filter((page) => !page.text).length
    const likelyScannedPages = pages.filter((page) => page.likelyScanned).length

    return {
      characterCount: text.length,
      emptyTextPages,
      likelyScannedPages,
      pageCount: pages.length,
      pages,
      text,
      textPages: pages.length - emptyTextPages,
      wordCount: countWords(text),
    }
  } finally {
    if (documentProxy) {
      await documentProxy.destroy()
    } else {
      await loadingTask.destroy()
    }
  }
}

export {
  countWords,
  createTextDownloadFileName,
  extractPdfText,
  formatBytes,
  isPdfFile,
  isPdfPasswordError,
  normalizePageText,
  toOutputText,
}
export type {
  PdfDocumentLoadingTaskLike,
  PdfDocumentProxyLike,
  PdfPageProxyLike,
  PdfTextExtractionResult,
  PdfTextPage,
}
