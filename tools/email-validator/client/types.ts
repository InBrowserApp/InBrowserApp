import type { EmailValidationResult } from "../core/email"

type EmailValidatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  email: string
  placeholder: string
  valid: string
  invalid: string
  invalidAt: string
  invalidLength: string
  invalidLocalLength: string
  invalidDomainLength: string
  invalidLocal: string
  invalidDomain: string
  invalidTld: string
  result: string
  pass: string
  fail: string
  notAvailable: string
  status: string
  normalized: string
  localPart: string
  domain: string
  emailLength: string
  localLength: string
  domainLength: string
  lengthCheck: string
  localCheck: string
  domainCheck: string
  tldCheck: string
}>

type EmailValidationAnalysis = EmailValidationResult
type EmailValidatorMessagesCatalog = Omit<EmailValidatorMessages, "meta">

export type {
  EmailValidationAnalysis,
  EmailValidatorMessages,
  EmailValidatorMessagesCatalog,
}
