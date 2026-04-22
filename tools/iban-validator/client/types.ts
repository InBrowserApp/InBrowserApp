import type { IBANValidationResult } from "../core/iban"

type IBANValidatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  iban: string
  placeholder: string
  valid: string
  invalid: string
  invalidCountry: string
  invalidLength: string
  invalidFormat: string
  invalidChecksum: string
  result: string
  status: string
  country: string
  registry: string
  supported: string
  unknown: string
  length: string
  expected: string
  actual: string
  checkDigits: string
  normalized: string
  formatted: string
  bban: string
  checksum: string
  pass: string
  fail: string
  notAvailable: string
  copyResultLabel: string
  copiedLabel: string
}>

type IBANValidationAnalysis = IBANValidationResult
type IBANValidatorMessagesCatalog = Omit<IBANValidatorMessages, "meta">

export type {
  IBANValidationAnalysis,
  IBANValidatorMessages,
  IBANValidatorMessagesCatalog,
}
