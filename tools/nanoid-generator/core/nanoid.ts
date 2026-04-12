const DEFAULT_NANOID_LENGTH = 21
const DEFAULT_NANOID_COUNT = 5
const NANOID_MAX_LENGTH = 128
const NANOID_MAX_COUNT = 100

const NANOID_ALPHABETS = {
  "url-safe":
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
  alphanumeric:
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  "hex-lowercase": "0123456789abcdef",
  "hex-uppercase": "0123456789ABCDEF",
} as const

type NanoidAlphabetPreset = keyof typeof NANOID_ALPHABETS | "custom"

const RANDOMNESS_FACTOR = 1.6

function createMask(alphabetSize: number): number {
  return (2 << Math.floor(Math.log2(alphabetSize - 1))) - 1
}

function createStep(alphabetSize: number, size: number): number {
  return Math.ceil(
    (RANDOMNESS_FACTOR * createMask(alphabetSize) * size) / alphabetSize
  )
}

function getAlphabetMetrics(alphabet: string) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const character of Array.from(alphabet)) {
    if (seen.has(character)) {
      duplicates.add(character)
      continue
    }

    seen.add(character)
  }

  return {
    uniqueCount: seen.size,
    duplicates: Array.from(duplicates),
  }
}

function normalizeNanoidLength(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return DEFAULT_NANOID_LENGTH
  }

  return Math.min(Math.max(Math.floor(value), 1), NANOID_MAX_LENGTH)
}

function normalizeNanoidCount(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 1
  }

  return Math.min(Math.max(Math.floor(value), 1), NANOID_MAX_COUNT)
}

function generateNanoid(alphabet: string, size: number): string {
  const normalizedSize = Math.floor(size)

  if (!Number.isFinite(normalizedSize) || normalizedSize < 1) {
    throw new RangeError("NanoID length must be a positive integer")
  }

  const metrics = getAlphabetMetrics(alphabet)

  if (metrics.uniqueCount < 2) {
    throw new RangeError(
      "NanoID alphabet must contain at least 2 unique characters"
    )
  }

  if (metrics.duplicates.length > 0) {
    throw new RangeError(
      "NanoID alphabet must not contain duplicate characters"
    )
  }

  const alphabetCharacters = Array.from(alphabet)
  const mask = createMask(alphabetCharacters.length)
  const step = createStep(alphabetCharacters.length, normalizedSize)
  const id: string[] = []

  while (id.length < normalizedSize) {
    const bytes = crypto.getRandomValues(new Uint8Array(step))

    for (
      let index = 0;
      index < step && id.length < normalizedSize;
      index += 1
    ) {
      const byte = bytes[index]!
      const character = alphabetCharacters[byte & mask]

      if (character !== undefined) {
        id.push(character)
      }
    }
  }

  return id.join("")
}

export {
  DEFAULT_NANOID_COUNT,
  DEFAULT_NANOID_LENGTH,
  NANOID_ALPHABETS,
  NANOID_MAX_COUNT,
  NANOID_MAX_LENGTH,
  generateNanoid,
  getAlphabetMetrics,
  normalizeNanoidCount,
  normalizeNanoidLength,
}
export type { NanoidAlphabetPreset }
