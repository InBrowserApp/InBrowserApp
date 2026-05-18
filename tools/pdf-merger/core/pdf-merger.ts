import { PDFDocument } from "pdf-lib"

type PdfMergeErrorCode =
  (typeof PDF_MERGER_ERROR)[keyof typeof PDF_MERGER_ERROR]

type PdfInspectionResult = Readonly<{
  pageCount: number
}>

type PdfMergeSource = Readonly<{
  buffer: ArrayBuffer
  name: string
}>

type PdfMergeProgress = Readonly<{
  completed: number
  total: number
}>

const PDF_MIME_TYPE = "application/pdf"
const DEFAULT_OUTPUT_FILE_NAME = "merged.pdf"
const PDF_EXTENSION = /\.pdf$/i

const PDF_MERGER_ERROR = {
  encrypted: "encrypted-pdf",
  invalid: "invalid-pdf",
  mergeFailed: "merge-failed",
  notEnoughFiles: "not-enough-files",
  workerUnavailable: "worker-unavailable",
} as const

function isPdfFile(file: Pick<File, "name" | "type">) {
  return file.type === PDF_MIME_TYPE || PDF_EXTENSION.test(file.name)
}

function isEncryptedPdfError(error: unknown) {
  return error instanceof Error && error.name === "EncryptedPDFError"
}

function isPdfMergeErrorCode(value: string): value is PdfMergeErrorCode {
  return Object.values(PDF_MERGER_ERROR).includes(value as PdfMergeErrorCode)
}

function toInspectionErrorCode(error: unknown): PdfMergeErrorCode {
  return isEncryptedPdfError(error)
    ? PDF_MERGER_ERROR.encrypted
    : PDF_MERGER_ERROR.invalid
}

function toMergeErrorCode(error: unknown): PdfMergeErrorCode {
  return isEncryptedPdfError(error)
    ? PDF_MERGER_ERROR.encrypted
    : PDF_MERGER_ERROR.mergeFailed
}

async function inspectPdfBuffer(
  buffer: ArrayBuffer
): Promise<PdfInspectionResult> {
  try {
    const document = await PDFDocument.load(buffer)

    return {
      pageCount: document.getPageCount(),
    }
  } catch (error) {
    throw new Error(toInspectionErrorCode(error))
  }
}

async function inspectPdfFile(file: File) {
  return await inspectPdfBuffer(await file.arrayBuffer())
}

async function mergePdfBuffers(
  sources: readonly PdfMergeSource[],
  onProgress?: (progress: PdfMergeProgress) => void
) {
  if (sources.length < 2) {
    throw new Error(PDF_MERGER_ERROR.notEnoughFiles)
  }

  const mergedDocument = await PDFDocument.create()

  for (const [index, source] of sources.entries()) {
    try {
      const currentDocument = await PDFDocument.load(source.buffer)
      const pages = await mergedDocument.copyPages(
        currentDocument,
        currentDocument.getPageIndices()
      )

      for (const page of pages) {
        mergedDocument.addPage(page)
      }
    } catch (error) {
      throw new Error(toMergeErrorCode(error))
    }

    onProgress?.({
      completed: index + 1,
      total: sources.length,
    })
  }

  return await mergedDocument.save()
}

function createPdfBlob(bytes: Uint8Array) {
  return new Blob([bytes.slice()], { type: PDF_MIME_TYPE })
}

function copyBytesToArrayBuffer(bytes: Uint8Array) {
  const output = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(output).set(bytes)

  return output
}

function normalizeOutputFileName(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return DEFAULT_OUTPUT_FILE_NAME
  }

  return PDF_EXTENSION.test(trimmed) ? trimmed : `${trimmed}.pdf`
}

function getFileSignature(file: Pick<File, "lastModified" | "name" | "size">) {
  return `${file.name}:${file.size}:${file.lastModified}`
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
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

function formatProgressLabel(
  template: string,
  completed: number,
  total: number
) {
  return template
    .replace("{completed}", String(completed))
    .replace("{total}", String(total))
}

export {
  DEFAULT_OUTPUT_FILE_NAME,
  PDF_MERGER_ERROR,
  PDF_MIME_TYPE,
  createPdfBlob,
  copyBytesToArrayBuffer,
  formatBytes,
  formatProgressLabel,
  getFileSignature,
  inspectPdfBuffer,
  inspectPdfFile,
  isEncryptedPdfError,
  isPdfMergeErrorCode,
  isPdfFile,
  mergePdfBuffers,
  normalizeOutputFileName,
  toInspectionErrorCode,
  toMergeErrorCode,
}
export type { PdfMergeErrorCode, PdfMergeProgress }
