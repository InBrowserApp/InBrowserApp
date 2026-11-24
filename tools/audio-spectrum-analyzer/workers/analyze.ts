import { averageSpectrum, type selectFrames } from "../core/spectrum"

export type Response = ReturnType<typeof averageSpectrum>
export type Request = ReturnType<typeof selectFrames>

self.onmessage = ({ data }: MessageEvent<Request>) => {
  const result = averageSpectrum(data)
  self.postMessage(result, { transfer: [result.levels.buffer] })
}
