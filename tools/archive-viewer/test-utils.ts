/* v8 ignore file -- test fixture helpers */

import type { ArchiveEntryKind } from "./core/types"

function writeString(
  target: Uint8Array,
  offset: number,
  length: number,
  value: string
) {
  const bytes = new TextEncoder().encode(value)
  target.set(bytes.subarray(0, length), offset)
}

function writeOctal(
  target: Uint8Array,
  offset: number,
  length: number,
  value: number
) {
  const octal = value.toString(8)
  const padded = octal.padStart(length - 1, "0")
  writeString(target, offset, length, `${padded}\0`)
}

function createTarHeader(
  path: string,
  contentSize: number,
  typeFlag: string,
  mtime = 0
): Uint8Array {
  const header = new Uint8Array(512)
  const { name, prefix } = splitTarPath(path)

  writeString(header, 0, 100, name)
  writeOctal(header, 100, 8, 0o644)
  writeOctal(header, 108, 8, 0)
  writeOctal(header, 116, 8, 0)
  writeOctal(header, 124, 12, contentSize)
  writeOctal(header, 136, 12, mtime)

  for (let index = 148; index < 156; index += 1) header[index] = 0x20

  writeString(header, 156, 1, typeFlag)
  writeString(header, 257, 6, "ustar")
  writeString(header, 263, 2, "00")
  writeString(header, 345, 155, prefix)

  const checksum = header.reduce((total, byte) => total + byte, 0)
  const checksumOctal = checksum.toString(8).padStart(6, "0")
  writeString(header, 148, 8, `${checksumOctal}\0 `)

  return header
}

function createTar(
  entries: readonly {
    path: string
    content?: string
    kind?: ArchiveEntryKind
  }[]
): Uint8Array {
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = []

  for (const entry of entries) {
    const kind = entry.kind ?? "file"
    const content =
      kind === "file" ? encoder.encode(entry.content ?? "") : new Uint8Array(0)
    const typeFlag = kind === "directory" ? "5" : "0"
    const normalizedPath =
      kind === "directory" && !entry.path.endsWith("/")
        ? `${entry.path}/`
        : entry.path

    chunks.push(
      createTarHeader(normalizedPath, content.length, typeFlag, 1711929600)
    )
    chunks.push(content)

    const paddingSize = Math.ceil(content.length / 512) * 512 - content.length
    if (paddingSize > 0) chunks.push(new Uint8Array(paddingSize))
  }

  chunks.push(new Uint8Array(1024))
  return concatChunks(chunks)
}

function concatChunks(chunks: readonly Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0)
  const output = new Uint8Array(totalLength)
  let offset = 0

  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }

  return output
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.length)
  copy.set(bytes)
  return copy.buffer
}

function splitTarPath(path: string) {
  if (path.length <= 100) return { name: path, prefix: "" }

  const slashIndex = path.lastIndexOf("/")
  if (slashIndex <= 0) throw new Error("Path too long")

  return {
    name: path.slice(slashIndex + 1),
    prefix: path.slice(0, slashIndex),
  }
}

export { concatChunks, createTar, createTarHeader, toArrayBuffer, writeString }
