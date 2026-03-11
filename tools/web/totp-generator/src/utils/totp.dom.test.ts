import { describe, expect, it, vi } from 'vitest'
import { encodeBase32 } from '@utils/base32'
import {
  generateTotp,
  generateTotpAtCounter,
  getCounterForTimestamp,
  normalizeSecretInput,
  TotpValidationError,
  validateTotpConfig,
  type TotpHashAlgorithm,
} from './totp'

const makeSecret = (value: string) =>
  encodeBase32(new TextEncoder().encode(value), { padding: false })

describe('totp utilities', () => {
  it('normalizes whitespace and casing in secrets', () => {
    expect(normalizeSecretInput(' jbsw y3dp ehpk3pxp ')).toBe('JBSWY3DPEHPK3PXP')
  })

  it('validates config and trims optional labels', () => {
    expect(
      validateTotpConfig({
        secret: 'jbsw y3dp ehpk3pxp',
        issuer: ' Example ',
        accountName: ' demo@example.com ',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      }),
    ).toEqual({
      secret: 'JBSWY3DPEHPK3PXP',
      issuer: 'Example',
      accountName: 'demo@example.com',
      algorithm: 'SHA-1',
      digits: 6,
      period: 30,
    })
  })

  it('throws typed validation errors for bad configs', () => {
    expect(() =>
      validateTotpConfig({
        secret: '***',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      }),
    ).toThrowError(new TotpValidationError('invalid_base32'))

    expect(() =>
      validateTotpConfig({
        secret: '',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      }),
    ).toThrowError(new TotpValidationError('missing_secret'))

    expect(() =>
      validateTotpConfig({
        secret: 'JBSWY3DPEHPK3PXP',
        algorithm: 'MD5' as TotpHashAlgorithm,
        digits: 6,
        period: 30,
      }),
    ).toThrowError(new TotpValidationError('invalid_algorithm'))

    expect(() =>
      validateTotpConfig({
        secret: 'JBSWY3DPEHPK3PXP',
        algorithm: 'SHA-1',
        digits: 0,
        period: 30,
      }),
    ).toThrowError(new TotpValidationError('invalid_digits'))

    expect(() =>
      validateTotpConfig({
        secret: 'JBSWY3DPEHPK3PXP',
        algorithm: 'SHA-1',
        digits: 6,
        period: 0,
      }),
    ).toThrowError(new TotpValidationError('invalid_period'))
  })

  it('computes counters from timestamps', () => {
    expect(getCounterForTimestamp(59_000, 30)).toBe(1)
    expect(getCounterForTimestamp(1_111_111_109_000, 30)).toBe(37_037_036)
  })

  it.each([
    ['SHA-1', '12345678901234567890', 59, '94287082'],
    ['SHA-256', '12345678901234567890123456789012', 59, '46119246'],
    ['SHA-512', '1234567890123456789012345678901234567890123456789012345678901234', 59, '90693936'],
    ['SHA-1', '12345678901234567890', 1_111_111_109, '07081804'],
    ['SHA-256', '12345678901234567890123456789012', 1_111_111_109, '68084774'],
    [
      'SHA-512',
      '1234567890123456789012345678901234567890123456789012345678901234',
      1_111_111_109,
      '25091201',
    ],
    ['SHA-1', '12345678901234567890', 1_234_567_890, '89005924'],
    ['SHA-256', '12345678901234567890123456789012', 1_234_567_890, '91819424'],
    [
      'SHA-512',
      '1234567890123456789012345678901234567890123456789012345678901234',
      1_234_567_890,
      '93441116',
    ],
  ])('matches RFC 6238 vectors for %s at %i', async (algorithm, secretValue, epoch, expected) => {
    const config = {
      secret: makeSecret(secretValue),
      algorithm: algorithm as TotpHashAlgorithm,
      digits: 8,
      period: 30,
    }

    await expect(generateTotp(config, epoch * 1000)).resolves.toEqual({
      code: expected,
      counter: Math.floor(epoch / 30),
    })
  })

  it('generates codes directly from a counter', async () => {
    const result = await generateTotpAtCounter(
      {
        secret: 'JBSWY3DPEHPK3PXP',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      },
      0,
    )

    expect(result.counter).toBe(0)
    expect(result.code).toMatch(/^\d{6}$/)
  })

  it('fails clearly when Web Crypto is unavailable', async () => {
    const originalCrypto = globalThis.crypto
    vi.stubGlobal('crypto', undefined)

    await expect(
      generateTotpAtCounter(
        {
          secret: 'JBSWY3DPEHPK3PXP',
          algorithm: 'SHA-1',
          digits: 6,
          period: 30,
        },
        1,
      ),
    ).rejects.toThrow('Web Crypto API is unavailable')

    vi.stubGlobal('crypto', originalCrypto)
  })
})
