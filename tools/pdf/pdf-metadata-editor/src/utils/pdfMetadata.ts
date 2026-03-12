import { PDFDocument, PDFName } from 'pdf-lib'

export const PDF_METADATA_FIELD_KEYS = [
  'title',
  'author',
  'subject',
  'keywords',
  'creator',
  'producer',
  'creationDate',
  'modificationDate',
] as const

export type PdfMetadataFieldKey = (typeof PDF_METADATA_FIELD_KEYS)[number]

export type PdfMetadataInfo = {
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
    keywords?: string
    creator?: string
    producer?: string
    creationDate?: Date
    modificationDate?: Date
  }
}

export type PdfMetadataUpdateMode = 'preserve' | 'set' | 'clear'

export type PdfMetadataTextUpdate = {
  mode: PdfMetadataUpdateMode
  value?: string
}

export type PdfMetadataDateUpdate = {
  mode: PdfMetadataUpdateMode
  value?: Date
}

export type PdfMetadataUpdates = {
  title: PdfMetadataTextUpdate
  author: PdfMetadataTextUpdate
  subject: PdfMetadataTextUpdate
  keywords: PdfMetadataTextUpdate
  creator: PdfMetadataTextUpdate
  producer: PdfMetadataTextUpdate
  creationDate: PdfMetadataDateUpdate
  modificationDate: PdfMetadataDateUpdate
}

type PdfInfoDict = {
  delete: (key: PDFName) => boolean
}

type PdfDocumentInternals = {
  getInfoDict: () => PdfInfoDict
}

const headerPattern = /%PDF-([0-9]+\.[0-9]+)/

const INFO_KEY_BY_FIELD: Record<PdfMetadataFieldKey, string> = {
  title: 'Title',
  author: 'Author',
  subject: 'Subject',
  keywords: 'Keywords',
  creator: 'Creator',
  producer: 'Producer',
  creationDate: 'CreationDate',
  modificationDate: 'ModDate',
}

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

const normalizeDate = (value?: Date): Date | undefined => {
  if (!value || Number.isNaN(value.getTime())) {
    return undefined
  }

  return value
}

const isEncryptedPdfError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'EncryptedPDFError'

const deleteInfoField = (pdfDoc: PDFDocument, field: PdfMetadataFieldKey): void => {
  const infoDict = (pdfDoc as unknown as PdfDocumentInternals).getInfoDict()
  infoDict.delete(PDFName.of(INFO_KEY_BY_FIELD[field]))
}

const applyTextUpdate = (
  pdfDoc: PDFDocument,
  field: Exclude<PdfMetadataFieldKey, 'creationDate' | 'modificationDate'>,
  update: PdfMetadataTextUpdate,
): void => {
  if (update.mode === 'preserve') {
    return
  }

  if (update.mode === 'clear') {
    deleteInfoField(pdfDoc, field)
    return
  }

  const value = normalizeText(update.value)
  if (!value) {
    throw new Error(`Missing value for ${field}`)
  }

  switch (field) {
    case 'title':
      pdfDoc.setTitle(value)
      break
    case 'author':
      pdfDoc.setAuthor(value)
      break
    case 'subject':
      pdfDoc.setSubject(value)
      break
    case 'keywords':
      pdfDoc.setKeywords([value])
      break
    case 'creator':
      pdfDoc.setCreator(value)
      break
    case 'producer':
      pdfDoc.setProducer(value)
      break
  }
}

const applyDateUpdate = (
  pdfDoc: PDFDocument,
  field: Extract<PdfMetadataFieldKey, 'creationDate' | 'modificationDate'>,
  update: PdfMetadataDateUpdate,
): void => {
  if (update.mode === 'preserve') {
    return
  }

  if (update.mode === 'clear') {
    deleteInfoField(pdfDoc, field)
    return
  }

  const value = normalizeDate(update.value)
  if (!value) {
    throw new Error(`Missing value for ${field}`)
  }

  if (field === 'creationDate') {
    pdfDoc.setCreationDate(value)
    return
  }

  pdfDoc.setModificationDate(value)
}

export const formatMetadataDateForInput = (value?: Date): string => {
  const date = normalizeDate(value)
  if (!date) {
    return ''
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const parseMetadataDateInput = (value: string): Date | undefined => {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const date = new Date(trimmed)
  return normalizeDate(date)
}

export const readPdfMetadata = async (file: File): Promise<PdfMetadataInfo> => {
  const buffer = await file.arrayBuffer()
  const version = parsePdfVersion(buffer)

  const info: PdfMetadataInfo = {
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
    const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false })
    info.document.pageCount = pdfDoc.getPageCount()
    info.metadata.title = normalizeText(pdfDoc.getTitle())
    info.metadata.author = normalizeText(pdfDoc.getAuthor())
    info.metadata.subject = normalizeText(pdfDoc.getSubject())
    info.metadata.keywords = normalizeText(pdfDoc.getKeywords())
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

export const writePdfMetadata = async (file: File, updates: PdfMetadataUpdates): Promise<Blob> => {
  const buffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false })

  applyTextUpdate(pdfDoc, 'title', updates.title)
  applyTextUpdate(pdfDoc, 'author', updates.author)
  applyTextUpdate(pdfDoc, 'subject', updates.subject)
  applyTextUpdate(pdfDoc, 'keywords', updates.keywords)
  applyTextUpdate(pdfDoc, 'creator', updates.creator)
  applyTextUpdate(pdfDoc, 'producer', updates.producer)
  applyDateUpdate(pdfDoc, 'creationDate', updates.creationDate)
  applyDateUpdate(pdfDoc, 'modificationDate', updates.modificationDate)

  const bytes = await pdfDoc.save()
  return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
}
