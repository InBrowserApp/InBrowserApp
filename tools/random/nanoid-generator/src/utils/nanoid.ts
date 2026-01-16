export const DEFAULT_NANOID_LENGTH = 21
export const NANOID_MAX_LENGTH = 128
export const NANOID_MAX_COUNT = 100

export const NANOID_ALPHABETS = {
  'url-safe': '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_',
  alphanumeric: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  'hex-lowercase': '0123456789abcdef',
  'hex-uppercase': '0123456789ABCDEF',
}

export type NanoidAlphabetPreset = keyof typeof NANOID_ALPHABETS | 'custom'

const RANDOMNESS_FACTOR = 1.6

function createMask(alphabetSize: number): number {
  return (2 << Math.floor(Math.log2(alphabetSize - 1))) - 1
}

function createStep(alphabetSize: number, size: number): number {
  return Math.ceil((RANDOMNESS_FACTOR * createMask(alphabetSize) * size) / alphabetSize)
}

export function getAlphabetMetrics(alphabet: string) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const char of Array.from(alphabet)) {
    if (seen.has(char)) {
      duplicates.add(char)
    } else {
      seen.add(char)
    }
  }

  return {
    uniqueCount: seen.size,
    duplicates: Array.from(duplicates),
  }
}

export function generateNanoid(alphabet: string, size: number): string {
  const normalizedSize = Math.floor(size)
  if (!Number.isFinite(normalizedSize) || normalizedSize < 1) {
    throw new RangeError('NanoID length must be a positive integer')
  }

  const metrics = getAlphabetMetrics(alphabet)
  if (metrics.uniqueCount < 2) {
    throw new RangeError('NanoID alphabet must contain at least 2 unique characters')
  }
  if (metrics.duplicates.length > 0) {
    throw new RangeError('NanoID alphabet must not contain duplicate characters')
  }

  const alphabetChars = Array.from(alphabet)

  const mask = createMask(alphabetChars.length)
  const step = createStep(alphabetChars.length, normalizedSize)

  const id: string[] = []
  while (id.length < normalizedSize) {
    const bytes = crypto.getRandomValues(new Uint8Array(step))
    for (let i = 0; i < step && id.length < normalizedSize; i += 1) {
      const byte = bytes[i]
      if (byte === undefined) continue

      const index = byte & mask
      const char = alphabetChars[index]
      if (char !== undefined) {
        id.push(char)
      }
    }
  }

  return id.join('')
}
