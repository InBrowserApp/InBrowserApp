import { describe, it, expect } from 'vitest'
import { formatIBAN, getExpectedCheckDigits, normalizeIBAN, validateIBAN } from './iban'

describe('normalizeIBAN', () => {
  it('removes separators and uppercases', () => {
    expect(normalizeIBAN('gb29 nwbk 6016-1331 9268 19')).toBe('GB29NWBK60161331926819')
  })
})

describe('formatIBAN', () => {
  it('groups characters in blocks of 4', () => {
    expect(formatIBAN('GB29NWBK60161331926819')).toBe('GB29 NWBK 6016 1331 9268 19')
  })
})

describe('getExpectedCheckDigits', () => {
  it('computes the check digits', () => {
    expect(getExpectedCheckDigits('GB29NWBK60161331926819')).toBe('29')
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
})
