import { describe, it, expect } from 'vitest'
import { decodeBase85, encodeBase85, isValidBase85, type Base85Variant } from './index'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const ASCII85_HELLO_WORLD = '87cURD]i,"Ebo7'
const ASCII85_HELLO_WORLD_LOWER = 'BOu!rD]j7BEbo7'
const Z85_HELLO_WORLD = 'nm=QNz=Z<$y?aXj'

function toBytes(text: string): Uint8Array {
  return encoder.encode(text)
}

describe('encodeBase85', () => {
  it('encodes ASCII85 values and shorthand', () => {
    expect(encodeBase85(toBytes(''))).toBe('')
    expect(encodeBase85(toBytes('Hello World'))).toBe(ASCII85_HELLO_WORLD)
    expect(encodeBase85(toBytes('hello world'))).toBe(ASCII85_HELLO_WORLD_LOWER)
    expect(encodeBase85(new Uint8Array([0, 0, 0, 0]))).toBe('z')
    expect(encodeBase85(new Uint8Array([0, 0, 0, 0, 0]))).toBe('z!!')
    expect(encodeBase85(toBytes('foo'))).toBe('AoDS')
    expect(encodeBase85(toBytes('foo').buffer)).toBe('AoDS')
  })

  it('encodes Z85 values', () => {
    expect(encodeBase85(toBytes('HelloWorld!!'), { variant: 'z85' })).toBe(Z85_HELLO_WORLD)
    expect(encodeBase85(new Uint8Array([0, 0, 0, 0]), { variant: 'z85' })).toBe('00000')
  })

  it('rejects Z85 input with invalid length', () => {
    expect(() => encodeBase85(toBytes('hi'), { variant: 'z85' })).toThrow('Invalid Base85 length')
  })

  it('rejects invalid alphabets', () => {
    expect(() => encodeBase85(toBytes('hi'), { alphabet: '123' })).toThrow(
      'Invalid Base85 alphabet',
    )
    expect(() => encodeBase85(toBytes('hi'), { alphabet: 'a'.repeat(85) })).toThrow(
      'Invalid Base85 alphabet',
    )
  })
})

describe('decodeBase85', () => {
  it('decodes ASCII85 values and wrappers', () => {
    expect(decoder.decode(decodeBase85(ASCII85_HELLO_WORLD))).toBe('Hello World')
    expect(decoder.decode(decodeBase85(`<~${ASCII85_HELLO_WORLD}~>`))).toBe('Hello World')
    expect(Array.from(decodeBase85('z'))).toEqual([0, 0, 0, 0])
    expect(Array.from(decodeBase85('z!!'))).toEqual([0, 0, 0, 0, 0])
    expect(Array.from(decodeBase85(''))).toEqual([])
  })

  it('decodes with whitespace', () => {
    expect(decoder.decode(decodeBase85('87cURD ]i,"Ebo7'))).toBe('Hello World')
  })

  it('decodes Z85 values', () => {
    expect(decoder.decode(decodeBase85(Z85_HELLO_WORLD, { variant: 'z85' }))).toBe('HelloWorld!!')
  })

  it('rejects invalid ASCII85 input', () => {
    expect(() => decodeBase85('!')).toThrow('Invalid Base85 length')
    expect(() => decodeBase85('!!z')).toThrow('Invalid Base85 length')
    expect(() => decodeBase85('<~87cURD]i,"Ebo7')).toThrow('Invalid Base85 delimiter')
    expect(() => decodeBase85('v')).toThrow('Invalid Base85 character')
  })

  it('rejects invalid Z85 input', () => {
    expect(() => decodeBase85('abcd', { variant: 'z85' })).toThrow('Invalid Base85 length')
    expect(() => decodeBase85('@@@@@', { variant: 'z85', alphabet: '123' })).toThrow(
      'Invalid Base85 alphabet',
    )
  })
})

describe('isValidBase85', () => {
  it('returns true for valid inputs', () => {
    expect(isValidBase85(ASCII85_HELLO_WORLD)).toBe(true)
    expect(isValidBase85(Z85_HELLO_WORLD, { variant: 'z85' })).toBe(true)
  })

  it('returns false for invalid inputs', () => {
    const variant: Base85Variant = 'z85'
    expect(isValidBase85('abcd', { variant })).toBe(false)
    expect(isValidBase85('@@', { alphabet: '123' })).toBe(false)
  })
})
