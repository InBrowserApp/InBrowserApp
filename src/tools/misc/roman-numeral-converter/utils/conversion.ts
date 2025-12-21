// Roman numeral conversion utility functions

// Roman numeral conversion mappings
const romanValues = [
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' },
]

/**
 * Convert Arabic number to Roman numeral
 * @param num - Arabic number (1-3999)
 * @returns Roman numeral string
 * @throws Error if number is out of range
 */
export function arabicToRoman(num: number): string {
  if (num < 1 || num > 3999) {
    throw new Error('Number out of range (1-3999)')
  }

  let result = ''
  let remaining = num

  for (const { value, symbol } of romanValues) {
    while (remaining >= value) {
      result += symbol
      remaining -= value
    }
  }

  return result
}

/**
 * Convert Roman numeral to Arabic number
 * @param roman - Roman numeral string
 * @returns Arabic number
 * @throws Error if Roman numeral is invalid
 */
export function romanToArabic(roman: string): number {
  const romanMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }

  const cleanRoman = roman.toUpperCase().trim()

  // Validate Roman numeral format
  if (!/^[IVXLCDM]+$/.test(cleanRoman)) {
    throw new Error('Invalid Roman numeral format')
  }

  let result = 0
  let prevValue = 0

  for (let i = cleanRoman.length - 1; i >= 0; i--) {
    const currentValue = romanMap[cleanRoman[i]!]!

    if (!currentValue) {
      throw new Error('Invalid Roman numeral character')
    }

    if (currentValue < prevValue) {
      result -= currentValue
    } else {
      result += currentValue
    }

    prevValue = currentValue
  }

  // Validate by converting back and checking if it matches
  if (result < 1 || result > 3999 || arabicToRoman(result) !== cleanRoman) {
    throw new Error('Invalid Roman numeral format')
  }

  return result
}

/**
 * Validate if a string is a valid Roman numeral
 * @param roman - String to validate
 * @returns true if valid, false otherwise
 */
export function isValidRomanNumeral(roman: string): boolean {
  try {
    romanToArabic(roman)
    return true
  } catch {
    return false
  }
}
