import { toSegments } from "../core/transcript"
import { SAMPLE_RATE } from "../worker-messages"
import { loadRecognizer } from "./sense-voice-runtime"
import { speechUpdates } from "./voice-activity"
import type { Segment } from "../core/transcript"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

function send(message: TranscriptionResponse, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer })
}

self.onmessage = async ({ data }: MessageEvent<TranscriptionRequest>) => {
  const { audio, language, model, cpuOnly } = data
  if (!audio.some((sample) => sample !== 0)) {
    send({ type: "done", segments: [] })
    return
  }
  const tryGpu = model === "senseVoiceGpu" && !cpuOnly
  let stage: "modelError" | "transcriptionError" = "modelError"
  try {
    const gpu =
      tryGpu && "gpu" in navigator
        ? await (await import("./sense-voice-webgpu")).findSenseVoiceGpu()
        : undefined
    if (tryGpu && !gpu) {
      send({ type: "retry", audio }, [audio.buffer])
      return
    }
    const backend = gpu ? "webgpu" : "wasm"
    send({ type: "loading", backend })
    const { engine, vad } = await loadRecognizer(
      language,
      (progress) => send({ type: "loading", backend, progress }),
      gpu
    )
    stage = "transcriptionError"
    send({ type: "transcribing", backend, progress: 0 })
    const duration = audio.length / SAMPLE_RATE
    const segments: Segment[] = []
    const started = performance.now()
    try {
      for (const { passages, progress } of speechUpdates(audio, vad)) {
        const previousCount = segments.length
        for (const { samples, start } of passages) {
          const recognized = await engine.recognize(samples)
          const timestamp: [number, number] = [
            start / SAMPLE_RATE + recognized.startSeconds,
            (start + samples.length) / SAMPLE_RATE,
          ]
          segments.push(
            ...toSegments([{ text: recognized.text, timestamp }], duration)
          )
        }

        const hasNewPassage = previousCount !== segments.length
        const elapsed = (performance.now() - started) / 1000
        const etaSeconds =
          elapsed >= 1 && progress < 1 && segments.length >= 2
            ? Math.max(1, Math.ceil((elapsed * (1 - progress)) / progress))
            : undefined
        send({
          type: "transcribing",
          backend,
          progress,
          etaSeconds,
          partialSegments: hasNewPassage ? segments : undefined,
        })
      }
    } finally {
      vad.free()
      await engine.release()
    }
    send({ type: "done", segments })
  } catch {
    if (tryGpu) send({ type: "retry", audio }, [audio.buffer])
    else send({ type: "error", stage })
  }
}
