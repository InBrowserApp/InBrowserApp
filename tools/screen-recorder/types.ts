import type { ToolMeta } from "@workspace/tool-sdk"

type RecorderMessages = Readonly<{
  title: string
  description: string
  startLabel: string
  preparingLabel: string
  pauseLabel: string
  resumeLabel: string
  stopLabel: string
  retryLabel: string
  statusLabel: string
  durationLabel: string
  statusChecking: string
  statusReady: string
  statusRecording: string
  statusPaused: string
}>

type SettingsMessages = Readonly<{
  title: string
  description: string
  systemAudioLabel: string
  systemAudioDescription: string
  microphoneLabel: string
  microphoneDescription: string
  microphoneUnsupported: string
}>

type OutputMessages = Readonly<{
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
  formatLabel: string
  fileSizeLabel: string
  fileNameLabel: string
  fileNamePlaceholder: string
  downloadLabel: string
  clearLabel: string
  formatUnknown: string
}>

type AlertMessages = Readonly<{
  unsupportedTitle: string
  unsupportedDescription: string
  screenPermissionTitle: string
  screenPermissionDescription: string
  microphonePermissionTitle: string
  microphonePermissionDescription: string
  microphoneUnsupportedTitle: string
  genericErrorTitle: string
  genericErrorDescription: string
}>

type ScreenRecorderMessages = Readonly<{
  meta: ToolMeta
  recorder: RecorderMessages
  settings: SettingsMessages
  output: OutputMessages
  alerts: AlertMessages
}>

type RecorderStatus = "idle" | "recording" | "paused"
type SupportStatus = "checking" | "supported" | "unsupported"
type RecorderError =
  | "screen-permission"
  | "microphone-permission"
  | "microphone-unsupported"
  | "generic"

type ScreenRecordingOutput = Readonly<{
  blob: Blob
  mimeType: string
  fileName: string
  durationMs: number
}>

export type {
  AlertMessages,
  OutputMessages,
  RecorderError,
  RecorderMessages,
  RecorderStatus,
  ScreenRecorderMessages,
  ScreenRecordingOutput,
  SettingsMessages,
  SupportStatus,
}
