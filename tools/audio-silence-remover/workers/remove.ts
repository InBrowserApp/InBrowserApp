import { encodeWav } from "@workspace/pcm-audio"
import { audioLevels, SAMPLE_RATE, trimChannels } from "../core/silence"

type Range = { start: number; end: number }
export type Request =
  | { type: "analyze"; channels: Float32Array[] }
  | { type: "edit"; cuts: Range[] }
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
    const wav = encodeWav(trimChannels(channels, data.cuts), SAMPLE_RATE, 0)
    self.postMessage({ type: "edited", wav }, { transfer: [wav] })
  } catch {
    self.postMessage({ type: "error" })
  }
}
