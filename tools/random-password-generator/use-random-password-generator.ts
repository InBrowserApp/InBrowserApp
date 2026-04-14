import { startTransition, useEffect, useState } from "react"

import { generatePasswordByMode } from "./core/password-generator"
import { usePersistedRandomPasswordGeneratorState } from "./use-persisted-random-password-generator-state"
import { useRandomPasswordGeneratorUi } from "./use-random-password-generator-ui"

import type { CharsetOption } from "./types"

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
  } = persisted

  const ui = useRandomPasswordGeneratorUi(result, result.length > 0)

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
      generatePasswordByMode(mode, {
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

  return {
    mode,
    result,
    downloadUrl: ui.downloadUrl,
    isResultHidden: ui.isResultHidden,
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
    toggleResultHidden: ui.toggleResultHidden,
  }
}

export { useRandomPasswordGenerator }
