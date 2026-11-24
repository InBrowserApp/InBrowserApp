import { initASRModule, OfflineRecognizer } from "@sherpaw/asr"
import { MODELS } from "../models"
import { modelDownloader } from "./model-download"
import { loadVad, SILERO_VAD } from "./voice-activity"

const MODEL_FILE = "model.int8.onnx"
const TOKENS_FILE = "tokens.txt"
const { repository, revision } = MODELS.senseVoice
const modelUrl = `https://huggingface.co/${repository}/resolve/${revision}`
const MODEL = { url: `${modelUrl}/${MODEL_FILE}`, size: 237_115_547 }
const TOKENS = { url: `${modelUrl}/${TOKENS_FILE}`, size: 315_894 }

export async function loadRecognizer(
  language: string,
  onProgress: (progress: number) => void
) {
  const download = modelDownloader(
    "audio-to-text-sense-voice",
    [MODEL, TOKENS, SILERO_VAD],
    onProgress
  )
  const [model, tokens, asr, vad] = await Promise.all([
    download(MODEL),
    download(TOKENS),
    initASRModule(),
    loadVad(download),
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
  return { recognizer, vad }
}
