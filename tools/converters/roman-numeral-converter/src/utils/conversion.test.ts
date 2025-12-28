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
    expect(arabicToRoman(2024)).toBe('MMXXIV')
    expect(arabicToRoman(2025)).toBe('MMXXV')
    expect(arabicToRoman(1999)).toBe('MCMXCIX')
    expect(arabicToRoman(3888)).toBe('MMMDCCCLXXXVIII')
  })

  it('handles boundary values', () => {
    expect(arabicToRoman(1)).toBe('I')
    expect(arabicToRoman(3999)).toBe('MMMCMXCIX')
  })

  it('throws for out of range values', () => {
    expect(() => arabicToRoman(0)).toThrow('Number out of range')
    expect(() => arabicToRoman(-1)).toThrow('Number out of range')
    expect(() => arabicToRoman(4000)).toThrow('Number out of range')
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

  it('converts subtractive notation', () => {
    expect(romanToArabic('IV')).toBe(4)
    expect(romanToArabic('IX')).toBe(9)
    expect(romanToArabic('XL')).toBe(40)
    expect(romanToArabic('XC')).toBe(90)
    expect(romanToArabic('CD')).toBe(400)
    expect(romanToArabic('CM')).toBe(900)
  })

  it('converts complex numerals', () => {
    expect(romanToArabic('MMXXIV')).toBe(2024)
    expect(romanToArabic('MMXXV')).toBe(2025)
    expect(romanToArabic('MCMXCIX')).toBe(1999)
    expect(romanToArabic('MMMCMXCIX')).toBe(3999)
  })

  it('handles lowercase input', () => {
    expect(romanToArabic('iv')).toBe(4)
    expect(romanToArabic('mmxxiv')).toBe(2024)
  })

  it('handles whitespace', () => {
    expect(romanToArabic('  IV  ')).toBe(4)
  })

  it('throws for invalid format', () => {
    expect(() => romanToArabic('')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('ABC')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('IIII')).toThrow('Invalid Roman numeral format')
    expect(() => romanToArabic('VV')).toThrow('Invalid Roman numeral format')
  })
})

describe('isValidRomanNumeral', () => {
  it('returns true for valid numerals', () => {
    expect(isValidRomanNumeral('I')).toBe(true)
    expect(isValidRomanNumeral('IV')).toBe(true)
    expect(isValidRomanNumeral('MMXXIV')).toBe(true)
    expect(isValidRomanNumeral('MMMCMXCIX')).toBe(true)
  })

  it('returns false for invalid numerals', () => {
    expect(isValidRomanNumeral('')).toBe(false)
    expect(isValidRomanNumeral('IIII')).toBe(false)
    expect(isValidRomanNumeral('ABC')).toBe(false)
    expect(isValidRomanNumeral('VV')).toBe(false)
  })
})
