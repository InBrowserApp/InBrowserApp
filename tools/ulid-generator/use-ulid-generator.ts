import { startTransition, useEffect, useId, useState } from "react"

import {
  formatDateTimeLocalInput,
  parseDateTimeLocalInput,
} from "./core/local-date"
import {
  generateUlidBatch,
  isValidUlidTimestampMs,
  normalizeUlidBatchCount,
} from "./core/ulid"
import { readStoredUlidOptions, usePersistedUlidOptions } from "./storage"
import {
  formatMessage,
  getCurrentUnixMilliseconds,
  getTimestampError,
  parseUnixMillisecondsInput,
} from "./state"

import type { UlidMessages } from "./types"
import type { GenerationMode, TimestampMode } from "./state"

const DEFAULT_COUNT = 5
const DEFAULT_GENERATION_MODE = "single"

function useUlidGenerator(messages: UlidMessages, language: string) {
  const generationModeId = useId()
  const countId = useId()
  const customDateTimeId = useId()
  const customUnixMillisecondsId = useId()
  const monotonicBatchId = useId()

  const [generationMode, setGenerationMode] = useState<GenerationMode>(
    DEFAULT_GENERATION_MODE
  )
  const [count, setCount] = useState(DEFAULT_COUNT)
  const [timestampMode, setTimestampMode] = useState<TimestampMode>("now")
  const [monotonicBatch, setMonotonicBatch] = useState(true)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [generatedAtMs, setGeneratedAtMs] = useState<number | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [customDateTimeInput, setCustomDateTimeInput] = useState(() =>
    formatDateTimeLocalInput(getCurrentUnixMilliseconds())
  )
  const [customUnixMillisecondsInput, setCustomUnixMillisecondsInput] =
    useState(() => String(getCurrentUnixMilliseconds()))

  useEffect(() => {
    const storedOptions = readStoredUlidOptions()

    setGenerationMode((current) => storedOptions.generationMode ?? current)
    setCount((current) => storedOptions.count ?? current)
    setTimestampMode((current) => storedOptions.timestampMode ?? current)
    setCustomDateTimeInput(
      (current) => storedOptions.customDateTimeInput ?? current
    )
    setCustomUnixMillisecondsInput(
      (current) => storedOptions.customUnixMillisecondsInput ?? current
    )
    setMonotonicBatch((current) => storedOptions.monotonicBatch ?? current)
  }, [])

  usePersistedUlidOptions({
    generationMode,
    count,
    timestampMode,
    customDateTimeInput,
    customUnixMillisecondsInput,
    monotonicBatch,
  })

  const customUnixMilliseconds = parseUnixMillisecondsInput(
    customUnixMillisecondsInput
  )
  const timestampError = getTimestampError(
    messages,
    timestampMode,
    customUnixMilliseconds
  )

  useEffect(() => {
    const normalizedCount = normalizeUlidBatchCount(count)
    const generationCount = generationMode === "single" ? 1 : normalizedCount

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    const timestampMs =
      timestampMode === "custom"
        ? customUnixMilliseconds
        : getCurrentUnixMilliseconds()

    if (timestampMs === null || !isValidUlidTimestampMs(timestampMs)) {
      setGeneratedAtMs(null)
      setGeneratedIds([])
      return
    }

    startTransition(() => {
      setGeneratedAtMs(timestampMs)
      setGeneratedIds(
        generateUlidBatch(generationCount, timestampMs, monotonicBatch)
      )
    })
  }, [
    count,
    customUnixMilliseconds,
    generationVersion,
    generationMode,
    monotonicBatch,
    timestampMode,
  ])

  const output = generatedIds.join("\n")
  const outputCount = generationMode === "single" ? 1 : count
  const downloadFilename =
    generatedAtMs === null
      ? "ulid.txt"
      : generationMode === "single"
        ? `ulid-${generatedAtMs}.txt`
        : `ulid-${outputCount}-${generatedAtMs}.txt`
  const generatedAtText =
    output.length === 0 || generatedAtMs === null
      ? null
      : formatMessage(messages.generatedAtLabel, {
          milliseconds: new Intl.NumberFormat(language).format(generatedAtMs),
        })

  useEffect(() => {
    if (output.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([output], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [output])

  return {
    generationModeId,
    countId,
    customDateTimeId,
    customUnixMillisecondsId,
    monotonicBatchId,
    generationMode,
    count,
    timestampMode,
    customDateTimeInput,
    customUnixMillisecondsInput,
    monotonicBatch,
    output,
    timestampError,
    generatedAtText,
    downloadFilename,
    downloadUrl,
    setGenerationMode,
    setCount: (value: string) => {
      setCount(normalizeUlidBatchCount(Number(value)))
    },
    setTimestampMode,
    setCustomDateTimeInput: (value: string) => {
      setCustomDateTimeInput(value)

      const parsedMs = parseDateTimeLocalInput(value)

      if (parsedMs !== null) {
        setCustomUnixMillisecondsInput(String(parsedMs))
      }
    },
    setCustomUnixMillisecondsInput: (value: string) => {
      setCustomUnixMillisecondsInput(value)

      const parsedMs = parseUnixMillisecondsInput(value)

      if (parsedMs !== null && isValidUlidTimestampMs(parsedMs)) {
        setCustomDateTimeInput(formatDateTimeLocalInput(parsedMs))
      }
    },
    setMonotonicBatch,
    setCustomTimestampToNow: () => {
      const nowMs = getCurrentUnixMilliseconds()

      setCustomDateTimeInput(formatDateTimeLocalInput(nowMs))
      setCustomUnixMillisecondsInput(String(nowMs))
    },
    regenerate: () => {
      startTransition(() => {
        setGenerationVersion((current) => current + 1)
      })
    },
  }
}

export { useUlidGenerator }
