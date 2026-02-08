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
