const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

const BASE58_MAP = new Map<string, number>()
for (let i = 0; i < BASE58_ALPHABET.length; i += 1) {
  const char = BASE58_ALPHABET[i]
  BASE58_MAP.set(char, i)
}

function normalizeBase58Input(value: string): string {
  return value.replace(/\s+/g, '')
}

function validateBase58Input(value: string): string {
  const normalized = normalizeBase58Input(value)
  if (!normalized) return ''

  for (const char of normalized) {
    if (!BASE58_MAP.has(char)) {
      throw new Error('Invalid Base58 character')
    }
  }

  return normalized
}

export function encodeBase58(input: Uint8Array | ArrayBuffer): string {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input
  if (bytes.length === 0) return ''

  const digits = [0]
  for (const byte of bytes) {
    let carry = byte
    for (let index = 0; index < digits.length; index += 1) {
      carry += digits[index] << 8
      digits[index] = carry % 58
      carry = Math.floor(carry / 58)
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }

  let output = ''
  for (
    let index = 0;
    index < bytes.length && bytes[index] === 0 && index < bytes.length - 1;
    index += 1
  ) {
    output += BASE58_ALPHABET[0]
  }

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    output += BASE58_ALPHABET[digits[index]]
  }

  return output
}

export function decodeBase58(value: string): Uint8Array {
  const normalized = validateBase58Input(value)
  if (!normalized) return new Uint8Array()

  const bytes = [0]
  for (const char of normalized) {
    const charValue = BASE58_MAP.get(char) as number

    let carry = charValue
    for (let index = 0; index < bytes.length; index += 1) {
      carry += bytes[index] * 58
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
    normalized[index] === BASE58_ALPHABET[0] &&
    index < normalized.length - 1;
    index += 1
  ) {
    bytes.push(0)
  }

  return new Uint8Array(bytes.reverse())
}

export function isValidBase58(value: string): boolean {
  try {
    decodeBase58(value)
    return true
  } catch {
    return false
  }
}
