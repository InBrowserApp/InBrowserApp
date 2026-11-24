import { InferenceSession, Tensor } from "onnxruntime-web/webgpu"
import { MODELS } from "../models"
import { parseNormalization, senseVoiceFeatures } from "./sense-voice-features"
import { SENSE_VOICE_TOKENS } from "./sense-voice-runtime"
import { findWebGpuAdapter, initializeWebGpu } from "./webgpu-runtime"
import type { DownloadModelAsset } from "./model-download"
import type { SenseVoiceRecognizer } from "./sense-voice-runtime"

const { repository, revision } = MODELS.senseVoiceGpu
const MODEL = {
  url: `https://huggingface.co/${repository}/resolve/${revision}/model.w8a32.onnx`,
  size: 267_523_195,
}
const NORMALIZATION = {
  url: "https://huggingface.co/FunAudioLLM/SenseVoiceSmall/resolve/3847d57b6bdf2dd8875cb1508d2af43d80a16bf7/am.mvn",
  size: 11_203,
}
const LANGUAGE_IDS: Readonly<Record<string, number>> = {
  zh: 3,
  en: 4,
  yue: 7,
  ja: 11,
  ko: 12,
}

function parseTokens(source: string) {
  const tokens: string[] = []
  for (const line of source.trimEnd().split(/\r?\n/)) {
    const divider = line.lastIndexOf(" ")
    tokens[Number(line.slice(divider + 1))] = line.slice(0, divider)
  }
  return tokens
}

function decodeSenseVoice(
  logits: Float32Array,
  frames: number,
  vocab: number,
  tokens: string[]
) {
  let previous = 0
  let startSeconds = 0
  let text = ""
  // The first four positions are language, emotion, event, and ITN controls.
  for (let frame = 4; frame < frames; frame++) {
    const offset = frame * vocab
    let best = 0
    for (let id = 1; id < vocab; id++) {
      if (logits[offset + id]! > logits[offset + best]!) best = id
    }
    const token = tokens[best]
    if (best !== 0 && best !== previous && token && !token.startsWith("<|")) {
      if (!text) startSeconds = (frame - 4) * 0.06
      text += token
    }
    previous = best
  }
  return { text: text.replaceAll("▁", " ").trim(), startSeconds }
}

async function findSenseVoiceGpu() {
  const adapter = await findWebGpuAdapter()
  if (!adapter) return undefined

  return {
    assets: [MODEL, NORMALIZATION],
    async load(
      download: DownloadModelAsset,
      language: string
    ): Promise<SenseVoiceRecognizer> {
      await initializeWebGpu(adapter)
      const [model, stats, vocabulary] = await Promise.all([
        download(MODEL),
        download(NORMALIZATION),
        download(SENSE_VOICE_TOKENS),
      ])
      const decoder = new TextDecoder()
      const normalization = parseNormalization(decoder.decode(stats))
      const tokens = parseTokens(decoder.decode(vocabulary))
      const session = await InferenceSession.create(model, {
        executionProviders: ["webgpu"],
      })
      const control = (value: number) =>
        new Tensor("int32", Int32Array.of(value), [1])
      return {
        async recognize(samples) {
          const { frames, values, width } = senseVoiceFeatures(
            samples,
            normalization
          )
          if (frames === 0) return { text: "", startSeconds: 0 }
          const { logits } = await session.run({
            x: new Tensor("float32", values, [1, frames, width]),
            x_length: control(frames),
            language: control(LANGUAGE_IDS[language] ?? 0),
            text_norm: control(14),
          })
          try {
            return decodeSenseVoice(
              logits!.data as Float32Array,
              logits!.dims[1]!,
              logits!.dims[2]!,
              tokens
            )
          } finally {
            logits?.dispose()
          }
        },
        release: () => session.release(),
      }
    },
  }
}

export { findSenseVoiceGpu }
