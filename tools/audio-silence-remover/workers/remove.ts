import { encodeWav } from "@workspace/pcm-audio"
import { audioLevels, keptSpans, SAMPLE_RATE } from "../core/silence"
import type { SilenceCut } from "../core/silence"

export type Request =
  | { type: "analyze"; channels: Float32Array[] }
  | { type: "edit"; cuts: SilenceCut[] }
export type Response =
  | { type: "analyzed"; audio: ReturnType<typeof audioLevels> }
  | { type: "edited"; wav: ArrayBuffer }
  | { type: "error" }

let channels: Float32Array[]
self.onmessage = ({ data }: MessageEvent<Request>) => {
  if (data.type === "analyze") {
    channels = data.channels
    const audio = audioLevels(channels)
    self.postMessage(
      { type: "analyzed", audio },
      { transfer: [audio.levels.buffer] }
    )
    return
  }
  try {
    const wav = encodeWav(channels, SAMPLE_RATE, 0, {
      spans: keptSpans(channels[0]!.length, data.cuts),
      fadeFrames: Math.round(SAMPLE_RATE * 0.005),
    })
    self.postMessage({ type: "edited", wav }, { transfer: [wav] })
  } catch {
    self.postMessage({ type: "error" })
  }
}
