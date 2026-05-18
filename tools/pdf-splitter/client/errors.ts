import { PDF_DOCUMENT_ERROR } from "../core/pdf-document"

import type { PdfSplitterMessages } from "./types"

const WORKER_UNSUPPORTED_ERROR = "worker-not-supported"

function toErrorCode(error: unknown) {
  return error instanceof Error ? error.message : ""
}

function toRangeErrorMessage(code: string, messages: PdfSplitterMessages) {
  switch (code) {
    case "page-range-empty":
      return messages.rangeEmpty
    case "page-range-out-of-bounds":
      return messages.rangeOutOfBounds
    case "page-range-descending-range":
      return messages.rangeDescending
    case "page-range-duplicate-page":
      return messages.rangeDuplicate
    default:
      return messages.rangeInvalid
  }
}

function toPdfErrorMessage(error: unknown, messages: PdfSplitterMessages) {
  const code = typeof error === "string" ? error : toErrorCode(error)

  switch (code) {
    case PDF_DOCUMENT_ERROR.Encrypted:
      return messages.encryptedPdf
    case PDF_DOCUMENT_ERROR.Invalid:
      return messages.invalidPdf
    case WORKER_UNSUPPORTED_ERROR:
      return messages.workerUnsupported
    case PDF_DOCUMENT_ERROR.SplitFailed:
      return messages.splitFailed
    default:
      return messages.invalidPdf
  }
}

export { toErrorCode, toPdfErrorMessage, toRangeErrorMessage }
