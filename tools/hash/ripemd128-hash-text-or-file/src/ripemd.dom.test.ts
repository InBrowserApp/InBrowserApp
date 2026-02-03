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

describe('ripemd128 hashing', () => {
  it('hashes known RIPEMD-128 vectors', () => {
    const vectors = [
      { message: '', digest: 'cdf26213a150dc3ecb610f18f6b38b46' },
      { message: 'a', digest: '86be7afa339d0fc7cfc785e72f578d33' },
      { message: 'abc', digest: 'c14a12199c66e4ba84636b0f69144c77' },
      { message: 'message digest', digest: '9e327b3d6e523062afc1132d7df9d1b8' },
    ]

    for (const { message, digest } of vectors) {
      const buffer = encoder.encode(message).buffer
      const hash = hashRipemd(buffer, 128)
      expect(toHex(hash)).toBe(digest)
    }
  })

  it('produces expected lengths for other variants', () => {
    const buffer = encoder.encode('abc').buffer
    const outputs = [
      { length: 160, bytes: 20 },
      { length: 256, bytes: 32 },
      { length: 320, bytes: 40 },
    ]

    for (const { length, bytes } of outputs) {
      const hash = hashRipemd(buffer, length)
      expect(new Uint8Array(hash)).toHaveLength(bytes)
    }
  })

  it('round-trips hasher state', () => {
    const hasher = new Ripemd({ length: 128 })
    hasher.update('a')
    const state = hasher.getState()

    state.message = 'mutated'
    expect(hasher.getState().message).toBe('a')

    const restored = new Ripemd({ length: 128 })
    restored.setState(hasher.getState())
    const digest = toHexFromBinary(restored.finalize())

    expect(digest).toBe('86be7afa339d0fc7cfc785e72f578d33')
  })
})
