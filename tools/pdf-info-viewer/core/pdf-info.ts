import { PDFDocument } from "pdf-lib"

type PdfFileInfo = Readonly<{
  name: string
  size: number
  type: string
  lastModified?: string
}>

type PdfPageSize = Readonly<{
  height: number
  width: number
}>

type PdfDocumentInfo = Readonly<{
  encrypted: boolean
  firstPageSize?: PdfPageSize
  pageCount?: number
  version?: string
}>

type PdfMetadataInfo = Readonly<{
  author?: string
  creationDate?: string
  creator?: string
  keywords?: readonly string[]
  modificationDate?: string
  producer?: string
  subject?: string
  title?: string
}>

type PdfInfo = Readonly<{
  document: PdfDocumentInfo
  file: PdfFileInfo
  metadata: PdfMetadataInfo
}>

const PDF_EXTENSION = /\.pdf$/i
const PDF_HEADER_PATTERN = /%PDF-([0-9]+\.[0-9]+)/

function isPdfFile(file: Pick<File, "name" | "type">) {
  return file.type === "application/pdf" || PDF_EXTENSION.test(file.name)
}

function formatBytes(bytes: number) {
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

  return `${value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${
    units[unitIndex]
  }`
}

function formatDateTime(value: string | undefined, language: string) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatPageSize(size: PdfPageSize | undefined) {
  if (!size) {
    return ""
  }

  const widthInches = size.width / 72
  const heightInches = size.height / 72

  return `${formatNumber(size.width)} x ${formatNumber(
    size.height
  )} pt (${widthInches.toFixed(2)} x ${heightInches.toFixed(2)} in)`
}

function getMetadataFieldCount(metadata: PdfMetadataInfo) {
  return Object.values(metadata).filter((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  ).length
}

function pdfInfoToJson(info: PdfInfo) {
  return JSON.stringify(info, null, 2)
}

function parsePdfVersion(buffer: ArrayBuffer) {
  const headerText = new TextDecoder("utf-8").decode(buffer.slice(0, 32))
  return headerText.match(PDF_HEADER_PATTERN)?.[1]
}

function normalizeText(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function normalizeKeywords(value?: string | string[]) {
  if (!value) {
    return undefined
  }

  if (Array.isArray(value)) {
    const keywords = value.map((item) => item.trim()).filter(Boolean)
    return keywords.length ? keywords : undefined
  }

  const keywords = value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return keywords.length ? keywords : undefined
}

function normalizeDate(value?: Date) {
  if (!value || Number.isNaN(value.getTime())) {
    return undefined
  }

  return value.toISOString()
}

function createBaseInfo(file: File, buffer: ArrayBuffer): PdfInfo {
  return {
    document: {
      encrypted: false,
      version: parsePdfVersion(buffer),
    },
    file: {
      lastModified: file.lastModified
        ? new Date(file.lastModified).toISOString()
        : undefined,
      name: file.name,
      size: file.size,
      type: file.type || "application/pdf",
    },
    metadata: {},
  }
}

function isEncryptedPdfError(error: unknown) {
  return error instanceof Error && error.name === "EncryptedPDFError"
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.?0+$/, "")
}

async function extractPdfInfo(file: File): Promise<PdfInfo> {
  const buffer = await file.arrayBuffer()
  const baseInfo = createBaseInfo(file, buffer)

  try {
    const pdfDocument = await PDFDocument.load(buffer)
    const firstPage = pdfDocument.getPages()[0]

    return {
      ...baseInfo,
      document: {
        ...baseInfo.document,
        firstPageSize: firstPage?.getSize(),
        pageCount: pdfDocument.getPageCount(),
      },
      metadata: {
        author: normalizeText(pdfDocument.getAuthor()),
        creationDate: normalizeDate(pdfDocument.getCreationDate()),
        creator: normalizeText(pdfDocument.getCreator()),
        keywords: normalizeKeywords(pdfDocument.getKeywords()),
        modificationDate: normalizeDate(pdfDocument.getModificationDate()),
        producer: normalizeText(pdfDocument.getProducer()),
        subject: normalizeText(pdfDocument.getSubject()),
        title: normalizeText(pdfDocument.getTitle()),
      },
    }
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      return {
        ...baseInfo,
        document: {
          ...baseInfo.document,
          encrypted: true,
        },
      }
    }

    throw error
  }
}

export {
  extractPdfInfo,
  formatBytes,
  formatDateTime,
  formatPageSize,
  getMetadataFieldCount,
  isPdfFile,
  pdfInfoToJson,
}
export type { PdfInfo }
