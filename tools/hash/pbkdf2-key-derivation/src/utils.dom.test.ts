import { describe, it, expect, beforeAll } from 'vitest'
import { webcrypto } from 'node:crypto'
import {
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  derivePbkdf2,
  isValidBase64,
  normalizeBase64Input,
  saltToBytes,
} from './utils'

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

describe('pbkdf2 utils', () => {
  it('normalizes base64 input', () => {
    expect(normalizeBase64Input(' YWJj\nZA== ')).toBe('YWJjZA==')
    expect(normalizeBase64Input('YWJjZA-_')).toBe('YWJjZA+/')
  })

  it('decodes base64 input', () => {
    const bytes = decodeBase64('c2FsdA==')
    const text = new TextDecoder().decode(bytes)
    expect(text).toBe('salt')
  })

  it('rejects invalid base64 length', () => {
    expect(() => decodeBase64('abcde')).toThrow('Invalid base64 length')
  })

  it('validates base64 input', () => {
    expect(isValidBase64('c2FsdA==')).toBe(true)
    expect(isValidBase64('@@@')).toBe(false)
  })

  it('converts salt to bytes for hex, base64, utf-8, and file', async () => {
    const hexBytes = await saltToBytes('0a0b', 'hex')
    expect(hexBytes).toEqual(new Uint8Array([0x0a, 0x0b]))

    const base64Bytes = await saltToBytes('AQID', 'base64')
    expect(base64Bytes).toEqual(new Uint8Array([1, 2, 3]))

    const utf8Bytes = await saltToBytes('salt', 'utf-8')
    expect(new TextDecoder().decode(utf8Bytes)).toBe('salt')

    const file = new File([new Uint8Array([4, 5, 6])], 'salt.bin')
    const fileBytes = await saltToBytes(file, 'utf-8')
    expect(fileBytes).toEqual(new Uint8Array([4, 5, 6]))
  })

  it('formats bytes as hex and base64', () => {
    expect(bytesToHex(new Uint8Array())).toBe('')
    expect(bytesToHex(new Uint8Array([0, 15, 255]))).toBe('000fff')
    expect(bytesToBase64(new Uint8Array())).toBe('')
    expect(bytesToBase64(new Uint8Array([1, 2, 3]))).toBe('AQID')
  })

  it('derives a pbkdf2 key', async () => {
    const derived = await derivePbkdf2({
      password: 'password',
      salt: 'salt',
      saltFormat: 'utf-8',
      iterations: 1,
      lengthBytes: 32,
      hash: 'SHA-256',
    })

    expect(bytesToHex(derived)).toBe(
      '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b',
    )
  })

  it('throws on invalid pbkdf2 parameters', async () => {
    await expect(
      derivePbkdf2({
        password: 'password',
        salt: 'salt',
        saltFormat: 'utf-8',
        iterations: 0,
        lengthBytes: 32,
        hash: 'SHA-256',
      }),
    ).rejects.toThrow('Invalid PBKDF2 parameters')
  })
})
