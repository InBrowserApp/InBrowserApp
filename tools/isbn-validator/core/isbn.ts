export type ISBNType = "isbn-10" | "isbn-13" | "unknown"

export interface ISBNValidationResult {
  input: string
  normalized: string
  length: number
  type: ISBNType
  isValid: boolean
  isLengthValid: boolean
  isFormatValid: boolean
  isChecksumValid: boolean
  expectedCheckDigit: string | null
  actualCheckDigit: string | null
  isbn10: string | null
  isbn13: string | null
  prefix: string | null
}

export function normalizeISBN(input: string): string {
  return input.replace(/[^0-9xX]/g, "").toUpperCase()
}

function isISBN10Format(normalized: string): boolean {
  return /^\d{9}[0-9X]$/.test(normalized)
}

function isISBN13Format(normalized: string): boolean {
  return /^\d{13}$/.test(normalized)
}

export function getISBN10CheckDigit(core: string): string | null {
  if (!/^\d{9}$/.test(core)) {
    return null
  }

  let sum = 0

  for (let index = 0; index < core.length; index += 1) {
    sum += (10 - index) * Number(core[index])
  }

  const remainder = sum % 11
  const checkValue = (11 - remainder) % 11

  return checkValue === 10 ? "X" : String(checkValue)
}

export function getISBN13CheckDigit(core: string): string | null {
  if (!/^\d{12}$/.test(core)) {
    return null
  }

  let sum = 0

  for (let index = 0; index < core.length; index += 1) {
    const digit = Number(core[index])
    sum += index % 2 === 0 ? digit : digit * 3
  }

  return String((10 - (sum % 10)) % 10)
}

export function convertISBN10To13(isbn10: string): string | null {
  const normalized = normalizeISBN(isbn10)

  if (!isISBN10Format(normalized)) {
    return null
  }

  const base = "978" + normalized.slice(0, 9)
  return base + getISBN13CheckDigit(base)!
}

export function convertISBN13To10(isbn13: string): string | null {
  const normalized = normalizeISBN(isbn13)

  if (!isISBN13Format(normalized) || !normalized.startsWith("978")) {
    return null
  }

  const core = normalized.slice(3, 12)
  return core + getISBN10CheckDigit(core)!
}

export function validateISBN(input: string): ISBNValidationResult {
  const normalized = normalizeISBN(input)
  const length = normalized.length
  const type = length === 10 ? "isbn-10" : length === 13 ? "isbn-13" : "unknown"
  const isLengthValid = type !== "unknown"

  let isFormatValid = false
  let isChecksumValid = false
  let expectedCheckDigit: string | null = null
  let actualCheckDigit: string | null = null
  let isbn10: string | null = null
  let isbn13: string | null = null
  let prefix: string | null = null

  if (type === "isbn-10") {
    isFormatValid = isISBN10Format(normalized)

    if (isFormatValid) {
      const core = normalized.slice(0, 9)
      expectedCheckDigit = getISBN10CheckDigit(core)
      actualCheckDigit = normalized[9]!
      isChecksumValid = expectedCheckDigit === actualCheckDigit

      if (isChecksumValid) {
        isbn10 = normalized
        isbn13 = convertISBN10To13(normalized)
      }
    }
  }

  if (type === "isbn-13") {
    isFormatValid = isISBN13Format(normalized)

    if (isFormatValid) {
      prefix = normalized.slice(0, 3)
      expectedCheckDigit = getISBN13CheckDigit(normalized.slice(0, 12))
      actualCheckDigit = normalized[12]!
      isChecksumValid = expectedCheckDigit === actualCheckDigit

      if (isChecksumValid) {
        isbn13 = normalized
        isbn10 = prefix === "978" ? convertISBN13To10(normalized) : null
      }
    }
  }

  return {
    input,
    normalized,
    length,
    type,
    isValid: isLengthValid && isFormatValid && isChecksumValid,
    isLengthValid,
    isFormatValid,
    isChecksumValid,
    expectedCheckDigit,
    actualCheckDigit,
    isbn10,
    isbn13,
    prefix,
  }
}
