import { guessMimeType } from "./mime"
import { extractExtension, normalizeArchivePath, sortEntries } from "./path"
import { ArchiveError } from "./types"

import type { ArchiveEntry, ArchiveEntryKind, ArchiveHandle } from "./types"

const TAR_BLOCK_SIZE = 512

type TarIndexedEntry = Readonly<{
  path: string
  kind: ArchiveEntryKind
  size: number
  modifiedAt: Date | null
  dataStart: number
  dataSize: number
}>

async function openTarArchive(
  buffer: ArrayBuffer,
  format: "tar" | "tgz"
): Promise<ArchiveHandle> {
  const bytes = new Uint8Array(buffer)
  const indexedEntries = indexTarEntries(bytes)

  const entries: ArchiveEntry[] = indexedEntries.map((entry) => ({
    path: entry.path,
    kind: entry.kind,
    size: entry.size,
    compressedSize: null,
    modifiedAt: entry.modifiedAt,
    extension: extractExtension(entry.path),
  }))
  const entryByPath = new Map(
    indexedEntries.map((entry) => [entry.path, entry])
  )

  return {
    format,
    entries: sortEntries(entries),
    async readEntry(path: string) {
      const normalizedPath = normalizeArchivePath(path)
      const indexed = entryByPath.get(normalizedPath)

      if (!indexed) {
        throw new ArchiveError(
          "entry-not-found",
          `Archive entry not found: ${path}`
        )
      }
      if (indexed.kind !== "file") {
        throw new ArchiveError(
          "file-only",
          "Only files can be previewed or downloaded."
        )
      }

      const content = bytes.slice(
        indexed.dataStart,
        indexed.dataStart + indexed.dataSize
      )
      return new Blob([content], { type: guessMimeType(indexed.path) })
    },
    async dispose() {
      return
    },
  }
}

function indexTarEntries(bytes: Uint8Array): TarIndexedEntry[] {
  const entries: TarIndexedEntry[] = []
  let cursor = 0
  let pendingLongPath: string | null = null
  let pendingPaxPath: string | null = null

  while (cursor + TAR_BLOCK_SIZE <= bytes.length) {
    const header = bytes.subarray(cursor, cursor + TAR_BLOCK_SIZE)
    if (isZeroBlock(header)) break

    const name = readTarString(header, 0, 100)
    const prefix = readTarString(header, 345, 155)
    const rawPath = joinTarPath(prefix, name)
    const size = readTarNumber(header, 124, 12)
    const modifiedAt = toDate(readTarNumber(header, 136, 12))
    const typeFlag = String.fromCharCode(header[156]!)

    const dataStart = cursor + TAR_BLOCK_SIZE
    const dataEnd = dataStart + size
    const blockSpan = Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE
    cursor = dataStart + blockSpan

    if (dataEnd > bytes.length) {
      throw new ArchiveError(
        "tar-truncated",
        "Invalid TAR: truncated entry payload."
      )
    }

    if (typeFlag === "L") {
      pendingLongPath = decodeTarPayload(bytes, dataStart, dataEnd)
      continue
    }

    if (typeFlag === "x" || typeFlag === "g") {
      const paxPath = parsePaxPath(decodeTarPayload(bytes, dataStart, dataEnd))
      if (paxPath) pendingPaxPath = paxPath
      continue
    }

    const normalizedPath = normalizeArchivePath(
      pendingPaxPath ?? pendingLongPath ?? rawPath
    )
    pendingLongPath = null
    pendingPaxPath = null
    if (!normalizedPath) continue

    const kind = getTarEntryKind(typeFlag, normalizedPath)
    entries.push({
      path: normalizedPath,
      kind,
      size: kind === "file" ? size : 0,
      modifiedAt,
      dataStart,
      dataSize: size,
    })
  }

  return entries
}

function getTarEntryKind(typeFlag: string, path: string): ArchiveEntryKind {
  if (typeFlag === "5" || path.endsWith("/")) return "directory"
  if (typeFlag === "2") return "symlink"
  if (typeFlag === "0" || typeFlag === "\0" || typeFlag === "") return "file"
  return "other"
}

function parsePaxPath(payload: string): string | null {
  const lines = payload.split("\n").filter(Boolean)
  for (const line of lines) {
    const separator = line.indexOf(" ")
    if (separator < 0) continue

    const record = line.slice(separator + 1)
    const equals = record.indexOf("=")
    if (equals < 0) continue

    const key = record.slice(0, equals)
    const value = record.slice(equals + 1)
    if (key === "path" && value) return value
  }

  return null
}

function readTarNumber(
  header: Uint8Array,
  offset: number,
  length: number
): number {
  const text = readTarString(header, offset, length).trim()
  if (!text) return 0

  const parsed = Number.parseInt(text, 8)
  return Number.isFinite(parsed) ? parsed : 0
}

function readTarString(
  header: Uint8Array,
  offset: number,
  length: number
): string {
  const slice = header.subarray(offset, offset + length)
  let text = ""

  for (const byte of slice) {
    if (byte === 0) break
    text += String.fromCharCode(byte)
  }

  return text
}

function isZeroBlock(block: Uint8Array): boolean {
  return block.every((byte) => byte === 0)
}

function joinTarPath(prefix: string, name: string): string {
  if (!prefix) return name
  if (!name) return prefix
  return `${prefix}/${name}`
}

function stripTrailingNulls(value: string): string {
  let end = value.length
  while (end > 0 && value.charCodeAt(end - 1) === 0) end -= 1
  return end === value.length ? value : value.slice(0, end)
}

function toDate(seconds: number): Date | null {
  if (seconds <= 0) return null
  return new Date(seconds * 1000)
}

function decodeTarPayload(
  bytes: Uint8Array,
  start: number,
  end: number
): string {
  return stripTrailingNulls(
    new TextDecoder().decode(bytes.subarray(start, end))
  )
}

export {
  getTarEntryKind,
  indexTarEntries,
  isZeroBlock,
  joinTarPath,
  openTarArchive,
  parsePaxPath,
  readTarNumber,
  stripTrailingNulls,
  toDate,
}
