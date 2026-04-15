import type { CreditCardValidationResult } from "../core/credit-card"

type CreditCardValidatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  cardNumber: string
  placeholder: string
  valid: string
  invalid: string
  invalidLuhn: string
  invalidLength: string
  result: string
  brand: string
  unknown: string
  formattedNumber: string
  luhnCheck: string
  lengthCheck: string
  digits: string
  cvcLength: string
  digitsLabel: string
  pass: string
  fail: string
  expectedLength: string
  copyResultLabel: string
  copiedLabel: string
}>

type CreditCardValidationAnalysis = CreditCardValidationResult
type CreditCardValidatorMessagesCatalog = Omit<
  CreditCardValidatorMessages,
  "meta"
>

export type {
  CreditCardValidationAnalysis,
  CreditCardValidatorMessages,
  CreditCardValidatorMessagesCatalog,
}
