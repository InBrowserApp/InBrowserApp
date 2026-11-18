import { createGifEncoder } from "./core/animation"
import { frameRect } from "./core/size"
import type { GifRequest, GifResult } from "./types"

async function encode({ frames, width, height, scale, plays }: GifRequest) {
  const canvas = new OffscreenCanvas(width, height)
  const context = canvas.getContext("2d", { willReadFrequently: true })!
  const encoder = createGifEncoder(width, height, plays)
  let poster: Blob | undefined

  for (const frame of frames) {
    const image = await createImageBitmap(frame.file)
    const bounds = frameRect(image, canvas, scale)
    try {
      context.clearRect(0, 0, width, height)
      context.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height)
    } finally {
      image.close()
    }
    encoder.addFrame(
      context.getImageData(0, 0, width, height).data,
      frame.duration
    )
    poster ??= await canvas.convertToBlob()
  }

  return { gif: encoder.finish(), poster: poster! } satisfies GifResult
}

self.onmessage = async (event: MessageEvent<GifRequest>) => {
  try {
    self.postMessage(await encode(event.data))
  } catch {
    self.postMessage(null)
  }
}
