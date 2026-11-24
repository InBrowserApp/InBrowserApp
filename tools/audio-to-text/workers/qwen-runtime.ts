import { initASRModule, OfflineRecognizer } from "@sherpaw/asr"
import { modelDownloader } from "./model-download"
import { loadVad, SILERO_VAD } from "./voice-activity"

const ASR_URL =
  "https://huggingface.co/cattle12/sherpa-onnx-qwen3-asr-0.6B-int8-2026-03-25/resolve/603954e3768c2354ccaf1ca43092e844d975641d"
const ALIGNER_URL =
  "https://huggingface.co/valoomba/Qwen3-ForcedAligner-0.6B-ONNX/resolve/261c9ed100c1b18a4a1fbc488e05625dc9a4ae5c"

const QWEN_ALIGNER_ASSETS = {
  model: { url: `${ALIGNER_URL}/onnx/model_q4.onnx`, size: 1_048_397_349 },
  tokenizer: { url: `${ALIGNER_URL}/tokenizer.json`, size: 11_429_733 },
  tokenizerConfig: {
    url: `${ALIGNER_URL}/tokenizer_config.json`,
    size: 12_696,
  },
}
const ASR_FILES = {
  "conv_frontend.onnx": 44_148_281,
  "encoder.int8.onnx": 182_491_662,
  "decoder.int8.onnx": 755_914_231,
  "tokenizer/merges.txt": 1_671_853,
  "tokenizer/tokenizer_config.json": 12_487,
  "tokenizer/vocab.json": 2_776_833,
}
const asrAssets = Object.entries(ASR_FILES).map(([path, size]) => ({
  path,
  url: `${ASR_URL}/${path}`,
  size,
}))

async function loadQwenRecognizer(
  timed: boolean,
  onProgress: (progress: number) => void
) {
  const download = modelDownloader(
    "audio-to-text-qwen",
    [
      ...asrAssets,
      SILERO_VAD,
      ...(timed ? Object.values(QWEN_ALIGNER_ASSETS) : []),
    ],
    onProgress
  )
  const [files, runtime, vad] = await Promise.all([
    Promise.all(asrAssets.map(download)),
    initASRModule(),
    loadVad(download),
  ])

  runtime.FS_createPath("/", "tokenizer", true, true)
  asrAssets.forEach(({ path }, index) => {
    const [directory, file] = path.includes("/") ? path.split("/") : ["/", path]
    runtime.FS_createDataFile(directory, file, files[index]!, true, false, true)
  })
  const recognizer = new OfflineRecognizer(
    {
      modelConfig: {
        debug: 0,
        tokens: "",
        qwen3Asr: {
          convFrontend: "conv_frontend.onnx",
          encoder: "encoder.int8.onnx",
          decoder: "decoder.int8.onnx",
          tokenizer: "tokenizer",
          maxTotalLen: 512,
          maxNewTokens: 256,
        },
      },
    },
    runtime
  )
  for (const { path } of asrAssets) runtime.FS_unlink(path)
  return { recognizer, vad, download }
}

export { loadQwenRecognizer, QWEN_ALIGNER_ASSETS }
