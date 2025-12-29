// Standard alphabet for bases up to 64
// 0-9 (10) + a-z (26) + A-Z (26) = 62, then +/ for 64
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'

// Base64 uses a different alphabet order: A-Za-z0-9+/
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

// Build reverse lookup maps
function buildReverseMap(alphabet: string): Map<string, number> {
  const map = new Map<string, number>()
  for (let i = 0; i < alphabet.length; i++) {
    const char = alphabet[i]
    if (char !== undefined) {
      map.set(char, i)
    }
  }
  return map
}

const ALPHABET_MAP = buildReverseMap(ALPHABET)
const BASE64_MAP = buildReverseMap(BASE64_ALPHABET)

// Get valid characters for a given base
function getValidChars(base: number, useBase64Alphabet = false): Set<string> {
  const alphabet = useBase64Alphabet ? BASE64_ALPHABET : ALPHABET
  const chars = new Set<string>()
  for (let i = 0; i < base && i < alphabet.length; i++) {
    const char = alphabet[i]
    if (char !== undefined) {
      chars.add(char)
      // For standard alphabet, also accept uppercase for hex-range
      if (!useBase64Alphabet && i >= 10 && i < 36) {
        chars.add(char.toUpperCase())
      }
    }
  }
  return chars
}

// Generic validation for any base
export function isValidForBase(value: string, base: number, useBase64Alphabet = false): boolean {
  if (value === '') return true
  if (base < 2 || base > 64) return false
  const validChars = getValidChars(base, useBase64Alphabet)
  for (const char of value) {
    if (!validChars.has(char)) return false
  }
  return true
}

// Generic parse for any base
export function parseBase(value: string, base: number, useBase64Alphabet = false): bigint | null {
  if (!value || !isValidForBase(value, base, useBase64Alphabet)) return null

  const map = useBase64Alphabet ? BASE64_MAP : ALPHABET_MAP

  try {
    let result = 0n
    const baseBigInt = BigInt(base)

    for (const char of value) {
      const lowerChar = useBase64Alphabet ? char : char.toLowerCase()
      const digit = map.get(lowerChar)
      if (digit === undefined || digit >= base) return null
      result = result * baseBigInt + BigInt(digit)
    }

    return result
  } catch {
    return null
  }
}

// Generic format for any base
export function toBase(value: bigint, base: number, useBase64Alphabet = false): string {
  if (value === 0n) return '0'
  if (base < 2 || base > 64) return ''

  const alphabet = useBase64Alphabet ? BASE64_ALPHABET : ALPHABET
  const baseBigInt = BigInt(base)

  let result = ''
  let n = value

  while (n > 0n) {
    const digit = Number(n % baseBigInt)
    result = alphabet[digit] + result
    n = n / baseBigInt
  }

  return result
}

// Specific validation functions for common bases
export function isValidBinary(value: string): boolean {
  return value === '' || /^[01]+$/.test(value)
}

export function isValidOctal(value: string): boolean {
  return value === '' || /^[0-7]+$/.test(value)
}

export function isValidDecimal(value: string): boolean {
  return value === '' || /^[0-9]+$/.test(value)
}

export function isValidHex(value: string): boolean {
  return value === '' || /^[0-9a-fA-F]+$/.test(value)
}

export function isValidBase32(value: string): boolean {
  return isValidForBase(value, 32)
}

export function isValidBase36(value: string): boolean {
  return value === '' || /^[0-9a-zA-Z]+$/.test(value)
}

export function isValidBase62(value: string): boolean {
  return isValidForBase(value, 62)
}

export function isValidBase64(value: string): boolean {
  return isValidForBase(value, 64, true)
}

// Specific parse functions
export function parseBinary(value: string): bigint | null {
  if (!value || !isValidBinary(value)) return null
  try {
    return BigInt('0b' + value)
  } catch {
    return null
  }
}

export function parseOctal(value: string): bigint | null {
  if (!value || !isValidOctal(value)) return null
  try {
    return BigInt('0o' + value)
  } catch {
    return null
  }
}

export function parseDecimal(value: string): bigint | null {
  if (!value || !isValidDecimal(value)) return null
  try {
    return BigInt(value)
  } catch {
    return null
  }
}

export function parseHex(value: string): bigint | null {
  if (!value || !isValidHex(value)) return null
  try {
    return BigInt('0x' + value)
  } catch {
    return null
  }
}

export function parseBase32(value: string): bigint | null {
  return parseBase(value, 32)
}

export function parseBase36(value: string): bigint | null {
  return parseBase(value, 36)
}

export function parseBase62(value: string): bigint | null {
  return parseBase(value, 62)
}

export function parseBase64Num(value: string): bigint | null {
  return parseBase(value, 64, true)
}

// Specific format functions
export function toBinary(value: bigint): string {
  return value.toString(2)
}

export function toOctal(value: bigint): string {
  return value.toString(8)
}

export function toDecimal(value: bigint): string {
  return value.toString(10)
}

export function toHex(value: bigint): string {
  return value.toString(16).toLowerCase()
}

export function toBase32(value: bigint): string {
  return toBase(value, 32)
}

export function toBase36(value: bigint): string {
  return value.toString(36).toLowerCase()
}

export function toBase62(value: bigint): string {
  return toBase(value, 62)
}

export function toBase64Num(value: bigint): string {
  return toBase(value, 64, true)
}
