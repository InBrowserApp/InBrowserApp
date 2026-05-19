import { startTransition, useEffect, useId, useMemo, useState } from "react"

import {
  formatDateTimeLocalInput,
  parseDateTimeLocalInput,
} from "./core/local-date"
import {
  UUID_V7_DEFAULT_COUNT,
  generateUuidV7Ids,
  isValidUuidV7TimestampMs,
  parseUuidV7Timestamp,
} from "./core/uuid-v7"
import { readStoredUuidV7Options, usePersistedUuidV7Options } from "./storage"
import {
  getCurrentUnixMilliseconds,
  getTimestampError,
  normalizeUuidV7BatchCount,
  parseUnixMillisecondsInput,
} from "./state"

import type {
  UuidV7GenerationMode,
  UuidV7Messages,
  UuidV7TimestampMode,
} from "./types"

const UUID_V7_DEFAULT_MODE: UuidV7GenerationMode = "single"
const UUID_V7_DEFAULT_TIMESTAMP_MODE: UuidV7TimestampMode = "now"

function useUuidV7Generator(messages: UuidV7Messages, language: string) {
  const countId = useId()
  const customDateTimeId = useId()
  const customUnixMillisecondsId = useId()
  const timestampErrorId = useId()

  const [count, setCount] = useState(UUID_V7_DEFAULT_COUNT)
  const [mode, setMode] = useState<UuidV7GenerationMode>(UUID_V7_DEFAULT_MODE)
  const [timestampMode, setTimestampMode] = useState<UuidV7TimestampMode>(
    UUID_V7_DEFAULT_TIMESTAMP_MODE
  )
  const [customDateTimeInput, setCustomDateTimeInput] = useState(() =>
    formatDateTimeLocalInput(getCurrentUnixMilliseconds())
  )
  const [customUnixMillisecondsInput, setCustomUnixMillisecondsInput] =
    useState(() => String(getCurrentUnixMilliseconds()))
  const [settingsReady, setSettingsReady] = useState(false)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    const storedOptions = readStoredUuidV7Options()

    setCount((current) => storedOptions.count ?? current)
    setMode((current) => storedOptions.mode ?? current)
    setTimestampMode((current) => storedOptions.timestampMode ?? current)
    setCustomDateTimeInput(
      (current) => storedOptions.customDateTimeInput ?? current
    )
    setCustomUnixMillisecondsInput(
      (current) => storedOptions.customUnixMillisecondsInput ?? current
    )

    setSettingsReady(true)
  }, [])

  usePersistedUuidV7Options({
    settingsReady,
    count,
    mode,
    timestampMode,
    customDateTimeInput,
    customUnixMillisecondsInput,
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
    if (!settingsReady) {
      return
    }

    const normalizedCount = normalizeUuidV7BatchCount(count)

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    const timestampMs =
      timestampMode === "custom"
        ? customUnixMilliseconds
        : getCurrentUnixMilliseconds()

    if (timestampMs === null || !isValidUuidV7TimestampMs(timestampMs)) {
      setGeneratedIds([])
      return
    }

    startTransition(() => {
      setGeneratedIds(
        generateUuidV7Ids(mode === "single" ? 1 : normalizedCount, {
          now: () => timestampMs,
        })
      )
    })
  }, [
    count,
    customUnixMilliseconds,
    generationVersion,
    mode,
    settingsReady,
    timestampMode,
  ])

  const output = generatedIds.join("\n")
  const generatedAtMs = generatedIds[0]
    ? parseUuidV7Timestamp(generatedIds[0])
    : null
  const generatedAtLabel = useMemo(() => {
    if (generatedAtMs === null) {
      return messages.unavailableLabel
    }

    return new Intl.DateTimeFormat(language, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(generatedAtMs))
  }, [generatedAtMs, language, messages.unavailableLabel])
  const downloadFilename =
    generatedAtMs === null
      ? "uuid-v7.txt"
      : mode === "single"
        ? `uuid-v7-${generatedAtMs}.txt`
        : `uuid-v7-${generatedIds.length}-${generatedAtMs}.txt`

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
    countId,
    customDateTimeId,
    customUnixMillisecondsId,
    timestampErrorId,
    mode,
    count,
    timestampMode,
    customDateTimeInput,
    customUnixMillisecondsInput,
    timestampError,
    output,
    generatedAtMs,
    generatedAtLabel,
    downloadFilename,
    downloadUrl,
    generatedCount: generatedIds.length,
    setMode,
    setTimestampMode,
    setCount: (value: string) => {
      setCount(normalizeUuidV7BatchCount(Number(value)))
    },
    setCustomDateTimeInput: (value: string) => {
      setCustomDateTimeInput(value)

      const parsedMs = parseDateTimeLocalInput(value)

      if (parsedMs !== null) {
        setCustomUnixMillisecondsInput(String(parsedMs))
      } else {
        setCustomUnixMillisecondsInput("")
      }
    },
    setCustomUnixMillisecondsInput: (value: string) => {
      setCustomUnixMillisecondsInput(value)

      const parsedMs = parseUnixMillisecondsInput(value)

      if (parsedMs !== null && isValidUuidV7TimestampMs(parsedMs)) {
        setCustomDateTimeInput(formatDateTimeLocalInput(parsedMs))
      }
    },
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

export { useUuidV7Generator }
