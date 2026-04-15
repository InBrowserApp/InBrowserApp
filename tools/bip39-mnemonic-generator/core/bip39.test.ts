import { afterEach, describe, expect, test } from "vitest"

import {
  WORD_COUNTS,
  countMnemonicWords,
  createEntropyHex,
  entropyToMnemonic,
  generateMnemonic,
  isValidEntropyHex,
  mnemonicToEntropy,
  normalizeEntropyHex,
  normalizeMnemonic,
  validateMnemonic,
  wordCountToStrength,
} from "./bip39"

const originalCrypto = globalThis.crypto

afterEach(() => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: originalCrypto,
  })
})

describe("bip39 core helpers", () => {
  test("maps word counts to entropy strength", () => {
    expect(WORD_COUNTS.map(wordCountToStrength)).toEqual([
      128, 160, 192, 224, 256,
    ])
  })

  test("normalizes mnemonic whitespace", () => {
    expect(normalizeMnemonic("  abandon   about  ")).toBe("abandon about")
    expect(normalizeMnemonic("")).toBe("")
  })

  test("normalizes entropy hex", () => {
    expect(normalizeEntropyHex("  0xAABBCC  ")).toBe("aabbcc")
  })

  test("validates entropy hex shape and bit length", () => {
    expect(isValidEntropyHex("00000000000000000000000000000000")).toBe(true)
    expect(isValidEntropyHex("0x00000000000000000000000000000000")).toBe(true)
    expect(isValidEntropyHex("abc")).toBe(false)
    expect(isValidEntropyHex("zz")).toBe(false)
    expect(isValidEntropyHex("0000")).toBe(false)
  })

  test("counts normalized mnemonic words", () => {
    expect(countMnemonicWords("")).toBe(0)
    expect(countMnemonicWords(" abandon   abandon about ")).toBe(3)
  })

  test("creates deterministic entropy hex with an injected random source", () => {
    const entropy = createEntropyHex(128, (values) => {
      values.fill(0xab)
      return values
    })

    expect(entropy).toBe("abababababababababababababababab")
  })

  test("uses crypto.getRandomValues by default when creating entropy", () => {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: {
        getRandomValues(values: Uint8Array) {
          values.fill(0xcd)
          return values
        },
      },
    })

    expect(createEntropyHex(128)).toBe("cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd")
  })

  test("throws when secure random generation is unavailable", () => {
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: undefined,
    })

    expect(() => createEntropyHex(128)).toThrow(
      "Secure random generation is not available"
    )
  })

  test("generates a deterministic english mnemonic with injected entropy", () => {
    const result = generateMnemonic(
      { wordCount: 12, wordlist: "english" },
      () => "00000000000000000000000000000000"
    )

    expect(result).toEqual({
      mnemonic:
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
      entropy: "00000000000000000000000000000000",
      strength: 128,
      wordCount: 12,
    })
  })

  test("falls back to the default word count and english wordlist", () => {
    const result = generateMnemonic(undefined, () => {
      return "00000000000000000000000000000000"
    })

    expect(result.wordCount).toBe(12)
    expect(result.strength).toBe(128)
    expect(result.mnemonic).toBe(
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    )
  })

  test("converts entropy and mnemonics both directions", () => {
    const mnemonic = entropyToMnemonic("00000000000000000000000000000000")

    expect(mnemonic).toBe(
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    )
    expect(mnemonicToEntropy(mnemonic)).toBe("00000000000000000000000000000000")
  })

  test("validates mnemonics against the selected wordlist", () => {
    const validMnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    const invalidMnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"

    expect(validateMnemonic(validMnemonic, "english")).toBe(true)
    expect(validateMnemonic(invalidMnemonic, "english")).toBe(false)
    expect(validateMnemonic("   ", "english")).toBe(false)
  })
})
