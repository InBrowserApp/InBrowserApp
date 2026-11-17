import type copy from "./messages/en.json"
import type { ToolMeta } from "@workspace/tool-sdk"

export type AudioEditorMessages = typeof copy & { meta: ToolMeta }

export type AudioClip = {
  id: string
  name: string
  buffer: AudioBuffer
  peaks: number[]
  start: number
  end: number
}

export type PcmClip = { channels: Float32Array[] }

export type OutputFormat = "mp3" | "wav" | "ogg"
export type CompressionQuality = "small" | "standard" | "high"
export type JoinSettings = {
  mode: "none" | "gap" | "crossfade"
  seconds: number
}
export type ExportSettings = {
  format: OutputFormat
  quality: CompressionQuality
  smooth: boolean
  join: JoinSettings
}
export type AudioResult = { url: string; format: OutputFormat; bytes: number }
export type EncodeRequest = { clips: PcmClip[]; settings: ExportSettings }
export type EncodeResponse =
  | { progress: number }
  | { buffer: ArrayBuffer }
  | { error: true }
