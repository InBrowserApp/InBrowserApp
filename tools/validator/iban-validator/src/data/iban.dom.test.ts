import { describe, it, expect, vi } from 'vitest'
import {
  IBAN_COUNTRY_SPECS,
  formatIBAN,
  getExpectedCheckDigits,
  normalizeIBAN,
  validateIBAN,
} from './iban'

describe('normalizeIBAN', () => {
  it('removes separators and uppercases', () => {
    expect(normalizeIBAN('gb29 nwbk 6016-1331 9268 19')).toBe('GB29NWBK60161331926819')
  })
})

describe('formatIBAN', () => {
  it('groups characters in blocks of 4', () => {
    expect(formatIBAN('GB29NWBK60161331926819')).toBe('GB29 NWBK 6016 1331 9268 19')
  })

  it('returns empty string for empty normalized input', () => {
    expect(formatIBAN('---')).toBe('')
  })
})

describe('getExpectedCheckDigits', () => {
  it('computes the check digits', () => {
    expect(getExpectedCheckDigits('GB29NWBK60161331926819')).toBe('29')
  })

  it('returns null for short and invalid country prefixes', () => {
    expect(getExpectedCheckDigits('GB2')).toBeNull()
    expect(getExpectedCheckDigits('1A00ABC')).toBeNull()
  })

  it('returns null when numeric conversion fails', () => {
    const charCodeSpy = vi
      .spyOn(String.prototype, 'charCodeAt')
      .mockImplementation(() => Number.POSITIVE_INFINITY)

    expect(getExpectedCheckDigits('GB29NWBK60161331926819')).toBeNull()

    charCodeSpy.mockRestore()
  })
})

describe('validateIBAN', () => {
  it('validates a UK IBAN', () => {
    const result = validateIBAN('GB29NWBK60161331926819')
    expect(result.isValid).toBe(true)
    expect(result.countryCode).toBe('GB')
    expect(result.expectedLength).toBe(22)
    expect(result.isChecksumValid).toBe(true)
    expect(result.isStructureValid).toBe(true)
  })

  it('validates a German IBAN', () => {
    const result = validateIBAN('DE89370400440532013000')
    expect(result.isValid).toBe(true)
    expect(result.countryCode).toBe('DE')
  })

  it('rejects an invalid checksum', () => {
    const result = validateIBAN('GB29NWBK60161331926818')
    expect(result.isChecksumValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('rejects an invalid length', () => {
    const result = validateIBAN('GB29NWBK601613319268')
    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags invalid structure', () => {
    const result = validateIBAN('GB29NWBK60161331AA6819')
    expect(result.isStructureValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags unknown country codes', () => {
    const result = validateIBAN('ZZ00TEST12345678901234')
    expect(result.isCountryValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('builds structure regexes for all format tokens', () => {
    const mutableSpecs = IBAN_COUNTRY_SPECS as Record<
      string,
      {
        length: number
        structure: string
        example: string
      }
    >

    const temporarySpecs = {
      XA: { length: 6, structure: 'A02', example: 'XA00AB' },
      XB: { length: 6, structure: 'B02', example: 'XB0009' },
      XC: { length: 6, structure: 'C02', example: 'XC00AZ' },
      XL: { length: 6, structure: 'L02', example: 'XL00aa' },
      XU: { length: 6, structure: 'U02', example: 'XU00AZ' },
      XW: { length: 6, structure: 'W02', example: 'XW00aa' },
      XZ: { length: 6, structure: 'Z02', example: 'XZ00A9' },
    }

    Object.assign(mutableSpecs, temporarySpecs)

    try {
      expect(validateIBAN('XA00AB').isCountryValid).toBe(true)
      expect(validateIBAN('XB0009').isCountryValid).toBe(true)
      expect(validateIBAN('XC00AZ').isCountryValid).toBe(true)
      expect(validateIBAN('XL00AA').isCountryValid).toBe(true)
      expect(validateIBAN('XU00AZ').isCountryValid).toBe(true)
      expect(validateIBAN('XW00AA').isCountryValid).toBe(true)
      expect(validateIBAN('XZ00A9').isCountryValid).toBe(true)
    } finally {
      Object.keys(temporarySpecs).forEach((code) => {
        delete mutableSpecs[code]
      })
    }
  })
})
