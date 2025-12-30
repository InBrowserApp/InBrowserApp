import { describe, it, expect } from 'vitest'
import { decode, getVariant } from './decode'

describe('getVariant', () => {
  it('should return variant 1 for RFC 4122 UUIDs', () => {
    // Variant 1 UUIDs have variant byte 8-b
    expect(getVariant('550e8400-e29b-41d4-a716-446655440000')).toBe(1)
    expect(getVariant('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(1)
  })

  it('should return variant 0 for NCS backward compatibility', () => {
    // Variant 0 has variant byte 0-7
    expect(getVariant('00000000-0000-0000-0000-000000000000')).toBe(0)
  })
})

describe('decode', () => {
  it('should decode a valid v4 UUID', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const result = decode(uuid)

    expect(result.uuid).toBe(uuid)
    expect(result.version).toBe(4)
    expect(result.variant).toBe(1)
    expect(typeof result.base64).toBe('string')
    expect(typeof result.integer).toBe('bigint')
    expect(typeof result.octal).toBe('string')
    expect(typeof result.binary).toBe('string')
  })

  it('should decode a v1 UUID with timestamp and MAC', () => {
    // v1 UUID: time-based
    const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    const result = decode(uuid)

    expect(result.version).toBe(1)
    expect(result.macAddress).toBeDefined()
    expect(result.timestamp).toBeDefined()
    expect(typeof result.timestamp).toBe('number')
  })

  it('should set algorithm for v3 UUID', () => {
    // v3 UUID uses MD5
    const uuid = 'a3bb189e-8bf9-3888-9912-ace4e6543002'
    const result = decode(uuid)

    expect(result.version).toBe(3)
    expect(result.algorithm).toBe('md5')
  })

  it('should set algorithm for v5 UUID', () => {
    // v5 UUID uses SHA-1
    const uuid = '886313e1-3b8a-5372-9b90-0c9aee199e5d'
    const result = decode(uuid)

    expect(result.version).toBe(5)
    expect(result.algorithm).toBe('sha1')
  })

  it('should throw error for invalid UUID', () => {
    expect(() => decode('not-a-uuid')).toThrow('Invalid UUID')
    expect(() => decode('')).toThrow('Invalid UUID')
    expect(() => decode('12345')).toThrow('Invalid UUID')
  })

  it('should return correct base64 representation', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const result = decode(uuid)

    expect(result.base64).toBeTruthy()
    expect(typeof result.base64).toBe('string')
  })

  it('should return correct integer representation', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const result = decode(uuid)

    expect(result.integer).toBe(113059749145936325402354257176981405696n)
  })
})
