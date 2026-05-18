import { startTransition, useEffect, useId, useMemo, useState } from "react"

import { UuidV1OptionsCard } from "./components/options-card"
import { UuidV1ResultsCard } from "./components/results-card"
import {
  generateUuidV1Batch,
  normalizeMacAddress,
  normalizeUuidV1ClockSequence,
  normalizeUuidV1Count,
  parseMacAddress,
  randomMacAddress,
  randomUuidV1ClockSequence,
} from "./core/uuid-v1"

import type { UuidV1Messages } from "./types"

type UuidV1GeneratorClientProps = Readonly<{
  messages: UuidV1Messages
  language: string
}>

type GenerationMode = "single" | "batch"

const DEFAULT_BATCH_COUNT = 10
const DEFAULT_MAC_ADDRESS = "02:00:00:00:00:00"
const DEFAULT_CLOCK_SEQUENCE = 0

const STORAGE_KEYS = {
  generationMode: "tools:uuid-v1-generator:generation-mode",
  count: "tools:uuid-v1-generator:count",
  macAddress: "tools:uuid-v1-generator:mac-address",
  clockSequence: "tools:uuid-v1-generator:clock-sequence",
} as const

function formatMessage(
  template: string,
  replacements: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/gu, (_, key: string) =>
    Object.hasOwn(replacements, key) ? String(replacements[key]) : ""
  )
}

function parseStoredNumber(value: string | null) {
  if (value === null) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function parseStoredGenerationMode(value: string | null) {
  return value === "single" || value === "batch" ? value : null
}

function normalizeUuidV1BatchCount(value: number | null | undefined) {
  return Math.max(2, normalizeUuidV1Count(value))
}

function UuidV1GeneratorClient({
  messages,
  language,
}: UuidV1GeneratorClientProps) {
  const countId = useId()
  const macAddressId = useId()
  const clockSequenceId = useId()

  const [generationMode, setGenerationMode] = useState<GenerationMode>("single")
  const [batchCount, setBatchCount] = useState(DEFAULT_BATCH_COUNT)
  const [macAddress, setMacAddress] = useState(DEFAULT_MAC_ADDRESS)
  const [clockSequence, setClockSequence] = useState(DEFAULT_CLOCK_SEQUENCE)
  const [settingsReady, setSettingsReady] = useState(false)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [generatedAtMs, setGeneratedAtMs] = useState<number | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedGenerationMode = parseStoredGenerationMode(
      window.localStorage.getItem(STORAGE_KEYS.generationMode)
    )
    const storedCount = parseStoredNumber(
      window.localStorage.getItem(STORAGE_KEYS.count)
    )
    const storedMacAddress = window.localStorage.getItem(
      STORAGE_KEYS.macAddress
    )
    const storedClockSequence = parseStoredNumber(
      window.localStorage.getItem(STORAGE_KEYS.clockSequence)
    )

    if (storedGenerationMode !== null) {
      setGenerationMode(storedGenerationMode)
    } else if (storedCount !== null && normalizeUuidV1Count(storedCount) > 1) {
      setGenerationMode("batch")
    }

    if (storedCount !== null) {
      setBatchCount(normalizeUuidV1BatchCount(storedCount))
    }

    setMacAddress(
      storedMacAddress
        ? (normalizeMacAddress(storedMacAddress) ?? randomMacAddress())
        : randomMacAddress()
    )

    setClockSequence(
      storedClockSequence === null
        ? randomUuidV1ClockSequence()
        : normalizeUuidV1ClockSequence(storedClockSequence)
    )
    setSettingsReady(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.generationMode, generationMode)
  }, [generationMode, settingsReady])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.count, String(batchCount))
  }, [batchCount, settingsReady])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.macAddress, macAddress)
  }, [macAddress, settingsReady])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !settingsReady) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.clockSequence,
      String(clockSequence)
    )
  }, [clockSequence, settingsReady])

  const macAddressBytes = useMemo(
    () => parseMacAddress(macAddress),
    [macAddress]
  )
  const macAddressError =
    macAddress.trim() === ""
      ? messages.macAddressRequired
      : macAddressBytes === null
        ? messages.macAddressInvalid
        : ""
  const effectiveCount = generationMode === "single" ? 1 : batchCount

  useEffect(() => {
    if (!settingsReady) {
      return
    }

    const normalizedBatchCount = normalizeUuidV1BatchCount(batchCount)

    if (batchCount !== normalizedBatchCount) {
      setBatchCount(normalizedBatchCount)
      return
    }

    if (macAddressBytes === null) {
      setGeneratedAtMs(null)
      setGeneratedIds([])
      return
    }

    const nextGeneratedAtMs = Date.now()

    startTransition(() => {
      setGeneratedAtMs(nextGeneratedAtMs)
      setGeneratedIds(
        generateUuidV1Batch(effectiveCount, {
          msecs: nextGeneratedAtMs,
          node: macAddressBytes,
          clockSequence,
        })
      )
    })
  }, [
    batchCount,
    clockSequence,
    effectiveCount,
    generationVersion,
    macAddressBytes,
    settingsReady,
  ])

  const output = generatedIds.join("\n")
  const downloadFilename =
    generatedAtMs === null
      ? "uuid-v1.txt"
      : generationMode === "single"
        ? `uuid-v1-${generatedAtMs}.txt`
        : `uuid-v1-batch-${effectiveCount}-${generatedAtMs}.txt`
  const generatedAtText =
    generatedAtMs === null
      ? null
      : formatMessage(messages.generatedAtLabel, {
          time: new Intl.DateTimeFormat(language, {
            dateStyle: "medium",
            timeStyle: "medium",
          }).format(new Date(generatedAtMs)),
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
      <UuidV1OptionsCard
        messages={messages}
        countId={countId}
        macAddressId={macAddressId}
        clockSequenceId={clockSequenceId}
        generationMode={generationMode}
        count={batchCount}
        macAddress={macAddress}
        clockSequence={clockSequence}
        macAddressError={macAddressError}
        onGenerationModeChange={(nextGenerationMode) => {
          setGenerationMode(nextGenerationMode)
        }}
        onCountChange={(value) => {
          setBatchCount(normalizeUuidV1BatchCount(Number(value)))
        }}
        onMacAddressChange={setMacAddress}
        onMacAddressBlur={() => {
          const normalized = normalizeMacAddress(macAddress)

          if (normalized) {
            setMacAddress(normalized)
          }
        }}
        onClockSequenceChange={(value) => {
          setClockSequence(normalizeUuidV1ClockSequence(Number(value)))
        }}
        onRandomMacAddress={() => {
          setMacAddress(randomMacAddress())
        }}
        onRandomClockSequence={() => {
          setClockSequence(randomUuidV1ClockSequence())
        }}
      />

      <UuidV1ResultsCard
        messages={messages}
        output={output}
        generatedAtText={generatedAtText}
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        isBatchMode={generationMode === "batch"}
        onRegenerate={() => {
          startTransition(() => {
            setGenerationVersion((current) => current + 1)
          })
        }}
      />
    </div>
  )
}

export default UuidV1GeneratorClient
