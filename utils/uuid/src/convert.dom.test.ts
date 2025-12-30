import { describe, it, expect } from 'vitest'
import {
  uuidToBase64,
  uuidToInteger,
  uuidToDecimal,
  uuidToHex,
  uuidToOctal,
  uuidToBinary,
  base64ToUUID,
  integerToUUID,
  hexToUUID,
  octalToUUID,
  binaryToUUID,
  decimalToUUID,
} from './convert'

// Test UUID: 550e8400-e29b-41d4-a716-446655440000
const TEST_UUID = '550e8400-e29b-41d4-a716-446655440000'
const TEST_HEX = '550e8400e29b41d4a716446655440000'
const TEST_INTEGER = 113059749145936325402354257176981405696n

describe('uuidToHex', () => {
  it('should convert UUID to hex string', () => {
    expect(uuidToHex(TEST_UUID)).toBe(TEST_HEX)
  })

  it('should remove hyphens', () => {
    const result = uuidToHex(TEST_UUID)
    expect(result).not.toContain('-')
    expect(result.length).toBe(32)
  })
})

describe('uuidToInteger', () => {
  it('should convert UUID to BigInt', () => {
    expect(uuidToInteger(TEST_UUID)).toBe(TEST_INTEGER)
  })

  it('should handle nil UUID', () => {
    expect(uuidToInteger('00000000-0000-0000-0000-000000000000')).toBe(0n)
  })

  it('should handle max UUID', () => {
    const maxUuid = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
    const maxInt = BigInt('0xffffffffffffffffffffffffffffffff')
    expect(uuidToInteger(maxUuid)).toBe(maxInt)
  })
})

describe('uuidToDecimal', () => {
  it('should convert UUID to decimal string', () => {
    expect(uuidToDecimal(TEST_UUID)).toBe(TEST_INTEGER.toString())
  })

  it('should return "0" for nil UUID', () => {
    expect(uuidToDecimal('00000000-0000-0000-0000-000000000000')).toBe('0')
  })
})

describe('uuidToOctal', () => {
  it('should convert UUID to octal string', () => {
    const result = uuidToOctal(TEST_UUID)
    expect(result).toBe(TEST_INTEGER.toString(8))
  })
})

describe('uuidToBinary', () => {
  it('should convert UUID to binary string', () => {
    const result = uuidToBinary(TEST_UUID)
    expect(result).toBe(TEST_INTEGER.toString(2))
  })
})

describe('uuidToBase64', () => {
  it('should convert UUID to base64', () => {
    const result = uuidToBase64(TEST_UUID)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should be reversible', () => {
    const base64 = uuidToBase64(TEST_UUID)
    const uuid = base64ToUUID(base64)
    expect(uuid).toBe(TEST_UUID)
  })
})

describe('integerToUUID', () => {
  it('should convert BigInt to UUID', () => {
    expect(integerToUUID(TEST_INTEGER)).toBe(TEST_UUID)
  })

  it('should handle zero (nil UUID)', () => {
    expect(integerToUUID(0n)).toBe('00000000-0000-0000-0000-000000000000')
  })

  it('should pad with zeros for small numbers', () => {
    const result = integerToUUID(1n)
    expect(result).toBe('00000000-0000-0000-0000-000000000001')
  })
})

describe('hexToUUID', () => {
  it('should convert hex string to UUID', () => {
    expect(hexToUUID(TEST_HEX)).toBe(TEST_UUID)
  })

  it('should insert hyphens at correct positions', () => {
    const result = hexToUUID('00000000000000000000000000000000')
    expect(result).toBe('00000000-0000-0000-0000-000000000000')
  })
})

describe('octalToUUID', () => {
  it('should convert octal string to UUID', () => {
    const octal = TEST_INTEGER.toString(8)
    expect(octalToUUID(octal)).toBe(TEST_UUID)
  })
})

describe('binaryToUUID', () => {
  it('should convert binary string to UUID', () => {
    const binary = TEST_INTEGER.toString(2)
    expect(binaryToUUID(binary)).toBe(TEST_UUID)
  })
})

describe('decimalToUUID', () => {
  it('should convert decimal string to UUID', () => {
    expect(decimalToUUID(TEST_INTEGER.toString())).toBe(TEST_UUID)
  })

  it('should handle "0" (nil UUID)', () => {
    expect(decimalToUUID('0')).toBe('00000000-0000-0000-0000-000000000000')
  })
})

describe('base64ToUUID', () => {
  it('should convert base64 to UUID', () => {
    const base64 = uuidToBase64(TEST_UUID)
    expect(base64ToUUID(base64)).toBe(TEST_UUID)
  })
})

describe('round-trip conversions', () => {
  const testUuids = [
    '550e8400-e29b-41d4-a716-446655440000',
    '00000000-0000-0000-0000-000000000000',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  ]

  it('should round-trip through integer', () => {
    for (const uuid of testUuids) {
      const integer = uuidToInteger(uuid)
      expect(integerToUUID(integer)).toBe(uuid)
    }
  })

  it('should round-trip through hex', () => {
    for (const uuid of testUuids) {
      const hex = uuidToHex(uuid)
      expect(hexToUUID(hex)).toBe(uuid)
    }
  })

  it('should round-trip through decimal', () => {
    for (const uuid of testUuids) {
      const decimal = uuidToDecimal(uuid)
      expect(decimalToUUID(decimal)).toBe(uuid)
    }
  })

  it('should round-trip through octal', () => {
    for (const uuid of testUuids) {
      const octal = uuidToOctal(uuid)
      expect(octalToUUID(octal)).toBe(uuid)
    }
  })

  it('should round-trip through binary', () => {
    for (const uuid of testUuids) {
      const binary = uuidToBinary(uuid)
      expect(binaryToUUID(binary)).toBe(uuid)
    }
  })

  it('should round-trip through base64', () => {
    for (const uuid of testUuids) {
      const base64 = uuidToBase64(uuid)
      expect(base64ToUUID(base64)).toBe(uuid)
    }
  })
})
