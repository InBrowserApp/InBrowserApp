import { describe, expect, it } from 'vitest'
import { getIMEICheckDigit, normalizeIMEI, validateIMEI } from './imei'

describe('imei utilities', () => {
  it('normalizes whitespace and hyphen separators', () => {
    expect(normalizeIMEI('49-015420 323751-8')).toBe('490154203237518')
  })

  it('computes check digits for 14-digit cores', () => {
    expect(getIMEICheckDigit('49015420323751')).toBe('8')
    expect(getIMEICheckDigit('123')).toBeNull()
    expect(getIMEICheckDigit('4901542032375A')).toBeNull()
  })

  it('validates a valid imei', () => {
    const result = validateIMEI('490154203237518')

    expect(result.isValid).toBe(true)
    expect(result.reason).toBe('valid')
    expect(result.normalized).toBe('490154203237518')
    expect(result.tac).toBe('49015420')
    expect(result.serialNumber).toBe('323751')
    expect(result.checkDigit).toBe('8')
    expect(result.expectedCheckDigit).toBe('8')
  })

  it('accepts normalized input with spaces and hyphens', () => {
    const result = validateIMEI('49-015420-323751-8')

    expect(result.isValid).toBe(true)
    expect(result.normalized).toBe('490154203237518')
  })

  it('marks invalid length', () => {
    const result = validateIMEI('49015420323751')

    expect(result.isValid).toBe(false)
    expect(result.reason).toBe('invalid-length')
    expect(result.isLengthValid).toBe(false)
    expect(result.isChecksumValid).toBe(false)
  })

  it('marks invalid format', () => {
    const result = validateIMEI('49015420323751A')

    expect(result.isValid).toBe(false)
    expect(result.reason).toBe('invalid-format')
    expect(result.isFormatValid).toBe(false)
    expect(result.tac).toBeNull()
    expect(result.serialNumber).toBeNull()
  })

  it('prioritizes format error when both format and length are invalid', () => {
    const result = validateIMEI('4901542032375A')

    expect(result.isValid).toBe(false)
    expect(result.isLengthValid).toBe(false)
    expect(result.isFormatValid).toBe(false)
    expect(result.reason).toBe('invalid-format')
  })

  it('marks invalid checksum', () => {
    const result = validateIMEI('490154203237519')

    expect(result.isValid).toBe(false)
    expect(result.reason).toBe('invalid-checksum')
    expect(result.checkDigit).toBe('9')
    expect(result.expectedCheckDigit).toBe('8')
    expect(result.isChecksumValid).toBe(false)
  })

  it('handles empty input without throwing', () => {
    const result = validateIMEI('  -   ')

    expect(result.isValid).toBe(false)
    expect(result.reason).toBe('empty')
    expect(result.normalized).toBe('')
    expect(result.checkDigit).toBeNull()
    expect(result.expectedCheckDigit).toBeNull()
  })
})
