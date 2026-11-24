import { averageSpectrum } from "../core/spectrum"

export type Response = ReturnType<typeof averageSpectrum>

self.onmessage = ({ data }: MessageEvent<Float32Array[]>) => {
  const result = averageSpectrum(data)
  self.postMessage(result, { transfer: [result.levels.buffer] })
}
