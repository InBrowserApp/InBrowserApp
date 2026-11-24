import type { Segment } from "./transcript"
import type { WHISPER_MODELS } from "./whisper"

type Backend = "webgpu" | "wasm"
export type TranscriptionRequest<
  ModelId extends string = keyof typeof WHISPER_MODELS,
> = {
  audio: Float32Array<ArrayBuffer>
  model: ModelId
  language: string
  cpuOnly: boolean
}
export type TranscriptionResponse =
  | { type: "loading"; backend: Backend; progress?: number }
  | {
      type: "transcribing"
      backend: Backend
      progress: number
      etaSeconds?: number
      preview?: string
      partialSegments?: Segment[]
      partialText?: string
    }
  | { type: "done"; segments: Segment[]; plainText?: never }
  | {
      type: "done"
      plainText: string
      segments?: never
      alignmentFallback?: boolean
    }
  | { type: "retry"; audio: Float32Array<ArrayBuffer> }
  | { type: "error"; stage: "modelError" | "transcriptionError" }

export const SAMPLE_RATE = 16000
