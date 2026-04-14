type UnixTimestampConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  timestampLabel: string
  timestampPlaceholder: string
  invalidTimestamp: string
  nowLabel: string
  unitLabel: string
  autoLabel: string
  secondsLabel: string
  millisecondsLabel: string
  nanosecondsLabel: string
  detectedLabel: string
  digitsLabel: string
  dateTimeLabel: string
  iso8601Label: string
  utcLabel: string
  relativeLabel: string
  copyLabel: string
  copiedLabel: string
}>

type UnixTimestampConverterClientProps = Readonly<{
  language: string
  messages: UnixTimestampConverterMessages
}>

export type {
  UnixTimestampConverterClientProps,
  UnixTimestampConverterMessages,
}
