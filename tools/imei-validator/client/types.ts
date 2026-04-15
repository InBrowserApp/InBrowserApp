import type { IMEIValidationResult } from "../core/imei"

type IMEIValidatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  imei: string
  placeholder: string
  valid: string
  invalid: string
  invalidLength: string
  invalidFormat: string
  invalidChecksum: string
  result: string
  status: string
  reason: string
  normalized: string
  expectedCheckDigit: string
  actualCheckDigit: string
}>

type IMEIValidationAnalysis = IMEIValidationResult
type IMEIValidatorMessagesCatalog = Omit<IMEIValidatorMessages, "meta">

export type {
  IMEIValidationAnalysis,
  IMEIValidatorMessages,
  IMEIValidatorMessagesCatalog,
}
