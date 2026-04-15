type CardPattern = string | readonly [number, number]

type CardBrand = Readonly<{
  id: string
  name: string
  patterns: readonly CardPattern[]
  lengths: readonly number[]
  cvcLength: number
  formatPattern: readonly number[]
}>

type CreditCardValidationResult = Readonly<{
  raw: string
  digits: string
  formattedNumber: string
  brand: CardBrand | null
  isLuhnValid: boolean
  isLengthValid: boolean
  isValid: boolean
}>

const DEFAULT_FORMAT_PATTERN = [4, 4, 4, 4, 3] as const

const cardBrands = [
  {
    id: "visa",
    name: "Visa",
    patterns: ["4"],
    lengths: [13, 16, 19],
    cvcLength: 3,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
  {
    id: "mastercard",
    name: "Mastercard",
    patterns: ["51", "52", "53", "54", "55", [2221, 2720]],
    lengths: [16],
    cvcLength: 3,
    formatPattern: [4, 4, 4, 4],
  },
  {
    id: "amex",
    name: "American Express",
    patterns: ["34", "37"],
    lengths: [15],
    cvcLength: 4,
    formatPattern: [4, 6, 5],
  },
  {
    id: "discover",
    name: "Discover",
    patterns: ["6011", "65", [644, 649], [622126, 622925]],
    lengths: [16, 19],
    cvcLength: 3,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
  {
    id: "jcb",
    name: "JCB",
    patterns: [[3528, 3589]],
    lengths: [16, 17, 18, 19],
    cvcLength: 3,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
  {
    id: "unionpay",
    name: "UnionPay",
    patterns: ["62"],
    lengths: [16, 17, 18, 19],
    cvcLength: 3,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
  {
    id: "dinersclub",
    name: "Diners Club",
    patterns: ["36", "38", "39", [300, 305]],
    lengths: [14, 16, 19],
    cvcLength: 3,
    formatPattern: [4, 6, 4, 4, 1],
  },
] as const satisfies readonly CardBrand[]

function normalizeCardNumber(input: string) {
  return input.replace(/\D/g, "")
}

function luhnValidate(cardNumber: string) {
  const digits = normalizeCardNumber(cardNumber)

  if (digits.length === 0) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number.parseInt(digits[index]!, 10)

    if (isEven) {
      digit *= 2

      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

function matchesPattern(cardNumber: string, pattern: CardPattern) {
  if (typeof pattern === "string") {
    return cardNumber.startsWith(pattern)
  }

  const [start, end] = pattern
  const prefixLength = start.toString().length
  const prefix = Number.parseInt(cardNumber.slice(0, prefixLength), 10)

  return prefix >= start && prefix <= end
}

function detectCardBrand(cardNumber: string): CardBrand | null {
  const digits = normalizeCardNumber(cardNumber)

  if (digits.length === 0) {
    return null
  }

  for (const brand of cardBrands) {
    for (const pattern of brand.patterns) {
      if (matchesPattern(digits, pattern)) {
        return brand
      }
    }
  }

  return null
}

function validateCardLength(cardNumber: string, brand: CardBrand | null) {
  const digits = normalizeCardNumber(cardNumber)

  if (!brand) {
    return false
  }

  return brand.lengths.includes(digits.length)
}

function formatCardNumber(cardNumber: string, brand?: CardBrand | null) {
  const digits = normalizeCardNumber(cardNumber)

  if (digits.length === 0) {
    return ""
  }

  const pattern = brand?.formatPattern ?? DEFAULT_FORMAT_PATTERN
  const parts: string[] = []
  let index = 0

  for (const length of pattern) {
    if (index >= digits.length) {
      break
    }

    parts.push(digits.slice(index, index + length))
    index += length
  }

  return parts.join(" ")
}

function validateCardNumber(cardNumber: string): CreditCardValidationResult {
  const digits = normalizeCardNumber(cardNumber)
  const brand = detectCardBrand(digits)
  const isLuhnValid = luhnValidate(digits)
  const isLengthValid = validateCardLength(digits, brand)
  const formattedNumber = formatCardNumber(digits, brand)

  return {
    raw: cardNumber,
    digits,
    formattedNumber,
    brand,
    isLuhnValid,
    isLengthValid,
    isValid: isLuhnValid && isLengthValid,
  }
}

export {
  cardBrands,
  detectCardBrand,
  formatCardNumber,
  luhnValidate,
  normalizeCardNumber,
  validateCardLength,
  validateCardNumber,
  type CreditCardValidationResult,
}
