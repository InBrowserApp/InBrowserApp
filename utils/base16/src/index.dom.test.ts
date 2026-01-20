import { describe, it, expect } from 'vitest'
import { decodeBase16, encodeBase16, isValidBase16 } from './index'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

describe('encodeBase16', () => {
  it('encodes text to hex', () => {
    expect(encodeBase16(encoder.encode(''))).toBe('')
    expect(encodeBase16(encoder.encode('f'))).toBe('66')
    expect(encodeBase16(encoder.encode('foo'))).toBe('666F6F')
    expect(encodeBase16(encoder.encode('foobar'))).toBe('666F6F626172')
  })

  it('accepts ArrayBuffer input', () => {
    const buffer = encoder.encode('hi').buffer
    expect(encodeBase16(buffer)).toBe('6869')
  })
})

describe('decodeBase16', () => {
  it('decodes hex back to text', () => {
    expect(decoder.decode(decodeBase16('66'))).toBe('f')
    expect(decoder.decode(decodeBase16('666F6F'))).toBe('foo')
    expect(decoder.decode(decodeBase16('666F6F626172'))).toBe('foobar')
  })

  it('accepts lowercase, whitespace, and 0x prefix', () => {
    expect(decoder.decode(decodeBase16('0x666f6f'))).toBe('foo')
    expect(decoder.decode(decodeBase16('66 6f 6f'))).toBe('foo')
    expect(decoder.decode(decodeBase16('66\n6F\n6f'))).toBe('foo')
  })

  it('rejects invalid length or characters', () => {
    expect(() => decodeBase16('F')).toThrow('Invalid hex length')
    expect(() => decodeBase16('ZZ')).toThrow('Invalid hex character')
  })
})

describe('isValidBase16', () => {
  it('returns true for valid hex', () => {
    expect(isValidBase16('')).toBe(true)
    expect(isValidBase16('666F6F')).toBe(true)
    expect(isValidBase16('0x666f6f')).toBe(true)
    expect(isValidBase16('66 6f 6f')).toBe(true)
  })

  it('returns false for invalid hex', () => {
    expect(isValidBase16('F')).toBe(false)
    expect(isValidBase16('GG')).toBe(false)
  })
})
