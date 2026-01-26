const ASCII85_ALPHABET = Array.from({ length: 85 }, (_, index) =>
  String.fromCharCode(33 + index),
).join('')

export const BASE85_ALPHABETS = {
  ascii85: ASCII85_ALPHABET,
  z85: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#',
} as const

export type Base85Variant = keyof typeof BASE85_ALPHABETS

type Base85Options = {
  variant?: Base85Variant
  alphabet?: string
}

type ResolvedBase85Options = {
  variant: Base85Variant
  alphabet: string
  map: Map<string, number>
}

const INVALID_BASE85_ALPHABET = 'Invalid Base85 alphabet'
const INVALID_BASE85_CHARACTER = 'Invalid Base85 character'
const INVALID_BASE85_DELIMITER = 'Invalid Base85 delimiter'
const INVALID_BASE85_LENGTH = 'Invalid Base85 length'

function resolveBase85Options(options: Base85Options | undefined): ResolvedBase85Options {
  const variant = options?.variant ?? 'ascii85'
  const alphabet = options?.alphabet ?? BASE85_ALPHABETS[variant]
  if (alphabet.length !== 85) {
    throw new Error(INVALID_BASE85_ALPHABET)
  }

  const map = new Map<string, number>()
  for (let index = 0; index < alphabet.length; index += 1) {
    const char = alphabet.charAt(index)
    if (map.has(char)) {
      throw new Error(INVALID_BASE85_ALPHABET)
    }
    map.set(char, index)
  }

  return { variant, alphabet, map }
}

function normalizeBase85Input(value: string, variant: Base85Variant): string {
  let normalized = value.replace(/\s+/g, '')
  if (variant !== 'ascii85' || normalized.length === 0) return normalized

  const hasStart = normalized.startsWith('<~')
  const hasEnd = normalized.endsWith('~>')
  if (hasStart || hasEnd) {
    if (!hasStart || !hasEnd) {
      throw new Error(INVALID_BASE85_DELIMITER)
    }
    normalized = normalized.slice(2, -2)
  }

  return normalized
}

function valueToBytes(value: number): [number, number, number, number] {
  const b0 = Math.floor(value / 256 ** 3) % 256
  const b1 = Math.floor(value / 256 ** 2) % 256
  const b2 = Math.floor(value / 256) % 256
  const b3 = Math.floor(value) % 256
  return [b0, b1, b2, b3]
}

export function encodeBase85(input: Uint8Array | ArrayBuffer, options: Base85Options = {}): string {
  const { variant, alphabet } = resolveBase85Options(options)
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input
  if (bytes.length === 0) return ''

  if (variant === 'z85' && bytes.length % 4 !== 0) {
    throw new Error(INVALID_BASE85_LENGTH)
  }

  let output = ''
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const chunk = bytes.subarray(offset, offset + 4)
    if (
      variant === 'ascii85' &&
      chunk.length === 4 &&
      chunk[0] === 0 &&
      chunk[1] === 0 &&
      chunk[2] === 0 &&
      chunk[3] === 0
    ) {
      output += 'z'
      continue
    }

    let value = 0
    for (let index = 0; index < 4; index += 1) {
      value = (value << 8) | (chunk[index] ?? 0)
    }

    const digits = new Array<number>(5)
    let remainder = value
    for (let index = 4; index >= 0; index -= 1) {
      digits[index] = remainder % 85
      remainder = Math.floor(remainder / 85)
    }

    const encoded = digits.map((digit) => alphabet.charAt(digit)).join('')
    if (variant === 'ascii85' && chunk.length < 4) {
      output += encoded.slice(0, chunk.length + 1)
    } else {
      output += encoded
    }
  }

  return output
}

export function decodeBase85(value: string, options: Base85Options = {}): Uint8Array {
  const { variant, alphabet, map } = resolveBase85Options(options)
  const normalized = normalizeBase85Input(value, variant)
  if (!normalized) return new Uint8Array()

  if (variant === 'z85' && normalized.length % 5 !== 0) {
    throw new Error(INVALID_BASE85_LENGTH)
  }

  const bytes: number[] = []
  const digits: number[] = []

  for (const char of normalized) {
    if (variant === 'ascii85' && char === 'z') {
      if (digits.length !== 0) {
        throw new Error(INVALID_BASE85_LENGTH)
      }
      bytes.push(0, 0, 0, 0)
      continue
    }

    const digit = map.get(char)
    if (digit === undefined) {
      throw new Error(INVALID_BASE85_CHARACTER)
    }

    digits.push(digit)
    if (digits.length === 5) {
      let valueSum = 0
      for (const part of digits) {
        valueSum = valueSum * 85 + part
      }
      const chunk = valueToBytes(valueSum)
      bytes.push(...chunk)
      digits.length = 0
    }
  }

  if (digits.length > 0) {
    if (variant === 'z85' || digits.length === 1) {
      throw new Error(INVALID_BASE85_LENGTH)
    }

    const finalLength = digits.length
    while (digits.length < 5) {
      digits.push(84)
    }

    let valueSum = 0
    for (const part of digits) {
      valueSum = valueSum * 85 + part
    }
    const chunk = valueToBytes(valueSum)
    bytes.push(...chunk.slice(0, finalLength - 1))
  }

  return new Uint8Array(bytes)
}

export function isValidBase85(value: string, options: Base85Options = {}): boolean {
  try {
    decodeBase85(value, options)
    return true
  } catch {
    return false
  }
}
