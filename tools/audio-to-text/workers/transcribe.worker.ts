import {
  env,
  pipeline,
  Tensor,
  WhisperTextStreamer,
} from "@huggingface/transformers"
import type {
  AutomaticSpeechRecognitionPipeline,
  WhisperTokenizer,
} from "@huggingface/transformers"
import { toSegments } from "../core/transcript"
import type { Segment } from "../core/transcript"
import { MODELS } from "../models"
import { SAMPLE_RATE } from "../worker-messages"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

env.allowLocalModels = false

const WINDOW_SECONDS = 30
const OVERLAP_SECONDS = 5
const PREVIEW_INTERVAL_MS = 250
const PREVIEW_CHARACTERS = 240

type WhisperWindow = { tokens: bigint[]; stride: number[] }

function completedSegments(
  tokenizer: WhisperTokenizer,
  windows: WhisperWindow[],
  covered: number
) {
  // Use the same overlap decoder as the pipeline. Its open tail can still
  // change when the next window arrives, so only publish closed passages.
  const [, result] = tokenizer._decode_asr(windows, {
    return_timestamps: true,
    force_full_sequences: false,
    time_precision: 0.02,
  })
  if (typeof result !== "object" || !result.chunks) return []
  return toSegments(
    result.chunks.flatMap(({ timestamp: [start, end], text }) =>
      start != null && end != null && end <= covered
        ? [{ timestamp: [start, end], text }]
        : []
    ),
    covered
  )
}

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
    let progress = 0
    let firstWindow: { covered: number; finishedAt: number } | undefined
    let etaSeconds: number | undefined
    let draft = ""
    let lastUpdate = -Infinity
    const tokenizer = transcribe.tokenizer as WhisperTokenizer
    const windows: WhisperWindow[] = []
    let tokens: bigint[] = []

    function publish(partialSegments?: Segment[]) {
      const text = draft.trim()
      const characters = Array.from(text)
      const preview =
        characters.length > PREVIEW_CHARACTERS
          ? `…${characters.slice(-PREVIEW_CHARACTERS).join("")}`
          : text || undefined
      send({
        type: "transcribing",
        backend,
        progress,
        etaSeconds,
        preview,
        partialSegments,
      })
      lastUpdate = performance.now()
    }

    const streamer = new WhisperTextStreamer(tokenizer, {
      skip_prompt: true,
      token_callback_function(generated) {
        tokens.push(...generated)
      },
      callback_function(text) {
        draft += text
        if (performance.now() - lastUpdate >= PREVIEW_INTERVAL_MS) publish()
      },
      on_finalize() {
        // Whisper calls end once per window. Its trailing overlap is
        // processed in the next window, except at the end of the recording.
        const covered =
          windowEnd >= duration ? duration : windowEnd - OVERLAP_SECONDS
        const now = performance.now()
        // Exclude initial audio preparation and language detection from the rate.
        if (firstWindow && covered < duration) {
          const elapsedSeconds = (now - firstWindow.finishedAt) / 1000
          const coveredSinceStart = covered - firstWindow.covered
          etaSeconds = Math.max(
            1,
            Math.ceil(
              (elapsedSeconds * (duration - covered)) / coveredSinceStart
            )
          )
        } else {
          etaSeconds = undefined
        }
        firstWindow ??= { covered, finishedAt: now }
        progress = covered / duration
        draft = ""
        if (covered < duration) {
          windows.push({
            tokens,
            stride: [
              WINDOW_SECONDS,
              windows.length ? OVERLAP_SECONDS : 0,
              OVERLAP_SECONDS,
            ],
          })
          publish(completedSegments(tokenizer, windows, covered))
        } else {
          publish()
        }
        tokens = []
        windowEnd += WINDOW_SECONDS - 2 * OVERLAP_SECONDS
      },
    })
    const result = await transcribe(audio, {
      ...prompt,
      task: "transcribe",
      return_timestamps: true,
      chunk_length_s: WINDOW_SECONDS,
      stride_length_s: OVERLAP_SECONDS,
      streamer,
    })
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
