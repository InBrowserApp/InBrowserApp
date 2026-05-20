import { PAGE_RANGE_ERROR } from "../core/page-range"

import type { PageRangeErrorCode } from "../core/page-range"
import type { PdfPageNumberAdderMessages } from "./types"

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

function formatMessage(
  template: string,
  values: Readonly<Record<string, string | number>>
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  )
}

function getRangeErrorMessage(
  code: PageRangeErrorCode,
  messages: PdfPageNumberAdderMessages
) {
  if (code === PAGE_RANGE_ERROR.OutOfBounds) {
    return messages.rangeOutOfBounds
  }

  if (code === PAGE_RANGE_ERROR.DescendingRange) {
    return messages.rangeDescending
  }

  if (code === PAGE_RANGE_ERROR.DuplicatePage) {
    return messages.rangeDuplicate
  }

  return messages.rangeInvalidToken
}

function isEncryptedPdfError(error: unknown) {
  return error instanceof Error && error.name === "EncryptedPDFError"
}

function resolvePdfErrorMessage(
  error: unknown,
  messages: PdfPageNumberAdderMessages,
  fallback: string
) {
  if (isEncryptedPdfError(error)) {
    return messages.encryptedPdfError
  }

  return error instanceof Error && error.message ? error.message : fallback
}

export {
  formatBytes,
  formatMessage,
  getRangeErrorMessage,
  isEncryptedPdfError,
  resolvePdfErrorMessage,
}
