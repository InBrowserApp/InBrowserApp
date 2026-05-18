import { startTransition, useEffect, useId, useMemo, useState } from "react"

import {
  UUID_V7_DEFAULT_COUNT,
  UUID_V7_MIN_BATCH_COUNT,
  UUID_V7_MIN_COUNT,
  generateUuidV7Ids,
  normalizeUuidV7Count,
  parseUuidV7Timestamp,
} from "./core/uuid-v7"
import { UuidV7OptionsCard } from "./components/options-card"
import { UuidV7ResultsCard } from "./components/results-card"

import type { UuidV7GenerationMode, UuidV7Messages } from "./types"

type UuidV7GeneratorClientProps = Readonly<{
  messages: UuidV7Messages
}>

const STORAGE_KEYS = {
  count: "tools:uuid-v7-generator:count",
  mode: "tools:uuid-v7-generator:mode",
} as const

const UUID_V7_DEFAULT_MODE: UuidV7GenerationMode = "single"

function isUuidV7GenerationMode(
  value: string | null
): value is UuidV7GenerationMode {
  return value === "single" || value === "batch"
}

function parseStoredNumber(value: string | null) {
  if (value === null) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function normalizeUuidV7BatchCount(value: number | null | undefined) {
  return Math.max(UUID_V7_MIN_BATCH_COUNT, normalizeUuidV7Count(value))
}

function UuidV7GeneratorClient({ messages }: UuidV7GeneratorClientProps) {
  const countId = useId()

  const [count, setCount] = useState(UUID_V7_DEFAULT_COUNT)
  const [mode, setMode] = useState<UuidV7GenerationMode>(UUID_V7_DEFAULT_MODE)
  const [settingsReady, setSettingsReady] = useState(false)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedMode = window.localStorage.getItem(STORAGE_KEYS.mode)
    const parsedCount = parseStoredNumber(storedCount)

    if (parsedCount !== null) {
      setCount(normalizeUuidV7BatchCount(parsedCount))
    }

    if (isUuidV7GenerationMode(storedMode)) {
      setMode(storedMode)
    } else if (
      parsedCount !== null &&
      normalizeUuidV7Count(parsedCount) > UUID_V7_MIN_COUNT
    ) {
      setMode("batch")
    }

    setSettingsReady(true)
  }, [])

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
    if (!settingsReady) {
      return
    }

    const normalizedCount = normalizeUuidV7BatchCount(count)

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    startTransition(() => {
      setGeneratedIds(
        generateUuidV7Ids(mode === "single" ? 1 : normalizedCount)
      )
    })
  }, [count, generationVersion, mode, settingsReady])

  const output = generatedIds.join("\n")
  const generatedAtMs = generatedIds[0]
    ? parseUuidV7Timestamp(generatedIds[0])
    : null
  const generatedAtLabel = useMemo(() => {
    if (generatedAtMs === null) {
      return messages.unavailableLabel
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(generatedAtMs))
  }, [generatedAtMs, messages.unavailableLabel])
  const downloadFilename =
    mode === "single" ? "uuid-v7.txt" : `uuid-v7-${count}.txt`

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

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <UuidV7OptionsCard
        className="min-w-0 xl:sticky xl:top-6 xl:self-start"
        messages={messages}
        countId={countId}
        mode={mode}
        count={count}
        onModeChange={setMode}
        onCountChange={(value) => {
          setCount(normalizeUuidV7BatchCount(Number(value)))
        }}
      />

      <UuidV7ResultsCard
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        generatedAtLabel={generatedAtLabel}
        generatedAtMs={generatedAtMs}
        messages={messages}
        output={output}
        count={generatedIds.length}
        isBatchMode={mode === "batch"}
        onRegenerate={() => {
          startTransition(() => {
            setGenerationVersion((current) => current + 1)
          })
        }}
      />
    </div>
  )
}

export default UuidV7GeneratorClient
