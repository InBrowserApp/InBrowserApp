import { toSegments } from "../core/transcript"
import { SAMPLE_RATE } from "../worker-messages"
import { loadRecognizer, WINDOW_SAMPLES } from "./sense-voice-runtime"
import type { Segment } from "../core/transcript"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

const MAX_SPEECH_SAMPLES = 18 * SAMPLE_RATE

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
    let speechStart = 0
    let lastPublished = 0
    try {
      for (let offset = 0; offset < audio.length; offset += WINDOW_SAMPLES) {
        const end = Math.min(offset + WINDOW_SAMPLES, audio.length)
        vad.acceptWaveform(audio.subarray(offset, end))
        if (!vad.isDetected()) speechStart = end
        // Bound memory use and publish a passage even during sustained speech.
        if (end === audio.length || end - speechStart >= MAX_SPEECH_SAMPLES) {
          vad.flush()
          speechStart = end
        }

        const previousCount = segments.length
        while (!vad.isEmpty()) {
          const { samples, start } = vad.front()
          vad.pop()
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
        if (
          !hasNewPassage &&
          (vad.isDetected() || end - lastPublished < SAMPLE_RATE)
        )
          continue
        lastPublished = end
        const progress = end / audio.length
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
