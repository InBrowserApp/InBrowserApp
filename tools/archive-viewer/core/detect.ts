import { ArchiveError } from "./types"

import type { ArchiveFormat } from "./types"

const MAX_HEADER_SNIFF = 512

async function readArchiveSniffBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, MAX_HEADER_SNIFF).arrayBuffer())
}

function detectArchiveFormat(
  fileName: string,
  sniffBytes: Uint8Array
): ArchiveFormat {
  const normalizedName = fileName.trim().toLowerCase()

  if (normalizedName.endsWith(".tar.gz") || normalizedName.endsWith(".tgz")) {
    return "tgz"
  }
  if (normalizedName.endsWith(".tar")) return "tar"
  if (normalizedName.endsWith(".zip")) return "zip"
  if (normalizedName.endsWith(".gz")) return "gz"

  if (isZipSignature(sniffBytes)) return "zip"
  if (isGzipSignature(sniffBytes)) return "gz"
  if (isLikelyTar(sniffBytes)) return "tar"

  throw new ArchiveError(
    "unsupported-format",
    "Unsupported archive format. Please use ZIP, TAR, GZ, or TGZ."
  )
}

function isZipSignature(sniffBytes: Uint8Array): boolean {
  return (
    sniffBytes.length >= 4 &&
    sniffBytes[0] === 0x50 &&
    sniffBytes[1] === 0x4b &&
    (sniffBytes[2] === 0x03 ||
      sniffBytes[2] === 0x05 ||
      sniffBytes[2] === 0x07) &&
    (sniffBytes[3] === 0x04 || sniffBytes[3] === 0x06 || sniffBytes[3] === 0x08)
  )
}

function isGzipSignature(sniffBytes: Uint8Array): boolean {
  return (
    sniffBytes.length >= 2 && sniffBytes[0] === 0x1f && sniffBytes[1] === 0x8b
  )
}

function isLikelyTar(sniffBytes: Uint8Array): boolean {
  if (sniffBytes.length < 265) return false

  const ustar = String.fromCharCode(
    sniffBytes[257]!,
    sniffBytes[258]!,
    sniffBytes[259]!,
    sniffBytes[260]!,
    sniffBytes[261]!
  )

  return ustar === "ustar"
}

export {
  detectArchiveFormat,
  isGzipSignature,
  isLikelyTar,
  isZipSignature,
  readArchiveSniffBytes,
}
