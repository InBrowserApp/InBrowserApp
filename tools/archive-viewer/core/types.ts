import type { ArchiveFormat } from "./formats"

type ArchiveEntryKind = "file" | "directory" | "symlink" | "other"

type ArchiveEntry = Readonly<{
  path: string
  size: number
  compressedSize: number | null
  kind: ArchiveEntryKind
  modifiedAt: Date | null
  extension: string
}>

type ArchiveHandle = Readonly<{
  format: ArchiveFormat
  tarWrapped?: boolean
  entries: readonly ArchiveEntry[]
  readEntry: (path: string) => Promise<Blob>
  dispose: () => Promise<void>
}>

type ArchiveErrorCode =
  | "archive-read-failed"
  | "entry-not-found"
  | "entry-too-large"
  | "file-only"
  | "gzip-unsupported"
  | "tar-truncated"
  | "unsupported-format"

class ArchiveError extends Error {
  readonly code: ArchiveErrorCode

  constructor(code: ArchiveErrorCode, message: string) {
    super(message)
    this.name = "ArchiveError"
    this.code = code
  }
}

export { ArchiveError }
export type {
  ArchiveEntry,
  ArchiveEntryKind,
  ArchiveErrorCode,
  ArchiveFormat,
  ArchiveHandle,
}
