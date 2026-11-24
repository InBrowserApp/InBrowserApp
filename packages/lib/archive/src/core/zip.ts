import { guessMimeType, withGuessedMimeType } from "./mime"
import { extractExtension, normalizeArchivePath, sortEntries } from "./path"
import { ArchiveError } from "./types"

import type { ArchiveEntry, ArchiveEntryKind, ArchiveHandle } from "./types"

type ZipEntryLike = Readonly<{
  filename: string
  directory?: boolean
  uncompressedSize?: number
  compressedSize?: number
  lastModDate?: Date
  getData: (writer: unknown) => Promise<Blob>
}>

async function openZipArchive(file: File): Promise<ArchiveHandle> {
  const { BlobReader, BlobWriter, ZipReader } = await import("@zip.js/zip.js")

  const reader = new ZipReader(new BlobReader(file))
  const zipEntries = (await reader.getEntries()) as ZipEntryLike[]
  const index = buildZipIndex(zipEntries)

  return {
    format: "zip",
    entries: index.entries,
    async readEntry(path: string) {
      const normalizedPath = normalizeArchivePath(path)
      const entry = index.entryByPath.get(normalizedPath)
      if (!entry) {
        throw new ArchiveError(
          "entry-not-found",
          `Archive entry not found: ${path}`
        )
      }

      const blob = await entry.getData(
        new BlobWriter(guessMimeType(normalizedPath))
      )
      return withGuessedMimeType(blob, normalizedPath)
    },
    async dispose() {
      await reader.close()
    },
  }
}

function buildZipIndex(zipEntries: readonly ZipEntryLike[]) {
  const entryByPath = new Map<string, ZipEntryLike>()
  const entries: ArchiveEntry[] = []
  for (const entry of zipEntries) {
    const normalizedPath = normalizeArchivePath(entry.filename)
    if (!normalizedPath) continue

    const kind: ArchiveEntryKind = entry.directory ? "directory" : "file"
    entries.push({
      path: normalizedPath,
      kind,
      size: entry.uncompressedSize ?? 0,
      compressedSize: entry.compressedSize ?? null,
      modifiedAt: entry.lastModDate ?? null,
      extension: extractExtension(normalizedPath),
    })

    if (kind === "file") entryByPath.set(normalizedPath, entry)
  }

  return {
    entries: sortEntries(entries),
    entryByPath,
  }
}

export { buildZipIndex, openZipArchive }
