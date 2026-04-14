type DecodeBase16PreviewResult =
  | { state: "empty" }
  | { state: "invalid-base16" }
  | {
      state: "decoded"
      bytes: Uint8Array
      text: string
      previewText: string
      isPreviewTruncated: boolean
    }

const BASE16_ALPHABET = "0123456789ABCDEF"
const BASE16_MAP = new Map<string, number>()
const PREVIEW_CHARACTER_LIMIT = 2000

for (let index = 0; index < BASE16_ALPHABET.length; index += 1) {
  BASE16_MAP.set(BASE16_ALPHABET[index]!, index)
}

function normalizeBase16Input(value: string) {
  let normalized = ""

  for (const character of value) {
    if (
      character === " " ||
      character === "\n" ||
      character === "\r" ||
      character === "\t"
    ) {
      continue
    }

    normalized += character
  }

  if (normalized.startsWith("0x") || normalized.startsWith("0X")) {
    normalized = normalized.slice(2)
  }

  return normalized.toUpperCase()
}

function validateBase16Input(value: string) {
  const normalized = normalizeBase16Input(value)

  if (!normalized) {
    return ""
  }

  if (normalized.length % 2 !== 0) {
    throw new Error("Invalid hex length")
  }

  for (const character of normalized) {
    if (!BASE16_MAP.has(character)) {
      throw new Error("Invalid hex character")
    }
  }

  return normalized
}

function decodeBase16(value: string) {
  const normalized = validateBase16Input(value)

  if (!normalized) {
    return new Uint8Array()
  }

  const bytes = new Uint8Array(normalized.length / 2)

  for (let index = 0; index < normalized.length; index += 2) {
    const high = BASE16_MAP.get(normalized.charAt(index))!
    const low = BASE16_MAP.get(normalized.charAt(index + 1))!
    bytes[index / 2] = (high << 4) | low
  }

  return bytes
}

function decodeBase16Preview(value: string): DecodeBase16PreviewResult {
  if (value.trim() === "") {
    return { state: "empty" }
  }

  try {
    const bytes = decodeBase16(value)
    const text = new TextDecoder().decode(bytes)
    const isPreviewTruncated = text.length > PREVIEW_CHARACTER_LIMIT

    return {
      state: "decoded",
      bytes,
      text,
      previewText: isPreviewTruncated
        ? `${text.slice(0, PREVIEW_CHARACTER_LIMIT)}...`
        : text,
      isPreviewTruncated,
    }
  } catch {
    return { state: "invalid-base16" }
  }
}

function deriveDecodedFileName(fileName?: string | null) {
  if (!fileName) {
    return "decoded.bin"
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName ? `${baseName}.bin` : "decoded.bin"
}

export {
  PREVIEW_CHARACTER_LIMIT,
  decodeBase16,
  decodeBase16Preview,
  deriveDecodedFileName,
}
