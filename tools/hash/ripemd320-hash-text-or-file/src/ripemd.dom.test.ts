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

const expectedHex =
  'de4c01b3054f8930a79d09ae738e92301e5a17085beffdc1b8d116713e74f82fa942d64cdbc4682d'

describe('ripemd320 hashing', () => {
  it('hashes known RIPEMD-320 vectors', () => {
    const buffer = encoder.encode('abc').buffer
    const hash = hashRipemd(buffer, 320)
    expect(toHex(hash)).toBe(expectedHex)
  })

  it('produces expected lengths for other variants', () => {
    const buffer = encoder.encode('abc').buffer
    const outputs = [
      { length: 128, bytes: 16 },
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
    const hasher = new Ripemd({ length: 320 })
    hasher.update('abc')
    const state = hasher.getState()

    state.message = 'mutated'
    expect(hasher.getState().message).toBe('abc')

    const restored = new Ripemd({ length: 320 })
    restored.setState(hasher.getState())
    const digest = toHexFromBinary(restored.finalize())

    expect(digest).toBe(expectedHex)
  })
})
