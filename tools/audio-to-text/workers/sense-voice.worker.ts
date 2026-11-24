import { toSegments } from "../core/transcript"
import { SAMPLE_RATE } from "../worker-messages"
import { loadRecognizer } from "./sense-voice-runtime"
import { speechUpdates } from "./voice-activity"
import type { Segment } from "../core/transcript"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

function send(message: TranscriptionResponse) {
  self.postMessage(message)
}

self.onmessage = async ({ data }: MessageEvent<TranscriptionRequest>) => {
  const { audio, language } = data
  if (!audio.some((sample) => sample !== 0)) {
    send({ type: "done", segments: [] })
    return
  }
  let stage: "modelError" | "transcriptionError" = "modelError"
  send({ type: "loading", backend: "wasm" })
  try {
    const { recognizer, vad } = await loadRecognizer(language, (progress) => {
      send({ type: "loading", backend: "wasm", progress })
    })
    stage = "transcriptionError"
    send({ type: "transcribing", backend: "wasm", progress: 0 })
    const duration = audio.length / SAMPLE_RATE
    const segments: Segment[] = []
    const started = performance.now()
    try {
      for (const { passages, progress } of speechUpdates(audio, vad)) {
        const previousCount = segments.length
        for (const { samples, start } of passages) {
          const stream = recognizer.createStream()
          try {
            stream.acceptWaveform(SAMPLE_RATE, samples)
            recognizer.decode(stream)
            const { text, timestamps }: { text: string; timestamps: number[] } =
              recognizer.getResult(stream)
            const startSeconds = start / SAMPLE_RATE
            const endSeconds = (start + samples.length) / SAMPLE_RATE
            const timestamp: [number, number] = [
              startSeconds + Math.max(0, timestamps[0] ?? 0),
              endSeconds,
            ]
            segments.push(...toSegments([{ text, timestamp }], duration))
          } finally {
            stream.free()
          }
        }

        const hasNewPassage = previousCount !== segments.length
        const elapsed = (performance.now() - started) / 1000
        const etaSeconds =
          elapsed >= 1 && progress < 1 && segments.length >= 2
            ? Math.max(1, Math.ceil((elapsed * (1 - progress)) / progress))
            : undefined
        send({
          type: "transcribing",
          backend: "wasm",
          progress,
          etaSeconds,
          partialSegments: hasNewPassage ? segments : undefined,
        })
      }
    } finally {
      vad.free()
      recognizer.free()
    }
    send({ type: "done", segments })
  } catch {
    send({ type: "error", stage })
  }
}
