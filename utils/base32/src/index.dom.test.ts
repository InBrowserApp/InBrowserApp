import { describe, it, expect } from 'vitest'
import { decodeBase32, encodeBase32, isValidBase32 } from './index'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

describe('encodeBase32', () => {
  it('encodes known RFC 4648 values', () => {
    expect(encodeBase32(encoder.encode(''))).toBe('')
    expect(encodeBase32(encoder.encode('f'))).toBe('MY======')
    expect(encodeBase32(encoder.encode('fo'))).toBe('MZXQ====')
    expect(encodeBase32(encoder.encode('foo'))).toBe('MZXW6===')
    expect(encodeBase32(encoder.encode('foob'))).toBe('MZXW6YQ=')
    expect(encodeBase32(encoder.encode('fooba'))).toBe('MZXW6YTB')
    expect(encodeBase32(encoder.encode('foobar'))).toBe('MZXW6YTBOI======')
  })

  it('can omit padding', () => {
    expect(encodeBase32(encoder.encode('f'), { padding: false })).toBe('MY')
    expect(encodeBase32(encoder.encode('foo'), { padding: false })).toBe('MZXW6')
  })
})

describe('decodeBase32', () => {
  it('decodes known RFC 4648 values', () => {
    expect(decoder.decode(decodeBase32('MY======'))).toBe('f')
    expect(decoder.decode(decodeBase32('MZXQ===='))).toBe('fo')
    expect(decoder.decode(decodeBase32('MZXW6==='))).toBe('foo')
    expect(decoder.decode(decodeBase32('MZXW6YQ='))).toBe('foob')
    expect(decoder.decode(decodeBase32('MZXW6YTB'))).toBe('fooba')
    expect(decoder.decode(decodeBase32('MZXW6YTBOI======'))).toBe('foobar')
  })

  it('accepts lowercase, whitespace, and missing padding', () => {
    expect(decoder.decode(decodeBase32('my'))).toBe('f')
    expect(decoder.decode(decodeBase32('mzxw6==='))).toBe('foo')
    expect(decoder.decode(decodeBase32('MZXW6'))).toBe('foo')
    expect(decoder.decode(decodeBase32('MZXW6 YQ='))).toBe('foob')
  })

  it('rejects invalid characters and padding', () => {
    expect(() => decodeBase32('M1======')).toThrow('Invalid Base32 character')
    expect(() => decodeBase32('MY===')).toThrow(/Invalid Base32/)
    expect(() => decodeBase32('M')).toThrow(/Invalid Base32/)
  })
})

describe('isValidBase32', () => {
  it('returns true for valid Base32', () => {
    expect(isValidBase32('')).toBe(true)
    expect(isValidBase32('MZXW6===')).toBe(true)
    expect(isValidBase32('mzxw6')).toBe(true)
    expect(isValidBase32('MZXW6 YQ=')).toBe(true)
  })

  it('returns false for invalid Base32', () => {
    expect(isValidBase32('MZXW6====')).toBe(false)
    expect(isValidBase32('MZXW6=')).toBe(false)
    expect(isValidBase32('M1')).toBe(false)
  })
})
