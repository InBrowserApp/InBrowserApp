import { describe, it, expect } from 'vitest'
import {
  generateRandomResidentId,
  getResidentIdCheckDigit,
  normalizeResidentId,
  validateResidentId,
} from './residentId'

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

  it('returns null when the core has an invalid format', () => {
    expect(getResidentIdCheckDigit('1101051949123100X')).toBeNull()
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

  it('flags impossible calendar dates', () => {
    const core = '11010519990230002'
    const checkDigit = getResidentIdCheckDigit(core)
    expect(checkDigit).not.toBe(null)

    const result = validateResidentId(`${core}${checkDigit}`)
    expect(result.isChecksumValid).toBe(true)
    expect(result.isBirthdateValid).toBe(false)
    expect(result.birthDate).toBeNull()
    expect(result.birthDateText).toBeNull()
  })

  it('flags future birthdates even when date parsing succeeds', () => {
    const core = '11010529990101002'
    const checkDigit = getResidentIdCheckDigit(core)
    expect(checkDigit).not.toBe(null)

    const result = validateResidentId(`${core}${checkDigit}`)
    expect(result.isChecksumValid).toBe(true)
    expect(result.isBirthdateValid).toBe(false)
    expect(result.birthDate).toBeInstanceOf(Date)
    expect(result.birthDateText).toBe('2999-01-01')
    expect(result.age).toBeNull()
  })

  it('flags invalid length', () => {
    const result = validateResidentId('11010519491231002')
    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})

describe('generateRandomResidentId', () => {
  it('includes the provided date and produces a valid ID', () => {
    const date = new Date(2001, 0, 2)
    const generated = generateRandomResidentId(date)
    expect(generated).toMatch(/^\d{17}[\dX]$/)
    expect(generated.slice(6, 14)).toBe('20010102')

    const result = validateResidentId(generated)
    expect(result.isValid).toBe(true)
    expect(result.birthDateText).toBe('2001-01-02')
  })
})
