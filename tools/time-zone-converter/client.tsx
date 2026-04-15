import { useEffect, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { ArrowLeftRight } from "@workspace/ui/icons"
import { STORAGE_KEYS, readStoredString } from "./client/storage"
import { DetailsCard } from "./components/details-card"
import { TimeZoneCard } from "./components/time-zone-card"
import {
  buildTimeZoneOptions,
  formatInTimeZone,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from "./core/time-zone"

import type { TimeZoneConverterClientProps } from "./types"

function getDefaultTimeZone(fallback: string) {
  try {
    const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : fallback
  } catch {
    return fallback
  }
}

function resolveDefaultTimeZones() {
  const defaultFromTimeZone = getDefaultTimeZone("UTC")
  const defaultToCandidate =
    defaultFromTimeZone === "UTC" ? "America/New_York" : "UTC"
  const defaultToTimeZone = isTimeZoneSupported(defaultToCandidate)
    ? defaultToCandidate
    : "UTC"

  return {
    from: defaultFromTimeZone,
    to: defaultToTimeZone,
  } as const
}

function TimeZoneConverterClient({ messages }: TimeZoneConverterClientProps) {
  const defaults = useMemo(() => resolveDefaultTimeZones(), [])
  const [hasRestoredState, setHasRestoredState] = useState(false)
  const [fromInput, setFromInput] = useState("")
  const [toInput, setToInput] = useState("")
  const [fromTimeZone, setFromTimeZone] = useState<string>(defaults.from)
  const [toTimeZone, setToTimeZone] = useState<string>(defaults.to)
  const [lastEdited, setLastEdited] = useState<"from" | "to">("from")

  const timeZoneOptions = useMemo(() => buildTimeZoneOptions(Date.now()), [])

  useEffect(() => {
    const restoredFromTimeZone = readStoredString(
      STORAGE_KEYS.fromTimeZone,
      defaults.from
    )
    const restoredToTimeZone = readStoredString(
      STORAGE_KEYS.toTimeZone,
      defaults.to
    )
    const safeFromTimeZone = isTimeZoneSupported(restoredFromTimeZone)
      ? restoredFromTimeZone
      : defaults.from
    const safeToTimeZone = isTimeZoneSupported(restoredToTimeZone)
      ? restoredToTimeZone
      : defaults.to

    setFromTimeZone(safeFromTimeZone)
    setToTimeZone(safeToTimeZone)
    setFromInput(
      readStoredString(
        STORAGE_KEYS.fromInput,
        formatInTimeZone(Date.now(), safeFromTimeZone)
      )
    )
    setToInput(
      readStoredString(
        STORAGE_KEYS.toInput,
        formatInTimeZone(Date.now(), safeToTimeZone)
      )
    )
    setHasRestoredState(true)
  }, [defaults.from, defaults.to])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.fromInput, fromInput)
    window.localStorage.setItem(STORAGE_KEYS.toInput, toInput)
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, fromTimeZone)
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, toTimeZone)
  }, [fromInput, fromTimeZone, hasRestoredState, toInput, toTimeZone])

  const fromParts = useMemo(() => parseDateTimeInput(fromInput), [fromInput])
  const toParts = useMemo(() => parseDateTimeInput(toInput), [toInput])
  const fromError = Boolean(fromInput.trim()) && !fromParts
  const toError = Boolean(toInput.trim()) && !toParts

  const baseTimestamp = useMemo(() => {
    if (lastEdited === "from") {
      if (!fromParts) {
        return null
      }

      return toUtcTimestamp(fromParts, fromTimeZone)
    }

    if (!toParts) {
      return null
    }

    return toUtcTimestamp(toParts, toTimeZone)
  }, [fromParts, fromTimeZone, lastEdited, toParts, toTimeZone])

  const referenceTimestamp = baseTimestamp ?? Date.now()
  const fromOffsetLabel = useMemo(
    () =>
      formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp, fromTimeZone)),
    [fromTimeZone, referenceTimestamp]
  )
  const toOffsetLabel = useMemo(
    () =>
      formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp, toTimeZone)),
    [referenceTimestamp, toTimeZone]
  )

  useEffect(() => {
    if (baseTimestamp === null) {
      return
    }

    if (lastEdited === "from") {
      const nextToInput = formatInTimeZone(baseTimestamp, toTimeZone)

      setToInput((current) => (current === nextToInput ? current : nextToInput))
      return
    }

    const nextFromInput = formatInTimeZone(baseTimestamp, fromTimeZone)

    setFromInput((current) =>
      current === nextFromInput ? current : nextFromInput
    )
  }, [baseTimestamp, fromTimeZone, lastEdited, toTimeZone])

  const details = useMemo(() => {
    if (baseTimestamp === null) {
      return null
    }

    return {
      iso8601: new Date(baseTimestamp).toISOString(),
      utc: new Date(baseTimestamp).toUTCString(),
      unixMilliseconds: String(baseTimestamp),
      unixSeconds: String(Math.floor(baseTimestamp / 1000)),
    }
  }, [baseTimestamp])

  function handleSetNow(side: "from" | "to") {
    const now = Date.now()

    if (side === "from") {
      setFromInput(formatInTimeZone(now, fromTimeZone))
      setLastEdited("from")
      return
    }

    setToInput(formatInTimeZone(now, toTimeZone))
    setLastEdited("to")
  }

  function handleSwap() {
    const nextFromTimeZone = toTimeZone
    const nextToTimeZone = fromTimeZone
    const nextFromInput = toInput
    const nextToInput = fromInput

    setFromTimeZone(nextFromTimeZone)
    setToTimeZone(nextToTimeZone)
    setFromInput(nextFromInput)
    setToInput(nextToInput)
    setLastEdited("from")
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-center">
        <TimeZoneCard
          messages={messages}
          side="from"
          title={messages.fromLabel}
          timeZoneOptions={timeZoneOptions}
          input={fromInput}
          timeZone={fromTimeZone}
          offsetLabel={fromOffsetLabel}
          error={fromError}
          onInputChange={(value) => {
            setFromInput(value)
            setLastEdited("from")
          }}
          onTimeZoneChange={setFromTimeZone}
          onSetNow={() => {
            handleSetNow("from")
          }}
        />

        <div className="flex justify-center xl:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="swap-time-zones"
            onClick={handleSwap}
          >
            <ArrowLeftRight data-icon="inline-start" />
            {messages.swapLabel}
          </Button>
        </div>

        <TimeZoneCard
          messages={messages}
          side="to"
          title={messages.toLabel}
          timeZoneOptions={timeZoneOptions}
          input={toInput}
          timeZone={toTimeZone}
          offsetLabel={toOffsetLabel}
          error={toError}
          onInputChange={(value) => {
            setToInput(value)
            setLastEdited("to")
          }}
          onTimeZoneChange={setToTimeZone}
          onSetNow={() => {
            handleSetNow("to")
          }}
        />
      </div>

      <DetailsCard messages={messages} details={details} />
    </div>
  )
}

export default TimeZoneConverterClient
