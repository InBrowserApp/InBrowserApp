type ArchiveFormat = "zip" | "tar" | "gz" | "tgz"

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
  entries: readonly ArchiveEntry[]
  readEntry: (path: string) => Promise<Blob>
  dispose: () => Promise<void>
}>

type ArchiveErrorCode =
  | "entry-not-found"
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
export type { ArchiveEntry, ArchiveEntryKind, ArchiveFormat, ArchiveHandle }
