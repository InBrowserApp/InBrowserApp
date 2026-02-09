import { describe, expect, it } from 'vitest'
import {
  decryptJweWithPassword,
  decryptJweWithRawKey,
  encryptJweWithPassword,
  encryptJweWithRawKey,
  getConfigFromJweEnc,
  isJweFormat,
  parseJweHeader,
} from './jwe'

const decoder = new TextDecoder()

function arrayBufferToString(buffer: ArrayBuffer): string {
  return decoder.decode(new Uint8Array(buffer))
}

describe('jwe password mode', () => {
  it('encrypts and decrypts with GCM + PBES2', async () => {
    const plaintext = 'JWE password round-trip GCM'
    const password = 'strong-password'

    const jwe = await encryptJweWithPassword(plaintext, password, 'GCM', 256, {
      iterations: 5000,
    })

    expect(isJweFormat(jwe)).toBe(true)
    const header = parseJweHeader(jwe)
    expect(header?.alg).toBe('PBES2-HS512+A256KW')
    expect(header?.enc).toBe('A256GCM')
    expect(typeof header?.p2c).toBe('number')
    expect(header?.p2c).toBeGreaterThan(0)

    const decrypted = await decryptJweWithPassword(jwe, password)
    expect(arrayBufferToString(decrypted)).toBe(plaintext)
  })

  it('encrypts and decrypts with CBC + PBES2', async () => {
    const plaintext = 'JWE password round-trip CBC'
    const password = 'cbc-password'

    const jwe = await encryptJweWithPassword(plaintext, password, 'CBC', 128)
    const decrypted = await decryptJweWithPassword(jwe, password)

    expect(arrayBufferToString(decrypted)).toBe(plaintext)
    expect(parseJweHeader(jwe)?.enc).toBe('A128CBC-HS256')
  })

  it('rejects CTR mode in JWE', async () => {
    await expect(encryptJweWithPassword('text', 'password', 'CTR', 128)).rejects.toThrow(
      'JWE format does not support CTR mode',
    )
  })

  it('fails when decrypting with a wrong password', async () => {
    const jwe = await encryptJweWithPassword('secret', 'correct-password', 'GCM', 128)
    await expect(decryptJweWithPassword(jwe, 'wrong-password')).rejects.toThrow()
  })
})

describe('jwe raw key mode', () => {
  it('encrypts and decrypts with direct GCM key', async () => {
    const plaintext = 'JWE raw key GCM'
    const keyHex = '11'.repeat(32)

    const jwe = await encryptJweWithRawKey(plaintext, keyHex, 'GCM', 256)
    const decrypted = await decryptJweWithRawKey(jwe, keyHex)

    expect(arrayBufferToString(decrypted)).toBe(plaintext)
    expect(parseJweHeader(jwe)?.alg).toBe('dir')
    expect(parseJweHeader(jwe)?.enc).toBe('A256GCM')
  })

  it('encrypts and decrypts with direct CBC key', async () => {
    const plaintext = 'JWE raw key CBC'
    const keyHex = 'aa'.repeat(32)

    const jwe = await encryptJweWithRawKey(plaintext, keyHex, 'CBC', 128)
    const decrypted = await decryptJweWithRawKey(jwe, keyHex)

    expect(arrayBufferToString(decrypted)).toBe(plaintext)
    expect(parseJweHeader(jwe)?.enc).toBe('A128CBC-HS256')
  })

  it('validates raw key length for GCM and CBC modes', async () => {
    await expect(encryptJweWithRawKey('text', '00'.repeat(8), 'GCM', 128)).rejects.toThrow(
      'Invalid key length: expected 16 bytes, got 8',
    )

    await expect(encryptJweWithRawKey('text', '00'.repeat(16), 'CBC', 128)).rejects.toThrow(
      'For CBC mode with raw key, expected 32 bytes (enc + mac key), got 16',
    )
  })

  it('rejects odd-length hex keys', async () => {
    await expect(encryptJweWithRawKey('text', 'abc', 'GCM', 128)).rejects.toThrow(
      'Invalid hex string',
    )
  })
})

describe('jwe helpers', () => {
  it('validates and parses compact format headers', async () => {
    const jwe = await encryptJweWithPassword('header-check', 'password', 'GCM', 128)

    expect(isJweFormat(jwe)).toBe(true)
    expect(parseJweHeader(jwe)).toMatchObject({
      alg: 'PBES2-HS256+A128KW',
      enc: 'A128GCM',
    })

    expect(isJweFormat('not-a-jwe')).toBe(false)
    expect(isJweFormat('a.b.c.d.e')).toBe(false)
    expect(parseJweHeader('not-a-jwe')).toBeNull()
    expect(parseJweHeader('a.b.c.d.e')).toBeNull()
  })

  it('maps known JWE enc values to AES config', () => {
    expect(getConfigFromJweEnc('A128GCM')).toEqual({ mode: 'GCM', keyLength: 128 })
    expect(getConfigFromJweEnc('A256CBC-HS512')).toEqual({ mode: 'CBC', keyLength: 256 })
    expect(getConfigFromJweEnc('UNKNOWN')).toBeNull()
  })
})
