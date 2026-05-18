import { QPDF_DECRYPT_FAILED } from "../core/remove-owner-password"

import type { RemovePdfOwnerPasswordMessages } from "./types"

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"] as const
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** exponent

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

function toDisplayErrorMessage(
  error: unknown,
  messages: RemovePdfOwnerPasswordMessages
) {
  if (!(error instanceof Error)) {
    return messages.genericError
  }

  if (error.message === "WORKER_UNSUPPORTED") {
    return messages.workerUnsupportedError
  }

  if (
    error.message === QPDF_DECRYPT_FAILED ||
    error.message === "UNKNOWN_ERROR"
  ) {
    return messages.qpdfFailedError
  }

  return error.message || messages.genericError
}

export { formatBytes, toDisplayErrorMessage }
