import { detectTempo } from "../core/tempo"

self.onmessage = ({ data }: MessageEvent<Float32Array[][]>) => {
  self.postMessage(detectTempo(data))
}
