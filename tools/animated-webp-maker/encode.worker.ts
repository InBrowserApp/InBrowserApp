import {
  renderAnimationFrames,
  serveAnimationEncoder,
} from "@workspace/raster-image/animation-worker"
import {
  encodePngFramesWithImg2Webp,
  type PngAnimationFrame,
} from "@workspace/raster-image/img2webp-encoder"

import { webpAnimationBlob } from "./core/animation"

serveAnimationEncoder(async (request) => {
  const frames: PngAnimationFrame[] = []
  const poster = await renderAnimationFrames(
    request,
    async (canvas, _, duration) => {
      const png = await canvas.convertToBlob()
      frames.push({ data: new Uint8Array(await png.arrayBuffer()), duration })
    }
  )
  const bytes = await encodePngFramesWithImg2Webp(frames, request.plays)
  const animation = webpAnimationBlob(
    bytes,
    request.width,
    request.height,
    frames.map(({ duration }) => duration),
    request.plays
  )
  return { animation, poster }
})
