import { useEffect, useId, useMemo, useState } from "react"

import { InputCard } from "./components/input-card"
import { ResultCard } from "./components/result-card"
import {
  DEFAULT_ARABIC_INPUT,
  DEFAULT_ROMAN_INPUT,
  STORAGE_KEYS,
} from "./constants"
import { arabicToRoman, parseArabicInput, romanToArabic } from "./core/roman"

import type { ResultStatus, RomanNumeralConverterMessages } from "./types"

function RomanNumeralConverterClient({
  messages,
}: Readonly<{ messages: RomanNumeralConverterMessages }>) {
  const arabicInputId = useId()
  const romanInputId = useId()
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [arabicInput, setArabicInput] = useState(DEFAULT_ARABIC_INPUT)
  const [romanInput, setRomanInput] = useState(DEFAULT_ROMAN_INPUT)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      setHasLoadedStorage(true)
      return
    }

    const storedArabicInput = window.localStorage.getItem(
      STORAGE_KEYS.arabicInput
    )
    const storedRomanInput = window.localStorage.getItem(
      STORAGE_KEYS.romanInput
    )

    if (storedArabicInput !== null) {
      setArabicInput(storedArabicInput)
    }

    if (storedRomanInput !== null) {
      setRomanInput(storedRomanInput)
    }

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.arabicInput, arabicInput)
    window.localStorage.setItem(STORAGE_KEYS.romanInput, romanInput)
  }, [arabicInput, hasLoadedStorage, romanInput])

  const result = useMemo(() => {
    const parsedArabicInput = parseArabicInput(arabicInput)

    if (romanInput.trim().length > 0) {
      try {
        const arabicValue = romanToArabic(romanInput)
        return {
          arabicOutput: String(arabicValue),
          errorMessage: null,
          romanOutput: arabicToRoman(arabicValue),
          status: "valid" as ResultStatus,
        }
      } catch {
        return {
          arabicOutput: "",
          errorMessage: messages.invalidRomanNumeral,
          romanOutput: romanInput.trim().toUpperCase(),
          status: "invalid" as ResultStatus,
        }
      }
    }

    if (parsedArabicInput.kind === "empty") {
      return {
        arabicOutput: "",
        errorMessage: null,
        romanOutput: "",
        status: "idle" as ResultStatus,
      }
    }

    if (parsedArabicInput.kind === "invalid") {
      return {
        arabicOutput: arabicInput.trim(),
        errorMessage: messages.invalidArabicNumber,
        romanOutput: "",
        status: "invalid" as ResultStatus,
      }
    }

    if (parsedArabicInput.kind === "out-of-range") {
      return {
        arabicOutput: String(parsedArabicInput.value),
        errorMessage: messages.outOfRangeArabicNumber,
        romanOutput: "",
        status: "invalid" as ResultStatus,
      }
    }

    return {
      arabicOutput: String(parsedArabicInput.value),
      errorMessage: null,
      romanOutput: arabicToRoman(parsedArabicInput.value),
      status: "valid" as ResultStatus,
    }
  }, [
    arabicInput,
    messages.invalidArabicNumber,
    messages.invalidRomanNumeral,
    messages.outOfRangeArabicNumber,
    romanInput,
  ])

  function handleArabicInputChange(value: string) {
    setArabicInput(value)

    const parsed = parseArabicInput(value)

    if (parsed.kind === "valid") {
      setRomanInput(arabicToRoman(parsed.value))
      return
    }

    if (parsed.kind === "empty") {
      setRomanInput("")
      return
    }

    setRomanInput("")
  }

  function handleRomanInputChange(value: string) {
    const nextRomanInput = value.toUpperCase()

    setRomanInput(nextRomanInput)

    if (nextRomanInput.trim().length === 0) {
      setArabicInput("")
      return
    }

    try {
      const arabicValue = romanToArabic(nextRomanInput)
      setArabicInput(String(arabicValue))
    } catch {
      setArabicInput("")
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <InputCard
        arabicInput={arabicInput}
        arabicInputId={arabicInputId}
        messages={messages}
        romanInput={romanInput}
        romanInputId={romanInputId}
        onArabicInputChange={handleArabicInputChange}
        onClear={() => {
          setArabicInput("")
          setRomanInput("")
        }}
        onLoadSample={() => {
          setArabicInput(DEFAULT_ARABIC_INPUT)
          setRomanInput(DEFAULT_ROMAN_INPUT)
        }}
        onRomanInputChange={handleRomanInputChange}
      />

      <ResultCard
        arabicOutput={result.arabicOutput}
        errorMessage={result.errorMessage}
        messages={messages}
        romanOutput={result.romanOutput}
        status={result.status}
      />
    </div>
  )
}

export default RomanNumeralConverterClient
