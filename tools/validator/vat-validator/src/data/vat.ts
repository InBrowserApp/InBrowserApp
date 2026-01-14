export interface VATValidationResult {
  input: string
  normalized: string
  countryCode: string | null
  number: string | null
  isCountryCodeValid: boolean
  isCountrySupported: boolean
  isFormatValid: boolean
  isChecksumSupported: boolean
  isChecksumValid: boolean | null
  isValid: boolean
  formatHint: string | null
}

type VATChecksum = (value: string) => boolean | null

interface VATCountryRule {
  patterns: RegExp[]
  format: string
  checksum: VATChecksum | null
}

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/

const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE'
const CIF_CONTROL_LETTERS = 'JABCDEFGHI'
const CIF_LETTER_ONLY = 'KPQRSNW'
const CIF_DIGIT_ONLY = 'ABEH'

const toDigits = (value: string): number[] =>
  value.split('').map((char) => Number.parseInt(char, 10))

const sumDigits = (value: number): number => Math.floor(value / 10) + (value % 10)

const luhnCheck = (value: string): boolean => {
  const digits = toDigits(value)
  let sum = 0

  for (let i = 0; i < digits.length; i += 1) {
    let digit = digits[digits.length - 1 - i]!

    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
  }

  return sum % 10 === 0
}

function validateAT(value: string): boolean {
  const digits = toDigits(value.slice(1))
  const weights = [1, 2, 1, 2, 1, 2, 1]
  let sum = 0

  for (let i = 0; i < 7; i += 1) {
    sum += sumDigits(digits[i]! * weights[i]!)
  }

  sum += 4

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === digits[7]!
}

function validateBE(value: string): boolean {
  const base = Number(value.slice(0, 8))
  const check = 97 - (base % 97)
  return value.slice(8) === check.toString().padStart(2, '0')
}

function validateDE(value: string): boolean {
  let product = 10

  for (let i = 0; i < 8; i += 1) {
    const digit = Number(value[i])
    const sum = (digit + product) % 10
    const normalized = sum === 0 ? 10 : sum
    product = (2 * normalized) % 11
  }

  let checkDigit = 11 - product
  if (checkDigit >= 10) {
    checkDigit = 0
  }

  return checkDigit === Number(value[8])
}

function validateDK(value: string): boolean {
  const digits = toDigits(value)
  const weights = [2, 7, 6, 5, 4, 3, 2]
  const sum = weights.reduce((total, weight, index) => total + weight * digits[index]!, 0)

  return sum % 11 === 0
}

function validateFI(value: string): boolean {
  const digits = toDigits(value)
  const weights = [7, 9, 10, 5, 8, 4, 2]
  const sum = weights.reduce((total, weight, index) => total + weight * digits[index]!, 0)
  const checkDigit = (11 - (sum % 11)) % 11

  return checkDigit !== 10 && checkDigit === digits[7]
}

function validateFR(value: string): boolean | null {
  const key = value.slice(0, 2)
  if (!/^\d{2}$/.test(key)) return null

  const siren = Number(value.slice(2))
  const expected = (12 + 3 * (siren % 97)) % 97
  return Number(key) === expected
}

function validateIT(value: string): boolean {
  const digits = toDigits(value)
  let sum = 0

  for (let i = 0; i < 10; i += 1) {
    const digit = digits[i]!

    if (i % 2 === 0) {
      sum += digit
    } else {
      let doubled = digit * 2
      if (doubled > 9) {
        doubled -= 9
      }
      sum += doubled
    }
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === digits[10]!
}

function validateNL(value: string): boolean {
  const digits = toDigits(value.slice(0, 9))
  const weights = [9, 8, 7, 6, 5, 4, 3, 2, 1]
  const sum = weights.reduce((total, weight, index) => total + weight * digits[index]!, 0)

  return sum % 11 === 0
}

function validatePL(value: string): boolean {
  const digits = toDigits(value)
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const sum = weights.reduce((total, weight, index) => total + weight * digits[index]!, 0)
  const checkDigit = sum % 11

  return checkDigit !== 10 && checkDigit === digits[9]!
}

function validatePT(value: string): boolean {
  const digits = toDigits(value)
  const weights = [9, 8, 7, 6, 5, 4, 3, 2]
  const sum = weights.reduce((total, weight, index) => total + weight * digits[index]!, 0)
  const rawCheck = 11 - (sum % 11)
  const checkDigit = rawCheck >= 10 ? 0 : rawCheck

  return checkDigit === digits[8]!
}

function validateSE(value: string): boolean {
  if (value.slice(10) !== '01') return false

  return luhnCheck(value.slice(0, 10))
}

function validateES(value: string): boolean {
  if (/^\d{8}[A-Z]$/.test(value)) {
    const number = Number(value.slice(0, 8))
    const expected = NIF_LETTERS[number % 23]
    return value[8] === expected
  }

  if (/^[XYZ]\d{7}[A-Z]$/.test(value)) {
    const prefix = ({ X: '0', Y: '1', Z: '2' } as const)[value[0] as 'X' | 'Y' | 'Z']
    const number = Number(prefix + value.slice(1, 8))
    const expected = NIF_LETTERS[number % 23]
    return value[8] === expected
  }

  if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[A-Z0-9]$/.test(value)) {
    const digits = value.slice(1, 8)
    let sum = 0

    for (let i = 0; i < digits.length; i += 1) {
      const digit = Number(digits[i])
      if (i % 2 === 0) {
        sum += sumDigits(digit * 2)
      } else {
        sum += digit
      }
    }

    const controlDigit = (10 - (sum % 10)) % 10
    const controlLetter = CIF_CONTROL_LETTERS[controlDigit]
    const last = value[8]

    if (CIF_LETTER_ONLY.includes(value[0]!)) {
      return last === controlLetter
    }

    if (CIF_DIGIT_ONLY.includes(value[0]!)) {
      return last === `${controlDigit}`
    }

    return last === controlLetter || last === `${controlDigit}`
  }

  return false
}

const VAT_RULES: Record<string, VATCountryRule> = {
  AT: {
    patterns: [/^U\d{8}$/],
    format: 'U + 8 digits',
    checksum: validateAT,
  },
  BE: {
    patterns: [/^\d{10}$/],
    format: '10 digits',
    checksum: validateBE,
  },
  BG: {
    patterns: [/^\d{9,10}$/],
    format: '9 or 10 digits',
    checksum: null,
  },
  CY: {
    patterns: [/^\d{8}[A-Z]$/],
    format: '8 digits + 1 letter',
    checksum: null,
  },
  CZ: {
    patterns: [/^\d{8,10}$/],
    format: '8 to 10 digits',
    checksum: null,
  },
  DE: {
    patterns: [/^\d{9}$/],
    format: '9 digits',
    checksum: validateDE,
  },
  DK: {
    patterns: [/^\d{8}$/],
    format: '8 digits',
    checksum: validateDK,
  },
  EE: {
    patterns: [/^\d{9}$/],
    format: '9 digits',
    checksum: null,
  },
  EL: {
    patterns: [/^\d{9}$/],
    format: '9 digits',
    checksum: null,
  },
  ES: {
    patterns: [/^[A-Z0-9]\d{7}[A-Z0-9]$/],
    format: '1 char + 7 digits + 1 char',
    checksum: validateES,
  },
  FI: {
    patterns: [/^\d{8}$/],
    format: '8 digits',
    checksum: validateFI,
  },
  FR: {
    patterns: [/^[0-9A-Z]{2}\d{9}$/],
    format: '2 chars + 9 digits',
    checksum: validateFR,
  },
  HR: {
    patterns: [/^\d{11}$/],
    format: '11 digits',
    checksum: null,
  },
  HU: {
    patterns: [/^\d{8}$/],
    format: '8 digits',
    checksum: null,
  },
  IE: {
    patterns: [/^\d{7}[A-Z]{1,2}$/],
    format: '7 digits + 1-2 letters',
    checksum: null,
  },
  IT: {
    patterns: [/^\d{11}$/],
    format: '11 digits',
    checksum: validateIT,
  },
  LT: {
    patterns: [/^\d{9}(\d{3})?$/],
    format: '9 or 12 digits',
    checksum: null,
  },
  LU: {
    patterns: [/^\d{8}$/],
    format: '8 digits',
    checksum: null,
  },
  LV: {
    patterns: [/^\d{11}$/],
    format: '11 digits',
    checksum: null,
  },
  MT: {
    patterns: [/^\d{8}$/],
    format: '8 digits',
    checksum: null,
  },
  NL: {
    patterns: [/^\d{9}B\d{2}$/],
    format: '9 digits + B + 2 digits',
    checksum: validateNL,
  },
  PL: {
    patterns: [/^\d{10}$/],
    format: '10 digits',
    checksum: validatePL,
  },
  PT: {
    patterns: [/^\d{9}$/],
    format: '9 digits',
    checksum: validatePT,
  },
  RO: {
    patterns: [/^\d{2,10}$/],
    format: '2 to 10 digits',
    checksum: null,
  },
  SE: {
    patterns: [/^\d{12}$/],
    format: '12 digits',
    checksum: validateSE,
  },
  SI: {
    patterns: [/^\d{8}$/],
    format: '8 digits',
    checksum: null,
  },
  SK: {
    patterns: [/^\d{10}$/],
    format: '10 digits',
    checksum: null,
  },
}

export function normalizeVAT(input: string): string {
  return input.replace(/[^0-9a-z]/gi, '').toUpperCase()
}

export function getVATRule(countryCode: string | null): VATCountryRule | null {
  if (!countryCode) return null
  return VAT_RULES[countryCode] ?? null
}

export function validateVAT(input: string): VATValidationResult {
  const normalized = normalizeVAT(input)
  const countryCode = normalized.length >= 2 ? normalized.slice(0, 2) : null
  const number = normalized.length > 2 ? normalized.slice(2) : null
  const isCountryCodeValid = Boolean(countryCode && COUNTRY_CODE_REGEX.test(countryCode))
  const rule = isCountryCodeValid ? getVATRule(countryCode) : null
  const isCountrySupported = Boolean(rule)
  const isFormatValid = Boolean(
    rule && number && rule.patterns.some((pattern) => pattern.test(number)),
  )

  let checksumResult: boolean | null = null
  if (rule?.checksum && number && isFormatValid) {
    checksumResult = rule.checksum(number)
  }

  const isChecksumSupported = checksumResult !== null
  const isChecksumValid = checksumResult
  const isValid =
    isCountrySupported && isFormatValid && (!isChecksumSupported || Boolean(isChecksumValid))

  return {
    input,
    normalized,
    countryCode,
    number,
    isCountryCodeValid,
    isCountrySupported,
    isFormatValid,
    isChecksumSupported,
    isChecksumValid,
    isValid,
    formatHint: rule?.format ?? null,
  }
}
