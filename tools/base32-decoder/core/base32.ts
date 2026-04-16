type DecodeBase32PreviewResult =
  | { state: "empty" }
  | { state: "invalid-base32" }
  | {
      state: "decoded"
      bytes: Uint8Array
      text: string
      previewText: string
      isPreviewTruncated: boolean
    }

type EncodeBase32Options = Readonly<{
  padding?: boolean
}>

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
const BASE32_PADDING = "="
const VALID_BASE32_LENGTH_MODS = new Set([0, 2, 4, 5, 7])
const VALID_PADDING_LENGTHS = new Set([1, 3, 4, 6])
const BASE32_MAP = new Map<string, number>()
const PREVIEW_CHARACTER_LIMIT = 2000

for (let index = 0; index < BASE32_ALPHABET.length; index += 1) {
  BASE32_MAP.set(BASE32_ALPHABET[index]!, index)
}

function normalizeBase32Input(value: string) {
  return value.replace(/\s+/g, "").toUpperCase()
}

function validateBase32Input(value: string) {
  const normalized = normalizeBase32Input(value)

  if (!normalized) {
    return { trimmed: "" }
  }

  let padding = 0

  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    if (normalized[index] !== BASE32_PADDING) {
      break
    }

    padding += 1
  }

  const trimmed = padding ? normalized.slice(0, -padding) : normalized

  if (
    normalized.slice(0, normalized.length - padding).includes(BASE32_PADDING)
  ) {
    throw new Error("Invalid Base32 padding")
  }

  for (const character of trimmed) {
    if (!BASE32_MAP.has(character)) {
      throw new Error("Invalid Base32 character")
    }
  }

  if (padding > 0) {
    if (!VALID_PADDING_LENGTHS.has(padding)) {
      throw new Error("Invalid Base32 padding")
    }

    if (normalized.length % 8 !== 0) {
      throw new Error("Invalid Base32 length")
    }

    // On 8-char blocks, each allowed padding length implies exactly one valid
    // unpadded length remainder: 6->2, 4->4, 3->5, 1->7.
  } else if (!VALID_BASE32_LENGTH_MODS.has(trimmed.length % 8)) {
    throw new Error("Invalid Base32 length")
  }

  return { trimmed }
}

function encodeBase32(
  input: Uint8Array | ArrayBuffer,
  options: EncodeBase32Options = {}
) {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input

  if (bytes.length === 0) {
    return ""
  }

  let output = ""
  let buffer = 0
  let bits = 0

  for (const byte of bytes) {
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

function decodeBase32(value: string) {
  const { trimmed } = validateBase32Input(value)

  if (!trimmed) {
    return new Uint8Array()
  }

  let buffer = 0
  let bits = 0
  const output: number[] = []

  for (const character of trimmed) {
    const decoded = BASE32_MAP.get(character)!

    buffer = (buffer << 5) | decoded
    bits += 5

    while (bits >= 8) {
      bits -= 8
      output.push((buffer >> bits) & 255)
      buffer &= (1 << bits) - 1
    }
  }

  if (bits > 0) {
    const mask = (1 << bits) - 1

    if ((buffer & mask) !== 0) {
      throw new Error("Invalid Base32 padding")
    }
  }

  return new Uint8Array(output)
}

function decodeBase32Preview(value: string): DecodeBase32PreviewResult {
  if (value.trim() === "") {
    return { state: "empty" }
  }

  try {
    const bytes = decodeBase32(value)
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
    return { state: "invalid-base32" }
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
  decodeBase32,
  decodeBase32Preview,
  deriveDecodedFileName,
  encodeBase32,
}
