type Base16PreviewResult =
  | { state: "empty" }
  | {
      state: "encoded"
      text: string
      previewText: string
      isPreviewTruncated: boolean
    }

const BASE16_ALPHABET = "0123456789ABCDEF"
const PREVIEW_CHARACTER_LIMIT = 2000

function encodeBase16(bytes: Uint8Array) {
  let encoded = ""

  for (const byte of bytes) {
    encoded += BASE16_ALPHABET[(byte >> 4) & 0x0f]
    encoded += BASE16_ALPHABET[byte & 0x0f]
  }

  return encoded
}

function createBase16Preview(value: string): Base16PreviewResult {
  if (value.length === 0) {
    return { state: "empty" }
  }

  const isPreviewTruncated = value.length > PREVIEW_CHARACTER_LIMIT

  return {
    state: "encoded",
    text: value,
    previewText: isPreviewTruncated
      ? `${value.slice(0, PREVIEW_CHARACTER_LIMIT)}...`
      : value,
    isPreviewTruncated,
  }
}

function encodeBytesToBase16Preview(bytes: Uint8Array) {
  return createBase16Preview(encodeBase16(bytes))
}

function encodeTextToBase16Preview(value: string) {
  if (value.length === 0) {
    return { state: "empty" } satisfies Base16PreviewResult
  }

  return encodeBytesToBase16Preview(new TextEncoder().encode(value))
}

function deriveEncodedFileName(fileName?: string | null) {
  if (!fileName) {
    return "encoded.hex.txt"
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName ? `${baseName}.hex` : "file.hex"
}

export {
  PREVIEW_CHARACTER_LIMIT,
  deriveEncodedFileName,
  encodeBase16,
  encodeBytesToBase16Preview,
  encodeTextToBase16Preview,
}
