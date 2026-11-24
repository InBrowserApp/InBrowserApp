import { env, pipeline, Tensor } from "@huggingface/transformers"
import type { AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers"
import { toSegments } from "../core/transcript"
import { MODELS } from "../models"
import { SAMPLE_RATE } from "../worker-messages"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

env.allowLocalModels = false

const WINDOW_SECONDS = 30
const OVERLAP_SECONDS = 5

function send(message: TranscriptionResponse, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer })
}

async function findAdapter() {
  const gpu = (
    navigator as Navigator & {
      gpu?: {
        requestAdapter: (options: {
          powerPreference: "high-performance"
        }) => Promise<{ features: ReadonlySet<string> } | null>
      }
    }
  ).gpu
  try {
    return await gpu?.requestAdapter({ powerPreference: "high-performance" })
  } catch {
    // WebGPU can be exposed even if the graphics driver cannot supply an adapter.
    return null
  }
}

async function detectLanguagePrompt(
  transcribe: AutomaticSpeechRecognitionPipeline,
  audio: Float32Array<ArrayBuffer>
) {
  // Whisper predicts the language token immediately after the start token.
  const config = transcribe.model.generation_config as NonNullable<
    AutomaticSpeechRecognitionPipeline["model"]["generation_config"]
  > & {
    decoder_start_token_id: number
    lang_to_id: Record<string, number>
    task_to_id: { transcribe: number }
  }
  const start = config.decoder_start_token_id
  const features = await transcribe.processor(
    audio.subarray(0, WINDOW_SECONDS * SAMPLE_RATE)
  )
  const tokens = new Tensor("int64", BigInt64Array.of(BigInt(start)), [1, 1])
  const output: { logits: Tensor } & Record<string, Tensor> =
    await transcribe.model.forward({
      ...features,
      decoder_input_ids: tokens,
    })
  const logits = output.logits.data as Float32Array
  const languages = Object.values(config.lang_to_id)
  const language = languages.reduce((best, id) =>
    logits[id]! > logits[best]! ? id : best
  )
  for (const tensor of Object.values(output)) tensor.dispose()
  return [start, language, config.task_to_id.transcribe]
}

self.onmessage = async ({ data }: MessageEvent<TranscriptionRequest>) => {
  const { audio, model, language, cpuOnly } = data
  if (!audio.some((sample) => sample !== 0)) {
    send({ type: "done", segments: [] })
    return
  }
  const adapter = cpuOnly ? null : await findAdapter()
  const backend = adapter ? "webgpu" : "wasm"
  const config = MODELS[model]
  const dtype =
    model === "turbo"
      ? adapter?.features.has("shader-f16")
        ? "q4f16"
        : "q4"
      : adapter
        ? "q4"
        : "q8"
  const sizes: Partial<Record<typeof dtype, number>> = config.sizes
  const bytes = sizes[dtype]! * 1_000_000
  const loaded = new Map<string, number>()
  let lastPercent = 0
  let stage: "modelError" | "transcriptionError" = "modelError"
  send({ type: "loading", backend })

  try {
    const transcribe = await pipeline(
      "automatic-speech-recognition",
      config.repository,
      {
        revision: config.revision,
        device: backend,
        dtype,
        progress_callback(event) {
          if (event.status !== "progress" || !event.file.endsWith(".onnx"))
            return
          loaded.set(event.file, event.loaded)
          const received = [...loaded.values()].reduce(
            (sum, value) => sum + value,
            0
          )
          const percent = Math.min(99, Math.floor((received / bytes) * 100))
          if (percent === lastPercent) return
          lastPercent = percent
          send({ type: "loading", backend, progress: percent / 100 })
        },
      }
    )
    stage = "transcriptionError"
    send({ type: "transcribing", backend, progress: 0 })
    const prompt = language
      ? { language }
      : { decoder_input_ids: await detectLanguagePrompt(transcribe, audio) }
    const duration = audio.length / SAMPLE_RATE
    let windowEnd = WINDOW_SECONDS
    const options = {
      ...prompt,
      task: "transcribe",
      return_timestamps: true,
      chunk_length_s: WINDOW_SECONDS,
      stride_length_s: OVERLAP_SECONDS,
      streamer: {
        put() {},
        end() {
          // Whisper calls end once per window. Its trailing overlap is
          // processed in the next window, except at the end of the recording.
          const covered =
            windowEnd >= duration ? duration : windowEnd - OVERLAP_SECONDS
          send({ type: "transcribing", backend, progress: covered / duration })
          windowEnd += WINDOW_SECONDS - 2 * OVERLAP_SECONDS
        },
      },
    }
    const result = await transcribe(audio, options)
    const output = Array.isArray(result) ? result[0] : result
    send({
      type: "done",
      segments: toSegments(output?.chunks ?? [], duration),
    })
  } catch {
    if (adapter) {
      // Start CPU inference in a fresh worker so a failed GPU session is freed.
      send({ type: "retry", audio }, [audio.buffer])
    } else {
      send({ type: "error", stage })
    }
  }
}
