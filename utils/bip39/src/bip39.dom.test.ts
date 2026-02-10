import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  countMnemonicWords,
  entropyToMnemonic,
  generateMnemonic,
  isValidEntropyHex,
  mnemonicToEntropy,
  normalizeEntropyHex,
  normalizeMnemonic,
  validateMnemonic,
  wordCountToStrength,
} from './index'

const ENGLISH = 'english'

const cryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
const bufferDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'Buffer')

function mockCrypto(value: unknown): void {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value,
  })
}

afterEach(() => {
  if (cryptoDescriptor) {
    Object.defineProperty(globalThis, 'crypto', cryptoDescriptor)
  } else {
    Reflect.deleteProperty(globalThis, 'crypto')
  }

  if (bufferDescriptor) {
    Object.defineProperty(globalThis, 'Buffer', bufferDescriptor)
  } else {
    Reflect.deleteProperty(globalThis, 'Buffer')
  }

  vi.resetModules()
})

describe('bip39 utils', () => {
  it('converts entropy to mnemonic with the official test vector', () => {
    const entropy = '00000000000000000000000000000000'
    const mnemonic = entropyToMnemonic(entropy, ENGLISH)

    expect(mnemonic).toBe(
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    )
  })

  it('normalizes input for entropy and mnemonic conversions', () => {
    const mnemonic = entropyToMnemonic('  0X00000000000000000000000000000000  ', ENGLISH)
    expect(mnemonicToEntropy(`  ${mnemonic}\n`, ENGLISH)).toBe('00000000000000000000000000000000')
    expect(normalizeEntropyHex('  0XAbCd  ')).toBe('abcd')
    expect(normalizeMnemonic('  abandon   abandon\nabout  ')).toBe('abandon abandon about')
  })

  it('validates mnemonics and handles blank input', () => {
    const validMnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    const invalidMnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon above'

    expect(validateMnemonic(validMnemonic, ENGLISH)).toBe(true)
    expect(validateMnemonic(invalidMnemonic, ENGLISH)).toBe(false)
    expect(validateMnemonic('   ', ENGLISH)).toBe(false)
  })

  it('checks entropy hex validity across edge cases', () => {
    expect(isValidEntropyHex('00000000000000000000000000000000')).toBe(true)
    expect(isValidEntropyHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toBe(true)
    expect(isValidEntropyHex('')).toBe(false)
    expect(isValidEntropyHex('abc')).toBe(false)
    expect(isValidEntropyHex('0000')).toBe(false)
    expect(isValidEntropyHex('zzzz')).toBe(false)
  })

  it('counts mnemonic words after normalization', () => {
    expect(countMnemonicWords('legal winner thank year')).toBe(4)
    expect(countMnemonicWords('  legal   winner\nthank\tyear  ')).toBe(4)
    expect(countMnemonicWords('   ')).toBe(0)
  })

  it('maps supported word counts to entropy strength', () => {
    expect(wordCountToStrength(12)).toBe(128)
    expect(wordCountToStrength(15)).toBe(160)
    expect(wordCountToStrength(18)).toBe(192)
    expect(wordCountToStrength(21)).toBe(224)
    expect(wordCountToStrength(24)).toBe(256)
  })

  it('generates a mnemonic with default options', () => {
    const random = vi.fn((bytes: Uint8Array) => {
      bytes.fill(0)
      return bytes
    })
    mockCrypto({ getRandomValues: random })

    const result = generateMnemonic()

    expect(random).toHaveBeenCalledOnce()
    expect(result.entropy).toBe('00'.repeat(16))
    expect(result.wordCount).toBe(12)
    expect(result.strength).toBe(128)
    expect(countMnemonicWords(result.mnemonic)).toBe(12)
    expect(validateMnemonic(result.mnemonic, ENGLISH)).toBe(true)
  })

  it('supports custom word-count options during generation', () => {
    const random = vi.fn((bytes: Uint8Array) => {
      bytes.fill(255)
      return bytes
    })
    mockCrypto({ getRandomValues: random })

    const result = generateMnemonic({ wordCount: 24, wordlist: ENGLISH })

    expect(random).toHaveBeenCalledOnce()
    expect(result.entropy).toBe('ff'.repeat(32))
    expect(result.wordCount).toBe(24)
    expect(result.strength).toBe(256)
    expect(countMnemonicWords(result.mnemonic)).toBe(24)
  })

  it('throws when secure random generation is unavailable', () => {
    mockCrypto(undefined)
    expect(() => generateMnemonic()).toThrow('Secure random generation is not available')
  })

  it('throws when crypto exists without getRandomValues', () => {
    mockCrypto({})
    expect(() => generateMnemonic()).toThrow('Secure random generation is not available')
  })

  it('adds a Buffer shim when Buffer is missing', async () => {
    Object.defineProperty(globalThis, 'Buffer', {
      configurable: true,
      writable: true,
      value: undefined,
    })

    vi.resetModules()
    const module = await import('./index')

    expect(globalThis.Buffer).toBeDefined()
    expect(module.wordCountToStrength(12)).toBe(128)
  })
})
