import { decodeBase32 } from '@utils/base32'

export type TotpHashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512'

export type TotpConfig = {
  secret: string
  issuer?: string
  accountName?: string
  algorithm: TotpHashAlgorithm
  digits: number
  period: number
}

export type TotpCode = {
  code: string
  counter: number
}

export type TotpValidationErrorCode =
  | 'invalid_base32'
  | 'missing_secret'
  | 'invalid_algorithm'
  | 'invalid_digits'
  | 'invalid_period'

export class TotpValidationError extends Error {
  constructor(
    readonly code: TotpValidationErrorCode,
    message = code,
  ) {
    super(message)
    this.name = 'TotpValidationError'
  }
}

const SUPPORTED_ALGORITHMS = new Set<TotpHashAlgorithm>(['SHA-1', 'SHA-256', 'SHA-512'])

export function normalizeSecretInput(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase()
}

export function validateTotpConfig(config: TotpConfig): TotpConfig {
  const secret = normalizeSecretInput(config.secret)
  if (!secret) {
    throw new TotpValidationError('missing_secret')
  }

  try {
    decodeBase32(secret)
  } catch {
    throw new TotpValidationError('invalid_base32')
  }

  if (!SUPPORTED_ALGORITHMS.has(config.algorithm)) {
    throw new TotpValidationError('invalid_algorithm')
  }

  if (!Number.isInteger(config.digits) || config.digits < 1 || config.digits > 10) {
    throw new TotpValidationError('invalid_digits')
  }

  if (!Number.isInteger(config.period) || config.period < 1) {
    throw new TotpValidationError('invalid_period')
  }

  return {
    ...config,
    secret,
    issuer: config.issuer?.trim() ?? '',
    accountName: config.accountName?.trim() ?? '',
  }
}

export function getCounterForTimestamp(timestampMs: number, period: number): number {
  return Math.floor(Math.floor(timestampMs / 1000) / period)
}

export async function generateTotp(config: TotpConfig, timestampMs: number): Promise<TotpCode> {
  const validated = validateTotpConfig(config)
  const counter = getCounterForTimestamp(timestampMs, validated.period)
  return generateTotpAtCounter(validated, counter)
}

export async function generateTotpAtCounter(
  config: TotpConfig,
  counter: number,
): Promise<TotpCode> {
  const validated = validateTotpConfig(config)
  const keyBytes = decodeBase32(validated.secret)
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is unavailable')
  }

  const counterBytes = new Uint8Array(8)
  let value = BigInt(counter)
  for (let index = 7; index >= 0; index -= 1) {
    counterBytes[index] = Number(value & 255n)
    value >>= 8n
  }

  const keyMaterial = keyBytes.buffer.slice(
    keyBytes.byteOffset,
    keyBytes.byteOffset + keyBytes.byteLength,
  ) as ArrayBuffer

  const key = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'HMAC', hash: validated.algorithm },
    false,
    ['sign'],
  )

  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, counterBytes.buffer))
  const offset = signature[signature.length - 1]! & 0x0f
  const binary =
    ((signature[offset]! & 0x7f) << 24) |
    ((signature[offset + 1]! & 0xff) << 16) |
    ((signature[offset + 2]! & 0xff) << 8) |
    (signature[offset + 3]! & 0xff)

  const modulus = 10 ** validated.digits
  const code = String(binary % modulus).padStart(validated.digits, '0')

  return { code, counter }
}
