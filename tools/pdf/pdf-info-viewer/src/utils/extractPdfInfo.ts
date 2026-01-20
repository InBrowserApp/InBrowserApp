import { PDFDocument } from 'pdf-lib'

export type PdfInfo = {
  file: {
    name: string
    size: number
    type: string
    lastModified?: Date
  }
  document: {
    version?: string
    pageCount?: number
    encrypted: boolean
  }
  metadata: {
    title?: string
    author?: string
    subject?: string
    keywords?: string[]
    creator?: string
    producer?: string
    creationDate?: Date
    modificationDate?: Date
  }
}

const headerPattern = /%PDF-([0-9]+\.[0-9]+)/

const parsePdfVersion = (buffer: ArrayBuffer): string | undefined => {
  const headerSlice = buffer.slice(0, 32)
  const headerText = new TextDecoder('utf-8').decode(headerSlice)
  const match = headerText.match(headerPattern)
  return match?.[1]
}

const normalizeText = (value?: string): string | undefined => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

const normalizeKeywords = (value?: string | string[]): string[] | undefined => {
  if (!value) return undefined
  if (Array.isArray(value)) {
    const keywords = value.map((item) => item.trim()).filter(Boolean)
    return keywords.length ? keywords : undefined
  }

  const trimmed = value.trim()
  return trimmed ? [trimmed] : undefined
}

const normalizeDate = (value?: Date): Date | undefined => {
  if (!value) return undefined
  if (Number.isNaN(value.getTime())) return undefined
  return value
}

const isEncryptedPdfError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'EncryptedPDFError'

export async function extractPdfInfo(file: File): Promise<PdfInfo> {
  const buffer = await file.arrayBuffer()
  const version = parsePdfVersion(buffer)

  const info: PdfInfo = {
    file: {
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
      lastModified: file.lastModified ? new Date(file.lastModified) : undefined,
    },
    document: {
      version,
      encrypted: false,
    },
    metadata: {},
  }

  try {
    const pdfDoc = await PDFDocument.load(buffer)
    info.document.pageCount = pdfDoc.getPageCount()
    info.metadata.title = normalizeText(pdfDoc.getTitle())
    info.metadata.author = normalizeText(pdfDoc.getAuthor())
    info.metadata.subject = normalizeText(pdfDoc.getSubject())
    info.metadata.keywords = normalizeKeywords(pdfDoc.getKeywords())
    info.metadata.creator = normalizeText(pdfDoc.getCreator())
    info.metadata.producer = normalizeText(pdfDoc.getProducer())
    info.metadata.creationDate = normalizeDate(pdfDoc.getCreationDate())
    info.metadata.modificationDate = normalizeDate(pdfDoc.getModificationDate())
    return info
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      info.document.encrypted = true
      return info
    }
    throw error
  }
}
