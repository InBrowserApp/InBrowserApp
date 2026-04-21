type Base58Options = Readonly<{
  alphabet?: string
}>

type DecodeBase58PreviewResult =
  | { state: "empty" }
  | { state: "invalid-base58" }
  | {
      state: "decoded"
      bytes: Uint8Array
      text: string
      previewText: string
      isPreviewTruncated: boolean
    }

const BASE58_ALPHABETS = {
  bitcoin: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  flickr: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
  ripple: "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz",
} as const

type Base58AlphabetKey = keyof typeof BASE58_ALPHABETS

const DEFAULT_BASE58_ALPHABET_KEY = "bitcoin"
const DEFAULT_BASE58_ALPHABET = BASE58_ALPHABETS[DEFAULT_BASE58_ALPHABET_KEY]
const PREVIEW_CHARACTER_LIMIT = 2000

function normalizeBase58Input(value: string) {
  return value.replace(/\s+/gu, "")
}

function getAlphabetMap(alphabet?: string) {
  const resolvedAlphabet = alphabet ?? DEFAULT_BASE58_ALPHABET

  if (resolvedAlphabet.length !== 58) {
    throw new Error("Invalid Base58 alphabet")
  }

  const alphabetMap = new Map<string, number>()

  for (let index = 0; index < resolvedAlphabet.length; index += 1) {
    const character = resolvedAlphabet.charAt(index)

    if (alphabetMap.has(character)) {
      throw new Error("Invalid Base58 alphabet")
    }

    alphabetMap.set(character, index)
  }

  return {
    alphabet: resolvedAlphabet,
    map: alphabetMap,
  }
}

function resolveBase58AlphabetKey(value: string): Base58AlphabetKey {
  return Object.hasOwn(BASE58_ALPHABETS, value)
    ? (value as Base58AlphabetKey)
    : DEFAULT_BASE58_ALPHABET_KEY
}

function validateBase58Input(value: string) {
  const normalized = normalizeBase58Input(value)

  if (!normalized) {
    return ""
  }

  return normalized
}

function encodeBase58(
  input: Uint8Array | ArrayBuffer,
  options: Base58Options = {}
) {
  const { alphabet } = getAlphabetMap(options.alphabet)
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input

  if (bytes.length === 0) {
    return ""
  }

  const digits = [0]

  for (const byte of bytes) {
    let carry = byte

    for (let index = 0; index < digits.length; index += 1) {
      const digit = digits[index] as number

      carry += digit << 8
      digits[index] = carry % 58
      carry = Math.floor(carry / 58)
    }

    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }

  let output = ""

  for (
    let index = 0;
    index < bytes.length && bytes[index] === 0 && index < bytes.length - 1;
    index += 1
  ) {
    output += alphabet.charAt(0)
  }

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    output += alphabet.charAt(digits[index] as number)
  }

  return output
}

function decodeBase58(value: string, options: Base58Options = {}) {
  const { alphabet, map } = getAlphabetMap(options.alphabet)
  const normalized = validateBase58Input(value)

  if (!normalized) {
    return new Uint8Array()
  }

  const bytes = [0]

  for (const character of normalized) {
    const characterValue = map.get(character)

    if (characterValue === undefined) {
      throw new Error("Invalid Base58 character")
    }

    let carry = characterValue

    for (let index = 0; index < bytes.length; index += 1) {
      carry += (bytes[index] as number) * 58
      bytes[index] = carry & 0xff
      carry >>= 8
    }

    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }

  for (
    let index = 0;
    index < normalized.length &&
    normalized.charAt(index) === alphabet.charAt(0) &&
    index < normalized.length - 1;
    index += 1
  ) {
    bytes.push(0)
  }

  return new Uint8Array(bytes.reverse())
}

function decodeBase58Preview(
  value: string,
  options: Base58Options = {}
): DecodeBase58PreviewResult {
  if (value.trim() === "") {
    return { state: "empty" }
  }

  try {
    const bytes = decodeBase58(value, options)
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
    return { state: "invalid-base58" }
  }
}

function deriveDecodedFileName(fileName?: string | null) {
  if (!fileName) {
    return "decoded.bin"
  }

  const baseName = fileName.replace(/\.[^/.]+$/u, "")

  return baseName ? `${baseName}.bin` : "decoded.bin"
}

export {
  BASE58_ALPHABETS,
  DEFAULT_BASE58_ALPHABET_KEY,
  PREVIEW_CHARACTER_LIMIT,
  decodeBase58,
  decodeBase58Preview,
  deriveDecodedFileName,
  encodeBase58,
  normalizeBase58Input,
  resolveBase58AlphabetKey,
}
export type { Base58AlphabetKey, DecodeBase58PreviewResult }
