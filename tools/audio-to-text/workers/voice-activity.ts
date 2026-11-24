import { createVad, initVADModule } from "@sherpaw/vad"
import { SAMPLE_RATE } from "../worker-messages"
import type { VadInstance } from "@sherpaw/vad"
import type { DownloadModelAsset } from "./model-download"

const WINDOW_SAMPLES = 512
const MAX_SPEECH_SAMPLES = 18 * SAMPLE_RATE
const VAD_FILE = "silero_vad.onnx"
const SILERO_VAD = {
  url: `https://huggingface.co/csukuangfj/vad/resolve/af4fcfc9b8305246b1fe2ebcaf248975673166f1/${VAD_FILE}`,
  size: 1_807_522,
}

async function loadVad(download: DownloadModelAsset) {
  const [bytes, runtime] = await Promise.all([
    download(SILERO_VAD),
    initVADModule(),
  ])
  runtime.FS_createDataFile("/", VAD_FILE, bytes, true, false, true)
  const vad = createVad(runtime, {
    bufferSizeInSeconds: 30,
    sileroVad: {
      model: VAD_FILE,
      minSpeechDuration: 0.2,
      windowSize: WINDOW_SAMPLES,
    },
  })
  runtime.FS_unlink(VAD_FILE)
  return vad
}

function* speechUpdates(audio: Float32Array, vad: VadInstance) {
  let speechStart = 0
  let lastPublished = 0
  for (let offset = 0; offset < audio.length; offset += WINDOW_SAMPLES) {
    const end = Math.min(offset + WINDOW_SAMPLES, audio.length)
    vad.acceptWaveform(audio.subarray(offset, end))
    if (!vad.isDetected()) speechStart = end
    // Bound inference memory and deliver passages during sustained speech.
    if (end === audio.length || end - speechStart >= MAX_SPEECH_SAMPLES) {
      vad.flush()
      speechStart = end
    }

    if (
      vad.isEmpty() &&
      (vad.isDetected() || end - lastPublished < SAMPLE_RATE)
    )
      continue
    const passages = []
    while (!vad.isEmpty()) {
      passages.push(vad.front())
      vad.pop()
    }
    lastPublished = end
    yield { passages, progress: end / audio.length }
  }
}

export { loadVad, SILERO_VAD, speechUpdates }
