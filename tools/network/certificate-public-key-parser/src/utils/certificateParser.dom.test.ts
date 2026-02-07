import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { parseCertificateInput, type ParserMessages } from './certificateParser'

vi.mock('@peculiar/x509', () => {
  const KeyUsageFlags = {
    digitalSignature: 1,
    nonRepudiation: 2,
    keyEncipherment: 4,
    dataEncipherment: 8,
    keyAgreement: 16,
    keyCertSign: 32,
    cRLSign: 64,
    encipherOnly: 128,
    decipherOnly: 256,
  }

  const ExtendedKeyUsage = {
    serverAuth: '1.3.6.1.5.5.7.3.1',
    clientAuth: '1.3.6.1.5.5.7.3.2',
    codeSigning: '1.3.6.1.5.5.7.3.3',
    emailProtection: '1.3.6.1.5.5.7.3.4',
    timeStamping: '1.3.6.1.5.5.7.3.8',
    ocspSigning: '1.3.6.1.5.5.7.3.9',
  }

  class SubjectAlternativeNameExtension {}
  class KeyUsagesExtension {}
  class ExtendedKeyUsageExtension {}
  class BasicConstraintsExtension {}
  class SubjectKeyIdentifierExtension {}
  class AuthorityKeyIdentifierExtension {}

  class PublicKey {
    rawData: ArrayBuffer
    algorithm: unknown

    constructor(buffer: ArrayBuffer) {
      const view = new Uint8Array(buffer)
      if (view[0] === 0xff) {
        throw new Error('invalid public key')
      }
      this.rawData = buffer
      if (view[0] === 0x00) {
        this.algorithm = { name: 'RSA', modulusLength: 2048 }
      } else if (view[0] === 0x03) {
        this.algorithm = {}
      } else {
        this.algorithm = { name: 'EC', namedCurve: 'P-256' }
      }
    }
  }

  class X509Certificate {
    rawData: ArrayBuffer
    mode: number
    subject = 'CN=example'
    issuer = 'CN=issuer'
    serialNumber = '0x0102'
    notBefore = new Date('2024-01-01T00:00:00Z')
    notAfter = new Date('2025-01-01T00:00:00Z')
    signatureAlgorithm = { name: 'RSA-PSS', hash: { name: 'SHA-256' } }
    publicKey: PublicKey

    constructor(buffer: ArrayBuffer) {
      const view = new Uint8Array(buffer)
      this.mode = view[0] ?? 0
      if (this.mode === 0x00 || this.mode === 0xff || this.mode === 0x03) {
        throw new Error('invalid certificate')
      }
      this.rawData = buffer
      this.publicKey = new PublicKey(new Uint8Array([0x00]).buffer)
    }

    getExtension(extensionClass: unknown) {
      if (extensionClass === SubjectAlternativeNameExtension) {
        if (this.mode === 0x06) {
          return { names: { items: [] } }
        }
        return { names: { items: [{ type: 'dns', value: 'example.com' }] } }
      }
      if (extensionClass === KeyUsagesExtension) {
        if (this.mode === 0x04) {
          return { usages: 0 }
        }
        return { usages: KeyUsageFlags.digitalSignature | KeyUsageFlags.keyEncipherment }
      }
      if (extensionClass === ExtendedKeyUsageExtension) {
        if (this.mode === 0x05) {
          return { usages: [] }
        }
        return { usages: [ExtendedKeyUsage.serverAuth, '1.2.3.4'] }
      }
      if (extensionClass === BasicConstraintsExtension) {
        if (this.mode === 0x06) {
          return undefined
        }
        return { ca: true, pathLength: 1 }
      }
      if (extensionClass === SubjectKeyIdentifierExtension) {
        if (this.mode === 0x06) {
          return {}
        }
        return { keyId: '0x0102' }
      }
      if (extensionClass === AuthorityKeyIdentifierExtension) {
        if (this.mode === 0x06) {
          return {}
        }
        return { keyId: 'abcd' }
      }
      return undefined
    }
  }

  return {
    __esModule: true,
    AuthorityKeyIdentifierExtension,
    BasicConstraintsExtension,
    ExtendedKeyUsageExtension,
    KeyUsagesExtension,
    PublicKey,
    SubjectAlternativeNameExtension,
    SubjectKeyIdentifierExtension,
    X509Certificate,
    ExtendedKeyUsage,
    KeyUsageFlags,
  }
})

const messages: ParserMessages = {
  invalidInput: 'Invalid input',
  invalidPem: 'Invalid PEM',
  parseFailed: 'Parse failed',
  notAvailable: 'Not available',
  unsupportedPemBlock: (label) => `Unsupported ${label}`,
  certificateTab: (index) => `Certificate ${index}`,
  publicKeyTab: (index) => `Public Key ${index}`,
}

const pemMixed = [
  '-----BEGIN CERTIFICATE-----\nAQ==\n-----END CERTIFICATE-----',
  '-----BEGIN CERTIFICATE-----\nAA==\n-----END CERTIFICATE-----',
  '-----BEGIN PUBLIC KEY-----\nAg==\n-----END PUBLIC KEY-----',
  '-----BEGIN PUBLIC KEY-----\n/w==\n-----END PUBLIC KEY-----',
  '-----BEGIN PRIVATE KEY-----\nAQ==\n-----END PRIVATE KEY-----',
].join('\n')

const pemUnsupportedOnly = '-----BEGIN PRIVATE KEY-----\nAQ==\n-----END PRIVATE KEY-----'
const pemInvalidBody = '-----BEGIN CERTIFICATE-----\n-----END CERTIFICATE-----'

let digestSpy: ReturnType<typeof vi.spyOn> | null = null

const assertParsed = (result: Awaited<ReturnType<typeof parseCertificateInput>>) => {
  expect(result.state).toBe('parsed')
  if (result.state !== 'parsed') {
    throw new Error('Expected parsed state')
  }
  return result
}

beforeEach(() => {
  const digestMock = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
  try {
    digestSpy = vi.spyOn(globalThis.crypto.subtle, 'digest').mockImplementation(digestMock)
  } catch {
    vi.stubGlobal('crypto', { subtle: { digest: digestMock } })
  }
})

afterEach(() => {
  digestSpy?.mockRestore()
  digestSpy = null
  vi.unstubAllGlobals()
})

describe('parseCertificateInput', () => {
  it('returns empty state for blank input', async () => {
    const result = await parseCertificateInput('   ', messages)
    expect(result.state).toBe('empty')
  })

  it('parses PEM blocks with mixed entries and warnings', async () => {
    const result = await parseCertificateInput(pemMixed, messages)
    const parsed = assertParsed(result)
    expect(parsed.entries).toHaveLength(2)
    expect(parsed.warnings).toHaveLength(3)
    expect(parsed.warnings.join(' | ')).toContain('Parse failed')
    expect(parsed.warnings.join(' | ')).toContain('Unsupported PRIVATE KEY')

    const certificate = parsed.entries[0]
    if (!certificate || certificate.type !== 'certificate') {
      throw new Error('Expected a certificate entry')
    }
    expect(certificate.label).toBe('Certificate 1')
    expect(certificate.serialNumber).toBe('01:02')
    expect(certificate.signatureAlgorithm).toBe('RSA-PSS (SHA-256)')
    expect(certificate.publicKeyAlgorithm).toBe('RSA')
    expect(certificate.publicKeySize).toBe(2048)
    expect(certificate.extensions.subjectAlternativeNames).toEqual(['DNS: example.com'])
    expect(certificate.extensions.keyUsage).toEqual(['Digital Signature', 'Key Encipherment'])
    expect(certificate.extensions.extendedKeyUsage).toEqual([
      'TLS Web Server Authentication',
      '1.2.3.4',
    ])
    expect(certificate.extensions.basicConstraints).toBe('CA: true, Path Length: 1')
    expect(certificate.extensions.subjectKeyIdentifier).toBe('01:02')
    expect(certificate.extensions.authorityKeyIdentifier).toBe('AB:CD')

    const publicKey = parsed.entries[1]
    if (!publicKey || publicKey.type !== 'publicKey') {
      throw new Error('Expected a public key entry')
    }
    expect(publicKey.label).toBe('Public Key 1')
  })

  it('throws the first warning when only unsupported PEM blocks are provided', async () => {
    await expect(parseCertificateInput(pemUnsupportedOnly, messages)).rejects.toThrow(
      'Unsupported PRIVATE KEY',
    )
  })

  it('throws when PEM has no valid blocks', async () => {
    await expect(parseCertificateInput(pemInvalidBody, messages)).rejects.toThrow('Invalid PEM')
  })

  it('parses base64 DER as certificate when certificate succeeds', async () => {
    const result = await parseCertificateInput('AQ==', messages)
    const parsed = assertParsed(result)
    expect(parsed.entries[0]?.type).toBe('certificate')
  })

  it('falls back to public key when certificate parsing fails', async () => {
    const result = await parseCertificateInput('AA==', messages)
    const parsed = assertParsed(result)
    expect(parsed.entries[0]?.type).toBe('publicKey')
    expect(parsed.entries[0]?.label).toBe('Certificate 1')
    if (parsed.entries[0]?.type === 'publicKey') {
      expect(parsed.entries[0].algorithm).toBe('RSA')
    }
  })

  it('uses not available when public key algorithm is missing', async () => {
    const result = await parseCertificateInput('Aw==', messages)
    const parsed = assertParsed(result)
    expect(parsed.entries[0]?.type).toBe('publicKey')
    if (parsed.entries[0]?.type === 'publicKey') {
      expect(parsed.entries[0].algorithm).toBe('Not available')
    }
  })

  it('omits key usage when the extension resolves to an empty list', async () => {
    const result = await parseCertificateInput('BA==', messages)
    const parsed = assertParsed(result)
    const entry = parsed.entries[0]

    if (!entry || entry.type !== 'certificate') {
      throw new Error('Expected a certificate entry')
    }

    expect(entry.extensions.keyUsage).toBeUndefined()
    expect(entry.extensions.extendedKeyUsage).toEqual(['TLS Web Server Authentication', '1.2.3.4'])
  })

  it('omits extended key usage when the extension has no usages', async () => {
    const result = await parseCertificateInput('BQ==', messages)
    const parsed = assertParsed(result)
    const entry = parsed.entries[0]

    if (!entry || entry.type !== 'certificate') {
      throw new Error('Expected a certificate entry')
    }

    expect(entry.extensions.extendedKeyUsage).toBeUndefined()
    expect(entry.extensions.keyUsage).toEqual(['Digital Signature', 'Key Encipherment'])
  })

  it('omits optional extension fields when extension values are absent', async () => {
    const result = await parseCertificateInput('Bg==', messages)
    const parsed = assertParsed(result)
    const entry = parsed.entries[0]

    if (!entry || entry.type !== 'certificate') {
      throw new Error('Expected a certificate entry')
    }

    expect(entry.extensions.subjectAlternativeNames).toBeUndefined()
    expect(entry.extensions.basicConstraints).toBeUndefined()
    expect(entry.extensions.subjectKeyIdentifier).toBeUndefined()
    expect(entry.extensions.authorityKeyIdentifier).toBeUndefined()
  })

  it('throws when base64 DER cannot be parsed', async () => {
    await expect(parseCertificateInput('/w==', messages)).rejects.toThrow('Parse failed')
  })

  it('parses PEM file inputs', async () => {
    const file = new File([pemMixed], 'input.pem', { type: 'application/x-pem-file' })
    const result = await parseCertificateInput(file, messages)
    const parsed = assertParsed(result)
    expect(parsed.entries).toHaveLength(2)
  })

  it('parses DER file inputs and uses filename for labels', async () => {
    const file = new File([new Uint8Array([0x00])], 'input.der', {
      type: 'application/octet-stream',
    })
    const result = await parseCertificateInput(file, messages)
    const parsed = assertParsed(result)
    expect(parsed.entries[0]?.label).toBe('input.der')
  })

  it('falls back to a generated label when DER file name is empty', async () => {
    const file = new File([new Uint8Array([0x00])], '', {
      type: 'application/octet-stream',
    })
    const result = await parseCertificateInput(file, messages)
    const parsed = assertParsed(result)
    expect(parsed.entries[0]?.label).toBe('Certificate 1')
  })

  it('throws for invalid text input', async () => {
    await expect(parseCertificateInput('not-a-cert', messages)).rejects.toThrow('Invalid input')
  })
})
