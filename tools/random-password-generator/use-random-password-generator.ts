import { startTransition, useEffect, useMemo, useRef, useState } from "react"

import {
  addHistoryEntry,
  generatePasswordByMode,
} from "./core/password-generator"
import { usePersistedRandomPasswordGeneratorState } from "./use-persisted-random-password-generator-state"
import { useRandomPasswordGeneratorUi } from "./use-random-password-generator-ui"

import type { CharsetOption, HistoryEntry, PasswordMode } from "./types"

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toggleCharset(
  currentCharsets: readonly CharsetOption[],
  charset: CharsetOption
) {
  if (currentCharsets.includes(charset)) {
    return currentCharsets.filter((value) => value !== charset)
  }

  return [...currentCharsets, charset]
}

function useRandomPasswordGenerator() {
  const persisted = usePersistedRandomPasswordGeneratorState()
  const [result, setResult] = useState("")
  const [nonce, setNonce] = useState(0)
  const hasInitializedResultRef = useRef(false)
  const resultRef = useRef("")
  const modeRef = useRef<PasswordMode>("random")

  const {
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
    setRandomLength,
    setRandomCharsets,
    setRandomExcludeSimilar,
    setWordsCount,
    setWordsSeparator,
    setWordsCapitalize,
    setWordsIncludeNumber,
    setSeparatorCharsets,
    setSeparatorExcludeSimilar,
    setSeparatorBlockLength,
    setSeparatorBlockCount,
    setSeparatorBlockSeparator,
    setPinLength,
    setPinAllowLeadingZero,
    setHistoryEntries,
  } = persisted

  modeRef.current = mode
  resultRef.current = result

  const outputText = useMemo(() => result, [result])
  const ui = useRandomPasswordGeneratorUi(outputText, result.length > 0)

  function setCurrentResult(value: string) {
    startTransition(() => {
      setResult(value)
    })
  }

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    setCurrentResult(
      generatePasswordByMode(modeRef.current, {
        random: {
          length: randomLength,
          charsets: randomCharsets,
          excludeSimilar: randomExcludeSimilar,
        },
        words: {
          wordCount: wordsCount,
          separator: wordsSeparator,
          capitalize: wordsCapitalize,
          includeNumber: wordsIncludeNumber,
        },
        separator: {
          charsets: separatorCharsets,
          excludeSimilar: separatorExcludeSimilar,
          blockLength: separatorBlockLength,
          blockCount: separatorBlockCount,
          blockSeparator: separatorBlockSeparator,
        },
        pin: {
          length: pinLength,
          allowLeadingZero: pinAllowLeadingZero,
        },
      })
    )
  }, [
    hasLoadedStorage,
    mode,
    nonce,
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

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    if (!hasInitializedResultRef.current) {
      hasInitializedResultRef.current = true
      return
    }

    setHistoryEntries((currentHistoryEntries: HistoryEntry[]) =>
      addHistoryEntry(currentHistoryEntries, modeRef.current, result, {
        createId: createHistoryId,
      })
    )
  }, [hasLoadedStorage, result, setHistoryEntries])

  return {
    mode,
    result,
    outputText,
    downloadUrl: ui.downloadUrl,
    historyEntries,
    isFullscreen: ui.isFullscreen,
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
    setMode,
    setRandomLength,
    setRandomExcludeSimilar,
    setWordsCount,
    setWordsSeparator,
    setWordsCapitalize,
    setWordsIncludeNumber,
    setSeparatorExcludeSimilar,
    setSeparatorBlockLength,
    setSeparatorBlockCount,
    setSeparatorBlockSeparator,
    setPinLength,
    setPinAllowLeadingZero,
    toggleRandomCharset(charset: CharsetOption) {
      setRandomCharsets(toggleCharset(randomCharsets, charset))
    },
    toggleSeparatorCharset(charset: CharsetOption) {
      setSeparatorCharsets(toggleCharset(separatorCharsets, charset))
    },
    regenerate() {
      setNonce((value) => value + 1)
    },
    clearHistory() {
      setHistoryEntries([])
    },
    openFullscreen: ui.openFullscreen,
    closeFullscreen: ui.closeFullscreen,
  }
}

export { useRandomPasswordGenerator }
