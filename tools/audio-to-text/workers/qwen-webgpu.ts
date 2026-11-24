import { PreTrainedTokenizer } from "@huggingface/transformers"
import { env, InferenceSession, Tensor } from "onnxruntime-web/webgpu"
import mjsUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url"
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?gzip-url"
import { QWEN_LANGUAGES } from "../models"
import { qwenFeatureExtractor } from "./qwen-features"
import type { DownloadModelAsset } from "./model-download"

const MODEL_URL =
  "https://huggingface.co/jiangzhuo9357/Qwen3-ASR-0.6B-ONNX/resolve/4a01b95fafe2c9e3af77e33c18bbb7de349c62f6"
const FILES = {
  encoder: ["encoder.onnx", 745_766_355],
  prefill: ["decoder_init.int4.onnx", 353_078],
  step: ["decoder_step.int4.onnx", 354_803],
  weights: ["decoder_weights.int4.data", 382_035_968],
  embeddings: ["embed_tokens.int8.bin", 155_582_464],
  scales: ["embed_scales.f32.bin", 607_744],
  mel: ["mel_filters.json", 132_427],
  prompt: ["prompt_config.json", 2578],
  tokenizer: ["tokenizer.json", 11_429_377],
  tokenizerConfig: ["tokenizer_config.json", 12_488],
} as const

const QWEN_GPU_ASSETS = Object.values(FILES).map(([path, size]) => ({
  url: `${MODEL_URL}/${path}`,
  size,
}))
type Adapter = NonNullable<typeof env.webgpu.adapter>
type PromptConfig = {
  prompt: {
    prefix_ids: number[]
    suffix_ids: number[]
    audio_pad_id: number
    asr_text_id: number
    eos_ids: number[]
    max_new_tokens: number
  }
  language_prefix_ids: Record<string, number[]>
}

async function findQwenGpu() {
  try {
    const gpu = (
      navigator as Navigator & {
        gpu?: {
          requestAdapter: (options: {
            powerPreference: string
          }) => Promise<Adapter | null>
        }
      }
    ).gpu
    const adapter = await gpu?.requestAdapter({
      powerPreference: "high-performance",
    })
    return adapter &&
      !(adapter.info as { isFallbackAdapter?: boolean } | undefined)
        ?.isFallbackAdapter
      ? adapter
      : undefined
  } catch {
    return undefined
  }
}

async function initializeGpu(adapter: Adapter) {
  const response = await fetch(new URL(wasmUrl, self.location.href))
  if (!response.ok || !response.body)
    throw new Error("Could not load the WebGPU runtime")
  env.wasm.wasmBinary = await new Response(
    response.body.pipeThrough(new DecompressionStream("gzip"))
  ).arrayBuffer()
  env.wasm.wasmPaths = { mjs: new URL(mjsUrl, self.location.href).href }
  env.wasm.numThreads = 1
  env.webgpu.adapter = adapter
}

function positions(from: number, length: number) {
  return new Tensor(
    "int64",
    BigInt64Array.from({ length }, (_, index) => BigInt(from + index)),
    [1, length]
  )
}

function bestToken(scores: Float32Array) {
  let best = 0
  for (let index = 1; index < scores.length; index++) {
    if (scores[index]! > scores[best]!) best = index
  }
  return best
}

async function loadQwenGpu(download: DownloadModelAsset, adapter: Adapter) {
  await initializeGpu(adapter)
  function asset([path, size]: readonly [string, number]) {
    return download({ url: `${MODEL_URL}/${path}`, size })
  }

  const decoder = new TextDecoder()
  const [
    encoder,
    prefill,
    step,
    weights,
    embeddings,
    scaleBytes,
    mel,
    settings,
    tokenBytes,
    tokenConfig,
  ] = await Promise.all([
    asset(FILES.encoder),
    asset(FILES.prefill),
    asset(FILES.step),
    asset(FILES.weights),
    asset(FILES.embeddings),
    asset(FILES.scales),
    asset(FILES.mel),
    asset(FILES.prompt),
    asset(FILES.tokenizer),
    asset(FILES.tokenizerConfig),
  ])
  const config = JSON.parse(decoder.decode(settings)) as PromptConfig
  const modelEmbeddings = new Int8Array(embeddings.buffer)
  const scales = new Float32Array(scaleBytes.buffer)
  const tokenizer = new PreTrainedTokenizer(
    JSON.parse(decoder.decode(tokenBytes)),
    JSON.parse(decoder.decode(tokenConfig))
  )
  const extractor = qwenFeatureExtractor(JSON.parse(decoder.decode(mel)).data)
  const encoderSession = await InferenceSession.create(encoder, {
    executionProviders: ["webgpu"],
  })
  const decoderOptions = {
    executionProviders: ["webgpu"],
    externalData: [{ path: FILES.weights[0], data: weights }],
    preferredOutputLocation: {
      present_keys: "gpu-buffer",
      present_values: "gpu-buffer",
    },
  } satisfies InferenceSession.SessionOptions
  const prefillSession = await InferenceSession.create(prefill, decoderOptions)
  const stepSession = await InferenceSession.create(step, decoderOptions)

  function embed(ids: readonly number[], width: number) {
    const result = new Float32Array(ids.length * width)
    ids.forEach((id, index) => {
      const source = id * width
      const target = index * width
      const scale = scales[id]!
      for (let column = 0; column < width; column++) {
        result[target + column] = modelEmbeddings[source + column]! * scale
      }
    })
    return result
  }

  return {
    async recognize(samples: Float32Array, language: string) {
      const { prompt } = config
      const { input_features: features } = await extractor(samples, {
        max_length: samples.length,
      })
      const { audio_features: audio } = await encoderSession.run({
        mel: new Tensor(
          "float32",
          features.data as Float32Array,
          features.dims
        ),
      })
      const [, count, width] = audio!.dims
      const name = QWEN_LANGUAGES[language]
      const languagePrefix = name
        ? (config.language_prefix_ids[language] ?? [
            ...tokenizer.encode(`language ${name}`, {
              add_special_tokens: false,
            }),
            prompt.asr_text_id,
          ])
        : []
      const ids = [
        ...prompt.prefix_ids,
        ...Array<number>(count!).fill(prompt.audio_pad_id),
        ...prompt.suffix_ids,
        ...languagePrefix,
      ]
      const initial = embed(ids, width!)
      initial.set(
        audio!.data as Float32Array,
        prompt.prefix_ids.length * width!
      )
      audio!.dispose()

      let output = await prefillSession.run({
        input_embeds: new Tensor("float32", initial, [1, ids.length, width!]),
        position_ids: positions(0, ids.length),
      })
      const generated: number[] = []
      try {
        for (let index = 0; index < prompt.max_new_tokens; index++) {
          const token = bestToken(output.logits!.data as Float32Array)
          if (prompt.eos_ids.includes(token)) break
          generated.push(token)
          if (index + 1 === prompt.max_new_tokens) break
          const previous = output
          output = await stepSession.run({
            input_embeds: new Tensor("float32", embed([token], width!), [
              1,
              1,
              width!,
            ]),
            position_ids: positions(ids.length + index, 1),
            past_keys: previous.present_keys!,
            past_values: previous.present_values!,
          })
          for (const tensor of Object.values(previous)) tensor.dispose()
        }
      } finally {
        for (const tensor of Object.values(output)) tensor.dispose()
      }
      const start = generated.indexOf(prompt.asr_text_id) + 1
      return tokenizer
        .decode(generated.slice(start), { skip_special_tokens: true })
        .trim()
    },
    async release() {
      await Promise.allSettled([
        encoderSession.release(),
        prefillSession.release(),
        stepSession.release(),
      ])
    },
  }
}

export { findQwenGpu, loadQwenGpu, QWEN_GPU_ASSETS }
