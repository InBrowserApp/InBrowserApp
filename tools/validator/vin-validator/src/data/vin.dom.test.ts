import { describe, it, expect } from 'vitest'
import { normalizeVIN, validateVIN } from './vin'

describe('normalizeVIN', () => {
  it('uppercases and removes spaces and hyphens', () => {
    expect(normalizeVIN('1m8 gdm9a-xkp042788')).toBe('1M8GDM9AXKP042788')
  })
})

describe('validateVIN', () => {
  it('handles empty input', () => {
    const result = validateVIN('')
    expect(result.isValid).toBe(false)
    expect(result.isLengthValid).toBe(false)
    expect(result.isCharacterValid).toBe(true)
    expect(result.expectedCheckDigit).toBeNull()
    expect(result.actualCheckDigit).toBeNull()
  })

  it('flags invalid length', () => {
    const result = validateVIN('123')
    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
    expect(result.actualCheckDigit).toBeNull()
  })

  it('flags invalid characters', () => {
    const result = validateVIN('1IOGDM9AXKP042788')
    expect(result.isCharacterValid).toBe(false)
    expect(result.expectedCheckDigit).toBeNull()
    expect(result.isValid).toBe(false)
  })

  it('validates known VIN with X check digit', () => {
    const result = validateVIN('1M8GDM9AXKP042788')
    expect(result.isValid).toBe(true)
    expect(result.expectedCheckDigit).toBe('X')
    expect(result.actualCheckDigit).toBe('X')
  })

  it('detects check digit mismatch', () => {
    const result = validateVIN('1M8GDM9A1KP042788')
    expect(result.isLengthValid).toBe(true)
    expect(result.isCharacterValid).toBe(true)
    expect(result.expectedCheckDigit).toBe('X')
    expect(result.actualCheckDigit).toBe('1')
    expect(result.isCheckDigitValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})
