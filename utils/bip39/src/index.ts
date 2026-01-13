import {
  entropyToMnemonic as bip39EntropyToMnemonic,
  mnemonicToEntropy as bip39MnemonicToEntropy,
  validateMnemonic as bip39ValidateMnemonic,
  wordlists,
} from 'bip39'
import { Buffer } from 'buffer'

// bip39 relies on Buffer in browser bundles, so provide a global shim.
const globalBuffer = globalThis as typeof globalThis & { Buffer?: typeof Buffer }
if (!globalBuffer.Buffer) {
  globalBuffer.Buffer = Buffer
}

export const BIP39_WORDLISTS = {
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

export type Bip39WordlistName = keyof typeof BIP39_WORDLISTS

export const WORD_COUNTS = [12, 15, 18, 21, 24] as const
export type Bip39WordCount = (typeof WORD_COUNTS)[number]

const WORD_COUNT_TO_STRENGTH: Record<Bip39WordCount, number> = {
  12: 128,
  15: 160,
  18: 192,
  21: 224,
  24: 256,
}

const VALID_ENTROPY_BITS = new Set(Object.values(WORD_COUNT_TO_STRENGTH))

export function wordCountToStrength(wordCount: Bip39WordCount): number {
  return WORD_COUNT_TO_STRENGTH[wordCount]
}

export function normalizeMnemonic(input: string): string {
  return input.trim().split(/\s+/u).join(' ')
}

export function normalizeEntropyHex(entropyHex: string): string {
  return entropyHex.trim().toLowerCase().replace(/^0x/, '')
}

export function isValidEntropyHex(entropyHex: string): boolean {
  const normalized = normalizeEntropyHex(entropyHex)
  if (!normalized.length || normalized.length % 2 !== 0) return false
  if (!/^[0-9a-f]+$/u.test(normalized)) return false
  return VALID_ENTROPY_BITS.has(normalized.length * 4)
}

export function countMnemonicWords(mnemonic: string): number {
  const normalized = normalizeMnemonic(mnemonic)
  if (!normalized) return 0
  return normalized.split(' ').length
}

function getRandomEntropyHex(strength: number): string {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random generation is not available')
  }

  const bytes = strength / 8
  const buffer = new Uint8Array(bytes)
  globalThis.crypto.getRandomValues(buffer)

  return Array.from(buffer)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

export function generateMnemonic(options?: {
  wordCount?: Bip39WordCount
  wordlist?: Bip39WordlistName
}): { mnemonic: string; entropy: string; wordCount: Bip39WordCount; strength: number } {
  const wordCount = options?.wordCount ?? 12
  const wordlist = options?.wordlist ?? 'english'
  const strength = wordCountToStrength(wordCount)
  const entropy = getRandomEntropyHex(strength)
  const mnemonic = bip39EntropyToMnemonic(entropy, BIP39_WORDLISTS[wordlist])

  return {
    mnemonic,
    entropy,
    wordCount,
    strength,
  }
}

export function entropyToMnemonic(entropyHex: string, wordlist: Bip39WordlistName): string {
  const normalized = normalizeEntropyHex(entropyHex)
  return bip39EntropyToMnemonic(normalized, BIP39_WORDLISTS[wordlist])
}

export function mnemonicToEntropy(mnemonic: string, wordlist: Bip39WordlistName): string {
  const normalized = normalizeMnemonic(mnemonic)
  return bip39MnemonicToEntropy(normalized, BIP39_WORDLISTS[wordlist])
}

export function validateMnemonic(mnemonic: string, wordlist: Bip39WordlistName): boolean {
  const normalized = normalizeMnemonic(mnemonic)
  if (!normalized) return false
  return bip39ValidateMnemonic(normalized, BIP39_WORDLISTS[wordlist])
}
