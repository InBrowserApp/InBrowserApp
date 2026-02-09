import { describe, expect, it } from 'vitest'
import { parseMACAddressToArrayBuffer, parseMACAddressToNumber } from './parse'

describe('parse MAC address edge cases', () => {
  it('returns an empty array when no hex pairs are present', () => {
    expect(parseMACAddressToNumber('')).toEqual([])
    expect(parseMACAddressToNumber('---')).toEqual([])
  })

  it('parses odd-length and noisy inputs into hex values', () => {
    expect(parseMACAddressToNumber('0:1:2')).toEqual([1, 2])
    expect(parseMACAddressToNumber('ab.cd?ef')).toEqual([0xab, 0xcd, 0xef])
  })

  it('fills array buffers with parsed bytes and leaves remaining bytes zeroed', () => {
    const buffer = parseMACAddressToArrayBuffer('0:1:2')
    const view = Array.from(new Uint8Array(buffer))

    expect(buffer.byteLength).toBe(6)
    expect(view).toEqual([1, 2, 0, 0, 0, 0])
  })
})
