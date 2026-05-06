/* v8 ignore file -- type-only module */

import type { StationId } from "./core/encoders"

type StationDescriptionMap = Readonly<Record<StationId, string>>

type RadioTimecodeMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  stationLabel: string
  stationHint: string
  stationDescriptions: StationDescriptionMap
  signalTitle: string
  outputTitle: string
  previewTitle: string
  startLabel: string
  stopLabel: string
  startingLabel: string
  unsupportedAudioTitle: string
  unsupportedAudioDescription: string
  startFailedTitle: string
  startFailedDescription: string
  playbackStatusLabel: string
  playbackStatusPlaying: string
  playbackStatusIdle: string
  volumeLabel: string
  volumeHint: string
  offsetLabel: string
  offsetHint: string
  carrierLabel: string
  outputToneLabel: string
  attenuationLabel: string
  stationTimeLabel: string
  timeZoneLabel: string
  currentSymbolLabel: string
  upcomingSymbolsLabel: string
  previewDescription: string
  notesTitle: string
  notes: readonly string[]
  hzUnit: string
  millisecondsUnit: string
  percentUnit: string
}>

export type { RadioTimecodeMessages }
