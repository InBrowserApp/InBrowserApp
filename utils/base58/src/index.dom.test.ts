import { describe, it, expect } from 'vitest'
import { decodeBase58, encodeBase58, isValidBase58 } from './index'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

describe('encodeBase58', () => {
  it('encodes known values', () => {
    expect(encodeBase58(encoder.encode(''))).toBe('')
    expect(encodeBase58(encoder.encode('Hello World'))).toBe('JxF12TrwUP45BMd')
    expect(encodeBase58(encoder.encode('hello world'))).toBe('StV1DL6CwTryKyV')
  })

  it('encodes ArrayBuffer input', () => {
    const bytes = encoder.encode('hello world')
    expect(encodeBase58(bytes.buffer)).toBe('StV1DL6CwTryKyV')
  })

  it('preserves leading zero bytes', () => {
    expect(encodeBase58(new Uint8Array([0]))).toBe('1')
    expect(encodeBase58(new Uint8Array([0, 0]))).toBe('11')
  })
})

describe('decodeBase58', () => {
  it('decodes known values', () => {
    expect(decoder.decode(decodeBase58('JxF12TrwUP45BMd'))).toBe('Hello World')
    expect(decoder.decode(decodeBase58('StV1DL6CwTryKyV'))).toBe('hello world')
  })

  it('accepts whitespace and leading zeros', () => {
    expect(decoder.decode(decodeBase58('StV1 DL6CwTryKyV'))).toBe('hello world')
    expect(Array.from(decodeBase58('11'))).toEqual([0, 0])
  })

  it('rejects invalid characters', () => {
    expect(() => decodeBase58('0OIl')).toThrow('Invalid Base58 character')
  })
})

describe('isValidBase58', () => {
  it('returns true for valid Base58', () => {
    expect(isValidBase58('')).toBe(true)
    expect(isValidBase58('JxF12TrwUP45BMd')).toBe(true)
    expect(isValidBase58('StV1 DL6CwTryKyV')).toBe(true)
  })

  it('returns false for invalid Base58', () => {
    expect(isValidBase58('0OIl')).toBe(false)
  })
})
