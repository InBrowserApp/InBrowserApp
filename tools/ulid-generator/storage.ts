import { useEffect } from "react"

import { parseDateTimeLocalInput } from "./core/local-date"
import { normalizeUlidBatchCount } from "./core/ulid"

import type { GenerationMode, TimestampMode } from "./state"

const STORAGE_KEYS = {
  generationMode: "tools:ulid-generator:generation-mode",
  count: "tools:ulid-generator:count",
  timestampMode: "tools:ulid-generator:timestamp-mode",
  customDateTime: "tools:ulid-generator:custom-date-time",
  customUnixMilliseconds: "tools:ulid-generator:custom-unix-milliseconds",
  monotonicBatch: "tools:ulid-generator:monotonic-batch",
} as const

type StoredUlidOptions = Readonly<{
  generationMode?: GenerationMode
  count?: number
  timestampMode?: TimestampMode
  customDateTimeInput?: string
  customUnixMillisecondsInput?: string
  monotonicBatch?: boolean
}>

type MutableStoredUlidOptions = {
  generationMode?: GenerationMode
  count?: number
  timestampMode?: TimestampMode
  customDateTimeInput?: string
  customUnixMillisecondsInput?: string
  monotonicBatch?: boolean
}

type PersistedUlidOptions = Readonly<{
  generationMode: GenerationMode
  count: number
  timestampMode: TimestampMode
  customDateTimeInput: string
  customUnixMillisecondsInput: string
  monotonicBatch: boolean
}>

function readStoredUlidOptions(): StoredUlidOptions {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return {}
  }

  const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
  const storedGenerationMode = window.localStorage.getItem(
    STORAGE_KEYS.generationMode
  )
  const storedTimestampMode = window.localStorage.getItem(
    STORAGE_KEYS.timestampMode
  )
  const storedCustomDateTime = window.localStorage.getItem(
    STORAGE_KEYS.customDateTime
  )
  const storedCustomUnixMilliseconds = window.localStorage.getItem(
    STORAGE_KEYS.customUnixMilliseconds
  )
  const storedMonotonicBatch = window.localStorage.getItem(
    STORAGE_KEYS.monotonicBatch
  )
  const options: MutableStoredUlidOptions = {}

  if (storedGenerationMode === "single" || storedGenerationMode === "batch") {
    options.generationMode = storedGenerationMode
  }

  if (storedCount !== null) {
    const parsedCount = Number(storedCount)

    if (Number.isFinite(parsedCount)) {
      options.count = normalizeUlidBatchCount(parsedCount)
    }
  }

  if (storedTimestampMode === "now" || storedTimestampMode === "custom") {
    options.timestampMode = storedTimestampMode
  }

  if (storedCustomDateTime !== null) {
    options.customDateTimeInput = storedCustomDateTime
  }

  if (storedCustomUnixMilliseconds !== null) {
    options.customUnixMillisecondsInput = storedCustomUnixMilliseconds
  } else if (storedCustomDateTime !== null) {
    const parsedMs = parseDateTimeLocalInput(storedCustomDateTime)

    if (parsedMs !== null) {
      options.customUnixMillisecondsInput = String(parsedMs)
    }
  }

  if (storedMonotonicBatch === "false") {
    options.monotonicBatch = false
  }

  return options
}

function usePersistedUlidOptions({
  generationMode,
  count,
  timestampMode,
  customDateTimeInput,
  customUnixMillisecondsInput,
  monotonicBatch,
}: PersistedUlidOptions) {
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.generationMode, generationMode)
  }, [generationMode])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.count, String(count))
  }, [count])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.timestampMode, timestampMode)
  }, [timestampMode])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.customDateTime,
      customDateTimeInput
    )
  }, [customDateTimeInput])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.customUnixMilliseconds,
      customUnixMillisecondsInput
    )
  }, [customUnixMillisecondsInput])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.monotonicBatch,
      String(monotonicBatch)
    )
  }, [monotonicBatch])
}

export { readStoredUlidOptions, usePersistedUlidOptions }
