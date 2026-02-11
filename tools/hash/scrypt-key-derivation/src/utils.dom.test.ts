import { describe, it, expect } from 'vitest'
import {
  MAX_SCRYPT_COST_BLOCK_PRODUCT,
  bytesToBase64,
  bytesToHex,
  decodeBase64,
  deriveScrypt,
  generateRandomSalt,
  getMaxBlockSizeForCostFactor,
  getMaxCostFactorForBlockSize,
  isScryptMemoryWithinLimit,
  isValidBase64,
  normalizeBase64Input,
  saltToBytes,
} from './utils'

describe('scrypt utils', () => {
  it('normalizes base64 input', () => {
    expect(normalizeBase64Input(' YWJj\nZA== ')).toBe('YWJjZA==')
    expect(normalizeBase64Input('YWJjZA-_')).toBe('YWJjZA+/')
  })

  it('decodes base64 input', () => {
    const bytes = decodeBase64('c2FsdA==')
    const text = new TextDecoder().decode(bytes)
    expect(text).toBe('salt')
  })

  it('returns empty bytes for blank base64 input', () => {
    expect(decodeBase64('')).toEqual(new Uint8Array())
    expect(decodeBase64(' \n\t ')).toEqual(new Uint8Array())
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

  it('generates random salt in selected formats', () => {
    const hexSalt = generateRandomSalt('hex')
    expect(hexSalt).toMatch(/^[a-f0-9]{32}$/)

    const base64Salt = generateRandomSalt('base64')
    expect(isValidBase64(base64Salt)).toBe(true)

    const utf8Salt = generateRandomSalt('utf-8')
    expect(utf8Salt.length).toBeGreaterThan(0)
  })

  it('computes scrypt memory safety bounds', () => {
    expect(MAX_SCRYPT_COST_BLOCK_PRODUCT).toBe(16777215)
    expect(getMaxCostFactorForBlockSize(16)).toBe(1048575)
    expect(getMaxBlockSizeForCostFactor(524288)).toBe(31)

    expect(isScryptMemoryWithinLimit(1048575, 16)).toBe(true)
    expect(isScryptMemoryWithinLimit(1048576, 16)).toBe(false)
    expect(isScryptMemoryWithinLimit(524288, 31)).toBe(true)
    expect(isScryptMemoryWithinLimit(524288, 32)).toBe(false)
  })

  it('derives a scrypt key', async () => {
    const derived = await deriveScrypt({
      password: 'password',
      salt: 'salt',
      saltFormat: 'utf-8',
      costFactor: 16,
      blockSize: 1,
      parallelism: 1,
      lengthBytes: 32,
    })

    expect(bytesToHex(derived)).toBe(
      '45133c3dfba48c82235df51a5349924110eee893752f0d4168d2e2aee5722d82',
    )
  })

  it('returns empty bytes when password is missing', async () => {
    await expect(
      deriveScrypt({
        password: '',
        salt: 'salt',
        saltFormat: 'utf-8',
        costFactor: 16,
        blockSize: 1,
        parallelism: 1,
        lengthBytes: 32,
      }),
    ).resolves.toEqual(new Uint8Array())
  })

  it('throws on invalid scrypt parameters', async () => {
    await expect(
      deriveScrypt({
        password: 'password',
        salt: 'salt',
        saltFormat: 'utf-8',
        costFactor: 15,
        blockSize: 1,
        parallelism: 1,
        lengthBytes: 32,
      }),
    ).rejects.toThrow('Invalid scrypt parameters')
  })

  it('throws when parameters exceed memory bounds', async () => {
    await expect(
      deriveScrypt({
        password: 'password',
        salt: 'salt',
        saltFormat: 'utf-8',
        costFactor: 1048576,
        blockSize: 16,
        parallelism: 1,
        lengthBytes: 32,
      }),
    ).rejects.toThrow('Invalid scrypt parameters')
  })
})
