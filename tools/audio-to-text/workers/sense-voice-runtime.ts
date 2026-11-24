import { initASRModule, OfflineRecognizer } from "@sherpaw/asr"
import { MODELS } from "../models"
import { SAMPLE_RATE } from "../worker-messages"
import { modelDownloader } from "./model-download"
import { loadVad, SILERO_VAD } from "./voice-activity"
import type { DownloadModelAsset, ModelAsset } from "./model-download"

const MODEL_FILE = "model.int8.onnx"
const TOKENS_FILE = "tokens.txt"
const { repository, revision } = MODELS.senseVoice
const modelUrl = `https://huggingface.co/${repository}/resolve/${revision}`
const MODEL = { url: `${modelUrl}/${MODEL_FILE}`, size: 237_115_547 }
export const SENSE_VOICE_TOKENS = {
  url: `${modelUrl}/${TOKENS_FILE}`,
  size: 315_894,
}

type Recognition = { text: string; startSeconds: number }
export type SenseVoiceRecognizer = {
  recognize: (samples: Float32Array) => Recognition | Promise<Recognition>
  release: () => void | Promise<void>
}

export async function loadRecognizer(
  language: string,
  onProgress: (progress: number) => void,
  gpu?: {
    assets: ModelAsset[]
    load: (
      download: DownloadModelAsset,
      language: string
    ) => Promise<SenseVoiceRecognizer>
  }
) {
  const download = modelDownloader(
    "audio-to-text-sense-voice",
    [...(gpu?.assets ?? [MODEL]), SENSE_VOICE_TOKENS, SILERO_VAD],
    onProgress
  )
  const [engine, vad] = await Promise.all([
    gpu ? gpu.load(download, language) : loadCpu(download, language),
    loadVad(download),
  ])
  return { engine, vad }
}

async function loadCpu(
  download: DownloadModelAsset,
  language: string
): Promise<SenseVoiceRecognizer> {
  const [model, tokens, asr] = await Promise.all([
    download(MODEL),
    download(SENSE_VOICE_TOKENS),
    initASRModule(),
  ])
  asr.FS_createDataFile("/", MODEL_FILE, model, true, false, true)
  asr.FS_createDataFile("/", TOKENS_FILE, tokens, true, false, true)
  const recognizer = new OfflineRecognizer(
    {
      modelConfig: {
        debug: 0,
        tokens: TOKENS_FILE,
        senseVoice: {
          model: MODEL_FILE,
          language: language || "auto",
          useInverseTextNormalization: 1,
        },
      },
    },
    asr
  )
  asr.FS_unlink(MODEL_FILE)
  asr.FS_unlink(TOKENS_FILE)
  return {
    recognize(samples) {
      const stream = recognizer.createStream()
      try {
        stream.acceptWaveform(SAMPLE_RATE, samples)
        recognizer.decode(stream)
        const { text, timestamps }: { text: string; timestamps: number[] } =
          recognizer.getResult(stream)
        return { text, startSeconds: Math.max(0, timestamps[0] ?? 0) }
      } finally {
        stream.free()
      }
    },
    release: () => recognizer.free(),
  }
}
