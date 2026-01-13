import { describe, it, expect } from 'vitest'
import { normalizeBIC, validateBIC } from './bic'

describe('normalizeBIC', () => {
  it('removes spaces and hyphens and uppercases', () => {
    expect(normalizeBIC('deut deff')).toBe('DEUTDEFF')
    expect(normalizeBIC('NWBK-GB2L')).toBe('NWBKGB2L')
  })
})

describe('validateBIC', () => {
  it('validates BIC-8 codes', () => {
    const result = validateBIC('DEUTDEFF')
    expect(result.isValid).toBe(true)
    expect(result.type).toBe('bic-8')
    expect(result.bankCode).toBe('DEUT')
    expect(result.countryCode).toBe('DE')
    expect(result.locationCode).toBe('FF')
    expect(result.isPrimaryOffice).toBe(true)
  })

  it('validates BIC-11 codes and branch', () => {
    const result = validateBIC('BOFAUS3NXXX')
    expect(result.isValid).toBe(true)
    expect(result.type).toBe('bic-11')
    expect(result.branchCode).toBe('XXX')
    expect(result.isPrimaryOffice).toBe(true)
  })

  it('detects test BICs', () => {
    const result = validateBIC('DEUTDEF0')
    expect(result.isValid).toBe(true)
    expect(result.isTestBIC).toBe(true)
  })

  it('detects passive participants', () => {
    const result = validateBIC('DEUTDEA1')
    expect(result.isValid).toBe(true)
    expect(result.isPassiveParticipant).toBe(true)
  })

  it('flags invalid length', () => {
    const result = validateBIC('DEUTDE')
    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags invalid bank code', () => {
    const result = validateBIC('D3UTDEFF')
    expect(result.isBankCodeValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags unknown country codes', () => {
    const result = validateBIC('DEUTZZFF')
    expect(result.isCountryValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})
