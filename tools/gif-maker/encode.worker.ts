import {
  renderAnimationFrames,
  serveAnimationEncoder,
} from "@workspace/raster-image/animation-worker"
import { createGifEncoder } from "@workspace/raster-image/gif-encoder"

serveAnimationEncoder(async (request) => {
  const { width, height, plays } = request
  const encoder = createGifEncoder(width, height, plays)
  const poster = await renderAnimationFrames(
    request,
    (_, context, duration) => {
      encoder.addFrame(context.getImageData(0, 0, width, height).data, duration)
    }
  )
  return { animation: encoder.finish(), poster }
})
