import type { TimeZoneOption } from "./core/time-zone"

type TimeZoneConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  fromLabel: string
  toLabel: string
  timeZoneLabel: string
  dateTimeLabel: string
  dateTimePlaceholder: string
  formatHint: string
  nowLabel: string
  offsetLabel: string
  invalidDateTimeLabel: string
  swapLabel: string
  detailsLabel: string
  iso8601Label: string
  utcLabel: string
  unixMillisecondsLabel: string
  unixSecondsLabel: string
  copyLabel: string
  copiedLabel: string
}>

type TimeZoneConverterClientProps = Readonly<{
  messages: TimeZoneConverterMessages
}>

type TimeZoneDetailSnapshot = Readonly<{
  iso8601: string
  utc: string
  unixMilliseconds: string
  unixSeconds: string
}>

type TimeZoneCardProps = Readonly<{
  messages: TimeZoneConverterMessages
  side: "from" | "to"
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

type DetailsCardProps = Readonly<{
  messages: TimeZoneConverterMessages
  details: TimeZoneDetailSnapshot | null
}>

export type {
  DetailsCardProps,
  TimeZoneCardProps,
  TimeZoneConverterClientProps,
  TimeZoneConverterMessages,
}
