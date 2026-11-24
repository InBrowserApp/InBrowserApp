import { createWhisperWorker } from "@workspace/local-speech/worker"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "@workspace/local-speech"
import type { Segment } from "@workspace/local-speech/transcript"

export type RecognitionStatus = Extract<
  TranscriptionResponse,
  { type: "loading" | "transcribing" }
>

export async function recognize(
  audio: Float32Array<ArrayBuffer>,
  language: string,
  signal: AbortSignal,
  onProgress: (status: RecognitionStatus) => void
): Promise<Segment[]> {
  const result = await run(audio, false)
  if (result.type === "done") return result.segments ?? []
  const retry = await run(result.audio, true)
  if (retry.type === "done") return retry.segments ?? []
  throw new Error("Transcription failed")

  function run(samples: Float32Array<ArrayBuffer>, cpuOnly: boolean) {
    signal.throwIfAborted()
    return new Promise<
      Extract<TranscriptionResponse, { type: "done" | "retry" }>
    >((resolve, reject) => {
      const worker = createWhisperWorker()
      const abort = () => finish(() => reject(signal.reason))
      function finish(callback: () => void) {
        signal.removeEventListener("abort", abort)
        worker.terminate()
        callback()
      }
      signal.addEventListener("abort", abort, { once: true })
      worker.onerror = () =>
        finish(() => reject(new Error("Transcription worker failed")))
      worker.onmessage = ({ data }: MessageEvent<TranscriptionResponse>) => {
        switch (data.type) {
          case "loading":
          case "transcribing":
            onProgress(data)
            break
          case "done":
          case "retry":
            finish(() => resolve(data))
            break
          case "error":
            finish(() => reject(new Error(data.stage)))
        }
      }
      const request: TranscriptionRequest = {
        audio: samples,
        model: "base",
        language,
        cpuOnly,
      }
      worker.postMessage(request, [samples.buffer])
    })
  }
}
