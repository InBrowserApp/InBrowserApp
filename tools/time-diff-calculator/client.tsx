import { useEffect, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { ArrowLeftRight } from "@workspace/ui/icons"
import { STORAGE_KEYS, readStoredString } from "./client/storage"
import { ResultsCard } from "./components/results-card"
import { TimeDiffCard } from "./components/time-diff-card"
import {
  formatDurationLabel,
  formatFraction,
  formatIsoDuration,
  millisecondsToDurationParts,
} from "./core/duration"
import {
  buildTimeZoneOptions,
  formatInTimeZone,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from "./core/time-zone"

import type { TimeDiffCalculatorClientProps, TimeDiffResult } from "./types"

function getDefaultTimeZone(fallback: string) {
  try {
    const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : fallback
  } catch {
    return fallback
  }
}

function createResult(diffMilliseconds: number | null): TimeDiffResult | null {
  if (diffMilliseconds === null) {
    return null
  }

  const sign: 1 | -1 = diffMilliseconds < 0 ? -1 : 1
  const parts = millisecondsToDurationParts(Math.abs(diffMilliseconds))

  return {
    signedDuration: `${sign < 0 ? "-" : ""}${formatDurationLabel(parts)}`,
    absoluteDuration: formatDurationLabel(parts),
    isoDuration: formatIsoDuration(parts, sign),
    totalMilliseconds: String(diffMilliseconds),
    totalSeconds: formatFraction(diffMilliseconds / 1_000, 3),
    totalMinutes: formatFraction(diffMilliseconds / 60_000, 6),
    totalHours: formatFraction(diffMilliseconds / 3_600_000, 6),
    totalDays: formatFraction(diffMilliseconds / 86_400_000, 6),
  }
}

function TimeDiffCalculatorClient({ messages }: TimeDiffCalculatorClientProps) {
  const defaultTimeZone = useMemo(() => getDefaultTimeZone("UTC"), [])
  const [hasRestoredState, setHasRestoredState] = useState(false)
  const [startInput, setStartInput] = useState("")
  const [endInput, setEndInput] = useState("")
  const [startTimeZone, setStartTimeZone] = useState(defaultTimeZone)
  const [endTimeZone, setEndTimeZone] = useState(defaultTimeZone)

  const timeZoneOptions = useMemo(() => buildTimeZoneOptions(Date.now()), [])

  useEffect(() => {
    const restoredStartTimeZone = readStoredString(
      STORAGE_KEYS.startTimeZone,
      defaultTimeZone
    )
    const restoredEndTimeZone = readStoredString(
      STORAGE_KEYS.endTimeZone,
      defaultTimeZone
    )
    const safeStartTimeZone = isTimeZoneSupported(restoredStartTimeZone)
      ? restoredStartTimeZone
      : defaultTimeZone
    const safeEndTimeZone = isTimeZoneSupported(restoredEndTimeZone)
      ? restoredEndTimeZone
      : defaultTimeZone
    const now = Date.now()

    setStartTimeZone(safeStartTimeZone)
    setEndTimeZone(safeEndTimeZone)
    setStartInput(
      readStoredString(
        STORAGE_KEYS.startInput,
        formatInTimeZone(now, safeStartTimeZone)
      )
    )
    setEndInput(
      readStoredString(
        STORAGE_KEYS.endInput,
        formatInTimeZone(now + 60 * 60 * 1_000, safeEndTimeZone)
      )
    )
    setHasRestoredState(true)
  }, [defaultTimeZone])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.startInput, startInput)
    window.localStorage.setItem(STORAGE_KEYS.endInput, endInput)
    window.localStorage.setItem(STORAGE_KEYS.startTimeZone, startTimeZone)
    window.localStorage.setItem(STORAGE_KEYS.endTimeZone, endTimeZone)
  }, [endInput, endTimeZone, hasRestoredState, startInput, startTimeZone])

  const startParts = useMemo(() => parseDateTimeInput(startInput), [startInput])
  const endParts = useMemo(() => parseDateTimeInput(endInput), [endInput])
  const startError = Boolean(startInput.trim()) && !startParts
  const endError = Boolean(endInput.trim()) && !endParts

  const startTimestamp = useMemo(() => {
    if (!startParts) {
      return null
    }

    return toUtcTimestamp(startParts, startTimeZone)
  }, [startParts, startTimeZone])

  const endTimestamp = useMemo(() => {
    if (!endParts) {
      return null
    }

    return toUtcTimestamp(endParts, endTimeZone)
  }, [endParts, endTimeZone])

  const startOffsetLabel = useMemo(() => {
    const referenceTimestamp = startTimestamp ?? Date.now()

    return formatOffsetLabel(
      getTimeZoneOffsetMs(referenceTimestamp, startTimeZone)
    )
  }, [startTimeZone, startTimestamp])
  const endOffsetLabel = useMemo(() => {
    const referenceTimestamp = endTimestamp ?? Date.now()

    return formatOffsetLabel(
      getTimeZoneOffsetMs(referenceTimestamp, endTimeZone)
    )
  }, [endTimeZone, endTimestamp])

  const result = useMemo(
    () =>
      createResult(
        startTimestamp === null || endTimestamp === null
          ? null
          : endTimestamp - startTimestamp
      ),
    [endTimestamp, startTimestamp]
  )

  function handleSetNow(side: "start" | "end") {
    const now = Date.now()

    if (side === "start") {
      setStartInput(formatInTimeZone(now, startTimeZone))
      return
    }

    setEndInput(formatInTimeZone(now, endTimeZone))
  }

  function handleSwap() {
    const nextStartTimeZone = endTimeZone
    const nextEndTimeZone = startTimeZone
    const nextStartInput = endInput
    const nextEndInput = startInput

    setStartTimeZone(nextStartTimeZone)
    setEndTimeZone(nextEndTimeZone)
    setStartInput(nextStartInput)
    setEndInput(nextEndInput)
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-center">
        <TimeDiffCard
          messages={messages}
          side="start"
          title={messages.startLabel}
          timeZoneOptions={timeZoneOptions}
          input={startInput}
          timeZone={startTimeZone}
          offsetLabel={startOffsetLabel}
          error={startError}
          onInputChange={setStartInput}
          onTimeZoneChange={setStartTimeZone}
          onSetNow={() => {
            handleSetNow("start")
          }}
        />

        <div className="flex justify-center xl:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="swap-time-diff-values"
            onClick={handleSwap}
          >
            <ArrowLeftRight data-icon="inline-start" />
            {messages.swapLabel}
          </Button>
        </div>

        <TimeDiffCard
          messages={messages}
          side="end"
          title={messages.endLabel}
          timeZoneOptions={timeZoneOptions}
          input={endInput}
          timeZone={endTimeZone}
          offsetLabel={endOffsetLabel}
          error={endError}
          onInputChange={setEndInput}
          onTimeZoneChange={setEndTimeZone}
          onSetNow={() => {
            handleSetNow("end")
          }}
        />
      </div>

      <ResultsCard messages={messages} result={result} />
    </div>
  )
}

export default TimeDiffCalculatorClient
