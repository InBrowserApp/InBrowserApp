import type { StripMetadataFormat } from "../core/strip-image-metadata"
import type { ImageMetadataCleanerMessages } from "./types"

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"] as const
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** unitIndex

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: value >= 100 ? 0 : value >= 10 ? 1 : 2,
  }).format(value)} ${units[unitIndex]}`
}

function formatToMime(format: StripMetadataFormat) {
  if (format === "jpeg") {
    return "image/jpeg"
  }

  if (format === "png") {
    return "image/png"
  }

  return "image/webp"
}

function toErrorMessage(
  error: unknown,
  messages: ImageMetadataCleanerMessages
) {
  if (error instanceof Error && error.message === "Unsupported image format") {
    return messages.unsupportedFormat
  }

  return error instanceof Error ? error.message : messages.cleaningFailed
}

export { formatBytes, formatToMime, toErrorMessage }
