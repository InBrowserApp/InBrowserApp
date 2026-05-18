type UuidV6MessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  countLabel: string
  timestampModeLabel: string
  timestampNowLabel: string
  timestampCustomLabel: string
  customDateTimeLabel: string
  customUnixMillisecondsLabel: string
  setNowLabel: string
  nodeModeLabel: string
  nodeRandomLabel: string
  nodeCustomLabel: string
  customNodeLabel: string
  customNodeDescription: string
  clockSequenceModeLabel: string
  clockSequenceRandomLabel: string
  clockSequenceCustomLabel: string
  customClockSequenceLabel: string
  customClockSequenceDescription: string
  timestampInvalid: string
  timestampOutOfRange: string
  nodeInvalid: string
  clockSequenceInvalid: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  generatedAtLabel: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type UuidV6Messages = UuidV6MessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV6Messages, UuidV6MessagesCatalog }
