import { describe, it, expect } from 'vitest'
import { siphash24, siphash128 } from './siphash'

const makeSequentialBytes = (length: number) => Uint8Array.from({ length }, (_, index) => index)

const key = makeSequentialBytes(16)

const toHex = (value: Uint8Array) => Buffer.from(value).toString('hex')

describe('siphash', () => {
  it('matches the SipHash-2-4 vector for 7 bytes', () => {
    const message = makeSequentialBytes(7)

    expect(toHex(siphash24(message, key))).toBe('ab0200f58b01d137')
  })

  it('matches the SipHash-2-4 vector for 15 bytes', () => {
    const message = makeSequentialBytes(15)

    expect(toHex(siphash24(message, key))).toBe('a129ca6149be45e5')
  })

  it('treats missing key bytes as zeros', () => {
    const message = makeSequentialBytes(9)

    const emptyKeyHash = toHex(siphash24(message, new Uint8Array()))
    const zeroKeyHash = toHex(siphash24(message, new Uint8Array(16)))

    expect(emptyKeyHash).toBe(zeroKeyHash)
  })

  it('matches the SipHash-2-4-128 vector for 15 bytes', () => {
    const message = makeSequentialBytes(15)

    expect(toHex(siphash128(message, key))).toBe('2152a4ce598ec92f5163778013caff1d')
  })
})
