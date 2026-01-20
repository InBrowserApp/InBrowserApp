export interface EmailValidationResult {
  input: string
  normalized: string
  length: number
  localPart: string
  domain: string
  localLength: number
  domainLength: number
  domainLabels: string[]
  hasSingleAt: boolean
  isLengthValid: boolean
  isLocalLengthValid: boolean
  isDomainLengthValid: boolean
  isLocalCharsValid: boolean
  isLocalDotsValid: boolean
  isDomainCharsValid: boolean
  isDomainDotsValid: boolean
  isDomainLabelLengthValid: boolean
  isDomainLabelCharsValid: boolean
  isTldValid: boolean
  isValid: boolean
}

const EMAIL_MAX_LENGTH = 254
const LOCAL_PART_MAX_LENGTH = 64
const DOMAIN_MAX_LENGTH = 253
const DOMAIN_LABEL_MAX_LENGTH = 63
const LOCAL_PART_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/
const DOMAIN_REGEX = /^[A-Za-z0-9.-]+$/
const DOMAIN_LABEL_REGEX = /^[A-Za-z0-9-]+$/
const TLD_REGEX = /[A-Za-z]/

export function normalizeEmail(input: string): string {
  const trimmed = input.trim()
  const atIndex = trimmed.indexOf('@')
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) return trimmed

  const localPart = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)
  if (!domain) return trimmed
  return `${localPart}@${domain.toLowerCase()}`
}

function hasValidDotPlacement(value: string): boolean {
  if (!value) return false
  if (value.startsWith('.') || value.endsWith('.')) return false
  return !value.includes('..')
}

function isValidDomainLabel(label: string): boolean {
  if (label.length === 0 || label.length > DOMAIN_LABEL_MAX_LENGTH) return false
  if (!DOMAIN_LABEL_REGEX.test(label)) return false
  if (label.startsWith('-') || label.endsWith('-')) return false
  return true
}

export function validateEmail(input: string): EmailValidationResult {
  const trimmed = input.trim()
  const length = trimmed.length
  const atIndex = trimmed.indexOf('@')
  const hasSingleAt =
    atIndex > 0 && atIndex === trimmed.lastIndexOf('@') && atIndex < trimmed.length - 1

  const localPart = hasSingleAt ? trimmed.slice(0, atIndex) : ''
  const domain = hasSingleAt ? trimmed.slice(atIndex + 1) : ''
  const normalized = hasSingleAt && domain ? `${localPart}@${domain.toLowerCase()}` : ''
  const localLength = localPart.length
  const domainLength = domain.length

  const isLengthValid = length <= EMAIL_MAX_LENGTH
  const isLocalLengthValid = localLength > 0 && localLength <= LOCAL_PART_MAX_LENGTH
  const isDomainLengthValid = domainLength > 0 && domainLength <= DOMAIN_MAX_LENGTH
  const isLocalCharsValid = localLength > 0 && LOCAL_PART_REGEX.test(localPart)
  const localDotsValid = hasValidDotPlacement(localPart)
  const isLocalDotsValid = localLength > 0 && localDotsValid
  const isDomainCharsValid = domainLength > 0 && DOMAIN_REGEX.test(domain)
  const domainDotsValid = hasValidDotPlacement(domain)
  const isDomainDotsValid = domainLength > 0 && domainDotsValid

  const domainLabels = isDomainDotsValid ? domain.split('.') : []
  const isDomainLabelLengthValid =
    domainLabels.length > 0 &&
    domainLabels.every((label) => label.length <= DOMAIN_LABEL_MAX_LENGTH)
  const isDomainLabelCharsValid =
    domainLabels.length > 0 && domainLabels.every((label) => isValidDomainLabel(label))
  const tld = domainLabels.at(-1) ?? ''
  const isTldValid = domainLabels.length > 1 && tld.length >= 2 && TLD_REGEX.test(tld)

  const isValid =
    hasSingleAt &&
    isLengthValid &&
    isLocalLengthValid &&
    isDomainLengthValid &&
    isLocalCharsValid &&
    isLocalDotsValid &&
    isDomainCharsValid &&
    isDomainDotsValid &&
    isDomainLabelLengthValid &&
    isDomainLabelCharsValid &&
    isTldValid

  return {
    input,
    normalized,
    length,
    localPart,
    domain,
    localLength,
    domainLength,
    domainLabels,
    hasSingleAt,
    isLengthValid,
    isLocalLengthValid,
    isDomainLengthValid,
    isLocalCharsValid,
    isLocalDotsValid,
    isDomainCharsValid,
    isDomainDotsValid,
    isDomainLabelLengthValid,
    isDomainLabelCharsValid,
    isTldValid,
    isValid,
  }
}
