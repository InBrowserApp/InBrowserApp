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
