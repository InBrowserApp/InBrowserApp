import { describe, it, expect } from 'vitest'
import { arabicToRoman, romanToArabic, isValidRomanNumeral } from './conversion'

describe('arabicToRoman', () => {
  it('converts basic numbers', () => {
    expect(arabicToRoman(1)).toBe('I')
    expect(arabicToRoman(5)).toBe('V')
    expect(arabicToRoman(10)).toBe('X')
    expect(arabicToRoman(50)).toBe('L')
    expect(arabicToRoman(100)).toBe('C')
    expect(arabicToRoman(500)).toBe('D')
    expect(arabicToRoman(1000)).toBe('M')
  })

  it('converts subtractive notation numbers', () => {
    expect(arabicToRoman(4)).toBe('IV')
    expect(arabicToRoman(9)).toBe('IX')
    expect(arabicToRoman(40)).toBe('XL')
    expect(arabicToRoman(90)).toBe('XC')
    expect(arabicToRoman(400)).toBe('CD')
    expect(arabicToRoman(900)).toBe('CM')
  })

  it('converts complex numbers', () => {
    expect(arabicToRoman(3)).toBe('III')
    expect(arabicToRoman(14)).toBe('XIV')
    expect(arabicToRoman(49)).toBe('XLIX')
    expect(arabicToRoman(99)).toBe('XCIX')
    expect(arabicToRoman(444)).toBe('CDXLIV')
    expect(arabicToRoman(1994)).toBe('MCMXCIV')
    expect(arabicToRoman(2024)).toBe('MMXXIV')
    expect(arabicToRoman(3888)).toBe('MMMDCCCLXXXVIII')
  })

  it('handles edge cases', () => {
    expect(arabicToRoman(1)).toBe('I')
    expect(arabicToRoman(3999)).toBe('MMMCMXCIX')
  })

  it('throws error for numbers out of range', () => {
    expect(() => arabicToRoman(0)).toThrow('Number out of range (1-3999)')
    expect(() => arabicToRoman(-1)).toThrow('Number out of range (1-3999)')
    expect(() => arabicToRoman(4000)).toThrow('Number out of range (1-3999)')
    expect(() => arabicToRoman(10000)).toThrow('Number out of range (1-3999)')
  })
})

describe('romanToArabic', () => {
  it('converts basic numerals', () => {
    expect(romanToArabic('I')).toBe(1)
    expect(romanToArabic('V')).toBe(5)
    expect(romanToArabic('X')).toBe(10)
    expect(romanToArabic('L')).toBe(50)
    expect(romanToArabic('C')).toBe(100)
    expect(romanToArabic('D')).toBe(500)
    expect(romanToArabic('M')).toBe(1000)
  })

  it('converts subtractive notation numerals', () => {
    expect(romanToArabic('IV')).toBe(4)
    expect(romanToArabic('IX')).toBe(9)
    expect(romanToArabic('XL')).toBe(40)
    expect(romanToArabic('XC')).toBe(90)
    expect(romanToArabic('CD')).toBe(400)
    expect(romanToArabic('CM')).toBe(900)
  })

  it('converts complex numerals', () => {
    expect(romanToArabic('III')).toBe(3)
    expect(romanToArabic('XIV')).toBe(14)
    expect(romanToArabic('XLIX')).toBe(49)
    expect(romanToArabic('XCIX')).toBe(99)
    expect(romanToArabic('CDXLIV')).toBe(444)
    expect(romanToArabic('MCMXCIV')).toBe(1994)
    expect(romanToArabic('MMXXIV')).toBe(2024)
    expect(romanToArabic('MMMDCCCLXXXVIII')).toBe(3888)
  })

  it('handles case insensitivity', () => {
    expect(romanToArabic('iv')).toBe(4)
    expect(romanToArabic('mcmxciv')).toBe(1994)
    expect(romanToArabic('MmXxIv')).toBe(2024)
  })

  it('handles whitespace', () => {
    expect(romanToArabic('  XIV  ')).toBe(14)
  })

  it('throws error for invalid characters', () => {
    expect(() => romanToArabic('ABC')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('XII3')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('')).toThrow('Invalid Roman numeral format')
  })

  it('throws error for invalid format', () => {
    expect(() => romanToArabic('IIII')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('VV')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('IC')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('IL')).toThrow('Invalid Roman numeral format')
  })
})

describe('isValidRomanNumeral', () => {
  it('returns true for valid numerals', () => {
    expect(isValidRomanNumeral('I')).toBe(true)
    expect(isValidRomanNumeral('IV')).toBe(true)
    expect(isValidRomanNumeral('MCMXCIV')).toBe(true)
    expect(isValidRomanNumeral('MMMCMXCIX')).toBe(true)
  })

  it('returns true for lowercase valid numerals', () => {
    expect(isValidRomanNumeral('iv')).toBe(true)
    expect(isValidRomanNumeral('mcmxciv')).toBe(true)
  })

  it('returns false for invalid numerals', () => {
    expect(isValidRomanNumeral('')).toBe(false)
    expect(isValidRomanNumeral('IIII')).toBe(false)
    expect(isValidRomanNumeral('VV')).toBe(false)
    expect(isValidRomanNumeral('ABC')).toBe(false)
    expect(isValidRomanNumeral('123')).toBe(false)
  })
})
