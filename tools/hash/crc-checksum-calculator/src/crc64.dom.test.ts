import { describe, expect, it } from 'vitest'
import { crc64Calculators } from './crc64'

describe('crc64 calculators', () => {
  it('exposes all configured CRC64 variants', () => {
    expect(crc64Calculators.map(({ name }) => name)).toEqual([
      'CRC64 ECMA-182',
      'CRC64 GO-ISO',
      'CRC64 MS',
      'CRC64 NVME',
      'CRC64 REDIS',
      'CRC64 WE',
      'CRC64 XZ',
    ])
  })

  it('matches standard check vectors for 123456789', () => {
    const input = new TextEncoder().encode('123456789')

    for (const { calculator, check } of crc64Calculators) {
      expect(calculator(input).toString(16)).toBe(check)
    }
  })
})
