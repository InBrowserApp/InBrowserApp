import {
  TotpValidationError,
  type TotpConfig,
  type TotpHashAlgorithm,
  validateTotpConfig,
} from './totp'

export type OtpauthParseResult = TotpConfig & {
  label: string
  type: 'totp'
}

export type OtpauthValidationErrorCode =
  | TotpValidationError['code']
  | 'invalid_uri'
  | 'invalid_otpauth_protocol'
  | 'unsupported_otpauth_type'

export class OtpauthValidationError extends Error {
  constructor(
    readonly code: OtpauthValidationErrorCode,
    message = code,
  ) {
    super(message)
    this.name = 'OtpauthValidationError'
  }
}

function parseAlgorithm(value: string | null): TotpHashAlgorithm {
  const normalized = value?.trim().toUpperCase() ?? ''
  switch (normalized) {
    case '':
    case 'SHA1':
    case 'SHA-1':
      return 'SHA-1'
    case 'SHA256':
    case 'SHA-256':
      return 'SHA-256'
    case 'SHA512':
    case 'SHA-512':
      return 'SHA-512'
    default:
      throw new OtpauthValidationError('invalid_algorithm')
  }
}

function parseInteger(
  value: string | null,
  fallback: number,
  code: TotpValidationError['code'],
): number {
  if (value === null || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new OtpauthValidationError(code)
  }

  return parsed
}

export function parseOtpauthUri(value: string): OtpauthParseResult {
  let parsed: URL
  try {
    parsed = new URL(value.trim())
  } catch {
    throw new OtpauthValidationError('invalid_uri')
  }

  if (parsed.protocol !== 'otpauth:') {
    throw new OtpauthValidationError('invalid_otpauth_protocol')
  }

  const type = parsed.hostname.toLowerCase()
  if (type !== 'totp') {
    throw new OtpauthValidationError('unsupported_otpauth_type')
  }

  const label = decodeURIComponent(parsed.pathname.replace(/^\//, ''))
  const separatorIndex = label.indexOf(':')
  const issuerFromLabel = separatorIndex >= 0 ? label.slice(0, separatorIndex).trim() : ''
  const accountFromLabel =
    separatorIndex >= 0 ? label.slice(separatorIndex + 1).trim() : label.trim()
  const issuer = parsed.searchParams.get('issuer')?.trim() || issuerFromLabel

  const config: TotpConfig = {
    secret: parsed.searchParams.get('secret')?.trim() ?? '',
    issuer,
    accountName: accountFromLabel,
    algorithm: parseAlgorithm(parsed.searchParams.get('algorithm')),
    digits: parseInteger(parsed.searchParams.get('digits'), 6, 'invalid_digits'),
    period: parseInteger(parsed.searchParams.get('period'), 30, 'invalid_period'),
  }

  try {
    return {
      ...validateTotpConfig(config),
      label,
      type: 'totp',
    }
  } catch (error) {
    if (error instanceof TotpValidationError) {
      throw new OtpauthValidationError(error.code)
    }
    throw error
  }
}

export function buildOtpauthUri(config: TotpConfig): string {
  const validated = validateTotpConfig(config)
  const labelAccount = validated.accountName || validated.issuer || 'TOTP'
  const label = validated.issuer
    ? `${validated.issuer}:${labelAccount === validated.issuer ? '' : labelAccount}`.replace(
        /:$/,
        '',
      )
    : labelAccount
  const params = new URLSearchParams()
  params.set('secret', validated.secret)
  if (validated.issuer) {
    params.set('issuer', validated.issuer)
  }
  if (validated.algorithm !== 'SHA-1') {
    params.set('algorithm', validated.algorithm.replace('-', ''))
  }
  if (validated.digits !== 6) {
    params.set('digits', String(validated.digits))
  }
  if (validated.period !== 30) {
    params.set('period', String(validated.period))
  }

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`
}
