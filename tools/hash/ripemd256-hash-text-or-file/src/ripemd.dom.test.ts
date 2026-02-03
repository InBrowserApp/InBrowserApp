import { describe, expect, it } from 'vitest'
import { hashRipemd, Ripemd } from './ripemd'

const encoder = new TextEncoder()

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

const toHexFromBinary = (value: string) =>
  Array.from(value, (char) => char.charCodeAt(0))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

const expectedHex = 'afbd6e228b9d8cbbcef5ca2d03e6dba10ac0bc7dcbe4680e1e42d2e975459b65'

describe('ripemd256 hashing', () => {
  it('hashes known RIPEMD-256 vectors', () => {
    const buffer = encoder.encode('abc').buffer
    const hash = hashRipemd(buffer, 256)
    expect(toHex(hash)).toBe(expectedHex)
  })

  it('produces expected lengths for other variants', () => {
    const buffer = encoder.encode('abc').buffer
    const outputs = [
      { length: 128, bytes: 16 },
      { length: 160, bytes: 20 },
      { length: 320, bytes: 40 },
    ]

    for (const { length, bytes } of outputs) {
      const hash = hashRipemd(buffer, length)
      expect(new Uint8Array(hash)).toHaveLength(bytes)
    }
  })

  it('round-trips hasher state', () => {
    const hasher = new Ripemd({ length: 256 })
    hasher.update('abc')
    const state = hasher.getState()

    state.message = 'mutated'
    expect(hasher.getState().message).toBe('abc')

    const restored = new Ripemd({ length: 256 })
    restored.setState(hasher.getState())
    const digest = toHexFromBinary(restored.finalize())

    expect(digest).toBe(expectedHex)
  })
})
