import { describe, it, expect } from 'vitest'
import { normalizeVAT, getVATRule, validateVAT } from './vat'

describe('normalizeVAT', () => {
  it('removes separators and uppercases', () => {
    expect(normalizeVAT('be 0123-4567 49')).toBe('BE0123456749')
    expect(normalizeVAT('fr.44 7328 29320')).toBe('FR44732829320')
  })
})

describe('getVATRule', () => {
  it('returns null for missing or unknown country codes', () => {
    expect(getVATRule(null)).toBeNull()
    expect(getVATRule('US')).toBeNull()
  })

  it('returns a rule for known country codes', () => {
    const rule = getVATRule('BE')
    expect(rule?.format).toBe('10 digits')
  })
})

describe('validateVAT', () => {
  it('handles empty and partial inputs', () => {
    const emptyResult = validateVAT('')
    expect(emptyResult.isValid).toBe(false)
    expect(emptyResult.countryCode).toBeNull()

    const shortResult = validateVAT('E')
    expect(shortResult.isCountryCodeValid).toBe(false)
    expect(shortResult.isCountrySupported).toBe(false)
  })

  it('flags invalid and unsupported country codes', () => {
    const invalidCode = validateVAT('1A123')
    expect(invalidCode.isCountryCodeValid).toBe(false)
    expect(invalidCode.isValid).toBe(false)

    const unsupported = validateVAT('US123456789')
    expect(unsupported.isCountryCodeValid).toBe(true)
    expect(unsupported.isCountrySupported).toBe(false)
    expect(unsupported.isValid).toBe(false)
  })

  it('flags invalid formats for supported countries', () => {
    const result = validateVAT('BE123')
    expect(result.isCountrySupported).toBe(true)
    expect(result.isFormatValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('accepts countries without checksums', () => {
    const result = validateVAT('BG123456789')
    expect(result.isCountrySupported).toBe(true)
    expect(result.isFormatValid).toBe(true)
    expect(result.isChecksumSupported).toBe(false)
    expect(result.isValid).toBe(true)
  })

  it('treats FR alphanumeric keys as checksum unsupported', () => {
    const result = validateVAT('FRAB123456789')
    expect(result.isFormatValid).toBe(true)
    expect(result.isChecksumSupported).toBe(false)
    expect(result.isValid).toBe(true)
  })

  it('validates checksums across supported countries', () => {
    const validNumbers = [
      'ATU12345675',
      'BE0123456749',
      'DE100000008',
      'DE100000090',
      'DK10000130',
      'FI10000004',
      'FR44732829320',
      'IT10000000009',
      'NL100000002B01',
      'PL1000000006',
      'PT100000002',
      'PT100000010',
      'SE100000000801',
      'ES12345678Z',
      'ESX1234567L',
      'ESK1234567D',
      'ESA12345674',
      'ESC1234567D',
      'ESC12345674',
    ]

    for (const vat of validNumbers) {
      const result = validateVAT(vat)
      expect(result.isValid).toBe(true)
    }
  })

  it('detects checksum failures and invalid variants', () => {
    const invalidNumbers = [
      'BE0123456748',
      'DE100000091',
      'DK20000130',
      'DK10000131',
      'FI10000081',
      'FR43732829320',
      'IT10000000008',
      'IT15000000009',
      'NL100000003B01',
      'PL1000000160',
      'PT100000003',
      'SE100000000802',
      'SE123456789001',
      'ESA1234567D',
      'ESC1234567A',
      'ESI1234567A',
    ]

    for (const vat of invalidNumbers) {
      const result = validateVAT(vat)
      expect(result.isValid).toBe(false)
    }
  })

  it('normalizes and splits the VAT number', () => {
    const result = validateVAT('be 0123 4567 49')
    expect(result.normalized).toBe('BE0123456749')
    expect(result.countryCode).toBe('BE')
    expect(result.number).toBe('0123456749')
    expect(result.formatHint).toBe('10 digits')
  })
})
