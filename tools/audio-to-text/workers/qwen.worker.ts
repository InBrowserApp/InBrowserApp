import { SAMPLE_RATE } from "../worker-messages"
import { loadQwenRecognizer } from "./qwen-runtime"
import { speechUpdates } from "./voice-activity"
import type { Segment } from "../core/transcript"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"
import type { loadQwenTiming } from "./qwen-timing"

function send(message: TranscriptionResponse, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer })
}

async function gpuBackend(cpuOnly: boolean) {
  if (cpuOnly || !("gpu" in navigator)) return undefined
  try {
    const { findQwenGpu, loadQwenGpu, QWEN_GPU_ASSETS } =
      await import("./qwen-webgpu")
    const adapter = await findQwenGpu()
    return adapter
      ? {
          assets: QWEN_GPU_ASSETS,
          load: (download: Parameters<typeof loadQwenGpu>[0]) =>
            loadQwenGpu(download, adapter),
        }
      : undefined
  } catch {
    return undefined
  }
}

self.onmessage = async ({ data }: MessageEvent<TranscriptionRequest>) => {
  const { audio, language, model, cpuOnly } = data
  if (!audio.some((sample) => sample !== 0)) {
    send({ type: "done", plainText: "" })
    return
  }

  const timed = model === "qwenTimed"
  const gpu = await gpuBackend(cpuOnly)
  const backend = gpu ? "webgpu" : "wasm"
  let stage: "modelError" | "transcriptionError" = "modelError"
  let aligner: Awaited<ReturnType<typeof loadQwenTiming>> | undefined
  send({ type: "loading", backend })
  try {
    const { engine, vad, download } = await loadQwenRecognizer(
      timed,
      (progress) => send({ type: "loading", backend, progress }),
      gpu
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
        backend,
        progress: 0,
        partialText: aligner ? undefined : "",
      })
      const duration = audio.length / SAMPLE_RATE
      const started = performance.now()
      for (const { passages, progress } of speechUpdates(audio, vad)) {
        const previousCount = text.length
        for (const { samples, start } of passages) {
          const passage = await engine.recognize(samples, language)
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
          backend,
          progress,
          etaSeconds,
          partialSegments: aligner && hasNewText ? segments : undefined,
          partialText: !aligner && hasNewText ? text.join("\n\n") : undefined,
        })
      }
    } finally {
      vad.free()
      await engine.release()
      await aligner?.release()
    }
    send(
      aligner
        ? { type: "done", segments }
        : { type: "done", plainText: text.join("\n\n"), alignmentFallback }
    )
  } catch {
    if (gpu) send({ type: "retry", audio }, [audio.buffer])
    else send({ type: "error", stage })
  }
}
