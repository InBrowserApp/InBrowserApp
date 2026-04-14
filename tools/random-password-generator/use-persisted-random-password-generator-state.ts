import { useEffect, useState } from "react"

import {
  DEFAULT_PIN_OPTIONS,
  DEFAULT_RANDOM_OPTIONS,
  DEFAULT_SEPARATOR_OPTIONS,
  DEFAULT_WORD_OPTIONS,
} from "./storage"
import {
  STORAGE_KEYS,
  isPasswordMode,
  parseBoolean,
  parseCharsets,
  parseHistory,
  parseNullableInteger,
} from "./storage"

import type { CharsetOption, HistoryEntry, PasswordMode } from "./types"

function usePersistedRandomPasswordGeneratorState() {
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [mode, setMode] = useState<PasswordMode>("random")
  const [randomLength, setRandomLengthState] = useState<number>(
    DEFAULT_RANDOM_OPTIONS.length
  )
  const [randomCharsets, setRandomCharsets] = useState<CharsetOption[]>([
    ...DEFAULT_RANDOM_OPTIONS.charsets,
  ])
  const [randomExcludeSimilar, setRandomExcludeSimilar] = useState<boolean>(
    DEFAULT_RANDOM_OPTIONS.excludeSimilar
  )
  const [wordsCount, setWordsCountState] = useState<number>(
    DEFAULT_WORD_OPTIONS.wordCount
  )
  const [wordsSeparator, setWordsSeparator] = useState<string>(
    DEFAULT_WORD_OPTIONS.separator
  )
  const [wordsCapitalize, setWordsCapitalize] = useState<boolean>(
    DEFAULT_WORD_OPTIONS.capitalize
  )
  const [wordsIncludeNumber, setWordsIncludeNumber] = useState<boolean>(
    DEFAULT_WORD_OPTIONS.includeNumber
  )
  const [separatorCharsets, setSeparatorCharsets] = useState<CharsetOption[]>([
    ...DEFAULT_SEPARATOR_OPTIONS.charsets,
  ])
  const [separatorExcludeSimilar, setSeparatorExcludeSimilar] =
    useState<boolean>(DEFAULT_SEPARATOR_OPTIONS.excludeSimilar)
  const [separatorBlockLength, setSeparatorBlockLengthState] = useState<number>(
    DEFAULT_SEPARATOR_OPTIONS.blockLength
  )
  const [separatorBlockCount, setSeparatorBlockCountState] = useState<number>(
    DEFAULT_SEPARATOR_OPTIONS.blockCount
  )
  const [separatorBlockSeparator, setSeparatorBlockSeparator] =
    useState<string>(DEFAULT_SEPARATOR_OPTIONS.blockSeparator)
  const [pinLength, setPinLengthState] = useState<number>(
    DEFAULT_PIN_OPTIONS.length
  )
  const [pinAllowLeadingZero, setPinAllowLeadingZero] = useState<boolean>(
    DEFAULT_PIN_OPTIONS.allowLeadingZero
  )
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEYS.mode)

    if (storedMode && isPasswordMode(storedMode)) {
      setMode(storedMode)
    }

    setRandomLengthState(
      parseNullableInteger(
        window.localStorage.getItem(STORAGE_KEYS.randomLength),
        DEFAULT_RANDOM_OPTIONS.length
      )
    )
    setRandomCharsets(
      parseCharsets(
        window.localStorage.getItem(STORAGE_KEYS.randomCharsets),
        DEFAULT_RANDOM_OPTIONS.charsets
      )
    )
    setRandomExcludeSimilar(
      parseBoolean(
        window.localStorage.getItem(STORAGE_KEYS.randomExcludeSimilar),
        DEFAULT_RANDOM_OPTIONS.excludeSimilar
      )
    )
    setWordsCountState(
      parseNullableInteger(
        window.localStorage.getItem(STORAGE_KEYS.wordsCount),
        DEFAULT_WORD_OPTIONS.wordCount
      )
    )
    setWordsSeparator(
      window.localStorage.getItem(STORAGE_KEYS.wordsSeparator) ??
        DEFAULT_WORD_OPTIONS.separator
    )
    setWordsCapitalize(
      parseBoolean(
        window.localStorage.getItem(STORAGE_KEYS.wordsCapitalize),
        DEFAULT_WORD_OPTIONS.capitalize
      )
    )
    setWordsIncludeNumber(
      parseBoolean(
        window.localStorage.getItem(STORAGE_KEYS.wordsIncludeNumber),
        DEFAULT_WORD_OPTIONS.includeNumber
      )
    )
    setSeparatorCharsets(
      parseCharsets(
        window.localStorage.getItem(STORAGE_KEYS.separatorCharsets),
        DEFAULT_SEPARATOR_OPTIONS.charsets
      )
    )
    setSeparatorExcludeSimilar(
      parseBoolean(
        window.localStorage.getItem(STORAGE_KEYS.separatorExcludeSimilar),
        DEFAULT_SEPARATOR_OPTIONS.excludeSimilar
      )
    )
    setSeparatorBlockLengthState(
      parseNullableInteger(
        window.localStorage.getItem(STORAGE_KEYS.separatorBlockLength),
        DEFAULT_SEPARATOR_OPTIONS.blockLength
      )
    )
    setSeparatorBlockCountState(
      parseNullableInteger(
        window.localStorage.getItem(STORAGE_KEYS.separatorBlockCount),
        DEFAULT_SEPARATOR_OPTIONS.blockCount
      )
    )
    setSeparatorBlockSeparator(
      window.localStorage.getItem(STORAGE_KEYS.separatorBlockSeparator) ??
        DEFAULT_SEPARATOR_OPTIONS.blockSeparator
    )
    setPinLengthState(
      parseNullableInteger(
        window.localStorage.getItem(STORAGE_KEYS.pinLength),
        DEFAULT_PIN_OPTIONS.length
      )
    )
    setPinAllowLeadingZero(
      parseBoolean(
        window.localStorage.getItem(STORAGE_KEYS.pinAllowLeadingZero),
        DEFAULT_PIN_OPTIONS.allowLeadingZero
      )
    )
    setHistoryEntries(
      parseHistory(window.localStorage.getItem(STORAGE_KEYS.history))
    )
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.mode, mode)
    window.localStorage.setItem(STORAGE_KEYS.randomLength, String(randomLength))
    window.localStorage.setItem(
      STORAGE_KEYS.randomCharsets,
      JSON.stringify(randomCharsets)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.randomExcludeSimilar,
      String(randomExcludeSimilar)
    )
    window.localStorage.setItem(STORAGE_KEYS.wordsCount, String(wordsCount))
    window.localStorage.setItem(STORAGE_KEYS.wordsSeparator, wordsSeparator)
    window.localStorage.setItem(
      STORAGE_KEYS.wordsCapitalize,
      String(wordsCapitalize)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.wordsIncludeNumber,
      String(wordsIncludeNumber)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.separatorCharsets,
      JSON.stringify(separatorCharsets)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.separatorExcludeSimilar,
      String(separatorExcludeSimilar)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.separatorBlockLength,
      String(separatorBlockLength)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.separatorBlockCount,
      String(separatorBlockCount)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.separatorBlockSeparator,
      separatorBlockSeparator
    )
    window.localStorage.setItem(STORAGE_KEYS.pinLength, String(pinLength))
    window.localStorage.setItem(
      STORAGE_KEYS.pinAllowLeadingZero,
      String(pinAllowLeadingZero)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.history,
      JSON.stringify(historyEntries)
    )
  }, [
    hasLoadedStorage,
    historyEntries,
    mode,
    pinAllowLeadingZero,
    pinLength,
    randomCharsets,
    randomExcludeSimilar,
    randomLength,
    separatorBlockCount,
    separatorBlockLength,
    separatorBlockSeparator,
    separatorCharsets,
    separatorExcludeSimilar,
    wordsCapitalize,
    wordsCount,
    wordsIncludeNumber,
    wordsSeparator,
  ])

  return {
    hasLoadedStorage,
    mode,
    randomLength,
    randomCharsets,
    randomExcludeSimilar,
    wordsCount,
    wordsSeparator,
    wordsCapitalize,
    wordsIncludeNumber,
    separatorCharsets,
    separatorExcludeSimilar,
    separatorBlockLength,
    separatorBlockCount,
    separatorBlockSeparator,
    pinLength,
    pinAllowLeadingZero,
    historyEntries,
    setMode,
    setRandomLength(value: string) {
      setRandomLengthState(
        parseNullableInteger(value, DEFAULT_RANDOM_OPTIONS.length)
      )
    },
    setRandomCharsets,
    setRandomExcludeSimilar,
    setWordsCount(value: string) {
      setWordsCountState(
        parseNullableInteger(value, DEFAULT_WORD_OPTIONS.wordCount)
      )
    },
    setWordsSeparator,
    setWordsCapitalize,
    setWordsIncludeNumber,
    setSeparatorCharsets,
    setSeparatorExcludeSimilar,
    setSeparatorBlockLength(value: string) {
      setSeparatorBlockLengthState(
        parseNullableInteger(value, DEFAULT_SEPARATOR_OPTIONS.blockLength)
      )
    },
    setSeparatorBlockCount(value: string) {
      setSeparatorBlockCountState(
        parseNullableInteger(value, DEFAULT_SEPARATOR_OPTIONS.blockCount)
      )
    },
    setSeparatorBlockSeparator,
    setPinLength(value: string) {
      setPinLengthState(parseNullableInteger(value, DEFAULT_PIN_OPTIONS.length))
    },
    setPinAllowLeadingZero,
    setHistoryEntries,
  }
}

export { usePersistedRandomPasswordGeneratorState }
