import { describe, expect, it } from 'vitest'
import {
  entropyToMnemonic,
  mnemonicToEntropy,
  validateMnemonic,
  normalizeMnemonic,
  isValidEntropyHex,
} from './index'

const ENGLISH = 'english'

describe('bip39 utils', () => {
  it('converts entropy to mnemonic with the official test vector', () => {
    const entropy = '00000000000000000000000000000000'
    const mnemonic = entropyToMnemonic(entropy, ENGLISH)
    expect(mnemonic).toBe(
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    )
  })

  it('converts mnemonic back to entropy', () => {
    const mnemonic =
      'legal winner thank year wave sausage worth useful legal winner thank yellow'
    const entropy = mnemonicToEntropy(mnemonic, ENGLISH)
    expect(entropy).toBe('7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f')
  })

  it('validates mnemonics', () => {
    const validMnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    const invalidMnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon above'

    expect(validateMnemonic(validMnemonic, ENGLISH)).toBe(true)
    expect(validateMnemonic(invalidMnemonic, ENGLISH)).toBe(false)
  })

  it('normalizes whitespace in mnemonics', () => {
    expect(normalizeMnemonic('  abandon   abandon\nabout  ')).toBe('abandon abandon about')
  })

  it('checks entropy hex validity', () => {
    expect(isValidEntropyHex('00000000000000000000000000000000')).toBe(true)
    expect(isValidEntropyHex('0000')).toBe(false)
    expect(isValidEntropyHex('zzzz')).toBe(false)
  })
})
