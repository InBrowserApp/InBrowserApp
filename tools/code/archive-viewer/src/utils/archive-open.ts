import type { ArchiveEntry, ArchiveEntryKind, ArchiveFormat, ArchiveHandle } from '../types'
import mime from 'mime'

const ZERO_BLOCK_SIZE = 512
const MAX_HEADER_SNIFF = 512

type ZipEntryLike = {
  filename: string
  directory?: boolean
  uncompressedSize?: number
  compressedSize?: number
  lastModDate?: Date
  getData: (writer: unknown) => Promise<Blob>
}

type TarIndexedEntry = {
  path: string
  kind: ArchiveEntryKind
  size: number
  modifiedAt: Date | null
  dataStart: number
  dataSize: number
}

type GzipHeader = {
  originalName: string | null
  modifiedAt: Date | null
}

export async function openArchive(file: File): Promise<ArchiveHandle> {
  const sniffBytes = new Uint8Array(await file.slice(0, MAX_HEADER_SNIFF).arrayBuffer())
  const format = detectArchiveFormat(file.name, sniffBytes)

  if (format === 'zip') {
    return openZipArchive(file)
  }

  if (format === 'tar') {
    return openTarArchive(await file.arrayBuffer(), 'tar')
  }

  return openGzipArchive(file, format)
}

export function detectArchiveFormat(fileName: string, sniffBytes: Uint8Array): ArchiveFormat {
  const normalizedName = fileName.trim().toLowerCase()

  if (normalizedName.endsWith('.tar.gz') || normalizedName.endsWith('.tgz')) {
    return 'tgz'
  }
  if (normalizedName.endsWith('.tar')) {
    return 'tar'
  }
  if (normalizedName.endsWith('.zip')) {
    return 'zip'
  }
  if (normalizedName.endsWith('.gz')) {
    return 'gz'
  }

  if (isZipSignature(sniffBytes)) {
    return 'zip'
  }

  if (isGzipSignature(sniffBytes)) {
    return 'gz'
  }

  if (isLikelyTar(sniffBytes)) {
    return 'tar'
  }

  throw new Error('Unsupported archive format. Please use ZIP, TAR, GZ, or TGZ.')
}

async function openZipArchive(file: File): Promise<ArchiveHandle> {
  const { BlobReader, BlobWriter, ZipReader } = await import('@zip.js/zip.js')

  const reader = new ZipReader(new BlobReader(file))
  const zipEntries = (await reader.getEntries()) as ZipEntryLike[]

  const entryByPath = new Map<string, ZipEntryLike>()
  const entries: ArchiveEntry[] = []

  for (const entry of zipEntries) {
    const normalizedPath = normalizeArchivePath(entry.filename)
    if (!normalizedPath) continue

    const kind: ArchiveEntryKind = entry.directory ? 'directory' : 'file'
    const archiveEntry: ArchiveEntry = {
      path: normalizedPath,
      kind,
      size: entry.uncompressedSize ?? 0,
      compressedSize: entry.compressedSize ?? null,
      modifiedAt: entry.lastModDate ?? null,
      extension: extractExtension(normalizedPath),
    }
    entries.push(archiveEntry)

    if (kind === 'file') {
      entryByPath.set(normalizedPath, entry)
    }
  }

  const sortedEntries = sortEntries(entries)

  return {
    format: 'zip',
    entries: sortedEntries,
    async readEntry(path: string): Promise<Blob> {
      const normalizedPath = normalizeArchivePath(path)
      const entry = entryByPath.get(normalizedPath)
      if (!entry) {
        throw new Error(`Archive entry not found: ${path}`)
      }

      const blob = await entry.getData(new BlobWriter(guessMimeType(normalizedPath)))
      return withGuessedMimeType(blob, normalizedPath)
    },
    async dispose() {
      await reader.close()
    },
  }
}

async function openTarArchive(buffer: ArrayBuffer, format: 'tar' | 'tgz'): Promise<ArchiveHandle> {
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

  const entryByPath = new Map(indexedEntries.map((entry) => [entry.path, entry]))

  return {
    format,
    entries: sortEntries(entries),
    async readEntry(path: string): Promise<Blob> {
      const normalizedPath = normalizeArchivePath(path)
      const indexed = entryByPath.get(normalizedPath)

      if (!indexed) {
        throw new Error(`Archive entry not found: ${path}`)
      }

      if (indexed.kind !== 'file') {
        throw new Error('Only files can be previewed or downloaded.')
      }

      const content = bytes.slice(indexed.dataStart, indexed.dataStart + indexed.dataSize)
      return new Blob([content.buffer], { type: guessMimeType(indexed.path) })
    },
    async dispose() {
      return
    },
  }
}

async function openGzipArchive(file: File, preferredFormat: 'gz' | 'tgz'): Promise<ArchiveHandle> {
  const header = await parseGzipHeader(file)
  const uncompressedBlob = await ungzip(file)
  const uncompressedBytes = new Uint8Array(await uncompressedBlob.arrayBuffer())

  const shouldTreatAsTar = preferredFormat === 'tgz' || isLikelyTar(uncompressedBytes)
  if (shouldTreatAsTar) {
    return openTarArchive(uncompressedBytes.buffer, 'tgz')
  }

  const fallbackName = stripSuffix(file.name, '.gz') || 'archive.bin'
  const path = normalizeArchivePath(header.originalName ?? fallbackName)
  const entry: ArchiveEntry = {
    path,
    kind: 'file',
    size: uncompressedBlob.size,
    compressedSize: file.size,
    modifiedAt: header.modifiedAt,
    extension: extractExtension(path),
  }
  const typedUncompressedBlob = withGuessedMimeType(uncompressedBlob, path)

  return {
    format: 'gz',
    entries: [entry],
    async readEntry(requestedPath: string): Promise<Blob> {
      const normalizedRequested = normalizeArchivePath(requestedPath)
      if (normalizedRequested !== path) {
        throw new Error(`Archive entry not found: ${requestedPath}`)
      }
      return typedUncompressedBlob
    },
    async dispose() {
      return
    },
  }
}

function isZipSignature(sniffBytes: Uint8Array): boolean {
  return (
    sniffBytes.length >= 4 &&
    sniffBytes[0] === 0x50 &&
    sniffBytes[1] === 0x4b &&
    (sniffBytes[2] === 0x03 || sniffBytes[2] === 0x05 || sniffBytes[2] === 0x07) &&
    (sniffBytes[3] === 0x04 || sniffBytes[3] === 0x06 || sniffBytes[3] === 0x08)
  )
}

function isGzipSignature(sniffBytes: Uint8Array): boolean {
  return sniffBytes.length >= 2 && sniffBytes[0] === 0x1f && sniffBytes[1] === 0x8b
}

function isLikelyTar(sniffBytes: Uint8Array): boolean {
  if (sniffBytes.length < 265) return false
  const ustar = String.fromCharCode(
    sniffBytes[257]!,
    sniffBytes[258]!,
    sniffBytes[259]!,
    sniffBytes[260]!,
    sniffBytes[261]!,
  )
  return ustar === 'ustar'
}

function indexTarEntries(bytes: Uint8Array): TarIndexedEntry[] {
  const entries: TarIndexedEntry[] = []
  let cursor = 0
  let pendingLongPath: string | null = null
  let pendingPaxPath: string | null = null

  while (cursor + ZERO_BLOCK_SIZE <= bytes.length) {
    const header = bytes.subarray(cursor, cursor + ZERO_BLOCK_SIZE)

    if (isZeroBlock(header)) {
      break
    }

    const name = readTarString(header, 0, 100)
    const prefix = readTarString(header, 345, 155)
    const rawPath = joinTarPath(prefix, name)
    const size = readTarNumber(header, 124, 12)
    const modifiedAt = toDate(readTarNumber(header, 136, 12))
    const typeFlag = String.fromCharCode(header[156]!)

    const dataStart = cursor + ZERO_BLOCK_SIZE
    const dataEnd = dataStart + size
    const blockSpan = Math.ceil(size / ZERO_BLOCK_SIZE) * ZERO_BLOCK_SIZE
    cursor = dataStart + blockSpan

    if (dataEnd > bytes.length) {
      throw new Error('Invalid TAR: truncated entry payload.')
    }

    if (typeFlag === 'L') {
      const longNameBytes = bytes.subarray(dataStart, dataEnd)
      pendingLongPath = stripTrailingNulls(new TextDecoder().decode(longNameBytes))
      continue
    }

    if (typeFlag === 'x' || typeFlag === 'g') {
      const paxData = stripTrailingNulls(
        new TextDecoder().decode(bytes.subarray(dataStart, dataEnd)),
      )
      const paxPath = parsePaxPath(paxData)
      if (paxPath) {
        pendingPaxPath = paxPath
      }
      continue
    }

    const normalizedPath = normalizeArchivePath(pendingPaxPath ?? pendingLongPath ?? rawPath)
    pendingLongPath = null
    pendingPaxPath = null
    if (!normalizedPath) continue

    const kind = getTarEntryKind(typeFlag, normalizedPath)

    entries.push({
      path: normalizedPath,
      kind,
      size: kind === 'file' ? size : 0,
      modifiedAt,
      dataStart,
      dataSize: size,
    })
  }

  return entries
}

function getTarEntryKind(typeFlag: string, path: string): ArchiveEntryKind {
  if (typeFlag === '5' || path.endsWith('/')) return 'directory'
  if (typeFlag === '2') return 'symlink'
  if (typeFlag === '0' || typeFlag === '\0' || typeFlag === '') return 'file'
  return 'other'
}

function parsePaxPath(payload: string): string | null {
  const lines = payload.split('\n').filter(Boolean)
  for (const line of lines) {
    const separator = line.indexOf(' ')
    if (separator < 0) continue
    const record = line.slice(separator + 1)
    const equals = record.indexOf('=')
    if (equals < 0) continue
    const key = record.slice(0, equals)
    const value = record.slice(equals + 1)
    if (key === 'path' && value) {
      return value
    }
  }
  return null
}

function readTarNumber(header: Uint8Array, offset: number, length: number): number {
  const text = readTarString(header, offset, length).trim()
  if (!text) return 0
  const parsed = Number.parseInt(text, 8)
  return Number.isFinite(parsed) ? parsed : 0
}

function readTarString(header: Uint8Array, offset: number, length: number): string {
  const slice = header.subarray(offset, offset + length)
  let text = ''
  for (let index = 0; index < slice.length; index += 1) {
    const byte = slice[index]
    if (!byte) break
    text += String.fromCharCode(byte)
  }
  return text
}

function isZeroBlock(block: Uint8Array): boolean {
  for (let index = 0; index < block.length; index += 1) {
    if (block[index] !== 0) return false
  }
  return true
}

function joinTarPath(prefix: string, name: string): string {
  if (!prefix) return name
  if (!name) return prefix
  return `${prefix}/${name}`
}

function stripTrailingNulls(value: string): string {
  let end = value.length
  while (end > 0 && value.charCodeAt(end - 1) === 0) {
    end -= 1
  }
  return end === value.length ? value : value.slice(0, end)
}

function toDate(seconds: number): Date | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return null
  return new Date(seconds * 1000)
}

async function parseGzipHeader(file: File): Promise<GzipHeader> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!isGzipSignature(bytes)) {
    throw new Error('Invalid GZIP signature.')
  }

  const flags = bytes[3] ?? 0
  const mtime =
    (bytes[4] ?? 0) | ((bytes[5] ?? 0) << 8) | ((bytes[6] ?? 0) << 16) | ((bytes[7] ?? 0) << 24)

  let cursor = 10

  if ((flags & 0x04) !== 0) {
    const xlen = (bytes[cursor] ?? 0) | ((bytes[cursor + 1] ?? 0) << 8)
    cursor += 2 + xlen
  }

  let originalName: string | null = null
  if ((flags & 0x08) !== 0) {
    const start = cursor
    while (cursor < bytes.length && bytes[cursor] !== 0) {
      cursor += 1
    }
    originalName = new TextDecoder().decode(bytes.subarray(start, cursor))
    cursor += 1
  }

  if ((flags & 0x10) !== 0) {
    while (cursor < bytes.length && bytes[cursor] !== 0) {
      cursor += 1
    }
    cursor += 1
  }

  if ((flags & 0x02) !== 0) {
    cursor += 2
  }

  return {
    originalName,
    modifiedAt: toDate(mtime),
  }
}

async function ungzip(file: File): Promise<Blob> {
  if (typeof DecompressionStream !== 'function') {
    throw new Error('This browser does not support GZIP decompression.')
  }
  const stream = file.stream().pipeThrough(new DecompressionStream('gzip'))
  return new Response(stream).blob()
}

function normalizeArchivePath(inputPath: string): string {
  const normalized = inputPath.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '').trim()
  if (!normalized || normalized === '.' || normalized === '..') return ''
  return normalized
}

function extractExtension(path: string): string {
  const fileName = path.split('/').pop() || ''
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === fileName.length - 1) return ''
  return fileName.slice(dotIndex + 1).toLowerCase()
}

function sortEntries(entries: ArchiveEntry[]): ArchiveEntry[] {
  return [...entries].sort((left, right) => {
    if (left.kind !== right.kind) {
      if (left.kind === 'directory') return -1
      if (right.kind === 'directory') return 1
    }
    return left.path.localeCompare(right.path)
  })
}

function stripSuffix(value: string, suffix: string): string {
  if (!value.toLowerCase().endsWith(suffix)) return value
  return value.slice(0, Math.max(0, value.length - suffix.length))
}

function guessMimeType(path: string): string {
  return mime.getType(path) ?? 'application/octet-stream'
}

function withGuessedMimeType(blob: Blob, path: string): Blob {
  if (blob.type && blob.type.toLowerCase() !== 'application/octet-stream') {
    return blob
  }

  return new Blob([blob], { type: guessMimeType(path) })
}

export const __test__ = {
  extractExtension,
  getTarEntryKind,
  guessMimeType,
  indexTarEntries,
  isGzipSignature,
  isLikelyTar,
  isZeroBlock,
  isZipSignature,
  joinTarPath,
  normalizeArchivePath,
  parseGzipHeader,
  parsePaxPath,
  readTarNumber,
  readTarString,
  sortEntries,
  stripSuffix,
  stripTrailingNulls,
  toDate,
  ungzip,
}
