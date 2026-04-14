const COMMON_PASSWORDS = new Set([
  "password",
  "123456",
  "123456789",
  "12345678",
  "12345",
  "1234",
  "111111",
  "000000",
  "qwerty",
  "qwerty123",
  "abc123",
  "letmein",
  "welcome",
  "admin",
  "iloveyou",
  "monkey",
  "dragon",
  "sunshine",
  "princess",
  "football",
])

const CHARSET_SIZES = {
  lower: 26,
  upper: 26,
  digit: 10,
  symbol: 33,
} as const

const LOG10_2 = Math.log10(2)
const OFFLINE_GUESS_RATE = 1e10
const ONLINE_GUESS_RATE = 100

type StrengthScore = 0 | 1 | 2 | 3 | 4
type StrengthWarningKey =
  | "common"
  | "short"
  | "sequence"
  | "repeat"
  | "singleClass"
type StrengthSuggestionKey =
  | "use-longer"
  | "add-uppercase"
  | "add-lowercase"
  | "add-numbers"
  | "add-symbols"
  | "avoid-common"
  | "avoid-sequences"
  | "avoid-repetition"
type DurationUnit =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "months"
  | "years"

type DurationDisplay = {
  value: number
  unit: DurationUnit
  isUnderSecond: boolean
}

type StrengthReport = {
  length: number
  uniqueCount: number
  poolSize: number
  entropyBits: number
  log10Guesses: number
  score: StrengthScore
  composition: {
    lower: number
    upper: number
    digit: number
    symbol: number
  }
  warnings: StrengthWarningKey[]
  suggestions: StrengthSuggestionKey[]
  crackTimes: {
    offlineFast: DurationDisplay
    onlineThrottled: DurationDisplay
  }
}

function scoreFromEntropy(entropyBits: number): StrengthScore {
  if (entropyBits < 28) return 0
  if (entropyBits < 36) return 1
  if (entropyBits < 60) return 2
  if (entropyBits < 90) return 3
  return 4
}

function formatDuration(seconds: number): DurationDisplay {
  if (!Number.isFinite(seconds)) {
    return { value: Number.MAX_VALUE, unit: "years", isUnderSecond: false }
  }

  if (seconds <= 0) {
    return { value: 0, unit: "seconds", isUnderSecond: true }
  }

  if (seconds < 1) {
    return { value: 1, unit: "seconds", isUnderSecond: true }
  }

  const units: Array<{ unit: DurationUnit; seconds: number }> = [
    { unit: "years", seconds: 31557600 },
    { unit: "months", seconds: 2629800 },
    { unit: "days", seconds: 86400 },
    { unit: "hours", seconds: 3600 },
    { unit: "minutes", seconds: 60 },
    { unit: "seconds", seconds: 1 },
  ]

  let selected = units[units.length - 1]!

  for (const entry of units) {
    if (seconds >= entry.seconds) {
      selected = entry
      break
    }
  }

  const rawValue = seconds / selected.seconds

  return {
    value: roundDurationValue(rawValue),
    unit: selected.unit,
    isUnderSecond: false,
  }
}

function analyzePassword(password: string): StrengthReport | null {
  if (!password) return null

  const composition = {
    lower: countMatches(password, /[a-z]/g),
    upper: countMatches(password, /[A-Z]/g),
    digit: countMatches(password, /\d/g),
    symbol: countMatches(password, /[^a-zA-Z0-9]/g),
  }

  const length = password.length
  const uniqueCount = new Set(password).size
  const poolSize =
    (composition.lower ? CHARSET_SIZES.lower : 0) +
    (composition.upper ? CHARSET_SIZES.upper : 0) +
    (composition.digit ? CHARSET_SIZES.digit : 0) +
    (composition.symbol ? CHARSET_SIZES.symbol : 0)
  const typesUsed = [
    composition.lower,
    composition.upper,
    composition.digit,
    composition.symbol,
  ].filter(Boolean).length

  const warnings = new Set<StrengthWarningKey>()
  const suggestions = new Set<StrengthSuggestionKey>()
  const normalized = password.trim().toLowerCase()
  const isCommon = COMMON_PASSWORDS.has(normalized)

  if (isCommon) {
    warnings.add("common")
    suggestions.add("avoid-common")
  }

  if (length < 8) {
    warnings.add("short")
    suggestions.add("use-longer")
  } else if (length < 12) {
    suggestions.add("use-longer")
  }

  if (typesUsed <= 1) {
    warnings.add("singleClass")
  }

  if (!composition.lower) suggestions.add("add-lowercase")
  if (!composition.upper) suggestions.add("add-uppercase")
  if (!composition.digit) suggestions.add("add-numbers")
  if (!composition.symbol) suggestions.add("add-symbols")

  const hasSequence = hasSequentialPattern(password)
  if (hasSequence) {
    warnings.add("sequence")
    suggestions.add("avoid-sequences")
  }

  const hasRepeat =
    hasRepeatingCharacters(password) || hasRepeatedPattern(password)
  if (hasRepeat) {
    warnings.add("repeat")
    suggestions.add("avoid-repetition")
  }

  const safePoolSize = Math.max(poolSize, 1)
  const baseEntropy = length * Math.log2(safePoolSize)
  let entropyBits = baseEntropy

  if (isCommon) {
    entropyBits = 0
  } else {
    entropyBits -= length < 8 ? 10 : 0
    entropyBits -= typesUsed <= 1 ? 10 : 0
    entropyBits -= hasSequence ? 10 : 0
    entropyBits -= hasRepeat ? 12 : 0
    entropyBits = Math.max(0, entropyBits)
  }

  const score = scoreFromEntropy(entropyBits)
  const log10Guesses = entropyBits * LOG10_2
  const offlineSeconds = toCrackSeconds(log10Guesses, OFFLINE_GUESS_RATE)
  const onlineSeconds = toCrackSeconds(log10Guesses, ONLINE_GUESS_RATE)

  return {
    length,
    uniqueCount,
    poolSize,
    entropyBits,
    log10Guesses,
    score,
    composition,
    warnings: Array.from(warnings),
    suggestions: Array.from(suggestions),
    crackTimes: {
      offlineFast: formatDuration(offlineSeconds),
      onlineThrottled: formatDuration(onlineSeconds),
    },
  }
}

function countMatches(value: string, regex: RegExp): number {
  const matches = value.match(regex)
  return matches ? matches.length : 0
}

function hasRepeatingCharacters(value: string): boolean {
  return /(.)\1{2,}/.test(value)
}

function hasSequentialPattern(value: string): boolean {
  const normalized = value.toLowerCase()
  let run = 1

  for (let index = 1; index < normalized.length; index += 1) {
    const previous = normalized.charAt(index - 1)
    const current = normalized.charAt(index)

    if (isSequentialPair(previous, current)) {
      run += 1
      if (run >= 3) return true
    } else {
      run = 1
    }
  }

  return false
}

function isSequentialPair(previous: string, current: string): boolean {
  if (isDigit(previous) && isDigit(current)) {
    return Math.abs(current.charCodeAt(0) - previous.charCodeAt(0)) === 1
  }

  if (isLowercaseLetter(previous) && isLowercaseLetter(current)) {
    return Math.abs(current.charCodeAt(0) - previous.charCodeAt(0)) === 1
  }

  return false
}

function isDigit(value: string): boolean {
  return value >= "0" && value <= "9"
}

function isLowercaseLetter(value: string): boolean {
  return value >= "a" && value <= "z"
}

function hasRepeatedPattern(value: string): boolean {
  const { length } = value

  for (let size = 1; size <= Math.floor(length / 2); size += 1) {
    if (length % size !== 0) continue

    const chunk = value.slice(0, size)
    if (chunk.repeat(length / size) === value) {
      return true
    }
  }

  return false
}

function roundDurationValue(value: number): number {
  if (value >= 100) return Math.round(value)
  if (value >= 10) return Math.round(value * 10) / 10
  return Math.round(value * 100) / 100
}

function toCrackSeconds(log10Guesses: number, rate: number): number {
  const log10Seconds = log10Guesses - Math.log10(rate)
  if (log10Seconds > 308) return Number.MAX_VALUE
  return Math.pow(10, log10Seconds)
}

export {
  analyzePassword,
  formatDuration,
  scoreFromEntropy,
  type DurationDisplay,
  type DurationUnit,
  type StrengthReport,
  type StrengthScore,
  type StrengthSuggestionKey,
  type StrengthWarningKey,
}
