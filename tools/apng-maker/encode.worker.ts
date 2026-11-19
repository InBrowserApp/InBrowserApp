import {
  renderAnimationFrames,
  serveAnimationEncoder,
} from "@workspace/raster-image/animation-worker"
import { createApngEncoder } from "./core/animation"

serveAnimationEncoder(async (request) => {
  const { width, height, frames, plays } = request
  const encoder = createApngEncoder(width, height, frames.length, plays)
  const poster = await renderAnimationFrames(
    request,
    (_, context, duration) => {
      encoder.addFrame(context.getImageData(0, 0, width, height).data, duration)
    }
  )
  return { animation: encoder.finish(), poster }
})
