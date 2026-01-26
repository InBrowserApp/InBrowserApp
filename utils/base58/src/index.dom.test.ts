import { describe, it, expect } from 'vitest'
import { decodeBase58, encodeBase58, isValidBase58, BASE58_ALPHABETS } from './index'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const BITCOIN_HELLO_WORLD = 'JxF12TrwUP45BMd'

function remapAlphabet(value: string, fromAlphabet: string, toAlphabet: string): string {
  return [...value]
    .map((char) => {
      const index = fromAlphabet.indexOf(char)
      if (index < 0) return ''
      return toAlphabet.charAt(index)
    })
    .join('')
}

describe('encodeBase58', () => {
  it('encodes known values', () => {
    expect(encodeBase58(encoder.encode(''))).toBe('')
    expect(encodeBase58(encoder.encode('Hello World'))).toBe(BITCOIN_HELLO_WORLD)
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

  it('encodes using alternate alphabets', () => {
    const flickr = remapAlphabet(
      BITCOIN_HELLO_WORLD,
      BASE58_ALPHABETS.bitcoin,
      BASE58_ALPHABETS.flickr,
    )
    const ripple = remapAlphabet(
      BITCOIN_HELLO_WORLD,
      BASE58_ALPHABETS.bitcoin,
      BASE58_ALPHABETS.ripple,
    )

    expect(encodeBase58(encoder.encode('Hello World'), { alphabet: BASE58_ALPHABETS.flickr })).toBe(
      flickr,
    )
    expect(encodeBase58(encoder.encode('Hello World'), { alphabet: BASE58_ALPHABETS.ripple })).toBe(
      ripple,
    )
  })

  it('rejects invalid alphabets', () => {
    const invalidLength = '123'
    const invalidDuplicate = '1'.repeat(58)

    expect(() => encodeBase58(encoder.encode('hello'), { alphabet: invalidLength })).toThrow(
      'Invalid Base58 alphabet',
    )
    expect(() => encodeBase58(encoder.encode('hello'), { alphabet: invalidDuplicate })).toThrow(
      'Invalid Base58 alphabet',
    )
  })
})

describe('decodeBase58', () => {
  it('decodes known values', () => {
    expect(decoder.decode(decodeBase58(BITCOIN_HELLO_WORLD))).toBe('Hello World')
    expect(decoder.decode(decodeBase58('StV1DL6CwTryKyV'))).toBe('hello world')
  })

  it('accepts whitespace and leading zeros', () => {
    expect(decoder.decode(decodeBase58('StV1 DL6CwTryKyV'))).toBe('hello world')
    expect(Array.from(decodeBase58('11'))).toEqual([0, 0])
  })

  it('decodes using alternate alphabets', () => {
    const flickr = remapAlphabet(
      BITCOIN_HELLO_WORLD,
      BASE58_ALPHABETS.bitcoin,
      BASE58_ALPHABETS.flickr,
    )

    expect(decoder.decode(decodeBase58(flickr, { alphabet: BASE58_ALPHABETS.flickr }))).toBe(
      'Hello World',
    )
  })

  it('rejects invalid characters', () => {
    expect(() => decodeBase58('0OIl')).toThrow('Invalid Base58 character')
  })

  it('rejects invalid alphabets', () => {
    const invalidLength = '123'
    const invalidDuplicate = '1'.repeat(58)

    expect(() => decodeBase58('1', { alphabet: invalidLength })).toThrow('Invalid Base58 alphabet')
    expect(() => decodeBase58('1', { alphabet: invalidDuplicate })).toThrow(
      'Invalid Base58 alphabet',
    )
  })
})

describe('isValidBase58', () => {
  it('returns true for valid Base58', () => {
    expect(isValidBase58('')).toBe(true)
    expect(isValidBase58(BITCOIN_HELLO_WORLD)).toBe(true)
    expect(isValidBase58('StV1 DL6CwTryKyV')).toBe(true)
  })

  it('returns false for invalid Base58', () => {
    expect(isValidBase58('0OIl')).toBe(false)
  })

  it('returns false for invalid alphabets', () => {
    expect(isValidBase58('1', { alphabet: '123' })).toBe(false)
  })
})
