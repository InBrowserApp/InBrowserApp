import { beforeAll, describe, expect, it } from 'vitest'
import { webcrypto } from 'node:crypto'
import { AsnConvert } from '@peculiar/asn1-schema'
import { PrivateKeyInfo, PrivateKey, Version } from '@peculiar/asn1-pkcs8'
import { RSAPrivateKey } from '@peculiar/asn1-rsa'
import { ECParameters, ECPrivateKey, id_ecPublicKey } from '@peculiar/asn1-ecc'
import { AlgorithmIdentifier } from '@peculiar/asn1-x509'
import { diAlgorithm } from '@peculiar/x509'
import { container } from 'tsyringe'
import {
  base64UrlToBytes,
  buildSanNames,
  buildSubjectJson,
  CsrGeneratorError,
  createCsr,
  formatKeyAlgorithmLabel,
  parsePrivateKeyPem,
  type KeyAlgorithm,
} from './csr'

const cryptoProvider = webcrypto as unknown as Crypto

const baseSubject = {
  commonName: 'example.com',
  organization: '',
  organizationalUnit: '',
  country: '',
  state: '',
  locality: '',
  emailAddress: '',
}

const baseSan = {
  dns: ['example.com'],
  ip: [],
  email: [],
  uri: [],
}

const toPem = (raw: ArrayBuffer, label: string) => {
  const base64 = Buffer.from(raw).toString('base64')
  const lines = base64.match(/.{1,64}/g) ?? []
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`
}

const extractPrivateKeyBytes = (pkcs8: ArrayBuffer) => {
  const info = AsnConvert.parse(pkcs8, PrivateKeyInfo) as unknown as {
    privateKey: { buffer?: ArrayBuffer }
  }
  const buffer = info.privateKey.buffer
  if (!buffer) {
    throw new Error('Unable to extract private key bytes')
  }
  return buffer
}

let rsaPkcs8: ArrayBuffer
let ecdsaPkcs8: ArrayBuffer
let ed25519Pkcs8: ArrayBuffer
let ed448Pkcs8: ArrayBuffer
let rsaPrivatePem: string
let rsaPkcs1Pem: string
let ecdsaPrivatePem: string
let ecdsaPkcs1Pem: string
let ed25519PrivatePem: string
let ed448PrivatePem: string

beforeAll(async () => {
  const rsaKeys = await cryptoProvider.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify'],
  )
  rsaPkcs8 = await cryptoProvider.subtle.exportKey('pkcs8', rsaKeys.privateKey)
  rsaPrivatePem = toPem(rsaPkcs8, 'PRIVATE KEY')
  rsaPkcs1Pem = toPem(extractPrivateKeyBytes(rsaPkcs8), 'RSA PRIVATE KEY')

  const ecdsaKeys = await cryptoProvider.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  )
  ecdsaPkcs8 = await cryptoProvider.subtle.exportKey('pkcs8', ecdsaKeys.privateKey)
  ecdsaPrivatePem = toPem(ecdsaPkcs8, 'PRIVATE KEY')
  const ecPrivateKey = AsnConvert.parse(extractPrivateKeyBytes(ecdsaPkcs8), ECPrivateKey)
  if (!ecPrivateKey.parameters) {
    ecPrivateKey.parameters = new ECParameters({ namedCurve: '1.2.840.10045.3.1.7' })
  }
  ecdsaPkcs1Pem = toPem(AsnConvert.serialize(ecPrivateKey), 'EC PRIVATE KEY')

  const ed25519Keys = await cryptoProvider.subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify',
  ])
  ed25519Pkcs8 = await cryptoProvider.subtle.exportKey('pkcs8', ed25519Keys.privateKey)
  ed25519PrivatePem = toPem(ed25519Pkcs8, 'PRIVATE KEY')

  const ed448Keys = await cryptoProvider.subtle.generateKey({ name: 'Ed448' }, true, [
    'sign',
    'verify',
  ])
  ed448Pkcs8 = await cryptoProvider.subtle.exportKey('pkcs8', ed448Keys.privateKey)
  ed448PrivatePem = toPem(ed448Pkcs8, 'PRIVATE KEY')
})

describe('buildSubjectJson', () => {
  it('returns null when subject is empty', () => {
    const subject = buildSubjectJson({
      commonName: ' ',
      organization: '',
      organizationalUnit: '',
      country: '',
      state: '',
      locality: '',
      emailAddress: '',
    })
    expect(subject).toBeNull()
  })

  it('builds a subject when fields are present', () => {
    const subject = buildSubjectJson({
      commonName: ' example.com ',
      organization: 'Acme',
      organizationalUnit: '',
      country: 'US',
      state: '',
      locality: '',
      emailAddress: '',
    })

    expect(subject).toEqual([
      {
        CN: ['example.com'],
        O: ['Acme'],
        C: ['US'],
      },
    ])
  })
})

describe('buildSanNames', () => {
  it('collects SAN entries', () => {
    const names = buildSanNames({
      dns: ['example.com'],
      ip: ['192.0.2.1'],
      email: ['admin@example.com'],
      uri: ['https://example.com'],
    })
    expect(names).toHaveLength(4)
  })

  it('rejects invalid IP addresses', () => {
    expect(() =>
      buildSanNames({
        dns: [],
        ip: ['not-an-ip'],
        email: [],
        uri: [],
      }),
    ).toThrowError(CsrGeneratorError)
  })
})

describe('formatKeyAlgorithmLabel', () => {
  it('formats known algorithms', () => {
    expect(
      formatKeyAlgorithmLabel({
        algorithm: 'rsa',
        rsaKeySize: 2048,
        rsaHash: 'SHA-256',
      }),
    ).toBe('RSA 2048 (SHA-256)')
    expect(formatKeyAlgorithmLabel({ algorithm: 'ecdsa', ecCurve: 'P-256' })).toBe(
      'ECDSA P-256 (SHA-256)',
    )
    expect(formatKeyAlgorithmLabel({ algorithm: 'ed25519' })).toBe('Ed25519')
    expect(formatKeyAlgorithmLabel({ algorithm: 'ed448' })).toBe('Ed448')
  })

  it('falls back to the algorithm name', () => {
    expect(formatKeyAlgorithmLabel({ algorithm: 'unknown' as KeyAlgorithm })).toBe('unknown')
  })

  it('handles missing RSA and ECDSA parameters', () => {
    expect(formatKeyAlgorithmLabel({ algorithm: 'rsa' })).toBe('RSA')
    expect(formatKeyAlgorithmLabel({ algorithm: 'ecdsa' })).toBe('ECDSA')
  })
})

describe('parsePrivateKeyPem', () => {
  it('throws for invalid or unsupported PEM input', () => {
    expect(() => parsePrivateKeyPem('not pem')).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem('-----BEGIN CERTIFICATE-----\nZm9v\n-----END CERTIFICATE-----'),
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(
        '-----BEGIN ENCRYPTED PRIVATE KEY-----\nZm9v\n-----END ENCRYPTED PRIVATE KEY-----',
      ),
    ).toThrowError(CsrGeneratorError)
  })

  it('parses PKCS#8 private keys', () => {
    const rsaParsed = parsePrivateKeyPem(rsaPrivatePem)
    expect(rsaParsed.algorithm).toEqual({ type: 'rsa' })

    const ecdsaParsed = parsePrivateKeyPem(ecdsaPrivatePem)
    expect(ecdsaParsed.algorithm).toEqual({ type: 'ecdsa', curve: 'P-256' })
  })

  it('parses RSA and EC private key blocks', () => {
    const rsaParsed = parsePrivateKeyPem(rsaPkcs1Pem)
    expect(rsaParsed.algorithm).toEqual({ type: 'rsa' })

    const ecParsed = parsePrivateKeyPem(ecdsaPkcs1Pem)
    expect(ecParsed.algorithm).toEqual({ type: 'ecdsa', curve: 'P-256' })
  })

  it('rejects EC private key blocks with unsupported curves', () => {
    const ecPrivateKey = AsnConvert.parse(extractPrivateKeyBytes(ecdsaPkcs8), ECPrivateKey)
    ecPrivateKey.parameters = new ECParameters({ namedCurve: '1.2.3.4.5' })

    expect(() =>
      parsePrivateKeyPem(toPem(AsnConvert.serialize(ecPrivateKey), 'EC PRIVATE KEY')),
    ).toThrowError(CsrGeneratorError)
  })

  it('handles OKP and unsupported algorithms', () => {
    const okpEd25519 = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: '1.3.101.112' }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })

    const okpEd448 = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: '1.3.101.113' }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })

    const okpX25519 = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: '1.3.101.110' }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })

    const unknownAlg = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: '1.2.3.4.5' }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })

    expect(
      parsePrivateKeyPem(toPem(AsnConvert.serialize(okpEd25519), 'PRIVATE KEY')).algorithm,
    ).toEqual({ type: 'ed25519' })
    expect(
      parsePrivateKeyPem(toPem(AsnConvert.serialize(okpEd448), 'PRIVATE KEY')).algorithm,
    ).toEqual({ type: 'ed448' })
    expect(() =>
      parsePrivateKeyPem(toPem(AsnConvert.serialize(okpX25519), 'PRIVATE KEY')),
    ).toThrowError(CsrGeneratorError)
    expect(() =>
      parsePrivateKeyPem(toPem(AsnConvert.serialize(unknownAlg), 'PRIVATE KEY')),
    ).toThrowError(CsrGeneratorError)
  })

  it('rejects unsupported curves', () => {
    const info = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({
        algorithm: id_ecPublicKey,
        parameters: AsnConvert.serialize(new ECParameters({ namedCurve: '1.2.3.4.5' })),
      }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })

    expect(() => parsePrivateKeyPem(toPem(AsnConvert.serialize(info), 'PRIVATE KEY'))).toThrowError(
      CsrGeneratorError,
    )
  })

  it('rejects EC PKCS#8 keys without parameters', () => {
    const info = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: id_ecPublicKey }),
      privateKey: new PrivateKey(new Uint8Array([1, 2, 3]).buffer),
    })

    expect(() => parsePrivateKeyPem(toPem(AsnConvert.serialize(info), 'PRIVATE KEY'))).toThrowError(
      CsrGeneratorError,
    )
  })

  it('rejects EC PRIVATE KEY blocks without parameters', () => {
    const ecPrivateKey = AsnConvert.parse(extractPrivateKeyBytes(ecdsaPkcs8), ECPrivateKey)
    ecPrivateKey.parameters = undefined

    expect(() =>
      parsePrivateKeyPem(toPem(AsnConvert.serialize(ecPrivateKey), 'EC PRIVATE KEY')),
    ).toThrowError(CsrGeneratorError)
  })
})

describe('createCsr', () => {
  it('requires subject or SAN', async () => {
    await expect(
      createCsr(
        {
          keySource: 'generate',
          algorithm: 'rsa',
          rsaKeySize: 2048,
          rsaHash: 'SHA-256',
          ecCurve: 'P-256',
          keyPem: '',
          subject: {
            commonName: '',
            organization: '',
            organizationalUnit: '',
            country: '',
            state: '',
            locality: '',
            emailAddress: '',
          },
          san: { dns: [], ip: [], email: [], uri: [] },
        },
        cryptoProvider,
      ),
    ).rejects.toThrowError(CsrGeneratorError)
  })

  it('creates CSRs with subject-only inputs', async () => {
    const result = await createCsr(
      {
        keySource: 'generate',
        algorithm: 'rsa',
        rsaKeySize: 2048,
        rsaHash: 'SHA-256',
        ecCurve: 'P-256',
        keyPem: '',
        subject: baseSubject,
        san: { dns: [], ip: [], email: [], uri: [] },
      },
      cryptoProvider,
    )

    expect(result.csrPem).toContain('BEGIN CERTIFICATE REQUEST')
  })

  it('creates CSRs with SAN-only inputs', async () => {
    const result = await createCsr(
      {
        keySource: 'generate',
        algorithm: 'rsa',
        rsaKeySize: 2048,
        rsaHash: 'SHA-256',
        ecCurve: 'P-256',
        keyPem: '',
        subject: {
          commonName: '',
          organization: '',
          organizationalUnit: '',
          country: '',
          state: '',
          locality: '',
          emailAddress: '',
        },
        san: baseSan,
      },
      cryptoProvider,
    )

    expect(result.csrPem).toContain('BEGIN CERTIFICATE REQUEST')
  })

  it('generates CSRs for supported algorithms', async () => {
    const algorithms: KeyAlgorithm[] = ['rsa', 'ecdsa', 'ed25519', 'ed448']
    for (const algorithm of algorithms) {
      const result = await createCsr(
        {
          keySource: 'generate',
          algorithm,
          rsaKeySize: 2048,
          rsaHash: 'SHA-256',
          ecCurve: 'P-256',
          keyPem: '',
          subject: baseSubject,
          san: baseSan,
        },
        cryptoProvider,
      )

      expect(result.csrPem).toContain('BEGIN CERTIFICATE REQUEST')
      expect(result.privateKeyPem).toContain('BEGIN PRIVATE KEY')
    }
  }, 30000)

  it('imports keys and produces CSRs without exporting private keys', async () => {
    const cases = [
      { algorithm: 'rsa' as const, pem: rsaPrivatePem },
      { algorithm: 'ecdsa' as const, pem: ecdsaPrivatePem },
      { algorithm: 'ed25519' as const, pem: ed25519PrivatePem },
      { algorithm: 'ed448' as const, pem: ed448PrivatePem },
    ]

    for (const entry of cases) {
      const result = await createCsr(
        {
          keySource: 'import',
          algorithm: entry.algorithm,
          rsaKeySize: 2048,
          rsaHash: 'SHA-256',
          ecCurve: 'P-256',
          keyPem: entry.pem,
          subject: baseSubject,
          san: baseSan,
        },
        cryptoProvider,
      )

      expect(result.csrPem).toContain('BEGIN CERTIFICATE REQUEST')
      expect(result.privateKeyPem).toBeUndefined()
    }
  }, 30000)

  it('rejects missing private keys on import', async () => {
    await expect(
      createCsr(
        {
          keySource: 'import',
          algorithm: 'rsa',
          rsaKeySize: 2048,
          rsaHash: 'SHA-256',
          ecCurve: 'P-256',
          keyPem: '   ',
          subject: baseSubject,
          san: baseSan,
        },
        cryptoProvider,
      ),
    ).rejects.toThrowError(CsrGeneratorError)
  })

  it('rejects unknown algorithms', async () => {
    await expect(
      createCsr(
        {
          keySource: 'generate',
          algorithm: 'unknown' as KeyAlgorithm,
          rsaKeySize: 2048,
          rsaHash: 'SHA-256',
          ecCurve: 'P-256',
          keyPem: '',
          subject: baseSubject,
          san: baseSan,
        },
        cryptoProvider,
      ),
    ).rejects.toThrowError(CsrGeneratorError)
  })
})

describe('Ed448Algorithm coverage', () => {
  it('returns null for non-Ed448 mappings', async () => {
    await createCsr(
      {
        keySource: 'generate',
        algorithm: 'rsa',
        rsaKeySize: 2048,
        rsaHash: 'SHA-256',
        ecCurve: 'P-256',
        keyPem: '',
        subject: baseSubject,
        san: baseSan,
      },
      cryptoProvider,
    )

    const algorithms = container.resolveAll<{
      toAsnAlgorithm?: (algo: Algorithm) => AlgorithmIdentifier | null
      toWebAlgorithm?: (algo: AlgorithmIdentifier) => Algorithm | null
    }>(diAlgorithm)

    const ed448Algorithm = algorithms.find(
      (algorithm) => algorithm.toAsnAlgorithm?.({ name: 'Ed448' })?.algorithm === '1.3.101.113',
    )

    expect(ed448Algorithm).toBeDefined()
    expect(ed448Algorithm?.toAsnAlgorithm?.({ name: 'Ed25519' })).toBeNull()
    expect(
      ed448Algorithm?.toWebAlgorithm?.(new AlgorithmIdentifier({ algorithm: '1.3.101.113' })),
    ).toEqual({ name: 'Ed448' })
    expect(
      ed448Algorithm?.toWebAlgorithm?.(new AlgorithmIdentifier({ algorithm: '1.2.3.4' })),
    ).toBeNull()
  })
})

describe('base64UrlToBytes', () => {
  it('decodes base64url strings', () => {
    const bytes = base64UrlToBytes('AQID')
    expect(Array.from(bytes)).toEqual([1, 2, 3])
  })

  it('pads base64url strings when needed', () => {
    const bytes = base64UrlToBytes('AQI')
    expect(Array.from(bytes)).toEqual([1, 2])
  })
})

describe('parsePrivateKeyPem coverage', () => {
  it('executes rsa key parsing via PKCS#1 helper', () => {
    const rsa = AsnConvert.parse(extractPrivateKeyBytes(rsaPkcs8), RSAPrivateKey)
    const info = new PrivateKeyInfo({
      version: Version.v1,
      privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: '1.2.840.113549.1.1.1' }),
      privateKey: new PrivateKey(AsnConvert.serialize(rsa)),
    })

    const parsed = parsePrivateKeyPem(toPem(AsnConvert.serialize(info), 'PRIVATE KEY'))
    expect(parsed.algorithm).toEqual({ type: 'rsa' })
  })
})
