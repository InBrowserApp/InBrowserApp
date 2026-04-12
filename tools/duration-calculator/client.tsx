import { useEffect, useMemo, useState } from "react"

import {
  DEFAULT_BASE_INPUT,
  DEFAULT_BASE_TIME_ZONE,
  DEFAULT_DURATION_ISO,
  DEFAULT_DURATION_PARTS,
  STORAGE_KEYS,
  readStoredDurationParts,
  readStoredString,
} from "./client/storage"
import {
  areDurationPartsEqual,
  createResultSnapshot,
  getDefaultTimeZone,
  parseNonNegativeInteger,
} from "./client/helpers"
import { BaseTimeCard } from "./components/base-time-card"
import { DurationCard } from "./components/duration-card"
import { ResultsCard } from "./components/results-card"
import {
  durationPartsToMilliseconds,
  formatIsoDuration,
  normalizeDurationParts,
  parseIsoDuration,
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

import type {
  DurationCalculatorClientProps,
  DurationInputSource,
} from "./client/types"
import type { DurationParts } from "./core/duration"

function DurationCalculatorClient({ messages }: DurationCalculatorClientProps) {
  const [hasRestoredState, setHasRestoredState] = useState(false)
  const [baseInput, setBaseInput] = useState(DEFAULT_BASE_INPUT)
  const [baseTimeZone, setBaseTimeZone] = useState(DEFAULT_BASE_TIME_ZONE)
  const [durationInputSource, setDurationInputSource] =
    useState<DurationInputSource>("iso")
  const [durationIsoInput, setDurationIsoInput] = useState(DEFAULT_DURATION_ISO)
  const [durationParts, setDurationParts] = useState(DEFAULT_DURATION_PARTS)

  const timeZoneOptions = useMemo(() => buildTimeZoneOptions(Date.now()), [])

  useEffect(() => {
    const restoredTimeZone = readStoredString(
      STORAGE_KEYS.baseTimeZone,
      getDefaultTimeZone(DEFAULT_BASE_TIME_ZONE)
    )
    const safeTimeZone = isTimeZoneSupported(restoredTimeZone)
      ? restoredTimeZone
      : getDefaultTimeZone(DEFAULT_BASE_TIME_ZONE)

    setBaseTimeZone(safeTimeZone)
    setBaseInput(
      readStoredString(
        STORAGE_KEYS.baseInput,
        formatInTimeZone(Date.now(), safeTimeZone)
      )
    )
    const restoredDurationIso = window.localStorage.getItem(
      STORAGE_KEYS.durationIso
    )
    const parsedDurationIso = restoredDurationIso
      ? parseIsoDuration(restoredDurationIso)
      : null

    if (parsedDurationIso && parsedDurationIso.sign > 0) {
      setDurationInputSource("iso")
      setDurationIsoInput(restoredDurationIso ?? DEFAULT_DURATION_ISO)
      setDurationParts(parsedDurationIso.parts)
    } else {
      const restoredDurationParts = readStoredDurationParts()

      setDurationInputSource("parts")
      setDurationIsoInput(formatIsoDuration(restoredDurationParts))
      setDurationParts(restoredDurationParts)
    }

    setHasRestoredState(true)
  }, [])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.baseInput, baseInput)
  }, [baseInput, hasRestoredState])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.baseTimeZone, baseTimeZone)
  }, [baseTimeZone, hasRestoredState])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.durationIso, durationIsoInput)
  }, [durationIsoInput, hasRestoredState])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.durationParts,
      JSON.stringify(durationParts)
    )
  }, [durationParts, hasRestoredState])

  const baseParts = useMemo(() => parseDateTimeInput(baseInput), [baseInput])
  const baseError = Boolean(baseInput.trim()) && !baseParts
  const baseTimestamp = useMemo(() => {
    if (!baseParts) {
      return null
    }

    return toUtcTimestamp(baseParts, baseTimeZone)
  }, [baseParts, baseTimeZone])
  const baseOffsetLabel = useMemo(() => {
    const referenceTimestamp = baseTimestamp ?? Date.now()

    return formatOffsetLabel(
      getTimeZoneOffsetMs(referenceTimestamp, baseTimeZone)
    )
  }, [baseTimeZone, baseTimestamp])

  const durationIsoParsed = useMemo(() => {
    const parsed = parseIsoDuration(durationIsoInput)

    if (!parsed || parsed.sign < 0) {
      return null
    }

    return parsed
  }, [durationIsoInput])
  const durationIsoInvalid =
    Boolean(durationIsoInput.trim()) && !durationIsoParsed
  const normalizedDurationParts = useMemo(
    () => normalizeDurationParts(durationParts),
    [durationParts]
  )
  const normalizedDurationIso = useMemo(
    () => formatIsoDuration(normalizedDurationParts),
    [normalizedDurationParts]
  )

  useEffect(() => {
    if (
      durationInputSource === "iso" &&
      durationIsoParsed &&
      !areDurationPartsEqual(durationIsoParsed.parts, durationParts)
    ) {
      setDurationParts(durationIsoParsed.parts)
    }
  }, [durationInputSource, durationIsoParsed, durationParts])

  useEffect(() => {
    if (durationInputSource !== "parts") {
      return
    }

    if (!areDurationPartsEqual(normalizedDurationParts, durationParts)) {
      setDurationParts(normalizedDurationParts)
      return
    }

    setDurationIsoInput((current) =>
      current === normalizedDurationIso ? current : normalizedDurationIso
    )
  }, [
    durationInputSource,
    durationParts,
    normalizedDurationIso,
    normalizedDurationParts,
  ])

  const effectiveDurationParts = useMemo(() => {
    if (durationInputSource === "iso") {
      return durationIsoParsed?.parts ?? null
    }

    return normalizedDurationParts
  }, [durationInputSource, durationIsoParsed, normalizedDurationParts])
  const resolvedDurationIso = useMemo(() => {
    if (!effectiveDurationParts) {
      return ""
    }

    return formatIsoDuration(effectiveDurationParts)
  }, [effectiveDurationParts])

  const durationMs = useMemo(() => {
    if (!effectiveDurationParts) {
      return null
    }

    return durationPartsToMilliseconds(effectiveDurationParts)
  }, [effectiveDurationParts])
  const addedResult = createResultSnapshot(
    baseTimestamp === null || durationMs === null
      ? null
      : baseTimestamp + durationMs,
    baseTimeZone
  )
  const subtractedResult = createResultSnapshot(
    baseTimestamp === null || durationMs === null
      ? null
      : baseTimestamp - durationMs,
    baseTimeZone
  )

  function handleDurationPartChange(
    key: keyof DurationParts,
    value: number | string
  ) {
    setDurationInputSource("parts")
    setDurationParts((current) => ({
      ...current,
      [key]: parseNonNegativeInteger(value),
    }))
  }

  function handleDurationIsoInputChange(value: string) {
    setDurationInputSource("iso")
    setDurationIsoInput(value)
  }

  function handleSetNow() {
    setBaseInput(formatInTimeZone(Date.now(), baseTimeZone))
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <BaseTimeCard
          messages={messages}
          timeZoneOptions={timeZoneOptions}
          baseInput={baseInput}
          baseTimeZone={baseTimeZone}
          baseOffsetLabel={baseOffsetLabel}
          baseError={baseError}
          onBaseInputChange={setBaseInput}
          onBaseTimeZoneChange={setBaseTimeZone}
          onSetNow={handleSetNow}
        />
        <DurationCard
          messages={messages}
          durationIsoInput={durationIsoInput}
          durationParts={durationParts}
          normalizedDurationIso={resolvedDurationIso}
          durationIsoInvalid={durationIsoInvalid}
          onDurationIsoInputChange={handleDurationIsoInputChange}
          onDurationPartChange={handleDurationPartChange}
        />
      </div>

      <div className="grid gap-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {messages.resultsLabel}
        </h2>
        <div className="grid gap-6 xl:grid-cols-2">
          <ResultsCard
            messages={messages}
            title={messages.addLabel}
            result={addedResult}
          />
          <ResultsCard
            messages={messages}
            title={messages.subtractLabel}
            result={subtractedResult}
          />
        </div>
      </div>
    </div>
  )
}

export default DurationCalculatorClient
