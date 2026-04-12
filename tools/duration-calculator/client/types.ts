import type { DurationParts } from "../core/duration"
import type { TimeZoneOption } from "../core/time-zone"

type DurationCalculatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  baseTimeLabel: string
  timeZoneLabel: string
  timeZonePlaceholder: string
  dateTimeLabel: string
  dateTimePlaceholder: string
  formatHint: string
  nowLabel: string
  offsetLabel: string
  invalidDateTimeLabel: string
  durationLabel: string
  durationIsoLabel: string
  durationPlaceholder: string
  durationHint: string
  daysLabel: string
  hoursLabel: string
  minutesLabel: string
  secondsLabel: string
  millisecondsLabel: string
  invalidDurationLabel: string
  resultsLabel: string
  addLabel: string
  subtractLabel: string
  iso8601Label: string
  unixMillisecondsLabel: string
  unixSecondsLabel: string
  copyLabel: string
  copiedLabel: string
}>

type DurationInputSource = "iso" | "parts"

type DurationCalculatorClientProps = Readonly<{
  messages: DurationCalculatorMessages
}>

type ResultSnapshot = Readonly<{
  dateTime: string
  iso8601: string
  unixMilliseconds: string
  unixSeconds: string
}>

type BaseTimeCardProps = Readonly<{
  messages: DurationCalculatorMessages
  timeZoneOptions: readonly TimeZoneOption[]
  baseInput: string
  baseTimeZone: string
  baseOffsetLabel: string
  baseError: boolean
  onBaseInputChange: (value: string) => void
  onBaseTimeZoneChange: (value: string) => void
  onSetNow: () => void
}>

type DurationCardProps = Readonly<{
  messages: DurationCalculatorMessages
  durationIsoInput: string
  durationParts: DurationParts
  normalizedDurationIso: string
  durationIsoInvalid: boolean
  onDurationIsoInputChange: (value: string) => void
  onDurationPartChange: (
    key: keyof DurationParts,
    value: number | string
  ) => void
}>

type ResultsCardProps = Readonly<{
  messages: DurationCalculatorMessages
  title: string
  result: ResultSnapshot | null
}>

export type {
  BaseTimeCardProps,
  DurationCalculatorClientProps,
  DurationCalculatorMessages,
  DurationInputSource,
  DurationCardProps,
  ResultSnapshot,
  ResultsCardProps,
}
