import type { Component } from 'vue'
import { VisaIcon, MasterCardIcon, AmericanExpressIcon, DiscoverIcon, JcbIcon, DinersClubIcon } from 'vue3-simple-icons'
import { UnionPayIcon } from '../icons/UnionPayIcon'

export interface CardBrand {
  id: string
  name: string
  patterns: (string | [number, number])[] // prefix strings or [start, end] ranges
  lengths: number[]
  icon: Component
  cvcLength: number
  formatPattern: number[] // e.g., [4, 4, 4, 4] for xxxx xxxx xxxx xxxx
}

export const cardBrands: CardBrand[] = [
  {
    id: 'visa',
    name: 'Visa',
    patterns: ['4'],
    lengths: [13, 16, 19],
    icon: VisaIcon,
    cvcLength: 3,
    formatPattern: [4, 4, 4, 4, 3],
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    patterns: ['51', '52', '53', '54', '55', [2221, 2720]],
    lengths: [16],
    icon: MasterCardIcon,
    cvcLength: 3,
    formatPattern: [4, 4, 4, 4],
  },
  {
    id: 'amex',
    name: 'American Express',
    patterns: ['34', '37'],
    lengths: [15],
    icon: AmericanExpressIcon,
    cvcLength: 4,
    formatPattern: [4, 6, 5],
  },
  {
    id: 'discover',
    name: 'Discover',
    patterns: ['6011', '65', [644, 649], [622126, 622925]],
    lengths: [16, 19],
    icon: DiscoverIcon,
    cvcLength: 3,
    formatPattern: [4, 4, 4, 4, 3],
  },
  {
    id: 'jcb',
    name: 'JCB',
    patterns: [[3528, 3589]],
    lengths: [16, 17, 18, 19],
    icon: JcbIcon,
    cvcLength: 3,
    formatPattern: [4, 4, 4, 4, 3],
  },
  {
    id: 'unionpay',
    name: 'UnionPay',
    patterns: ['62'],
    lengths: [16, 17, 18, 19],
    icon: UnionPayIcon,
    cvcLength: 3,
    formatPattern: [4, 4, 4, 4, 3],
  },
  {
    id: 'dinersclub',
    name: 'Diners Club',
    patterns: ['36', '38', '39', [300, 305]],
    lengths: [14, 16, 19],
    icon: DinersClubIcon,
    cvcLength: 3,
    formatPattern: [4, 6, 4, 4, 1],
  },
]

/**
 * Luhn algorithm to validate card number
 */
export function luhnValidate(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length === 0) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]!, 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Check if a card number matches a pattern
 */
function matchesPattern(cardNumber: string, pattern: string | [number, number]): boolean {
  if (typeof pattern === 'string') {
    return cardNumber.startsWith(pattern)
  }
  const [start, end] = pattern
  const prefixLength = start.toString().length
  const prefix = parseInt(cardNumber.substring(0, prefixLength), 10)
  return prefix >= start && prefix <= end
}

/**
 * Detect card brand from card number
 */
export function detectCardBrand(cardNumber: string): CardBrand | null {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length === 0) return null

  for (const brand of cardBrands) {
    for (const pattern of brand.patterns) {
      if (matchesPattern(digits, pattern)) {
        return brand
      }
    }
  }

  return null
}

/**
 * Validate card number length for a specific brand
 */
export function validateCardLength(cardNumber: string, brand: CardBrand | null): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (!brand) return false
  return brand.lengths.includes(digits.length)
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(cardNumber: string, brand?: CardBrand | null): string {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length === 0) return ''

  const pattern = brand?.formatPattern ?? [4, 4, 4, 4, 3]
  const parts: string[] = []
  let index = 0

  for (const length of pattern) {
    if (index >= digits.length) break
    parts.push(digits.substring(index, index + length))
    index += length
  }

  return parts.join(' ')
}

/**
 * Get validation result for a card number
 */
export interface ValidationResult {
  isValid: boolean
  brand: CardBrand | null
  formattedNumber: string
  isLuhnValid: boolean
  isLengthValid: boolean
  digits: string
}

export function validateCardNumber(cardNumber: string): ValidationResult {
  const digits = cardNumber.replace(/\D/g, '')
  const brand = detectCardBrand(digits)
  const isLuhnValid = luhnValidate(digits)
  const isLengthValid = validateCardLength(digits, brand)
  const formattedNumber = formatCardNumber(digits, brand)

  return {
    isValid: isLuhnValid && isLengthValid,
    brand,
    formattedNumber,
    isLuhnValid,
    isLengthValid,
    digits,
  }
}
