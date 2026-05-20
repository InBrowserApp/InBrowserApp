import { PDFDocument } from "pdf-lib"

type SplitOutputMode = "single" | "multiple"
type SplitMultipleMode = "ranges" | "pages"

type PdfInspectionResult = Readonly<{
  pageCount: number
}>

type SplitPdfInput = Readonly<{
  multipleMode: SplitMultipleMode
  outputBaseName: string
  outputMode: SplitOutputMode
  pages: readonly number[]
  segments: readonly (readonly number[])[]
  sourceBytes: ArrayBuffer | Uint8Array
}>

type SplitPdfOutput = Readonly<{
  bytes: Uint8Array
  name: string
}>

const PDF_DOCUMENT_ERROR = {
  Encrypted: "encrypted-pdf",
  Invalid: "invalid-pdf",
  SplitFailed: "split-failed",
} as const

const PDF_MIME_TYPE = "application/pdf"
const PDF_EXTENSION = /\.pdf$/i
const RESERVED_FILENAME_CHARS = /[<>:"/\\|?*]+/g
const DEFAULT_OUTPUT_BASE_NAME = "split-result"

function isPdfFile(file: Pick<File, "name" | "type">) {
  return file.type === PDF_MIME_TYPE || PDF_EXTENSION.test(file.name)
}

function isEncryptedPdfError(error: unknown) {
  return error instanceof Error && error.name === "EncryptedPDFError"
}

function createPdfBlob(bytes: Uint8Array) {
  return new Blob([bytes.slice()], { type: PDF_MIME_TYPE })
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

function getFileBaseName(filename: string) {
  const trimmed = filename.trim().replace(PDF_EXTENSION, "")
  return sanitizeOutputBaseName(trimmed)
}

function getOutputBaseName(filename: string, outputMode: SplitOutputMode) {
  const baseName = getFileBaseName(filename)
  return outputMode === "single" ? `${baseName}-selected` : `${baseName}-split`
}

function replaceControlCharacters(value: string) {
  let sanitized = ""

  for (const character of value) {
    sanitized += character.charCodeAt(0) < 32 ? "-" : character
  }

  return sanitized
}

function sanitizeOutputBaseName(name: string) {
  const sanitized = replaceControlCharacters(name)
    .replace(RESERVED_FILENAME_CHARS, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+|\.+$/g, "")

  return sanitized || DEFAULT_OUTPUT_BASE_NAME
}

function withPdfExtension(name: string) {
  const trimmed = name.trim()

  if (!trimmed) {
    return `${DEFAULT_OUTPUT_BASE_NAME}.pdf`
  }

  return PDF_EXTENSION.test(trimmed) ? trimmed : `${trimmed}.pdf`
}

async function inspectPdfFile(file: File): Promise<PdfInspectionResult> {
  try {
    const sourceBytes = await file.arrayBuffer()
    const document = await PDFDocument.load(sourceBytes)

    return { pageCount: document.getPageCount() }
  } catch (error) {
    throw new Error(
      isEncryptedPdfError(error)
        ? PDF_DOCUMENT_ERROR.Encrypted
        : PDF_DOCUMENT_ERROR.Invalid
    )
  }
}

async function splitPdfDocument(input: SplitPdfInput) {
  const sourceDocument = await PDFDocument.load(input.sourceBytes)

  if (input.outputMode === "single") {
    return [
      {
        bytes: await createPdfFromPages(sourceDocument, input.pages),
        name: withPdfExtension(input.outputBaseName),
      },
    ] satisfies SplitPdfOutput[]
  }

  if (input.multipleMode === "ranges") {
    return splitBySegments(sourceDocument, input)
  }

  return splitByPages(sourceDocument, input)
}

async function splitBySegments(
  sourceDocument: PDFDocument,
  input: SplitPdfInput
) {
  const indexWidth = Math.max(2, String(input.segments.length).length)
  const outputs: SplitPdfOutput[] = []

  for (const [index, segment] of input.segments.entries()) {
    if (segment.length === 0) {
      continue
    }

    outputs.push({
      bytes: await createPdfFromPages(sourceDocument, segment),
      name: `${input.outputBaseName}-part-${String(index + 1).padStart(
        indexWidth,
        "0"
      )}.pdf`,
    })
  }

  return outputs
}

async function splitByPages(sourceDocument: PDFDocument, input: SplitPdfInput) {
  const indexWidth = Math.max(2, String(sourceDocument.getPageCount()).length)
  const outputs: SplitPdfOutput[] = []

  for (const page of input.pages) {
    outputs.push({
      bytes: await createPdfFromPages(sourceDocument, [page]),
      name: `${input.outputBaseName}-page-${String(page).padStart(
        indexWidth,
        "0"
      )}.pdf`,
    })
  }

  return outputs
}

async function createPdfFromPages(
  sourceDocument: PDFDocument,
  pages: readonly number[]
) {
  const targetDocument = await PDFDocument.create()
  const pageIndices = pages.map((page) => page - 1)
  const copiedPages = await targetDocument.copyPages(
    sourceDocument,
    pageIndices
  )

  for (const page of copiedPages) {
    targetDocument.addPage(page)
  }

  return targetDocument.save()
}

export {
  PDF_DOCUMENT_ERROR,
  PDF_MIME_TYPE,
  createPdfBlob,
  formatBytes,
  getOutputBaseName,
  inspectPdfFile,
  isEncryptedPdfError,
  isPdfFile,
  sanitizeOutputBaseName,
  splitPdfDocument,
  withPdfExtension,
}
export type { SplitMultipleMode, SplitOutputMode }
