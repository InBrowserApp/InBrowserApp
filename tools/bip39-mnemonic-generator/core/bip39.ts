import {
  entropyToMnemonic as bip39EntropyToMnemonic,
  mnemonicToEntropy as bip39MnemonicToEntropy,
  validateMnemonic as bip39ValidateMnemonic,
  wordlists,
} from "bip39"
import { Buffer } from "buffer"

const bufferGlobal = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer
}

bufferGlobal.Buffer = Buffer

const BIP39_WORDLISTS = {
  english: wordlists.english,
  chinese_simplified: wordlists.chinese_simplified,
  chinese_traditional: wordlists.chinese_traditional,
  czech: wordlists.czech,
  french: wordlists.french,
  italian: wordlists.italian,
  japanese: wordlists.japanese,
  korean: wordlists.korean,
  portuguese: wordlists.portuguese,
  spanish: wordlists.spanish,
} as const

const WORD_COUNTS = [12, 15, 18, 21, 24] as const

type Bip39WordCount = (typeof WORD_COUNTS)[number]
type Bip39WordlistName = keyof typeof BIP39_WORDLISTS
type Bip39Tab = "generate" | "validate" | "convert"
type FillRandomValues = (values: Uint8Array) => Uint8Array

const WORD_COUNT_TO_STRENGTH: Record<Bip39WordCount, number> = {
  12: 128,
  15: 160,
  18: 192,
  21: 224,
  24: 256,
}

const VALID_ENTROPY_BITS = new Set(Object.values(WORD_COUNT_TO_STRENGTH))

function wordCountToStrength(wordCount: Bip39WordCount) {
  return WORD_COUNT_TO_STRENGTH[wordCount]
}

function normalizeMnemonic(input: string) {
  return input.trim().split(/\s+/u).join(" ")
}

function normalizeEntropyHex(input: string) {
  return input.trim().toLowerCase().replace(/^0x/u, "")
}

function isValidEntropyHex(input: string) {
  const normalized = normalizeEntropyHex(input)

  if (!normalized.length || normalized.length % 2 !== 0) {
    return false
  }

  if (!/^[0-9a-f]+$/u.test(normalized)) {
    return false
  }

  return VALID_ENTROPY_BITS.has(normalized.length * 4)
}

function countMnemonicWords(mnemonic: string) {
  const normalized = normalizeMnemonic(mnemonic)

  if (!normalized) {
    return 0
  }

  return normalized.split(" ").length
}

function fillWithSecureRandom(values: Uint8Array) {
  const getRandomValues = globalThis.crypto?.getRandomValues?.bind(
    globalThis.crypto
  )

  if (!getRandomValues) {
    throw new Error("Secure random generation is not available")
  }

  return getRandomValues(values)
}

function createEntropyHex(
  strength: number,
  fillRandomValues: FillRandomValues = fillWithSecureRandom
) {
  const values = new Uint8Array(strength / 8)

  fillRandomValues(values)

  return Array.from(values, (value) =>
    value.toString(16).padStart(2, "0")
  ).join("")
}

function entropyToMnemonic(
  entropyHex: string,
  wordlist: Bip39WordlistName = "english"
) {
  return bip39EntropyToMnemonic(
    normalizeEntropyHex(entropyHex),
    BIP39_WORDLISTS[wordlist]
  )
}

function mnemonicToEntropy(
  mnemonic: string,
  wordlist: Bip39WordlistName = "english"
) {
  return bip39MnemonicToEntropy(
    normalizeMnemonic(mnemonic),
    BIP39_WORDLISTS[wordlist]
  )
}

function validateMnemonic(
  mnemonic: string,
  wordlist: Bip39WordlistName = "english"
) {
  const normalized = normalizeMnemonic(mnemonic)

  if (!normalized) {
    return false
  }

  return bip39ValidateMnemonic(normalized, BIP39_WORDLISTS[wordlist])
}

function generateMnemonic(
  options: Readonly<{
    wordCount?: Bip39WordCount
    wordlist?: Bip39WordlistName
  }> = {},
  createEntropy = createEntropyHex
) {
  const wordCount = options.wordCount ?? WORD_COUNTS[0]
  const wordlist = options.wordlist ?? "english"
  const strength = wordCountToStrength(wordCount)
  const entropy = createEntropy(strength)

  return {
    mnemonic: entropyToMnemonic(entropy, wordlist),
    entropy,
    wordCount,
    strength,
  }
}

export {
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
}
export type { Bip39Tab, Bip39WordCount, Bip39WordlistName }
