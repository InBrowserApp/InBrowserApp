import type { BICValidationResult } from "../core/bic"

type BICSwiftValidatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  bic: string
  placeholder: string
  valid: string
  invalid: string
  invalidCountry: string
  invalidLength: string
  invalidFormat: string
  invalidBank: string
  invalidLocation: string
  invalidBranch: string
  result: string
  status: string
  type: string
  normalized: string
  length: string
  bankCode: string
  country: string
  countryStatus: string
  locationCode: string
  locationType: string
  branchCode: string
  officeType: string
  supported: string
  unknown: string
  standard: string
  test: string
  passive: string
  primaryOffice: string
  branchOffice: string
  bic8: string
  bic11: string
  notAvailable: string
  copyLabel: string
  copiedLabel: string
}>

type BICValidationAnalysis = BICValidationResult
type BICSwiftValidatorMessagesCatalog = Omit<BICSwiftValidatorMessages, "meta">

export type {
  BICSwiftValidatorMessages,
  BICSwiftValidatorMessagesCatalog,
  BICValidationAnalysis,
}
