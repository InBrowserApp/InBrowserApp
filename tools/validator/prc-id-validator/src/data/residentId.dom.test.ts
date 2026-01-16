import { describe, it, expect } from 'vitest'
import { getResidentIdCheckDigit, normalizeResidentId, validateResidentId } from './residentId'

describe('normalizeResidentId', () => {
  it('removes separators and normalizes X', () => {
    expect(normalizeResidentId('110105 19491231 002x')).toBe('11010519491231002X')
    expect(normalizeResidentId('110105-19491231-002X')).toBe('11010519491231002X')
  })
})

describe('getResidentIdCheckDigit', () => {
  it('computes the correct check digit', () => {
    expect(getResidentIdCheckDigit('11010519491231002')).toBe('X')
  })
})

describe('validateResidentId', () => {
  it('validates a known valid ID', () => {
    const result = validateResidentId('11010519491231002X')
    expect(result.isValid).toBe(true)
    expect(result.isRegionValid).toBe(true)
    expect(result.isBirthdateValid).toBe(true)
    expect(result.gender).toBe('female')
    expect(result.provinceName).toBe('北京市')
    expect(result.areaName).toBe('朝阳区')
    expect(result.expectedCheckDigit).toBe('X')
    expect(result.actualCheckDigit).toBe('X')
    expect(result.birthDateText).toBe('1949-12-31')
    expect(typeof result.age).toBe('number')
  })

  it('flags invalid checksum', () => {
    const result = validateResidentId('110105194912310020')
    expect(result.isChecksumValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags unknown region code', () => {
    const core = '99000019900101003'
    const checkDigit = getResidentIdCheckDigit(core)
    expect(checkDigit).not.toBe(null)

    const result = validateResidentId(`${core}${checkDigit}`)
    expect(result.isChecksumValid).toBe(true)
    expect(result.isRegionValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags invalid birthdate', () => {
    const core = '11010519991301002'
    const checkDigit = getResidentIdCheckDigit(core)
    expect(checkDigit).not.toBe(null)

    const result = validateResidentId(`${core}${checkDigit}`)
    expect(result.isChecksumValid).toBe(true)
    expect(result.isBirthdateValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags invalid length', () => {
    const result = validateResidentId('11010519491231002')
    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})
