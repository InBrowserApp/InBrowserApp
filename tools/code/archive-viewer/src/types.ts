export type ArchiveFormat = 'zip' | 'tar' | 'gz' | 'tgz'

export type ArchiveEntryKind = 'file' | 'directory' | 'symlink' | 'other'

export type ArchiveEntry = {
  path: string
  size: number
  compressedSize: number | null
  kind: ArchiveEntryKind
  modifiedAt: Date | null
  extension: string
}

export type ArchiveHandle = {
  format: ArchiveFormat
  entries: ArchiveEntry[]
  readEntry: (path: string) => Promise<Blob>
  dispose: () => Promise<void>
}
