import { ArchiveError } from "./core/types"

import type { ArchiveViewerMessages } from "./types"

function resolveArchiveError(
  error: unknown,
  messages: ArchiveViewerMessages
): string {
  if (error instanceof ArchiveError) {
    if (error.code === "unsupported-format") return messages.unsupportedFormat
    if (error.code === "gzip-unsupported") return messages.gzipUnsupported
    if (error.code === "archive-read-failed") return messages.parseFailed
    if (error.code === "entry-too-large") return messages.entryTooLarge
  }

  return error instanceof Error && error.message
    ? error.message
    : messages.parseFailed
}

export { resolveArchiveError }
