import { startTransition, useEffect, useId, useMemo, useState } from "react"

import { UuidV6OptionsCard } from "./components/options-card"
import { UuidV6ResultsCard } from "./components/results-card"
import {
  formatDateTimeLocalInput,
  parseDateTimeLocalInput,
} from "./core/local-date"
import {
  UUID_CLOCK_SEQUENCE_MAX,
  UUID_V6_MAX_UNIX_MILLISECONDS,
  UUID_V6_MIN_UNIX_MILLISECONDS,
  generateUuidV6Batch,
  isValidUuidClockSequence,
  isValidUuidV6UnixMilliseconds,
  normalizeUuidV6Count,
  parseUuidNode,
} from "./core/uuid-v6"
import {
  getCurrentUnixMilliseconds,
  useUuidV6GeneratorState,
} from "./use-uuid-v6-generator-state"

import type { UuidV6Messages } from "./types"

type UuidV6GeneratorClientProps = Readonly<{
  messages: UuidV6Messages
}>

function parseIntegerInput(value: string) {
  if (value.trim() === "") {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? Math.floor(parsed) : null
}

function formatMessage(
  template: string,
  replacements: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/gu, (_, key: string) =>
    Object.hasOwn(replacements, key) ? String(replacements[key]) : ""
  )
}

function parseCustomNodeInput(value: string) {
  try {
    return parseUuidNode(value)
  } catch {
    return null
  }
}

function UuidV6GeneratorClient({ messages }: UuidV6GeneratorClientProps) {
  const countId = useId()
  const customDateTimeId = useId()
  const customUnixMillisecondsId = useId()
  const customNodeId = useId()
  const customClockSequenceId = useId()
  const state = useUuidV6GeneratorState()
  const {
    clockSequenceMode,
    count,
    customClockSequenceInput,
    customDateTimeInput,
    customNodeInput,
    customUnixMillisecondsInput,
    nodeMode,
    setClockSequenceMode,
    setCount,
    setCountState,
    setCustomClockSequenceInput,
    setCustomDateTimeInput,
    setCustomNodeInput,
    setCustomUnixMillisecondsInput,
    setNodeMode,
    setTimestampMode,
    timestampMode,
  } = state
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [generatedAtUnixMilliseconds, setGeneratedAtUnixMilliseconds] =
    useState<number | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const customUnixMilliseconds = parseIntegerInput(customUnixMillisecondsInput)
  const customClockSequence = parseIntegerInput(customClockSequenceInput)
  const customNode = useMemo(
    () => parseCustomNodeInput(customNodeInput),
    [customNodeInput]
  )
  const timestampError =
    timestampMode !== "custom"
      ? ""
      : customUnixMilliseconds === null
        ? messages.timestampInvalid
        : !isValidUuidV6UnixMilliseconds(customUnixMilliseconds)
          ? formatMessage(messages.timestampOutOfRange, {
              min: UUID_V6_MIN_UNIX_MILLISECONDS,
              max: UUID_V6_MAX_UNIX_MILLISECONDS,
            })
          : ""
  const nodeError =
    nodeMode === "custom" && customNode === null ? messages.nodeInvalid : ""
  const clockSequenceError =
    clockSequenceMode === "custom" &&
    (customClockSequence === null ||
      !isValidUuidClockSequence(customClockSequence))
      ? formatMessage(messages.clockSequenceInvalid, {
          max: UUID_CLOCK_SEQUENCE_MAX,
        })
      : ""
  const hasError = Boolean(timestampError || nodeError || clockSequenceError)

  useEffect(() => {
    const normalizedCount = normalizeUuidV6Count(count)

    if (count !== normalizedCount) {
      setCountState(normalizedCount)
      return
    }

    const unixMilliseconds =
      timestampMode === "custom"
        ? customUnixMilliseconds
        : getCurrentUnixMilliseconds()

    if (
      unixMilliseconds === null ||
      hasError ||
      (nodeMode === "custom" && customNode === null) ||
      (clockSequenceMode === "custom" && customClockSequence === null)
    ) {
      setGeneratedAtUnixMilliseconds(null)
      setGeneratedIds([])
      return
    }

    startTransition(() => {
      setGeneratedAtUnixMilliseconds(unixMilliseconds)
      setGeneratedIds(
        generateUuidV6Batch({
          count: normalizedCount,
          unixMilliseconds,
          nodeMode,
          customNode: customNode ?? undefined,
          clockSequenceMode,
          customClockSequence: customClockSequence ?? undefined,
        })
      )
    })
  }, [
    clockSequenceMode,
    count,
    customClockSequence,
    customNode,
    customUnixMilliseconds,
    generationVersion,
    hasError,
    nodeMode,
    setCountState,
    timestampMode,
  ])

  const output = generatedIds.join("\n")
  const downloadFilename =
    generatedAtUnixMilliseconds === null
      ? "uuid-v6.txt"
      : `uuid-v6-${count}-${generatedAtUnixMilliseconds}.txt`
  const generatedAtText =
    output.length === 0 || generatedAtUnixMilliseconds === null
      ? null
      : formatMessage(messages.generatedAtLabel, {
          milliseconds: String(generatedAtUnixMilliseconds),
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
      <UuidV6OptionsCard
        messages={messages}
        countId={countId}
        customDateTimeId={customDateTimeId}
        customUnixMillisecondsId={customUnixMillisecondsId}
        customNodeId={customNodeId}
        customClockSequenceId={customClockSequenceId}
        count={count}
        timestampMode={timestampMode}
        customDateTimeInput={customDateTimeInput}
        customUnixMillisecondsInput={customUnixMillisecondsInput}
        nodeMode={nodeMode}
        customNodeInput={customNodeInput}
        clockSequenceMode={clockSequenceMode}
        customClockSequenceInput={customClockSequenceInput}
        timestampError={timestampError}
        nodeError={nodeError}
        clockSequenceError={clockSequenceError}
        onCountChange={setCount}
        onTimestampModeChange={setTimestampMode}
        onCustomDateTimeChange={(value) => {
          setCustomDateTimeInput(value)

          const parsedMilliseconds = parseDateTimeLocalInput(value)

          setCustomUnixMillisecondsInput(
            parsedMilliseconds === null ? "" : String(parsedMilliseconds)
          )
        }}
        onCustomUnixMillisecondsChange={(value) => {
          setCustomUnixMillisecondsInput(value)

          const parsedMilliseconds = parseIntegerInput(value)

          setCustomDateTimeInput(
            parsedMilliseconds === null
              ? ""
              : formatDateTimeLocalInput(parsedMilliseconds)
          )
        }}
        onSetNow={() => {
          const currentUnixMilliseconds = getCurrentUnixMilliseconds()

          setCustomUnixMillisecondsInput(String(currentUnixMilliseconds))
          setCustomDateTimeInput(
            formatDateTimeLocalInput(currentUnixMilliseconds)
          )
        }}
        onNodeModeChange={setNodeMode}
        onCustomNodeChange={setCustomNodeInput}
        onClockSequenceModeChange={setClockSequenceMode}
        onCustomClockSequenceChange={setCustomClockSequenceInput}
      />

      <UuidV6ResultsCard
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

export default UuidV6GeneratorClient
