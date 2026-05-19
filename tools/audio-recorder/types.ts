import type { ToolMeta } from "@workspace/tool-sdk"

type AudioRecorderMessages = Readonly<{
  meta: ToolMeta
  controlTitle: string
  controlDescription: string
  recordButton: string
  pauseButton: string
  resumeButton: string
  stopButton: string
  retryButton: string
  preparingLabel: string
  statusLabel: string
  statusIdle: string
  statusRecording: string
  statusPaused: string
  durationLabel: string
  unsupportedTitle: string
  unsupportedDescription: string
  permissionDeniedTitle: string
  permissionDeniedDescription: string
  recordingFailedTitle: string
  recordingFailedDescription: string
  outputTitle: string
  emptyOutputTitle: string
  emptyOutputDescription: string
  playbackLabel: string
  formatLabel: string
  unknownFormatLabel: string
  fileSizeLabel: string
  downloadButton: string
  clearButton: string
  privacyNote: string
  formatNote: string
}>

export type { AudioRecorderMessages }
