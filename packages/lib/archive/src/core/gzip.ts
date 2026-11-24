import { isGzipSignature, isLikelyTar } from "./detect"
import { withGuessedMimeType } from "./mime"
import { extractExtension, normalizeArchivePath, stripSuffix } from "./path"
import { openTarArchive } from "./tar"
import { ArchiveError } from "./types"

import type { ArchiveEntry, ArchiveHandle } from "./types"

const MIN_GZIP_HEADER_SIZE = 10
const GZIP_HEADER_READ_CHUNK_SIZE = 256

type GzipHeader = Readonly<{
  originalName: string | null
  modifiedAt: Date | null
}>

async function openGzipArchive(
  file: File,
  preferredFormat: "gz" | "tgz"
): Promise<ArchiveHandle> {
  const header = await parseGzipHeader(file)
  const uncompressedBlob = await ungzip(file)
  const uncompressedBytes = new Uint8Array(await uncompressedBlob.arrayBuffer())

  if (preferredFormat === "tgz" || isLikelyTar(uncompressedBytes)) {
    return openTarArchive(uncompressedBytes.buffer, "tgz")
  }

  const fallbackName = stripSuffix(file.name, ".gz") || "archive.bin"
  const path =
    normalizeArchivePath(header.originalName ?? fallbackName) ||
    normalizeArchivePath(fallbackName)
  const typedUncompressedBlob = withGuessedMimeType(uncompressedBlob, path)
  const entry: ArchiveEntry = {
    path,
    kind: "file",
    size: uncompressedBlob.size,
    compressedSize: file.size,
    modifiedAt: header.modifiedAt,
    extension: extractExtension(path),
  }

  return {
    format: "gz",
    entries: [entry],
    async readEntry(requestedPath: string) {
      if (normalizeArchivePath(requestedPath) !== path) {
        throw new ArchiveError(
          "entry-not-found",
          `Archive entry not found: ${requestedPath}`
        )
      }

      return typedUncompressedBlob
    },
    async dispose() {
      return
    },
  }
}

async function parseGzipHeader(file: File): Promise<GzipHeader> {
  let bytes = new Uint8Array(0)

  async function ensureHeaderBytes(requiredLength: number): Promise<boolean> {
    while (bytes.length < requiredLength) {
      const start = bytes.length
      const end = Math.min(
        file.size,
        Math.max(requiredLength, start + GZIP_HEADER_READ_CHUNK_SIZE)
      )
      if (end <= start) return false

      const chunk = new Uint8Array(await file.slice(start, end).arrayBuffer())
      if (!chunk.length) return false

      const nextBytes = new Uint8Array(start + chunk.length)
      nextBytes.set(bytes)
      nextBytes.set(chunk, start)
      bytes = nextBytes
    }

    return true
  }

  await ensureHeaderBytes(2)
  if (!isGzipSignature(bytes)) {
    throw new ArchiveError("unsupported-format", "Invalid GZIP signature.")
  }

  if (!(await ensureHeaderBytes(MIN_GZIP_HEADER_SIZE))) {
    return { originalName: null, modifiedAt: null }
  }

  const flags = bytes[3]!
  const modifiedAt = readGzipModifiedAt(bytes)
  let cursor = MIN_GZIP_HEADER_SIZE

  if ((flags & 0x04) !== 0) {
    if (!(await ensureHeaderBytes(cursor + 2))) {
      return { originalName: null, modifiedAt }
    }

    const xlen = bytes[cursor]! | (bytes[cursor + 1]! << 8)
    cursor += 2 + xlen
    if (!(await ensureHeaderBytes(cursor))) {
      return { originalName: null, modifiedAt }
    }
  }

  const originalName =
    (flags & 0x08) !== 0 ? await readNullTerminatedString(cursor) : null
  if (originalName !== null) cursor += originalName.length + 1

  if ((flags & 0x10) !== 0) {
    const comment = await readNullTerminatedString(cursor)
    if (comment !== null) cursor += comment.length + 1
  }

  if ((flags & 0x02) !== 0) await ensureHeaderBytes(cursor + 2)

  return { originalName, modifiedAt }

  async function readNullTerminatedString(
    start: number
  ): Promise<string | null> {
    let cursor = start
    while (true) {
      if (!(await ensureHeaderBytes(cursor + 1))) return null
      if (bytes[cursor] === 0) break
      cursor += 1
    }

    return new TextDecoder().decode(bytes.subarray(start, cursor))
  }
}

function readGzipModifiedAt(bytes: Uint8Array): Date | null {
  if (bytes.length < 8) return null

  const seconds =
    (bytes[4]! | (bytes[5]! << 8) | (bytes[6]! << 16) | (bytes[7]! << 24)) >>> 0

  if (seconds <= 0) return null
  return new Date(seconds * 1000)
}

async function ungzip(file: File): Promise<Blob> {
  if (typeof DecompressionStream !== "function") {
    throw new ArchiveError(
      "gzip-unsupported",
      "This browser does not support GZIP decompression."
    )
  }

  const stream = file.stream().pipeThrough(new DecompressionStream("gzip"))
  return new Response(stream).blob()
}

export { openGzipArchive, parseGzipHeader, readGzipModifiedAt, ungzip }
