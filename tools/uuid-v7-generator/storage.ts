import { useEffect } from "react"

import { parseDateTimeLocalInput } from "./core/local-date"
import { UUID_V7_MIN_COUNT, normalizeUuidV7Count } from "./core/uuid-v7"
import { normalizeUuidV7BatchCount } from "./state"

import type { UuidV7GenerationMode, UuidV7TimestampMode } from "./types"

const STORAGE_KEYS = {
  count: "tools:uuid-v7-generator:count",
  mode: "tools:uuid-v7-generator:mode",
  timestampMode: "tools:uuid-v7-generator:timestamp-mode",
  customDateTime: "tools:uuid-v7-generator:custom-date-time",
  customUnixMilliseconds: "tools:uuid-v7-generator:custom-unix-milliseconds",
} as const

type StoredUuidV7Options = Readonly<{
  count?: number
  mode?: UuidV7GenerationMode
  timestampMode?: UuidV7TimestampMode
  customDateTimeInput?: string
  customUnixMillisecondsInput?: string
}>

type MutableStoredUuidV7Options = {
  count?: number
  mode?: UuidV7GenerationMode
  timestampMode?: UuidV7TimestampMode
  customDateTimeInput?: string
  customUnixMillisecondsInput?: string
}

type PersistedUuidV7Options = Readonly<{
  settingsReady: boolean
  count: number
  mode: UuidV7GenerationMode
  timestampMode: UuidV7TimestampMode
  customDateTimeInput: string
  customUnixMillisecondsInput: string
}>

function parseStoredNumber(value: string | null) {
  if (value === null) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function readStoredUuidV7Options(): StoredUuidV7Options {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return {}
  }

  const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
  const storedMode = window.localStorage.getItem(STORAGE_KEYS.mode)
  const storedTimestampMode = window.localStorage.getItem(
    STORAGE_KEYS.timestampMode
  )
  const storedCustomDateTime = window.localStorage.getItem(
    STORAGE_KEYS.customDateTime
  )
  const storedCustomUnixMilliseconds = window.localStorage.getItem(
    STORAGE_KEYS.customUnixMilliseconds
  )
  const parsedCount = parseStoredNumber(storedCount)
  const options: MutableStoredUuidV7Options = {}

  if (parsedCount !== null) {
    options.count = normalizeUuidV7BatchCount(parsedCount)
  }

  if (storedMode === "single" || storedMode === "batch") {
    options.mode = storedMode
  } else if (
    parsedCount !== null &&
    normalizeUuidV7Count(parsedCount) > UUID_V7_MIN_COUNT
  ) {
    options.mode = "batch"
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

  return options
}

function usePersistedUuidV7Options({
  settingsReady,
  count,
  mode,
  timestampMode,
  customDateTimeInput,
  customUnixMillisecondsInput,
}: PersistedUuidV7Options) {
  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.count, String(count))
  }, [count, settingsReady])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.mode, mode)
  }, [mode, settingsReady])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.timestampMode, timestampMode)
  }, [settingsReady, timestampMode])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.customDateTime,
      customDateTimeInput
    )
  }, [customDateTimeInput, settingsReady])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.customUnixMilliseconds,
      customUnixMillisecondsInput
    )
  }, [customUnixMillisecondsInput, settingsReady])
}

export { readStoredUuidV7Options, usePersistedUuidV7Options }
