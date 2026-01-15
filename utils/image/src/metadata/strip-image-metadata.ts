const JPEG_SOI = [0xff, 0xd8]
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const RIFF_HEADER = [0x52, 0x49, 0x46, 0x46]
const WEBP_HEADER = [0x57, 0x45, 0x42, 0x50]

export type StripMetadataFormat = 'jpeg' | 'png' | 'webp'

export type StripMetadataResult = {
  cleaned: Uint8Array
  removedBytes: number
  format: StripMetadataFormat
}

export function stripImageMetadata(bytes: Uint8Array): StripMetadataResult {
  const format = detectImageFormat(bytes)
  if (format === 'jpeg') {
    const cleaned = stripJpegMetadata(bytes)
    return {
      cleaned,
      removedBytes: Math.max(0, bytes.length - cleaned.length),
      format,
    }
  }

  if (format === 'png') {
    const cleaned = stripPngMetadata(bytes)
    return {
      cleaned,
      removedBytes: Math.max(0, bytes.length - cleaned.length),
      format,
    }
  }

  if (format === 'webp') {
    const cleaned = stripWebpMetadata(bytes)
    return {
      cleaned,
      removedBytes: Math.max(0, bytes.length - cleaned.length),
      format,
    }
  }

  throw new Error('Unsupported image format')
}

function detectImageFormat(bytes: Uint8Array): StripMetadataFormat | 'unknown' {
  if (matchesSignature(bytes, JPEG_SOI)) {
    return 'jpeg'
  }

  if (matchesSignature(bytes, PNG_SIGNATURE)) {
    return 'png'
  }

  if (matchesSignature(bytes, RIFF_HEADER) && matchesSignature(bytes.subarray(8), WEBP_HEADER)) {
    return 'webp'
  }

  return 'unknown'
}

function matchesSignature(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[i] !== signature[i]) return false
  }
  return true
}

function stripJpegMetadata(bytes: Uint8Array): Uint8Array {
  if (bytes.length < 4 || bytes[0] !== JPEG_SOI[0] || bytes[1] !== JPEG_SOI[1]) {
    return bytes
  }

  const chunks: Uint8Array[] = [bytes.slice(0, 2)]
  let offset = 2

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      chunks.push(bytes.slice(offset))
      break
    }

    const marker = bytes[offset + 1]
    const fullMarker = (bytes[offset] << 8) | marker

    if (fullMarker === 0xffda) {
      chunks.push(bytes.slice(offset))
      break
    }

    if (fullMarker === 0xffd9) {
      chunks.push(bytes.slice(offset, offset + 2))
      break
    }

    if (offset + 4 > bytes.length) {
      chunks.push(bytes.slice(offset))
      break
    }

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3]
    if (length < 2) {
      chunks.push(bytes.slice(offset))
      break
    }

    const segmentEnd = offset + 2 + length
    if (segmentEnd > bytes.length) {
      chunks.push(bytes.slice(offset))
      break
    }

    if (!isJpegMetadataMarker(marker)) {
      chunks.push(bytes.slice(offset, segmentEnd))
    }

    offset = segmentEnd
  }

  return concatUint8Arrays(chunks)
}

function isJpegMetadataMarker(marker: number): boolean {
  if (marker === 0xfe) return true
  if (marker >= 0xe1 && marker <= 0xef) return true
  return false
}

function stripPngMetadata(bytes: Uint8Array): Uint8Array {
  if (!matchesSignature(bytes, PNG_SIGNATURE)) {
    return bytes
  }

  const chunks: Uint8Array[] = [bytes.slice(0, PNG_SIGNATURE.length)]
  let offset = PNG_SIGNATURE.length

  while (offset + 8 <= bytes.length) {
    const length = readUint32BE(bytes, offset)
    const typeStart = offset + 4
    const typeEnd = offset + 8
    const type = bytesToAscii(bytes.subarray(typeStart, typeEnd))
    const chunkSize = length + 12
    const chunkEnd = offset + chunkSize

    if (chunkEnd > bytes.length) {
      chunks.push(bytes.slice(offset))
      break
    }

    if (!isPngMetadataChunk(type)) {
      chunks.push(bytes.slice(offset, chunkEnd))
    }

    offset = chunkEnd

    if (type === 'IEND') break
  }

  return concatUint8Arrays(chunks)
}

function isPngMetadataChunk(type: string): boolean {
  return type === 'tEXt' || type === 'zTXt' || type === 'iTXt' || type === 'eXIf' || type === 'iCCP'
}

function stripWebpMetadata(bytes: Uint8Array): Uint8Array {
  if (!matchesSignature(bytes, RIFF_HEADER) || !matchesSignature(bytes.subarray(8), WEBP_HEADER)) {
    return bytes
  }

  const header = bytes.slice(0, 12)
  const chunks: Uint8Array[] = []
  let offset = 12

  while (offset + 8 <= bytes.length) {
    const type = bytesToAscii(bytes.subarray(offset, offset + 4))
    const size = readUint32LE(bytes, offset + 4)
    const paddedSize = size + (size % 2)
    const chunkEnd = offset + 8 + paddedSize

    if (chunkEnd > bytes.length) {
      chunks.push(bytes.slice(offset))
      break
    }

    if (!isWebpMetadataChunk(type)) {
      chunks.push(bytes.slice(offset, chunkEnd))
    }

    offset = chunkEnd
  }

  const cleaned = concatUint8Arrays([header, ...chunks])
  writeUint32LE(cleaned, 4, cleaned.length - 8)
  return cleaned
}

function isWebpMetadataChunk(type: string): boolean {
  return type === 'EXIF' || type === 'XMP ' || type === 'ICCP'
}

function concatUint8Arrays(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

function readUint32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  )
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  )
}

function writeUint32LE(bytes: Uint8Array, offset: number, value: number): void {
  bytes[offset] = value & 0xff
  bytes[offset + 1] = (value >> 8) & 0xff
  bytes[offset + 2] = (value >> 16) & 0xff
  bytes[offset + 3] = (value >> 24) & 0xff
}

function bytesToAscii(bytes: Uint8Array): string {
  return String.fromCharCode(...bytes)
}
