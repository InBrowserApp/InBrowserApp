import { describe, it, expect } from 'vitest'
import {
  convertISBN10To13,
  convertISBN13To10,
  getISBN10CheckDigit,
  getISBN13CheckDigit,
  normalizeISBN,
  validateISBN,
} from './isbn'

describe('normalizeISBN', () => {
  it('removes separators and uppercases X', () => {
    expect(normalizeISBN('0-306-40615-2')).toBe('0306406152')
    expect(normalizeISBN('0-8044-2957-x')).toBe('080442957X')
    expect(normalizeISBN(' 978-0-306-40615-7 ')).toBe('9780306406157')
  })
})

describe('getISBN10CheckDigit', () => {
  it('computes a numeric check digit', () => {
    expect(getISBN10CheckDigit('030640615')).toBe('2')
  })

  it('computes X for check digit 10', () => {
    expect(getISBN10CheckDigit('080442957')).toBe('X')
  })
})

describe('getISBN13CheckDigit', () => {
  it('computes the ISBN-13 check digit', () => {
    expect(getISBN13CheckDigit('978030640615')).toBe('7')
  })
})

describe('validateISBN', () => {
  it('validates ISBN-10 numbers', () => {
    const result = validateISBN('0-306-40615-2')
    expect(result.type).toBe('isbn-10')
    expect(result.isValid).toBe(true)
    expect(result.isbn10).toBe('0306406152')
    expect(result.isbn13).toBe('9780306406157')
  })

  it('validates ISBN-10 with X check digit', () => {
    const result = validateISBN('0-8044-2957-X')
    expect(result.isValid).toBe(true)
    expect(result.actualCheckDigit).toBe('X')
  })

  it('rejects invalid ISBN-10 checksum', () => {
    const result = validateISBN('0306406153')
    expect(result.type).toBe('isbn-10')
    expect(result.isChecksumValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('validates ISBN-13 numbers', () => {
    const result = validateISBN('9780306406157')
    expect(result.type).toBe('isbn-13')
    expect(result.isValid).toBe(true)
    expect(result.isbn13).toBe('9780306406157')
    expect(result.isbn10).toBe('0306406152')
    expect(result.prefix).toBe('978')
  })

  it('does not convert ISBN-13 with 979 prefix to ISBN-10', () => {
    const result = validateISBN('9790306406156')
    expect(result.type).toBe('isbn-13')
    expect(result.isValid).toBe(true)
    expect(result.prefix).toBe('979')
    expect(result.isbn10).toBe(null)
  })

  it('flags invalid length', () => {
    const result = validateISBN('1234567')
    expect(result.isLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})

describe('conversions', () => {
  it('converts ISBN-10 to ISBN-13', () => {
    expect(convertISBN10To13('0306406152')).toBe('9780306406157')
  })

  it('converts ISBN-13 to ISBN-10 when prefix is 978', () => {
    expect(convertISBN13To10('9780306406157')).toBe('0306406152')
  })

  it('returns null for ISBN-13 with 979 prefix', () => {
    expect(convertISBN13To10('9790306406156')).toBe(null)
  })
})
