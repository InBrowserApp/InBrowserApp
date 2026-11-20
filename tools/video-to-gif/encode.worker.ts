import { createGifEncoder } from "@workspace/raster-image/gif-encoder"
import type { EncodeCommand } from "./types"

let encoder: ReturnType<typeof createGifEncoder>

self.onmessage = ({ data }: MessageEvent<EncodeCommand>) => {
  switch (data.type) {
    case "start":
      encoder = createGifEncoder(data.width, data.height, 0)
      self.postMessage(null)
      break
    case "frame":
      encoder.addFrame(data.pixels, data.delay)
      self.postMessage(null)
      break
    case "finish":
      self.postMessage(encoder.finish())
      break
  }
}
