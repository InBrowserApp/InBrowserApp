import englishWordlist from "bip39/src/wordlists/english.json"

import type { CharsetOption, HistoryEntry, PasswordMode } from "../types"

const RANDOM_CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-={}[]|:;<>,.?/~",
} as const satisfies Record<CharsetOption, string>

const DEFAULT_CHARSETS: CharsetOption[] = ["upper", "lower", "digits"]
const SIMILAR_CHARACTERS_PATTERN = /[Il1O0]/g
const DEFAULT_WORD_SEPARATOR = "-"
const DEFAULT_BLOCK_SEPARATOR = "-"
const MAX_HISTORY_ITEMS = 20

const DEFAULT_RANDOM_OPTIONS = {
  length: 16,
  charsets: DEFAULT_CHARSETS,
  excludeSimilar: true,
} as const

const DEFAULT_WORD_OPTIONS = {
  wordCount: 4,
  separator: DEFAULT_WORD_SEPARATOR,
  capitalize: false,
  includeNumber: false,
} as const

const DEFAULT_SEPARATOR_OPTIONS = {
  charsets: DEFAULT_CHARSETS,
  excludeSimilar: true,
  blockLength: 3,
  blockCount: 3,
  blockSeparator: DEFAULT_BLOCK_SEPARATOR,
} as const

const DEFAULT_PIN_OPTIONS = {
  length: 6,
  allowLeadingZero: true,
} as const

type RandomIndex = (max: number) => number

type RandomPasswordOptions = Readonly<{
  length: number | null | undefined
  charsets: readonly CharsetOption[]
  excludeSimilar: boolean
}>

type WordPasswordOptions = Readonly<{
  wordCount: number | null | undefined
  separator: string
  capitalize: boolean
  includeNumber: boolean
}>

type SeparatorPasswordOptions = Readonly<{
  charsets: readonly CharsetOption[]
  excludeSimilar: boolean
  blockLength: number | null | undefined
  blockCount: number | null | undefined
  blockSeparator: string
}>

type PinPasswordOptions = Readonly<{
  length: number | null | undefined
  allowLeadingZero: boolean
}>

type AddHistoryEntryOptions = Readonly<{
  createId?: () => string
}>

function normalizeLength(value: number | null | undefined, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback
  }

  return Math.max(1, Math.floor(value))
}

function normalizeCharsets(charsets: readonly CharsetOption[]) {
  const nextCharsets = charsets.filter(
    (value) => DEFAULT_CHARSETS.includes(value) || value === "symbols"
  )

  return nextCharsets.length > 0 ? [...new Set(nextCharsets)] : DEFAULT_CHARSETS
}

function buildCharsetPool(
  charsets: readonly CharsetOption[],
  excludeSimilar: boolean
) {
  const selectedCharsets = normalizeCharsets(charsets)
  let pool = selectedCharsets.map((value) => RANDOM_CHARSETS[value]).join("")

  if (excludeSimilar) {
    pool = pool.replace(SIMILAR_CHARACTERS_PATTERN, "")
  }

  return pool.length > 0
    ? pool
    : DEFAULT_CHARSETS.map((value) => RANDOM_CHARSETS[value]).join("")
}

function createCryptoRandomIndex(max: number) {
  if (max <= 0) {
    return 0
  }

  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return buffer[0]! % max
}

function generateRandomPassword(
  options: RandomPasswordOptions,
  randomIndex: RandomIndex = createCryptoRandomIndex
) {
  const pool = buildCharsetPool(options.charsets, options.excludeSimilar)
  const length = normalizeLength(options.length, DEFAULT_RANDOM_OPTIONS.length)
  let result = ""

  for (let index = 0; index < length; index += 1) {
    result += pool[randomIndex(pool.length)]!
  }

  return result
}

function capitalizeWord(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

function generateWordPassword(
  options: WordPasswordOptions,
  randomIndex: RandomIndex = createCryptoRandomIndex
) {
  const wordCount = normalizeLength(
    options.wordCount,
    DEFAULT_WORD_OPTIONS.wordCount
  )
  const separator = options.separator || DEFAULT_WORD_SEPARATOR
  const parts: string[] = []

  for (let index = 0; index < wordCount; index += 1) {
    const word = englishWordlist[randomIndex(englishWordlist.length)]!
    parts.push(options.capitalize ? capitalizeWord(word) : word)
  }

  if (options.includeNumber) {
    parts.push(String(randomIndex(100)))
  }

  return parts.join(separator)
}

function generateSeparatorPassword(
  options: SeparatorPasswordOptions,
  randomIndex: RandomIndex = createCryptoRandomIndex
) {
  const pool = buildCharsetPool(options.charsets, options.excludeSimilar)
  const blockLength = normalizeLength(
    options.blockLength,
    DEFAULT_SEPARATOR_OPTIONS.blockLength
  )
  const blockCount = normalizeLength(
    options.blockCount,
    DEFAULT_SEPARATOR_OPTIONS.blockCount
  )
  const blockSeparator = options.blockSeparator || DEFAULT_BLOCK_SEPARATOR
  const blocks: string[] = []

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
    let block = ""

    for (let charIndex = 0; charIndex < blockLength; charIndex += 1) {
      block += pool[randomIndex(pool.length)]!
    }

    blocks.push(block)
  }

  return blocks.join(blockSeparator)
}

function generatePinPassword(
  options: PinPasswordOptions,
  randomIndex: RandomIndex = createCryptoRandomIndex
) {
  const length = normalizeLength(options.length, DEFAULT_PIN_OPTIONS.length)
  let result = ""

  for (let index = 0; index < length; index += 1) {
    const digit = randomIndex(10)

    if (!options.allowLeadingZero && index === 0 && digit === 0) {
      result += String(randomIndex(9) + 1)
      continue
    }

    result += String(digit)
  }

  return result
}

function generatePasswordByMode(
  mode: PasswordMode,
  options: {
    random: RandomPasswordOptions
    words: WordPasswordOptions
    separator: SeparatorPasswordOptions
    pin: PinPasswordOptions
  },
  randomIndex: RandomIndex = createCryptoRandomIndex
) {
  switch (mode) {
    case "random":
      return generateRandomPassword(options.random, randomIndex)
    case "words":
      return generateWordPassword(options.words, randomIndex)
    case "separator":
      return generateSeparatorPassword(options.separator, randomIndex)
    case "pin":
      return generatePinPassword(options.pin, randomIndex)
  }
}

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function addHistoryEntry(
  historyEntries: readonly HistoryEntry[],
  mode: PasswordMode,
  value: string,
  options: AddHistoryEntryOptions = {}
) {
  if (!value) {
    return [...historyEntries]
  }

  const latest = historyEntries[0]

  if (latest && latest.mode === mode && latest.value === value) {
    return [...historyEntries]
  }

  return [
    {
      id: (options.createId ?? createHistoryId)(),
      mode,
      value,
    },
    ...historyEntries,
  ].slice(0, MAX_HISTORY_ITEMS)
}

export {
  DEFAULT_PIN_OPTIONS,
  DEFAULT_RANDOM_OPTIONS,
  DEFAULT_SEPARATOR_OPTIONS,
  DEFAULT_WORD_OPTIONS,
  MAX_HISTORY_ITEMS,
  addHistoryEntry,
  buildCharsetPool,
  createCryptoRandomIndex,
  generatePasswordByMode,
  generatePinPassword,
  generateRandomPassword,
  generateSeparatorPassword,
  generateWordPassword,
}
