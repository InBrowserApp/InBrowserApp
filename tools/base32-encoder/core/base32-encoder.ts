const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
const BASE32_PADDING = "="

function encodeBytesAsBase32(
  bytes: Uint8Array | ArrayBuffer,
  options: Readonly<{ padding?: boolean }> = {}
) {
  const input = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes

  if (input.length === 0) {
    return ""
  }

  let output = ""
  let buffer = 0
  let bits = 0

  for (const byte of input) {
    buffer = (buffer << 8) | byte
    bits += 8

    while (bits >= 5) {
      bits -= 5
      output += BASE32_ALPHABET[(buffer >> bits) & 31]
      buffer &= (1 << bits) - 1
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(buffer << (5 - bits)) & 31]
  }

  if (options.padding !== false) {
    while (output.length % 8 !== 0) {
      output += BASE32_PADDING
    }
  }

  return output
}

function encodeTextAsBase32(value: string) {
  return encodeBytesAsBase32(new TextEncoder().encode(value))
}

async function encodeBase32(source: Blob) {
  return encodeBytesAsBase32(await source.arrayBuffer())
}

function deriveEncodedFileName(fileName?: string | null) {
  if (fileName === undefined) {
    return "encoded.base32.txt"
  }

  if (!fileName) {
    return "file.b32"
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName ? `${baseName}.b32` : "file.b32"
}

export {
  deriveEncodedFileName,
  encodeBase32,
  encodeBytesAsBase32,
  encodeTextAsBase32,
}
