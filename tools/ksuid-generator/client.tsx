import { startTransition, useEffect, useId, useState } from "react"

import { KsuidOptionsCard } from "./components/options-card"
import { KsuidResultsCard } from "./components/results-card"
import {
  formatDateTimeLocalInput,
  parseDateTimeLocalInput,
} from "./core/local-date"
import {
  KSUID_EPOCH_SECONDS,
  generateKsuidIds,
  isValidKsuidUnixSeconds,
  MAX_KSUID_TIMESTAMP,
  normalizeKsuidCount,
} from "./core/ksuid"

import type { KsuidMessages } from "./types"

type TimestampMode = "now" | "custom"

type KsuidGeneratorClientProps = Readonly<{
  messages: KsuidMessages
  language: string
}>

const DEFAULT_COUNT = 5

const STORAGE_KEYS = {
  count: "tools:ksuid-generator:count",
  timestampMode: "tools:ksuid-generator:timestamp-mode",
  customDateTime: "tools:ksuid-generator:custom-date-time",
  customUnixSeconds: "tools:ksuid-generator:custom-unix-seconds",
} as const

function getCurrentUnixSeconds() {
  return Math.floor(Date.now() / 1000)
}

function parseUnixSecondsInput(value: string) {
  if (value.trim() === "") {
    return null
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return Math.floor(parsed)
}

function formatMessage(
  template: string,
  replacements: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/gu, (_, key: string) =>
    Object.hasOwn(replacements, key) ? String(replacements[key]) : ""
  )
}

function KsuidGeneratorClient({
  messages,
  language,
}: KsuidGeneratorClientProps) {
  const countId = useId()
  const customDateTimeId = useId()
  const customUnixSecondsId = useId()

  const [count, setCount] = useState(DEFAULT_COUNT)
  const [timestampMode, setTimestampMode] = useState<TimestampMode>("now")
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [generatedAtUnixSeconds, setGeneratedAtUnixSeconds] = useState<
    number | null
  >(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [customDateTimeInput, setCustomDateTimeInput] = useState(() =>
    formatDateTimeLocalInput(getCurrentUnixSeconds() * 1000)
  )
  const [customUnixSecondsInput, setCustomUnixSecondsInput] = useState(() =>
    String(getCurrentUnixSeconds())
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedTimestampMode = window.localStorage.getItem(
      STORAGE_KEYS.timestampMode
    )
    const storedCustomDateTime = window.localStorage.getItem(
      STORAGE_KEYS.customDateTime
    )
    const storedCustomUnixSeconds = window.localStorage.getItem(
      STORAGE_KEYS.customUnixSeconds
    )

    if (storedCount !== null) {
      const parsedCount = Number(storedCount)

      if (Number.isFinite(parsedCount)) {
        setCount(normalizeKsuidCount(parsedCount))
      }
    }

    if (storedTimestampMode === "now" || storedTimestampMode === "custom") {
      setTimestampMode(storedTimestampMode)
    }

    if (storedCustomDateTime !== null) {
      setCustomDateTimeInput(storedCustomDateTime)
    }

    if (storedCustomUnixSeconds !== null) {
      setCustomUnixSecondsInput(storedCustomUnixSeconds)
      return
    }

    if (storedCustomDateTime !== null) {
      const parsedMs = parseDateTimeLocalInput(storedCustomDateTime)

      if (parsedMs !== null) {
        setCustomUnixSecondsInput(String(Math.floor(parsedMs / 1000)))
      }
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.count, String(count))
  }, [count])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.timestampMode, timestampMode)
  }, [timestampMode])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.customDateTime,
      customDateTimeInput
    )
  }, [customDateTimeInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.customUnixSeconds,
      customUnixSecondsInput
    )
  }, [customUnixSecondsInput])

  const customUnixSeconds = parseUnixSecondsInput(customUnixSecondsInput)
  const timestampError =
    timestampMode !== "custom"
      ? ""
      : customUnixSeconds === null
        ? messages.timestampInvalid
        : !isValidKsuidUnixSeconds(customUnixSeconds)
          ? formatMessage(messages.timestampOutOfRange, {
              min: KSUID_EPOCH_SECONDS,
              max: KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP,
            })
          : ""

  useEffect(() => {
    const normalizedCount = normalizeKsuidCount(count)

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    const unixSeconds =
      timestampMode === "custom" ? customUnixSeconds : getCurrentUnixSeconds()

    if (unixSeconds === null || !isValidKsuidUnixSeconds(unixSeconds)) {
      setGeneratedIds([])
      return
    }

    startTransition(() => {
      setGeneratedAtUnixSeconds(unixSeconds)
      setGeneratedIds(generateKsuidIds(normalizedCount, unixSeconds))
    })
  }, [count, customUnixSeconds, generationVersion, timestampMode])

  const output = generatedIds.join("\n")
  const downloadFilename =
    generatedAtUnixSeconds === null
      ? "ksuid.txt"
      : `ksuid-${count}-${generatedAtUnixSeconds}.txt`
  const generatedAtText =
    output.length === 0 || generatedAtUnixSeconds === null
      ? null
      : formatMessage(messages.generatedAtLabel, {
          seconds: new Intl.NumberFormat(language).format(
            generatedAtUnixSeconds
          ),
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

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <KsuidOptionsCard
        messages={messages}
        countId={countId}
        customDateTimeId={customDateTimeId}
        customUnixSecondsId={customUnixSecondsId}
        count={count}
        timestampMode={timestampMode}
        customDateTimeInput={customDateTimeInput}
        customUnixSecondsInput={customUnixSecondsInput}
        timestampError={timestampError}
        onCountChange={(value) => {
          setCount(normalizeKsuidCount(Number(value)))
        }}
        onTimestampModeChange={setTimestampMode}
        onCustomDateTimeChange={(value) => {
          setCustomDateTimeInput(value)

          const parsedMs = parseDateTimeLocalInput(value)

          if (parsedMs === null) {
            setCustomUnixSecondsInput("")
            return
          }

          setCustomUnixSecondsInput(String(Math.floor(parsedMs / 1000)))
        }}
        onCustomUnixSecondsChange={(value) => {
          setCustomUnixSecondsInput(value)

          const parsedUnixSeconds = parseUnixSecondsInput(value)

          if (parsedUnixSeconds === null) {
            setCustomDateTimeInput("")
            return
          }

          setCustomDateTimeInput(
            formatDateTimeLocalInput(parsedUnixSeconds * 1000)
          )
        }}
        onSetNow={() => {
          const currentUnixSeconds = getCurrentUnixSeconds()

          setCustomUnixSecondsInput(String(currentUnixSeconds))
          setCustomDateTimeInput(
            formatDateTimeLocalInput(currentUnixSeconds * 1000)
          )
        }}
      />

      <KsuidResultsCard
        messages={messages}
        output={output}
        generatedAtText={generatedAtText}
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        onRegenerate={() => {
          startTransition(() => {
            setGenerationVersion((current) => current + 1)
          })
        }}
      />
    </div>
  )
}

export default KsuidGeneratorClient
