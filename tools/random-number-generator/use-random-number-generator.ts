import { startTransition, useEffect, useMemo, useRef, useState } from "react"

import {
  addHistoryEntry,
  applyPreset,
  formatRandomNumbers,
  generateRandomNumbers,
  getInputStep,
  hasCountError,
  hasRangeError,
  normalizeDecimalPlaces,
  normalizeRandomCount,
  resolveRangeInfo,
} from "./core/random-number"
import { usePersistedRandomNumberGeneratorState } from "./use-persisted-random-number-generator-state"
import { useRandomNumberGeneratorUi } from "./use-random-number-generator-ui"

import type {
  RandomNumberGeneratorMessages,
  HistoryEntry,
  NumberType,
  PresetOption,
} from "./types"

const ROLLING_INTERVAL_MS = 80

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function useRandomNumberGenerator(messages: RandomNumberGeneratorMessages) {
  const persisted = usePersistedRandomNumberGeneratorState()
  const {
    hasLoadedStorage,
    minValue,
    maxValue,
    count,
    allowRepeat,
    numberType,
    decimalPlaces,
    historyEntries,
    setMinValue,
    setMinValueState,
    setMaxValue,
    setMaxValueState,
    setCount,
    setCountState,
    setAllowRepeat,
    setNumberType,
    setDecimalPlaces,
    setDecimalPlacesState,
    setHistoryEntries,
  } = persisted
  const [formattedNumbers, setFormattedNumbers] = useState<string[]>([])
  const [isRolling, setIsRolling] = useState(false)

  const hasInitializedResultsRef = useRef(false)
  const formattedNumbersRef = useRef(formattedNumbers)
  const isRollingRef = useRef(isRolling)
  const rollingLastTickRef = useRef(0)
  const rollingRafIdRef = useRef<number | null>(null)
  const latestConfigRef = useRef({
    minValue,
    maxValue,
    count,
    allowRepeat,
    numberType,
    decimalPlaces,
  })

  formattedNumbersRef.current = formattedNumbers
  isRollingRef.current = isRolling
  latestConfigRef.current = {
    minValue,
    maxValue,
    count,
    allowRepeat,
    numberType,
    decimalPlaces,
  }

  const normalizedCount = useMemo(() => normalizeRandomCount(count), [count])
  const normalizedDecimalPlaces = useMemo(
    () => normalizeDecimalPlaces(decimalPlaces),
    [decimalPlaces]
  )
  const rangeInfo = useMemo(
    () =>
      resolveRangeInfo(minValue, maxValue, numberType, normalizedDecimalPlaces),
    [maxValue, minValue, normalizedDecimalPlaces, numberType]
  )
  const rangeError = hasRangeError(rangeInfo) ? messages.rangeError : ""
  const countError = hasCountError(rangeInfo, allowRepeat, normalizedCount)
    ? messages.countError.replace("{range}", String(rangeInfo?.range ?? 0))
    : ""
  const canRoll = rangeError.length === 0 && countError.length === 0
  const inputStep = useMemo(
    () => getInputStep(numberType, normalizedDecimalPlaces),
    [normalizedDecimalPlaces, numberType]
  )
  const outputText = useMemo(
    () => formattedNumbers.join("\n"),
    [formattedNumbers]
  )
  const ui = useRandomNumberGeneratorUi(outputText, formattedNumbers.length > 0)

  function setCurrentResults(values: string[]) {
    startTransition(() => {
      setFormattedNumbers(values)
    })
  }

  function generateCurrentResults() {
    const currentConfig = latestConfigRef.current
    const nextDecimalPlaces = normalizeDecimalPlaces(
      currentConfig.decimalPlaces
    )

    return formatRandomNumbers(
      generateRandomNumbers({
        minValue: currentConfig.minValue,
        maxValue: currentConfig.maxValue,
        count: currentConfig.count,
        allowRepeat: currentConfig.allowRepeat,
        numberType: currentConfig.numberType,
        decimalPlaces: nextDecimalPlaces,
      }),
      currentConfig.numberType,
      nextDecimalPlaces
    )
  }

  function stopRolling(commitHistory: boolean) {
    if (!isRollingRef.current) {
      return
    }

    if (rollingRafIdRef.current !== null) {
      window.cancelAnimationFrame(rollingRafIdRef.current)
      rollingRafIdRef.current = null
    }

    isRollingRef.current = false
    setIsRolling(false)
    rollingLastTickRef.current = 0

    if (commitHistory) {
      setHistoryEntries((currentHistoryEntries: HistoryEntry[]) =>
        addHistoryEntry(currentHistoryEntries, formattedNumbersRef.current, {
          createId: createHistoryId,
        })
      )
    }
  }

  useEffect(() => {
    return () => {
      if (rollingRafIdRef.current !== null) {
        window.cancelAnimationFrame(rollingRafIdRef.current)
      }

      isRollingRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    const nextCount = normalizeRandomCount(count)
    if (count !== nextCount) {
      setCountState(nextCount)
      return
    }

    const nextDecimalPlaces = normalizeDecimalPlaces(decimalPlaces)
    if (decimalPlaces !== nextDecimalPlaces) {
      setDecimalPlacesState(nextDecimalPlaces)
      return
    }

    if (
      hasRangeError(rangeInfo) ||
      hasCountError(rangeInfo, allowRepeat, normalizedCount)
    ) {
      setCurrentResults([])

      if (isRollingRef.current) {
        if (rollingRafIdRef.current !== null) {
          window.cancelAnimationFrame(rollingRafIdRef.current)
          rollingRafIdRef.current = null
        }

        isRollingRef.current = false
        setIsRolling(false)
        rollingLastTickRef.current = 0
      }

      return
    }

    setCurrentResults(generateCurrentResults())
  }, [
    allowRepeat,
    count,
    decimalPlaces,
    hasLoadedStorage,
    maxValue,
    minValue,
    normalizedCount,
    numberType,
    rangeInfo,
    setCountState,
    setDecimalPlacesState,
  ])

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    if (!hasInitializedResultsRef.current) {
      hasInitializedResultsRef.current = true
      return
    }

    if (isRollingRef.current) {
      return
    }

    setHistoryEntries((currentHistoryEntries: HistoryEntry[]) =>
      addHistoryEntry(currentHistoryEntries, formattedNumbers, {
        createId: createHistoryId,
      })
    )
  }, [formattedNumbers, hasLoadedStorage, setHistoryEntries])

  function startRolling() {
    if (isRollingRef.current || !canRoll) {
      return
    }

    isRollingRef.current = true
    setIsRolling(true)
    rollingLastTickRef.current = 0
    setCurrentResults(generateCurrentResults())

    const tick = (timestamp: number) => {
      if (!isRollingRef.current) {
        return
      }

      if (rollingLastTickRef.current === 0) {
        rollingLastTickRef.current = timestamp
      } else if (
        timestamp - rollingLastTickRef.current >=
        ROLLING_INTERVAL_MS
      ) {
        setCurrentResults(generateCurrentResults())
        rollingLastTickRef.current = timestamp
      }

      rollingRafIdRef.current = window.requestAnimationFrame(tick)
    }

    rollingRafIdRef.current = window.requestAnimationFrame(tick)
  }

  return {
    minValue,
    maxValue,
    count,
    allowRepeat,
    numberType,
    decimalPlaces,
    inputStep,
    rangeError,
    countError,
    formattedNumbers,
    outputText,
    canRoll,
    isRolling,
    downloadUrl: ui.downloadUrl,
    historyEntries,
    isFullscreen: ui.isFullscreen,
    setMinValue,
    setMaxValue,
    setCount,
    setAllowRepeat,
    setNumberType: setNumberType as (value: NumberType) => void,
    setDecimalPlaces,
    applyPreset(preset: PresetOption) {
      const nextPreset = applyPreset(preset)

      setMinValueState(nextPreset.minValue)
      setMaxValueState(nextPreset.maxValue)
      setCountState(nextPreset.count)
      setAllowRepeat(nextPreset.allowRepeat)
      setNumberType(nextPreset.numberType)
    },
    toggleRolling() {
      if (isRollingRef.current) {
        stopRolling(true)
        return
      }

      startRolling()
    },
    clearHistory() {
      setHistoryEntries([])
    },
    openFullscreen: ui.openFullscreen,
    closeFullscreen: ui.closeFullscreen,
  }
}

export { useRandomNumberGenerator }
