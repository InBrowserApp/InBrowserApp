import { PreTrainedTokenizer } from "@huggingface/transformers"
import { env, InferenceSession } from "onnxruntime-web/wasm"
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url"
import { toSegments } from "../core/transcript"
import { SAMPLE_RATE } from "../worker-messages"
import { alignQwenChunk } from "./qwen-aligner"
import { qwenFeatureExtractor } from "./qwen-features"
import { QWEN_ALIGNER_ASSETS } from "./qwen-runtime"
import type { DownloadModelAsset } from "./model-download"

async function loadQwenTiming(download: DownloadModelAsset) {
  env.wasm.numThreads = 1
  env.wasm.wasmPaths = { wasm: new URL(wasmUrl, self.location.href).href }
  const { model, tokenizer, tokenizerConfig } = QWEN_ALIGNER_ASSETS
  const [weights, tokenizerFile, configFile] = await Promise.all([
    download(model),
    download(tokenizer),
    download(tokenizerConfig),
  ])
  const decoder = new TextDecoder()
  const tokens = new PreTrainedTokenizer(
    JSON.parse(decoder.decode(tokenizerFile)),
    JSON.parse(decoder.decode(configFile))
  )
  const session = await InferenceSession.create(weights, {
    executionProviders: ["wasm"],
  })
  const features = qwenFeatureExtractor()

  return {
    async align(
      samples: Float32Array,
      start: number,
      text: string,
      language: string,
      duration: number
    ) {
      const { input_features } = await features(samples, {
        max_length: samples.length,
      })
      const units = await alignQwenChunk(
        session,
        (input) => tokens.encode(input, { add_special_tokens: false }),
        input_features.data as Float32Array,
        input_features.dims[2]!,
        text,
        language
      )
      if (!units.length) throw new Error("No aligned speech")
      const offset = start / SAMPLE_RATE
      const end = Math.min(
        units.at(-1)!.end / 1000,
        samples.length / SAMPLE_RATE
      )
      const timestamp: [number, number] = [
        offset + units[0]!.start / 1000,
        offset + end,
      ]
      const passage = toSegments([{ text, timestamp }], duration)[0]
      if (!passage) throw new Error("No aligned passage")
      return passage
    },
    release: () => session.release().catch(() => undefined),
  }
}

export { loadQwenTiming }
