const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const BASE32_PADDING = '='
const VALID_BASE32_LENGTH_MODS = new Set([0, 2, 4, 5, 7])
const VALID_PADDING_LENGTHS = new Set([1, 3, 4, 6])

const BASE32_MAP = new Map<string, number>()
for (let i = 0; i < BASE32_ALPHABET.length; i += 1) {
  const char = BASE32_ALPHABET[i]
  if (char) {
    BASE32_MAP.set(char, i)
  }
}

type ValidationResult = {
  normalized: string
  trimmed: string
  padding: number
}

type EncodeOptions = {
  padding?: boolean
}

function normalizeBase32Input(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase()
}

function validateBase32Input(value: string): ValidationResult {
  const normalized = normalizeBase32Input(value)
  if (!normalized) {
    return { normalized, trimmed: '', padding: 0 }
  }

  const paddingMatch = normalized.match(/=+$/)
  const padding = paddingMatch ? paddingMatch[0].length : 0
  const trimmed = padding ? normalized.slice(0, -padding) : normalized

  if (normalized.slice(0, normalized.length - padding).includes(BASE32_PADDING)) {
    throw new Error('Invalid Base32 padding')
  }

  for (const char of trimmed) {
    if (!BASE32_MAP.has(char)) {
      throw new Error('Invalid Base32 character')
    }
  }

  if (padding > 0) {
    if (!VALID_PADDING_LENGTHS.has(padding)) {
      throw new Error('Invalid Base32 padding')
    }
    if (normalized.length % 8 !== 0) {
      throw new Error('Invalid Base32 length')
    }

    const mod = trimmed.length % 8
    const validMod =
      (padding === 6 && mod === 2) ||
      (padding === 4 && mod === 4) ||
      (padding === 3 && mod === 5) ||
      (padding === 1 && mod === 7)

    if (!validMod) {
      throw new Error('Invalid Base32 padding')
    }
  } else {
    const mod = trimmed.length % 8
    if (!VALID_BASE32_LENGTH_MODS.has(mod)) {
      throw new Error('Invalid Base32 length')
    }
  }

  return { normalized, trimmed, padding }
}

export function encodeBase32(input: Uint8Array | ArrayBuffer, options: EncodeOptions = {}): string {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input
  if (bytes.length === 0) return ''

  let output = ''
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

export function decodeBase32(value: string): Uint8Array {
  const { trimmed } = validateBase32Input(value)
  if (!trimmed) return new Uint8Array()

  let buffer = 0
  let bits = 0
  const output: number[] = []

  for (const char of trimmed) {
    const value = BASE32_MAP.get(char)
    if (value === undefined) {
      throw new Error('Invalid Base32 character')
    }

    buffer = (buffer << 5) | value
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
      throw new Error('Invalid Base32 padding')
    }
  }

  return new Uint8Array(output)
}

export function isValidBase32(value: string): boolean {
  try {
    decodeBase32(value)
    return true
  } catch {
    return false
  }
}
