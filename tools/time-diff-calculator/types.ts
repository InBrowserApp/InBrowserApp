import type { TimeZoneOption } from "./core/time-zone"

type TimeDiffCalculatorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  startLabel: string
  endLabel: string
  timeZoneLabel: string
  dateTimeLabel: string
  dateTimePlaceholder: string
  formatHint: string
  nowLabel: string
  offsetLabel: string
  invalidDateTimeLabel: string
  swapLabel: string
  resultsLabel: string
  signedDurationLabel: string
  absoluteDurationLabel: string
  iso8601DurationLabel: string
  totalMillisecondsLabel: string
  totalSecondsLabel: string
  totalMinutesLabel: string
  totalHoursLabel: string
  totalDaysLabel: string
  copyLabel: string
  copiedLabel: string
}>

type TimeDiffCalculatorClientProps = Readonly<{
  messages: TimeDiffCalculatorMessages
}>

type TimeDiffResult = Readonly<{
  signedDuration: string
  absoluteDuration: string
  isoDuration: string
  totalMilliseconds: string
  totalSeconds: string
  totalMinutes: string
  totalHours: string
  totalDays: string
}>

type TimeDiffCardProps = Readonly<{
  messages: TimeDiffCalculatorMessages
  side: "start" | "end"
  title: string
  timeZoneOptions: readonly TimeZoneOption[]
  input: string
  timeZone: string
  offsetLabel: string
  error: boolean
  onInputChange: (value: string) => void
  onTimeZoneChange: (value: string) => void
  onSetNow: () => void
}>

type ResultsCardProps = Readonly<{
  messages: TimeDiffCalculatorMessages
  result: TimeDiffResult | null
}>

export type {
  ResultsCardProps,
  TimeDiffCalculatorClientProps,
  TimeDiffCalculatorMessages,
  TimeDiffCardProps,
  TimeDiffResult,
}
