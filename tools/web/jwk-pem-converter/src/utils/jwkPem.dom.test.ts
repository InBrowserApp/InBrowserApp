import { describe, it, expect, beforeAll, vi } from 'vitest'
import { webcrypto, generateKeyPairSync } from 'node:crypto'
import * as ed25519 from '@noble/ed25519'
import * as jwkPemUtils from './jwkPem'
import {
  base64UrlToBytes,
  bytesToBase64Url,
  isBase64Input,
  jwkToPem,
  parseJwkJson,
  parsePemBlocks,
  pemToJwk,
  wrapPem,
  JwkPemError,
  __test__,
} from './jwkPem'

beforeAll(() => {
  const globalWithCrypto = globalThis as { crypto?: Crypto }
  if (globalWithCrypto.crypto !== webcrypto) {
    try {
      Object.defineProperty(globalWithCrypto, 'crypto', {
        value: webcrypto,
        configurable: true,
      })
    } catch {
      globalWithCrypto.crypto = webcrypto as Crypto
    }
  }
})

const testUtils = __test__
const stripPem = (pem: string) => pem.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----|\s+/g, '')
const toBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64')

describe('jwkPem utilities', () => {
  it('round-trips base64url encoding', () => {
    const input = new Uint8Array([1, 2, 3, 250, 251, 252])
    const encoded = bytesToBase64Url(input)
    const decoded = base64UrlToBytes(encoded)
    expect(decoded).toEqual(input)
  })

  it('parses PEM blocks', () => {
    const der = new Uint8Array([1, 2, 3, 4])
    const pem = wrapPem('PUBLIC KEY', der)
    const blocks = parsePemBlocks(pem)
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.label).toBe('PUBLIC KEY')
    expect(blocks[0]?.der).toEqual(der)
  })

  it('skips malformed PEM blocks', () => {
    const emptyBlock = '-----BEGIN TEST-----\n-----END TEST-----'
    const invalidBlock = '-----BEGIN TEST-----\n@@@\n-----END TEST-----'
    expect(parsePemBlocks(`${emptyBlock}\n${invalidBlock}`)).toEqual([])
  })

  it('treats blank values as non-base64 input', () => {
    expect(isBase64Input('   ')).toBe(false)
  })

  it('wraps empty PEM payloads', () => {
    const pem = wrapPem('TEST', new Uint8Array())
    expect(pem).toContain('BEGIN TEST')
  })

  it('converts Ed25519 JWK to PEM and back', async () => {
    const privateKey = ed25519.utils.randomSecretKey()
    const publicKey = await ed25519.getPublicKeyAsync(privateKey)
    const jwk = {
      kty: 'OKP',
      crv: 'Ed25519',
      x: bytesToBase64Url(publicKey),
      d: bytesToBase64Url(privateKey),
    } as const

    const privatePem = await jwkToPem(jwk, 'private')
    const privateResult = await pemToJwk(privatePem)
    const privateJwk = privateResult.jwk as JsonWebKey
    expect(privateJwk.kty).toBe('OKP')
    expect(privateJwk.crv).toBe('Ed25519')
    expect(privateJwk.x).toBe(jwk.x)
    expect(privateJwk.d).toBe(jwk.d)

    const publicPem = await jwkToPem(jwk, 'public')
    const publicResult = await pemToJwk(publicPem)
    const publicJwk = publicResult.jwk as JsonWebKey
    expect(publicJwk.kty).toBe('OKP')
    expect(publicJwk.crv).toBe('Ed25519')
    expect(publicJwk.x).toBe(jwk.x)
    expect(publicJwk.d).toBeUndefined()
  })

  it('converts RSA JWK to PEM and back with WebCrypto', async () => {
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    )
    const jwk = (await webcrypto.subtle.exportKey('jwk', keyPair.privateKey)) as JsonWebKey
    const pem = await jwkToPem(jwk, 'private')
    const result = await pemToJwk(pem)
    const parsed = result.jwk as JsonWebKey
    expect(parsed.kty).toBe('RSA')
    expect(parsed.n).toBe(jwk.n)
    expect(parsed.e).toBe(jwk.e)
    expect(parsed.d).toBeDefined()
  })

  it('converts EC JWK to PEM and back with WebCrypto', async () => {
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign', 'verify'],
    )
    const jwk = (await webcrypto.subtle.exportKey('jwk', keyPair.privateKey)) as JsonWebKey
    const pem = await jwkToPem(jwk, 'private')
    const result = await pemToJwk(pem)
    const parsed = result.jwk as JsonWebKey
    expect(parsed.kty).toBe('EC')
    expect(parsed.crv).toBe('P-256')
    expect(parsed.x).toBe(jwk.x)
    expect(parsed.y).toBe(jwk.y)
    expect(parsed.d).toBeDefined()
  })

  it('converts EC public keys from SPKI', async () => {
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign', 'verify'],
    )
    const jwk = (await webcrypto.subtle.exportKey('jwk', keyPair.publicKey)) as JsonWebKey
    const pem = await jwkToPem(jwk, 'public')
    const result = await pemToJwk(pem)
    const parsed = result.jwk as JsonWebKey
    expect(parsed.kty).toBe('EC')
    expect(parsed.crv).toBe('P-256')
    expect(parsed.x).toBe(jwk.x)
    expect(parsed.y).toBe(jwk.y)
    expect(parsed.d).toBeUndefined()
  })

  it('returns JWK Set for multiple PEM blocks', async () => {
    const privateKey = ed25519.utils.randomSecretKey()
    const publicKey = await ed25519.getPublicKeyAsync(privateKey)
    const okpJwk = {
      kty: 'OKP',
      crv: 'Ed25519',
      x: bytesToBase64Url(publicKey),
      d: bytesToBase64Url(privateKey),
    } as const

    const okpPem = await jwkToPem(okpJwk, 'public')
    const rsaKeyPair = await webcrypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    )
    const rsaPublic = (await webcrypto.subtle.exportKey('jwk', rsaKeyPair.publicKey)) as JsonWebKey
    const rsaPem = await jwkToPem(rsaPublic, 'public')

    const result = await pemToJwk(`${okpPem}\n${rsaPem}`)
    expect('keys' in result.jwk).toBe(true)
    if ('keys' in result.jwk) {
      expect(result.jwk.keys).toHaveLength(2)
    }
  })

  it('reports warnings for unsupported PEM blocks', async () => {
    const privateKey = ed25519.utils.randomSecretKey()
    const publicKey = await ed25519.getPublicKeyAsync(privateKey)
    const jwk = {
      kty: 'OKP',
      crv: 'Ed25519',
      x: bytesToBase64Url(publicKey),
      d: bytesToBase64Url(privateKey),
    } as const

    const okpPem = await jwkToPem(jwk, 'public')
    const unsupported = wrapPem('CERTIFICATE', new Uint8Array([1, 2, 3]))
    const result = await pemToJwk(`${okpPem}\n${unsupported}`)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]?.key).toBe('errorUnsupportedPemLabel')
  })

  it('converts base64-encoded PKCS8 and SPKI input', async () => {
    const privateKey = ed25519.utils.randomSecretKey()
    const publicKey = await ed25519.getPublicKeyAsync(privateKey)
    const jwk = {
      kty: 'OKP',
      crv: 'Ed25519',
      x: bytesToBase64Url(publicKey),
      d: bytesToBase64Url(privateKey),
    } as const

    const privatePem = await jwkToPem(jwk, 'private')
    const publicPem = await jwkToPem(jwk, 'public')

    const privateResult = await pemToJwk(stripPem(privatePem))
    const publicResult = await pemToJwk(stripPem(publicPem))

    expect(privateResult.jwk).toMatchObject({ kty: 'OKP', crv: 'Ed25519' })
    expect(publicResult.jwk).toMatchObject({ kty: 'OKP', crv: 'Ed25519' })
  })

  it('rejects unknown DER input', async () => {
    const unknownDer = new Uint8Array([0x30, 0x03, 0x04, 0x01, 0x00])
    await expect(pemToJwk(toBase64(unknownDer))).rejects.toMatchObject({
      key: 'errorInvalidPem',
    })
  })

  it('reports unsupported algorithms in mixed PEM input', async () => {
    const samplePem = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`
    const unknownAlg = testUtils.encodeSequence(testUtils.encodeOid('1.2.3.4'))
    const spkiUnknown = testUtils.encodeSequence(
      unknownAlg,
      testUtils.encodeBitString(new Uint8Array([1])),
    )
    const pkcs8Unknown = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      testUtils.encodeSequence(testUtils.encodeOid('1.2.3.4')),
      testUtils.encodeOctetString(new Uint8Array([1])),
    )

    const result = await pemToJwk(
      [samplePem, wrapPem('PUBLIC KEY', spkiUnknown), wrapPem('PRIVATE KEY', pkcs8Unknown)].join(
        '\n',
      ),
    )

    const warningKeys = result.warnings.map((warning) => warning.key)
    expect(warningKeys.filter((key) => key === 'errorUnsupportedAlgorithm')).toHaveLength(2)
  })

  it('converts PKCS1 RSA PEM blocks', async () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 1024,
      publicExponent: 0x10001,
    })
    const pkcs1Private = privateKey.export({ format: 'pem', type: 'pkcs1' }).toString()
    const pkcs1Public = publicKey.export({ format: 'pem', type: 'pkcs1' }).toString()

    const privateResult = await pemToJwk(pkcs1Private)
    expect(privateResult.jwk).toMatchObject({ kty: 'RSA' })
    if (!('keys' in privateResult.jwk)) {
      expect(privateResult.jwk.d).toBeDefined()
    }

    const publicResult = await pemToJwk(pkcs1Public)
    expect(publicResult.jwk).toMatchObject({ kty: 'RSA' })
    if (!('keys' in publicResult.jwk)) {
      expect(publicResult.jwk.d).toBeUndefined()
    }
  })

  it('converts SEC1 EC private keys', async () => {
    const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const sec1Pem = privateKey.export({ format: 'pem', type: 'sec1' }).toString()
    const result = await pemToJwk(sec1Pem)
    expect(result.jwk).toMatchObject({ kty: 'EC', crv: 'P-256' })
  })

  it('rejects PEM input with no valid blocks', async () => {
    const unsupported = wrapPem('CERTIFICATE', new Uint8Array([1, 2, 3]))
    await expect(pemToJwk(unsupported)).rejects.toMatchObject({ key: 'errorInvalidPem' })
  })

  it('rejects invalid PEM text that is not base64', async () => {
    await expect(pemToJwk('---')).rejects.toMatchObject({ key: 'errorInvalidPem' })
  })

  it('records warnings for unexpected conversion errors', async () => {
    const spy = vi
      .spyOn(jwkPemUtils, 'parsePemBlocks')
      .mockReturnValue([{ label: null as unknown as string, der: new Uint8Array() }])

    await expect(pemToJwk('ignored')).rejects.toMatchObject({ key: 'errorInvalidPem' })

    spy.mockRestore()
  })

  it('keeps valid keys when unexpected conversion errors occur', async () => {
    const samplePem = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`
    const okpAlg = testUtils.encodeSequence(testUtils.encodeOid('1.3.101.112'))
    const badPrivateKey = new Uint8Array([1, 2, 3])
    const inner = testUtils.encodeOctetString(badPrivateKey)
    const pkcs8 = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      okpAlg,
      testUtils.encodeOctetString(inner),
    )
    const badPem = wrapPem('PRIVATE KEY', pkcs8)

    const result = await pemToJwk(`${samplePem}\n${badPem}`)
    expect(result.warnings[0]?.key).toBe('errorUnsupportedPemLabel')
    expect(result.jwk).toMatchObject({ kty: 'OKP' })
  })

  it('rejects unsupported EC curves', async () => {
    const coord = bytesToBase64Url(new Uint8Array(32))
    const jwk = {
      kty: 'EC',
      crv: 'P-256K',
      x: coord,
      y: coord,
    } as const

    await expect(jwkToPem(jwk, 'public')).rejects.toMatchObject({
      key: 'errorUnsupportedCurve',
    })
  })

  it('rejects missing key material in JWK inputs', async () => {
    await expect(jwkToPem({} as JsonWebKey, 'public')).rejects.toMatchObject({
      key: 'errorMissingField',
    })
    await expect(jwkToPem({ kty: 'RSA' } as JsonWebKey, 'public')).rejects.toMatchObject({
      key: 'errorMissingField',
    })
    await expect(
      jwkToPem({ kty: 'RSA', n: 'a', e: 'b' } as JsonWebKey, 'private'),
    ).rejects.toMatchObject({
      key: 'errorMissingPrivateKey',
    })
    await expect(
      jwkToPem({ kty: 'EC', x: 'a', y: 'b' } as JsonWebKey, 'public'),
    ).rejects.toMatchObject({
      key: 'errorMissingField',
    })
    await expect(
      jwkToPem({ kty: 'EC', crv: 'P-256' } as JsonWebKey, 'public'),
    ).rejects.toMatchObject({
      key: 'errorMissingPublicKey',
    })
    await expect(
      jwkToPem({ kty: 'EC', crv: 'P-256', x: 'a', y: 'b' } as JsonWebKey, 'private'),
    ).rejects.toMatchObject({
      key: 'errorMissingPrivateKey',
    })
    await expect(jwkToPem({ kty: 'OKP' } as JsonWebKey, 'public')).rejects.toMatchObject({
      key: 'errorMissingField',
    })
    await expect(
      jwkToPem({ kty: 'OKP', crv: 'Nope', x: 'a' } as JsonWebKey, 'public'),
    ).rejects.toMatchObject({
      key: 'errorUnsupportedCurve',
    })
    await expect(
      jwkToPem({ kty: 'OKP', crv: 'Ed25519' } as JsonWebKey, 'public'),
    ).rejects.toMatchObject({
      key: 'errorMissingPublicKey',
    })
    await expect(
      jwkToPem({ kty: 'OKP', crv: 'Ed25519' } as JsonWebKey, 'private'),
    ).rejects.toMatchObject({
      key: 'errorMissingPrivateKey',
    })
  })

  it('fails to export minimal RSA private keys without CRT params', async () => {
    const minimalRsa = {
      kty: 'RSA',
      n: 'AQAB',
      e: 'AQAB',
      d: 'AQAB',
    }
    await expect(jwkToPem(minimalRsa as JsonWebKey, 'private')).rejects.toMatchObject({
      key: 'errorWebCryptoFailed',
    })
  })

  it('reports WebCrypto failures and missing WebCrypto', async () => {
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    )
    const publicJwk = (await webcrypto.subtle.exportKey('jwk', keyPair.publicKey)) as JsonWebKey
    await expect(
      testUtils.exportDerFromJwk(publicJwk, 'public', { name: 'AES-GCM' } as Algorithm),
    ).rejects.toMatchObject({
      key: 'errorWebCryptoFailed',
    })

    const spki = testUtils.encodeSequence(
      testUtils.encodeSequence(testUtils.encodeOid('1.2.840.113549.1.1.1'), testUtils.encodeNull()),
      testUtils.encodeBitString(new Uint8Array([1, 2, 3])),
    )
    await expect(pemToJwk(wrapPem('PUBLIC KEY', spki))).rejects.toMatchObject({
      key: 'errorInvalidPem',
    })

    const globalWithCrypto = globalThis as { crypto?: Crypto }
    const originalCrypto = globalWithCrypto.crypto
    try {
      try {
        Object.defineProperty(globalWithCrypto, 'crypto', {
          value: undefined,
          configurable: true,
        })
      } catch {
        globalWithCrypto.crypto = undefined
      }
      await expect(
        jwkToPem({ kty: 'RSA', n: 'a', e: 'b' } as JsonWebKey, 'public'),
      ).rejects.toMatchObject({
        key: 'errorWebCryptoUnavailable',
      })
    } finally {
      try {
        Object.defineProperty(globalWithCrypto, 'crypto', {
          value: originalCrypto,
          configurable: true,
        })
      } catch {
        globalWithCrypto.crypto = originalCrypto
      }
    }
  })

  it('rejects OKP private keys without derivable public keys', async () => {
    const privateKey = webcrypto.getRandomValues(new Uint8Array(32))
    const okpAlg = testUtils.encodeSequence(testUtils.encodeOid('1.3.101.110'))
    const inner = testUtils.encodeOctetString(privateKey)
    const pkcs8 = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      okpAlg,
      testUtils.encodeOctetString(inner),
    )

    await expect(testUtils.parseOkpPkcs8(pkcs8)).rejects.toMatchObject({
      key: 'errorOkpPublicKeyMissing',
    })
  })

  it('covers ASN.1 helper edge cases', () => {
    const smallInt = __test__.encodeInteger(1)
    expect(smallInt).toEqual(new Uint8Array([0x02, 0x01, 0x01]))

    const largeInt = __test__.encodeInteger(128)
    expect(largeInt).toEqual(new Uint8Array([0x02, 0x01, 0x80]))

    const nullValue = __test__.encodeNull()
    expect(nullValue).toEqual(new Uint8Array([0x05, 0x00]))

    const emptyBitString = __test__.extractBitString(new Uint8Array(), {
      tag: 0x03,
      length: 0,
      headerLength: 0,
      start: 0,
      valueStart: 0,
      valueEnd: 0,
      end: 0,
    })
    expect(emptyBitString).toEqual(new Uint8Array())
  })

  it('covers DER detection and OID helpers', () => {
    expect(testUtils.detectDerKeyType(testUtils.encodeSequence())).toBe('unknown')
    expect(testUtils.detectDerKeyType(testUtils.encodeSequence(testUtils.encodeInteger(0)))).toBe(
      'pkcs8',
    )
    expect(testUtils.detectDerKeyType(testUtils.encodeSequence(testUtils.encodeSequence()))).toBe(
      'spki',
    )
    expect(
      testUtils.detectDerKeyType(
        testUtils.encodeSequence(testUtils.encodeOctetString(new Uint8Array([1]))),
      ),
    ).toBe('unknown')

    expect(testUtils.decodeOid(new Uint8Array())).toBe('')
    expect(() => testUtils.encodeOid('1')).toThrow(JwkPemError)
    expect(testUtils.getKeyUsages({ name: 'AES-GCM' } as Algorithm, 'public')).toEqual([])

    const sec1 = testUtils.encodeSequence(testUtils.encodeInteger(1))
    expect(testUtils.extractSec1CurveOid(sec1)).toBeUndefined()
    expect(() => testUtils.buildPkcs8FromSec1(sec1)).toThrow(JwkPemError)

    const sec1BadOid = testUtils.encodeSequence(
      testUtils.encodeTag(0xa0, testUtils.encodeInteger(1)),
    )
    expect(testUtils.extractSec1CurveOid(sec1BadOid)).toBeUndefined()
  })

  it('rejects invalid ASN.1 structures', () => {
    expect(() => testUtils.readAsn1Element(new Uint8Array(), 0)).toThrow(JwkPemError)
    expect(() => testUtils.readAsn1Element(new Uint8Array([0x30]), 0)).toThrow(JwkPemError)
    expect(() => testUtils.readAsn1Element(new Uint8Array([0x30, 0x80]), 0)).toThrow(JwkPemError)
    expect(() => testUtils.readAsn1Element(new Uint8Array([0x30, 0x82, 0x01]), 0)).toThrow(
      JwkPemError,
    )
    expect(() => testUtils.readAsn1Element(new Uint8Array([0x30, 0x02, 0x01]), 0)).toThrow(
      JwkPemError,
    )

    const invalidChildren = new Uint8Array([0x30, 0x02, 0x02, 0x01, 0x00])
    const parent = testUtils.readAsn1Element(invalidChildren, 0)
    expect(() => testUtils.readAsn1Children(invalidChildren, parent)).toThrow(JwkPemError)

    expect(() => testUtils.parseAlgorithmIdentifier(new Uint8Array(), undefined)).toThrow(
      JwkPemError,
    )

    const notSequence = testUtils.encodeOctetString(new Uint8Array([1]))
    const notSequenceElement = testUtils.readAsn1Element(notSequence, 0)
    expect(() => testUtils.parseAlgorithmIdentifier(notSequence, notSequenceElement)).toThrow(
      JwkPemError,
    )

    const emptySequence = testUtils.encodeSequence()
    const emptyElement = testUtils.readAsn1Element(emptySequence, 0)
    expect(() => testUtils.parseAlgorithmIdentifier(emptySequence, emptyElement)).toThrow(
      JwkPemError,
    )

    const missingOid = testUtils.encodeSequence(testUtils.encodeInteger(1))
    const missingOidElement = testUtils.readAsn1Element(missingOid, 0)
    expect(() => testUtils.parseAlgorithmIdentifier(missingOid, missingOidElement)).toThrow(
      JwkPemError,
    )

    const nullParams = testUtils.encodeSequence(
      testUtils.encodeOid('1.2.840.113549.1.1.1'),
      testUtils.encodeNull(),
    )
    const nullParamsElement = testUtils.readAsn1Element(nullParams, 0)
    expect(testUtils.parseAlgorithmIdentifier(nullParams, nullParamsElement)).toEqual({
      oid: '1.2.840.113549.1.1.1',
    })
  })

  it('validates SPKI, PKCS8, and OKP structures', async () => {
    const unknownAlg = testUtils.encodeSequence(testUtils.encodeOid('1.2.3.4'))
    const spkiUnknown = testUtils.encodeSequence(
      unknownAlg,
      testUtils.encodeBitString(new Uint8Array([1])),
    )
    expect(testUtils.parseSpkiAlgorithm(spkiUnknown)).toEqual({
      type: 'Unknown',
      oid: '1.2.3.4',
    })

    const ecBadCurve = testUtils.encodeSequence(
      testUtils.encodeOid('1.2.840.10045.2.1'),
      testUtils.encodeOid('1.2.3.4'),
    )
    const spkiBadCurve = testUtils.encodeSequence(
      ecBadCurve,
      testUtils.encodeBitString(new Uint8Array([1])),
    )
    expect(() => testUtils.parseSpkiAlgorithm(spkiBadCurve)).toThrow(JwkPemError)

    const ecNoParams = testUtils.encodeSequence(testUtils.encodeOid('1.2.840.10045.2.1'))
    const spkiNoParams = testUtils.encodeSequence(
      ecNoParams,
      testUtils.encodeBitString(new Uint8Array([1])),
    )
    expect(() => testUtils.parseSpkiAlgorithm(spkiNoParams)).toThrow(JwkPemError)

    const pkcs8Unknown = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      testUtils.encodeSequence(testUtils.encodeOid('1.2.3.4')),
      testUtils.encodeOctetString(new Uint8Array([1])),
    )
    expect(testUtils.parsePkcs8Algorithm(pkcs8Unknown)).toEqual({
      type: 'Unknown',
      oid: '1.2.3.4',
    })

    const pkcs8BadCurve = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      testUtils.encodeSequence(
        testUtils.encodeOid('1.2.840.10045.2.1'),
        testUtils.encodeOid('1.2.3.4'),
      ),
      testUtils.encodeOctetString(new Uint8Array([1])),
    )
    expect(() => testUtils.parsePkcs8Algorithm(pkcs8BadCurve)).toThrow(JwkPemError)

    const pkcs8NoParams = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      ecNoParams,
      testUtils.encodeOctetString(new Uint8Array([1])),
    )
    expect(() => testUtils.parsePkcs8Algorithm(pkcs8NoParams)).toThrow(JwkPemError)

    const okpAlg = testUtils.encodeSequence(testUtils.encodeOid('1.3.101.112'))
    const okpSpkiBadKey = testUtils.encodeSequence(
      okpAlg,
      testUtils.encodeOctetString(new Uint8Array([1])),
    )
    expect(() => testUtils.parseOkpSpki(okpSpkiBadKey)).toThrow(JwkPemError)

    const rsaAlg = testUtils.encodeSequence(
      testUtils.encodeOid('1.2.840.113549.1.1.1'),
      testUtils.encodeNull(),
    )
    const okpSpkiWrongAlg = testUtils.encodeSequence(
      rsaAlg,
      testUtils.encodeBitString(new Uint8Array([1])),
    )
    expect(() => testUtils.parseOkpSpki(okpSpkiWrongAlg)).toThrow(JwkPemError)

    const pkcs8WrongAlg = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      rsaAlg,
      testUtils.encodeOctetString(new Uint8Array([1])),
    )
    await expect(testUtils.parseOkpPkcs8(pkcs8WrongAlg)).rejects.toThrow(JwkPemError)

    const pkcs8BadPrivate = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      okpAlg,
      testUtils.encodeBitString(new Uint8Array([1])),
    )
    await expect(testUtils.parseOkpPkcs8(pkcs8BadPrivate)).rejects.toThrow(JwkPemError)

    const pkcs8BadInner = testUtils.encodeSequence(
      testUtils.encodeInteger(0),
      okpAlg,
      testUtils.encodeOctetString(testUtils.encodeInteger(1)),
    )
    await expect(testUtils.parseOkpPkcs8(pkcs8BadInner)).rejects.toThrow(JwkPemError)

    const invalidPublic = testUtils.encodeTag(
      0xa1,
      testUtils.encodeOctetString(new Uint8Array([1])),
    )
    const wrapper = testUtils.encodeSequence(invalidPublic)
    const top = testUtils.readAsn1Element(wrapper, 0)
    const children = testUtils.readAsn1Children(wrapper, top)
    expect(testUtils.extractOkpPublicKey(children, wrapper)).toBeUndefined()

    const validPublic = testUtils.encodeTag(
      0xa1,
      testUtils.encodeBitString(new Uint8Array([1, 2, 3])),
    )
    const validWrapper = testUtils.encodeSequence(validPublic)
    const validTop = testUtils.readAsn1Element(validWrapper, 0)
    const validChildren = testUtils.readAsn1Children(validWrapper, validTop)
    expect(testUtils.extractOkpPublicKey(validChildren, validWrapper)).toEqual(
      new Uint8Array([1, 2, 3]),
    )
  })

  it('rejects invalid JWK inputs', () => {
    expect(() => parseJwkJson('{')).toThrow(JwkPemError)
    expect(() => parseJwkJson('null')).toThrow(JwkPemError)
    expect(() => parseJwkJson('{"keys": []}')).toThrow(JwkPemError)
  })
})
