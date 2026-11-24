import { env, WhisperFeatureExtractor } from "@huggingface/transformers"
import mjsUrl from "audio-transcription-runtime/ort-wasm-simd-threaded.jsep.mjs?url"
import wasmUrl from "audio-transcription-runtime/ort-wasm-simd-threaded.jsep.wasm?url"
import { SAMPLE_RATE } from "../worker-messages"

function qwenFeatureExtractor(melFilters?: number[][]) {
  const wasm = env.backends.onnx?.wasm
  if (wasm) {
    wasm.numThreads = 1
    wasm.wasmPaths = {
      mjs: new URL(mjsUrl, self.location.href).href,
      wasm: new URL(wasmUrl, self.location.href).href,
    }
  }
  return new WhisperFeatureExtractor({
    feature_size: 128,
    hop_length: 160,
    n_fft: 400,
    sampling_rate: SAMPLE_RATE,
    nb_max_frames: 3000,
    n_samples: 30 * SAMPLE_RATE,
    mel_filters: melFilters,
  })
}

export { qwenFeatureExtractor }
