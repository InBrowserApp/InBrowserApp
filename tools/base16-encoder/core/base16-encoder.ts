const BASE16_ALPHABET = "0123456789ABCDEF"

function encodeBytesAsBase16(bytes: Uint8Array) {
  let result = ""

  for (const byte of bytes) {
    result += BASE16_ALPHABET[(byte >> 4) & 0xf]
    result += BASE16_ALPHABET[byte & 0xf]
  }

  return result
}

function encodeTextAsBase16(value: string) {
  return encodeBytesAsBase16(new TextEncoder().encode(value))
}

async function encodeBase16(source: Blob) {
  return encodeBytesAsBase16(new Uint8Array(await source.arrayBuffer()))
}

function deriveEncodedFileName(fileName?: string | null) {
  if (fileName === undefined) {
    return "encoded.hex.txt"
  }

  if (!fileName) {
    return "file.hex"
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName ? `${baseName}.hex` : "file.hex"
}

export {
  deriveEncodedFileName,
  encodeBase16,
  encodeBytesAsBase16,
  encodeTextAsBase16,
}
