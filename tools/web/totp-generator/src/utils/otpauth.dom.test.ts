import { describe, expect, it, vi } from 'vitest'
import { buildOtpauthUri, OtpauthValidationError, parseOtpauthUri } from './otpauth'
import * as totpModule from './totp'

describe('otpauth utilities', () => {
  it('builds a provisioning uri with defaults omitted', () => {
    expect(
      buildOtpauthUri({
        secret: 'JBSWY3DPEHPK3PXP',
        issuer: 'InBrowser.App',
        accountName: 'demo@example.com',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      }),
    ).toBe(
      'otpauth://totp/InBrowser.App%3Ademo%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=InBrowser.App',
    )
  })

  it('builds a provisioning uri with non-default options', () => {
    expect(
      buildOtpauthUri({
        secret: 'JBSWY3DPEHPK3PXP',
        issuer: 'Example',
        accountName: 'ops@example.com',
        algorithm: 'SHA-512',
        digits: 8,
        period: 60,
      }),
    ).toBe(
      'otpauth://totp/Example%3Aops%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA512&digits=8&period=60',
    )
  })

  it('parses issuer, account, defaults, and normalized secret from a uri', () => {
    expect(
      parseOtpauthUri(
        'otpauth://totp/Example:demo%40example.com?secret=jbsw y3dp ehpk3pxp&issuer=Example',
      ),
    ).toEqual({
      label: 'Example:demo@example.com',
      type: 'totp',
      secret: 'JBSWY3DPEHPK3PXP',
      issuer: 'Example',
      accountName: 'demo@example.com',
      algorithm: 'SHA-1',
      digits: 6,
      period: 30,
    })
  })

  it('uses the label issuer when the query parameter is missing', () => {
    expect(
      parseOtpauthUri('otpauth://totp/Issuer%3Aaccount?secret=JBSWY3DPEHPK3PXP'),
    ).toMatchObject({
      issuer: 'Issuer',
      accountName: 'account',
    })
  })

  it('parses non-default digits, period, and algorithm', () => {
    expect(
      parseOtpauthUri(
        'otpauth://totp/Example:ops?secret=JBSWY3DPEHPK3PXP&algorithm=SHA256&digits=8&period=60',
      ),
    ).toMatchObject({
      algorithm: 'SHA-256',
      digits: 8,
      period: 60,
    })
  })

  it('parses SHA-512 algorithm aliases', () => {
    expect(
      parseOtpauthUri('otpauth://totp/Example:ops?secret=JBSWY3DPEHPK3PXP&algorithm=SHA-512'),
    ).toMatchObject({
      algorithm: 'SHA-512',
    })
  })

  it('parses SHA512 algorithm aliases without the hyphen', () => {
    expect(
      parseOtpauthUri('otpauth://totp/Example:ops?secret=JBSWY3DPEHPK3PXP&algorithm=SHA512'),
    ).toMatchObject({
      algorithm: 'SHA-512',
    })
  })

  it('parses SHA-1 algorithm aliases explicitly', () => {
    expect(
      parseOtpauthUri('otpauth://totp/Example:ops?secret=JBSWY3DPEHPK3PXP&algorithm=SHA1'),
    ).toMatchObject({
      algorithm: 'SHA-1',
    })
  })

  it('treats an empty algorithm as the default SHA-1 value', () => {
    expect(
      parseOtpauthUri('otpauth://totp/Example:ops?secret=JBSWY3DPEHPK3PXP&algorithm='),
    ).toMatchObject({
      algorithm: 'SHA-1',
    })
  })

  it('rejects invalid uris and unsupported types', () => {
    expect(() => parseOtpauthUri('not-a-uri')).toThrowError(
      new OtpauthValidationError('invalid_uri'),
    )
    expect(() => parseOtpauthUri('https://example.com')).toThrowError(
      new OtpauthValidationError('invalid_otpauth_protocol'),
    )
    expect(() => parseOtpauthUri('otpauth://hotp/Example?secret=JBSWY3DPEHPK3PXP')).toThrowError(
      new OtpauthValidationError('unsupported_otpauth_type'),
    )
  })

  it('rejects invalid secret and bad parameters', () => {
    expect(() => parseOtpauthUri('otpauth://totp/Example')).toThrowError(
      new OtpauthValidationError('missing_secret'),
    )
    expect(() => parseOtpauthUri('otpauth://totp/Example?secret=***')).toThrowError(
      new OtpauthValidationError('invalid_base32'),
    )
    expect(() =>
      parseOtpauthUri('otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&digits=0'),
    ).toThrowError(new OtpauthValidationError('invalid_digits'))
    expect(() =>
      parseOtpauthUri('otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&algorithm=MD5'),
    ).toThrowError(new OtpauthValidationError('invalid_algorithm'))
  })

  it('uses a fallback label when issuer and account are both empty', () => {
    expect(
      buildOtpauthUri({
        secret: 'JBSWY3DPEHPK3PXP',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      }),
    ).toBe('otpauth://totp/TOTP?secret=JBSWY3DPEHPK3PXP')
  })

  it('uses the issuer as the label when no account name is provided', () => {
    expect(
      buildOtpauthUri({
        secret: 'JBSWY3DPEHPK3PXP',
        issuer: 'Example',
        algorithm: 'SHA-1',
        digits: 6,
        period: 30,
      }),
    ).toBe('otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&issuer=Example')
  })

  it('rethrows unexpected validation errors unchanged', () => {
    const spy = vi.spyOn(totpModule, 'validateTotpConfig').mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() => parseOtpauthUri('otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP')).toThrow('boom')

    spy.mockRestore()
  })
})
