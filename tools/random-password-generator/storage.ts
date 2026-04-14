import {
  DEFAULT_PIN_OPTIONS,
  DEFAULT_RANDOM_OPTIONS,
  DEFAULT_SEPARATOR_OPTIONS,
  DEFAULT_WORD_OPTIONS,
} from "./core/password-generator"

import type { CharsetOption, PasswordMode } from "./types"

const STORAGE_KEYS = {
  mode: "tools:random-password-generator:mode",
  randomLength: "tools:random-password-generator:random:length",
  randomCharsets: "tools:random-password-generator:random:charsets",
  randomExcludeSimilar: "tools:random-password-generator:random:excludeSimilar",
  wordsCount: "tools:random-password-generator:words:count",
  wordsSeparator: "tools:random-password-generator:words:separator",
  wordsCapitalize: "tools:random-password-generator:words:capitalize",
  wordsIncludeNumber: "tools:random-password-generator:words:includeNumber",
  separatorCharsets: "tools:random-password-generator:separator:charsets",
  separatorExcludeSimilar:
    "tools:random-password-generator:separator:excludeSimilar",
  separatorBlockLength: "tools:random-password-generator:separator:blockLength",
  separatorBlockCount: "tools:random-password-generator:separator:blockCount",
  separatorBlockSeparator:
    "tools:random-password-generator:separator:blockSeparator",
  pinLength: "tools:random-password-generator:pin:length",
  pinAllowLeadingZero: "tools:random-password-generator:pin:allowLeadingZero",
} as const

function parseNullableInteger(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseBoolean(value: string | null, fallback: boolean) {
  if (value === null) {
    return fallback
  }

  return value === "true"
}

function isPasswordMode(value: string): value is PasswordMode {
  return (
    value === "random" ||
    value === "words" ||
    value === "separator" ||
    value === "pin"
  )
}

function parseCharsets(
  value: string | null,
  fallback: readonly CharsetOption[]
) {
  if (!value) {
    return [...fallback]
  }

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return [...fallback]
    }

    return parsed.filter(
      (item: unknown): item is CharsetOption =>
        item === "upper" ||
        item === "lower" ||
        item === "digits" ||
        item === "symbols"
    )
  } catch {
    return [...fallback]
  }
}

export {
  DEFAULT_PIN_OPTIONS,
  DEFAULT_RANDOM_OPTIONS,
  DEFAULT_SEPARATOR_OPTIONS,
  DEFAULT_WORD_OPTIONS,
  STORAGE_KEYS,
  parseBoolean,
  parseCharsets,
  parseNullableInteger,
  isPasswordMode,
}
