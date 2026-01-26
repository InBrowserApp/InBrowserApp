export const BASE58_ALPHABETS = {
  bitcoin: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  flickr: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  ripple: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz',
} as const

export type Base58AlphabetKey = keyof typeof BASE58_ALPHABETS

type Base58Options = {
  alphabet?: string
}

const DEFAULT_BASE58_ALPHABET = BASE58_ALPHABETS.bitcoin

function normalizeBase58Input(value: string): string {
  return value.replace(/\s+/g, '')
}

function getAlphabetMap(alphabet?: string): { alphabet: string; map: Map<string, number> } {
  const resolved = alphabet ?? DEFAULT_BASE58_ALPHABET
  if (resolved.length !== 58) {
    throw new Error('Invalid Base58 alphabet')
  }

  const map = new Map<string, number>()
  for (let i = 0; i < resolved.length; i += 1) {
    const char = resolved.charAt(i)
    if (map.has(char)) {
      throw new Error('Invalid Base58 alphabet')
    }
    map.set(char, i)
  }

  return { alphabet: resolved, map }
}

function validateBase58Input(value: string): string {
  const normalized = normalizeBase58Input(value)
  if (!normalized) return ''

  return normalized
}

export function encodeBase58(input: Uint8Array | ArrayBuffer, options: Base58Options = {}): string {
  const { alphabet } = getAlphabetMap(options.alphabet)
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input
  if (bytes.length === 0) return ''

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

  let output = ''
  for (
    let index = 0;
    index < bytes.length && bytes[index] === 0 && index < bytes.length - 1;
    index += 1
  ) {
    output += alphabet.charAt(0)
  }

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const digit = digits[index] as number
    output += alphabet.charAt(digit)
  }

  return output
}

export function decodeBase58(value: string, options: Base58Options = {}): Uint8Array {
  const { alphabet, map } = getAlphabetMap(options.alphabet)
  const normalized = validateBase58Input(value)
  if (!normalized) return new Uint8Array()

  const bytes = [0]
  for (const char of normalized) {
    const charValue = map.get(char)
    if (charValue === undefined) {
      throw new Error('Invalid Base58 character')
    }

    let carry = charValue
    for (let index = 0; index < bytes.length; index += 1) {
      const byte = bytes[index] as number
      carry += byte * 58
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

export function isValidBase58(value: string, options: Base58Options = {}): boolean {
  try {
    decodeBase58(value, options)
    return true
  } catch {
    return false
  }
}
