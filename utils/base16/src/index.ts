const BASE16_ALPHABET = '0123456789ABCDEF'

const BASE16_MAP = new Map<string, number>()
for (let i = 0; i < BASE16_ALPHABET.length; i += 1) {
  const char = BASE16_ALPHABET[i]
  if (char) {
    BASE16_MAP.set(char, i)
  }
}

function normalizeBase16Input(value: string): string {
  let normalized = ''
  for (const char of value) {
    if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
      continue
    }
    normalized += char
  }

  if (normalized.startsWith('0x') || normalized.startsWith('0X')) {
    normalized = normalized.slice(2)
  }

  return normalized.toUpperCase()
}

function validateBase16Input(value: string): string {
  const normalized = normalizeBase16Input(value)
  if (!normalized) return ''

  if (normalized.length % 2 !== 0) {
    throw new Error('Invalid hex length')
  }

  for (const char of normalized) {
    if (!BASE16_MAP.has(char)) {
      throw new Error('Invalid hex character')
    }
  }

  return normalized
}

export function encodeBase16(input: Uint8Array | ArrayBuffer): string {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input
  if (bytes.length === 0) return ''

  let output = ''
  for (const byte of bytes) {
    output += BASE16_ALPHABET[(byte >> 4) & 0x0f]
    output += BASE16_ALPHABET[byte & 0x0f]
  }

  return output
}

export function decodeBase16(value: string): Uint8Array {
  const normalized = validateBase16Input(value)
  if (!normalized) return new Uint8Array()

  const bytes = new Uint8Array(normalized.length / 2)
  for (let i = 0; i < normalized.length; i += 2) {
    const high = BASE16_MAP.get(normalized.charAt(i))
    const low = BASE16_MAP.get(normalized.charAt(i + 1))

    if (high === undefined || low === undefined) {
      throw new Error('Invalid hex character')
    }

    bytes[i / 2] = (high << 4) | low
  }

  return bytes
}

export function isValidBase16(value: string): boolean {
  try {
    validateBase16Input(value)
    return true
  } catch {
    return false
  }
}
