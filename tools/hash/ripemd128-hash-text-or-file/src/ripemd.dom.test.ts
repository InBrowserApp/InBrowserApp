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

  it('exercises base hasher helper methods', () => {
    const hasherProto = Object.getPrototypeOf(Object.getPrototypeOf(Ripemd.prototype))
    const BaseHasher = hasherProto.constructor as new () => {
      options: object
      state: { message: string; length: number }
      update: (message: string) => void
      process: () => void
      finalize: () => string
      getStateHash: (size?: number) => string
      addPaddingPKCS7: (length: number) => void
      addPaddingZero: (length: number) => void
    }

    const hasher = new BaseHasher()
    expect(hasher.options).toEqual({})

    hasher.update('ab')
    expect(hasher.state.length).toBe(2)
    expect(hasher.finalize()).toBe('')
    expect(hasher.getStateHash()).toBe('')

    hasher.addPaddingPKCS7(2)
    hasher.addPaddingZero(1)
    expect(hasher.state.message).toBe('ab\x02\x02\x00')

    const hasher32leProto = Object.getPrototypeOf(Ripemd.prototype)
    const BaseHasher32le = hasher32leProto.constructor as new () => {
      processBlock: (block: number[]) => void
    }
    const hasher32le = new BaseHasher32le()
    expect(hasher32le.processBlock([0, 1, 2])).toBeUndefined()
  })

  it('uses default length and long-message finalize padding path', () => {
    const hasher = new Ripemd(undefined)
    hasher.update('a'.repeat(56))

    const digest = hasher.finalize()

    expect(toHexFromBinary(digest)).toHaveLength(40)
  })
})
