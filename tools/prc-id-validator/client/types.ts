import type { ResidentIdAnalysisResult } from "../core/resident-id"

type PRCIdValidatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  residentIdNumber: string
  placeholder: string
  valid: string
  invalid: string
  invalidLength: string
  invalidFormat: string
  invalidRegion: string
  invalidBirthdate: string
  invalidChecksum: string
  result: string
  status: string
  region: string
  regionCode: string
  regionStatus: string
  province: string
  city: string
  district: string
  birthdate: string
  age: string
  gender: string
  sequenceCode: string
  checksum: string
  checkDigit: string
  normalized: string
  known: string
  unknown: string
  pass: string
  fail: string
  male: string
  female: string
  notAvailable: string
  expected: string
  actual: string
  copyLabel: string
  copiedLabel: string
}>

type PRCIdValidationAnalysis = ResidentIdAnalysisResult
type PRCIdValidatorMessagesCatalog = Omit<PRCIdValidatorMessages, "meta">

export type {
  PRCIdValidationAnalysis,
  PRCIdValidatorMessages,
  PRCIdValidatorMessagesCatalog,
}
