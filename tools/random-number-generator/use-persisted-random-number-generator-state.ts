import { useEffect, useState } from "react"

import {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_RANDOM_COUNT,
  DEFAULT_RANDOM_MAX,
  DEFAULT_RANDOM_MIN,
} from "./core/random-number"

import type { HistoryEntry, NumberType } from "./types"

const STORAGE_KEYS = {
  minValue: "tools:random-number-generator:min",
  maxValue: "tools:random-number-generator:max",
  count: "tools:random-number-generator:count",
  allowRepeat: "tools:random-number-generator:allow-repeat",
  numberType: "tools:random-number-generator:number-type",
  decimalPlaces: "tools:random-number-generator:decimal-places",
  history: "tools:random-number-generator:history",
} as const

function isNumberType(value: string): value is NumberType {
  return value === "integer" || value === "decimal"
}

function parseNullableNumber(value: string) {
  if (value.trim() === "" || value === "null") {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parseStoredHistory(rawValue: string | null): HistoryEntry[] {
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.flatMap((entry: unknown) => {
      if (!entry || typeof entry !== "object") {
        return []
      }

      const candidate = entry as {
        id?: unknown
        values?: unknown
      }

      if (
        typeof candidate.id !== "string" ||
        !Array.isArray(candidate.values) ||
        !candidate.values.every((value: unknown) => typeof value === "string")
      ) {
        return []
      }

      return [{ id: candidate.id, values: [...candidate.values] }]
    })
  } catch {
    return []
  }
}

function usePersistedRandomNumberGeneratorState() {
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [minValue, setMinValueState] = useState<number | null>(
    DEFAULT_RANDOM_MIN
  )
  const [maxValue, setMaxValueState] = useState<number | null>(
    DEFAULT_RANDOM_MAX
  )
  const [count, setCountState] = useState<number | null>(DEFAULT_RANDOM_COUNT)
  const [allowRepeat, setAllowRepeat] = useState(true)
  const [numberType, setNumberType] = useState<NumberType>("integer")
  const [decimalPlaces, setDecimalPlacesState] = useState<number | null>(
    DEFAULT_DECIMAL_PLACES
  )
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    const storedMinValue = window.localStorage.getItem(STORAGE_KEYS.minValue)
    const storedMaxValue = window.localStorage.getItem(STORAGE_KEYS.maxValue)
    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedAllowRepeat = window.localStorage.getItem(
      STORAGE_KEYS.allowRepeat
    )
    const storedNumberType = window.localStorage.getItem(
      STORAGE_KEYS.numberType
    )
    const storedDecimalPlaces = window.localStorage.getItem(
      STORAGE_KEYS.decimalPlaces
    )
    const storedHistory = window.localStorage.getItem(STORAGE_KEYS.history)

    if (storedMinValue !== null) {
      setMinValueState(parseNullableNumber(storedMinValue))
    }

    if (storedMaxValue !== null) {
      setMaxValueState(parseNullableNumber(storedMaxValue))
    }

    if (storedCount !== null) {
      setCountState(parseNullableNumber(storedCount))
    }

    if (storedAllowRepeat !== null) {
      setAllowRepeat(storedAllowRepeat === "true")
    }

    if (storedNumberType && isNumberType(storedNumberType)) {
      setNumberType(storedNumberType)
    }

    if (storedDecimalPlaces !== null) {
      setDecimalPlacesState(parseNullableNumber(storedDecimalPlaces))
    }

    setHistoryEntries(parseStoredHistory(storedHistory))
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.minValue, String(minValue))
    window.localStorage.setItem(STORAGE_KEYS.maxValue, String(maxValue))
    window.localStorage.setItem(STORAGE_KEYS.count, String(count))
    window.localStorage.setItem(STORAGE_KEYS.allowRepeat, String(allowRepeat))
    window.localStorage.setItem(STORAGE_KEYS.numberType, numberType)
    window.localStorage.setItem(
      STORAGE_KEYS.decimalPlaces,
      String(decimalPlaces)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.history,
      JSON.stringify(historyEntries)
    )
  }, [
    allowRepeat,
    count,
    decimalPlaces,
    hasLoadedStorage,
    historyEntries,
    maxValue,
    minValue,
    numberType,
  ])

  return {
    hasLoadedStorage,
    minValue,
    maxValue,
    count,
    allowRepeat,
    numberType,
    decimalPlaces,
    historyEntries,
    setMinValue(value: string) {
      setMinValueState(parseNullableNumber(value))
    },
    setMinValueState,
    setMaxValue(value: string) {
      setMaxValueState(parseNullableNumber(value))
    },
    setMaxValueState,
    setCount(value: string) {
      setCountState(parseNullableNumber(value))
    },
    setCountState,
    setAllowRepeat,
    setNumberType,
    setDecimalPlaces(value: string) {
      setDecimalPlacesState(parseNullableNumber(value))
    },
    setDecimalPlacesState,
    setHistoryEntries,
  }
}

export { usePersistedRandomNumberGeneratorState }
