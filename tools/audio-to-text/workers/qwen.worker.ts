import { QWEN_LANGUAGES } from "../models"
import { SAMPLE_RATE } from "../worker-messages"
import { loadQwenRecognizer } from "./qwen-runtime"
import { speechUpdates } from "./voice-activity"
import type { Segment } from "../core/transcript"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"
import type { loadQwenTiming } from "./qwen-timing"

function send(message: TranscriptionResponse) {
  self.postMessage(message)
}

self.onmessage = async ({ data }: MessageEvent<TranscriptionRequest>) => {
  const { audio, language, model } = data
  if (!audio.some((sample) => sample !== 0)) {
    send({ type: "done", plainText: "" })
    return
  }

  const timed = model === "qwenTimed"
  let stage: "modelError" | "transcriptionError" = "modelError"
  let aligner: Awaited<ReturnType<typeof loadQwenTiming>> | undefined
  send({ type: "loading", backend: "wasm" })
  try {
    const { recognizer, vad, download } = await loadQwenRecognizer(
      timed,
      (progress) => {
        send({ type: "loading", backend: "wasm", progress })
      }
    )
    let alignmentFallback = false
    const text: string[] = []
    const segments: Segment[] = []
    try {
      if (timed) {
        try {
          const { loadQwenTiming } = await import("./qwen-timing")
          aligner = await loadQwenTiming(download)
        } catch {
          alignmentFallback = true
        }
      }
      stage = "transcriptionError"
      send({
        type: "transcribing",
        backend: "wasm",
        progress: 0,
        partialText: aligner ? undefined : "",
      })
      const duration = audio.length / SAMPLE_RATE
      const started = performance.now()
      for (const { passages, progress } of speechUpdates(audio, vad)) {
        const previousCount = text.length
        for (const { samples, start } of passages) {
          const stream = recognizer.createStream()
          let passage: string
          try {
            const name = QWEN_LANGUAGES[language]
            if (name) stream.setOption("language", name)
            stream.acceptWaveform(SAMPLE_RATE, samples)
            recognizer.decode(stream)
            passage = (recognizer.getResult(stream).text as string).trim()
          } finally {
            stream.free()
          }
          if (!passage) continue
          text.push(passage)
          if (aligner) {
            try {
              segments.push(
                await aligner.align(samples, start, passage, language, duration)
              )
            } catch {
              await aligner.release()
              aligner = undefined
              alignmentFallback = true
            }
          }
        }
        const hasNewText = text.length !== previousCount
        const elapsed = (performance.now() - started) / 1000
        const etaSeconds =
          elapsed >= 1 && progress < 1 && text.length >= 2
            ? Math.max(1, Math.ceil((elapsed * (1 - progress)) / progress))
            : undefined
        send({
          type: "transcribing",
          backend: "wasm",
          progress,
          etaSeconds,
          partialSegments: aligner && hasNewText ? segments : undefined,
          partialText: !aligner && hasNewText ? text.join("\n\n") : undefined,
        })
      }
    } finally {
      vad.free()
      recognizer.free()
      await aligner?.release()
    }
    send(
      aligner
        ? { type: "done", segments }
        : { type: "done", plainText: text.join("\n\n"), alignmentFallback }
    )
  } catch {
    send({ type: "error", stage })
  }
}
