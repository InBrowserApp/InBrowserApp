import { initASRModule, OfflineRecognizer } from "@sherpaw/asr"
import { createVad, initVADModule } from "@sherpaw/vad"
import { MODELS } from "../models"

export const WINDOW_SAMPLES = 512
const MODEL_FILE = "model.int8.onnx"
const TOKENS_FILE = "tokens.txt"
const VAD_FILE = "silero_vad.onnx"
const { repository, revision } = MODELS.senseVoice
const modelUrl = `https://huggingface.co/${repository}/resolve/${revision}`
const vadUrl =
  "https://huggingface.co/csukuangfj/vad/resolve/af4fcfc9b8305246b1fe2ebcaf248975673166f1"

export async function loadRecognizer(
  language: string,
  onProgress: (progress: number) => void
) {
  const cache = await self.caches
    ?.open("audio-to-text-sense-voice")
    .catch(() => undefined)
  const assets = {
    model: { url: `${modelUrl}/${MODEL_FILE}`, size: 237_115_547 },
    tokens: { url: `${modelUrl}/${TOKENS_FILE}`, size: 315_894 },
    vad: { url: `${vadUrl}/${VAD_FILE}`, size: 1_807_522 },
  }
  const total = Object.values(assets).reduce(
    (bytes, { size }) => bytes + size,
    0
  )
  let received = 0
  let lastPercent = 0

  async function download({ url, size }: { url: string; size: number }) {
    const cached = await cache?.match(url).catch(() => undefined)
    const response =
      cached ?? (await fetch(url, { referrerPolicy: "no-referrer" }))
    if (!response.ok || !response.body) throw new Error("Model download failed")

    const store =
      !cached && cache?.put(url, response.clone()).catch(() => undefined)
    const bytes = new Uint8Array(size)
    let offset = 0
    try {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytes.set(value, offset)
        offset += value.byteLength
        received += value.byteLength
        const percent = Math.min(99, Math.floor((received / total) * 100))
        if (percent !== lastPercent) {
          lastPercent = percent
          onProgress(percent / 100)
        }
      }
      if (offset !== size) throw new Error("Model download is incomplete")
    } catch (error) {
      await store
      await cache?.delete(url).catch(() => undefined)
      throw error
    }
    await store
    return bytes
  }

  const [model, tokens, voiceActivity, asr, vadRuntime] = await Promise.all([
    download(assets.model),
    download(assets.tokens),
    download(assets.vad),
    initASRModule(),
    initVADModule(),
  ])
  asr.FS_createDataFile("/", MODEL_FILE, model, true, false, true)
  asr.FS_createDataFile("/", TOKENS_FILE, tokens, true, false, true)
  vadRuntime.FS_createDataFile("/", VAD_FILE, voiceActivity, true, false, true)
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
  const vad = createVad(vadRuntime, {
    bufferSizeInSeconds: 30,
    sileroVad: {
      model: VAD_FILE,
      minSpeechDuration: 0.2,
      windowSize: WINDOW_SAMPLES,
    },
  })
  asr.FS_unlink(MODEL_FILE)
  asr.FS_unlink(TOKENS_FILE)
  vadRuntime.FS_unlink(VAD_FILE)
  return { recognizer, vad }
}
