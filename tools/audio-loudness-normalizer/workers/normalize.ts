import { SAMPLE_RATE, measure, normalize } from "../core/loudness"
import { encodeWav } from "@workspace/pcm-audio"

export type Request =
  | { type: "measure"; channels: Float32Array[] }
  | { type: "render"; target: number; id: number }

export type Response =
  | { type: "measured"; loudness: number; peak: number }
  | {
      type: "rendered"
      id: number
      metrics: ReturnType<typeof normalize>
      wav: ArrayBuffer
    }
  | { type: "renderError"; id: number }
  | { type: "quiet" }

let channels: Float32Array[]
let analysis: ReturnType<typeof measure>

self.onmessage = ({ data }: MessageEvent<Request>) => {
  if (data.type === "measure") {
    channels = data.channels
    analysis = measure(channels)
    const { loudness, peak } = analysis
    self.postMessage(
      Number.isFinite(loudness)
        ? { type: "measured", loudness, peak }
        : { type: "quiet" }
    )
    return
  }
  try {
    const metrics = normalize(analysis, data.target)
    const wav = encodeWav(channels, SAMPLE_RATE, metrics.gain)
    self.postMessage(
      { type: "rendered", id: data.id, metrics, wav },
      { transfer: [wav] }
    )
  } catch {
    self.postMessage({ type: "renderError", id: data.id })
  }
}
