import {
  validateAT,
  validateBE,
  validateDE,
  validateDK,
  validateES,
  validateFI,
  validateFR,
  validateIT,
  validateNL,
  validatePL,
  validatePT,
  validateSE,
} from "./checksums"

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

const VAT_RULES: Record<string, VATCountryRule> = {
  AT: {
    patterns: [/^U\d{8}$/],
    format: "U + 8 digits",
    checksum: validateAT,
  },
  BE: {
    patterns: [/^\d{10}$/],
    format: "10 digits",
    checksum: validateBE,
  },
  BG: {
    patterns: [/^\d{9,10}$/],
    format: "9 or 10 digits",
    checksum: null,
  },
  CY: {
    patterns: [/^\d{8}[A-Z]$/],
    format: "8 digits + 1 letter",
    checksum: null,
  },
  CZ: {
    patterns: [/^\d{8,10}$/],
    format: "8 to 10 digits",
    checksum: null,
  },
  DE: {
    patterns: [/^\d{9}$/],
    format: "9 digits",
    checksum: validateDE,
  },
  DK: {
    patterns: [/^\d{8}$/],
    format: "8 digits",
    checksum: validateDK,
  },
  EE: {
    patterns: [/^\d{9}$/],
    format: "9 digits",
    checksum: null,
  },
  EL: {
    patterns: [/^\d{9}$/],
    format: "9 digits",
    checksum: null,
  },
  ES: {
    patterns: [/^[A-Z0-9]\d{7}[A-Z0-9]$/],
    format: "1 char + 7 digits + 1 char",
    checksum: validateES,
  },
  FI: {
    patterns: [/^\d{8}$/],
    format: "8 digits",
    checksum: validateFI,
  },
  FR: {
    patterns: [/^[0-9A-Z]{2}\d{9}$/],
    format: "2 chars + 9 digits",
    checksum: validateFR,
  },
  HR: {
    patterns: [/^\d{11}$/],
    format: "11 digits",
    checksum: null,
  },
  HU: {
    patterns: [/^\d{8}$/],
    format: "8 digits",
    checksum: null,
  },
  IE: {
    patterns: [/^\d{7}[A-Z]{1,2}$/],
    format: "7 digits + 1-2 letters",
    checksum: null,
  },
  IT: {
    patterns: [/^\d{11}$/],
    format: "11 digits",
    checksum: validateIT,
  },
  LT: {
    patterns: [/^\d{9}(\d{3})?$/],
    format: "9 or 12 digits",
    checksum: null,
  },
  LU: {
    patterns: [/^\d{8}$/],
    format: "8 digits",
    checksum: null,
  },
  LV: {
    patterns: [/^\d{11}$/],
    format: "11 digits",
    checksum: null,
  },
  MT: {
    patterns: [/^\d{8}$/],
    format: "8 digits",
    checksum: null,
  },
  NL: {
    patterns: [/^\d{9}B\d{2}$/],
    format: "9 digits + B + 2 digits",
    checksum: validateNL,
  },
  PL: {
    patterns: [/^\d{10}$/],
    format: "10 digits",
    checksum: validatePL,
  },
  PT: {
    patterns: [/^\d{9}$/],
    format: "9 digits",
    checksum: validatePT,
  },
  RO: {
    patterns: [/^\d{2,10}$/],
    format: "2 to 10 digits",
    checksum: null,
  },
  SE: {
    patterns: [/^\d{12}$/],
    format: "12 digits",
    checksum: validateSE,
  },
  SI: {
    patterns: [/^\d{8}$/],
    format: "8 digits",
    checksum: null,
  },
  SK: {
    patterns: [/^\d{10}$/],
    format: "10 digits",
    checksum: null,
  },
}

export const SUPPORTED_VAT_COUNTRY_CODES: readonly string[] =
  Object.keys(VAT_RULES).sort()

export function normalizeVAT(input: string): string {
  return input.replace(/[^0-9a-z]/gi, "").toUpperCase()
}

export function getVATRule(
  countryCode: string | null
): { format: string; hasChecksum: boolean } | null {
  if (!countryCode) return null
  const rule = VAT_RULES[countryCode]
  if (!rule) return null
  return { format: rule.format, hasChecksum: rule.checksum !== null }
}

export function validateVAT(input: string): VATValidationResult {
  const normalized = normalizeVAT(input)
  const countryCode = normalized.length >= 2 ? normalized.slice(0, 2) : null
  const number = normalized.length > 2 ? normalized.slice(2) : null
  const isCountryCodeValid = Boolean(
    countryCode && COUNTRY_CODE_REGEX.test(countryCode)
  )
  const rule = isCountryCodeValid ? VAT_RULES[countryCode!] : undefined
  const isCountrySupported = Boolean(rule)
  const isFormatValid = Boolean(
    rule && number && rule.patterns.some((pattern) => pattern.test(number))
  )

  let checksumResult: boolean | null = null
  if (rule?.checksum && number && isFormatValid) {
    checksumResult = rule.checksum(number)
  }

  const isChecksumSupported = checksumResult !== null
  const isChecksumValid = checksumResult
  const isValid =
    isCountrySupported &&
    isFormatValid &&
    (!isChecksumSupported || Boolean(isChecksumValid))

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
