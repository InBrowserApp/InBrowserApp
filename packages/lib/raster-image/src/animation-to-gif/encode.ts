import { createGifEncoder } from "../gif-encoder"
import { readApng } from "./apng"
import type { AnimationFormat, GifResult } from "./types"
import { readAnimatedWebp } from "./webp"

const MAX_GIF_DIMENSION = 65535
const MAX_GIF_PLAYS = 65536
const MAX_GIF_DELAY = 655350

export async function encodeAnimationGif(
  file: File,
  format: AnimationFormat
): Promise<GifResult> {
  const readAnimation = format === "apng" ? readApng : readAnimatedWebp
  const { width, height, plays, frames } = readAnimation(
    await file.arrayBuffer()
  )
  if (
    width > MAX_GIF_DIMENSION ||
    height > MAX_GIF_DIMENSION ||
    plays > MAX_GIF_PLAYS
  ) {
    throw new Error("limit")
  }
  const canvas = new OffscreenCanvas(width, height)
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) throw new Error("failed")
  const encoder = createGifEncoder(width, height, plays)
  for (const frame of frames) {
    const { x, y, width: w, height: h } = frame
    const bitmap = await createImageBitmap(frame.image(), {
      imageOrientation: "none",
    }).catch((reason: unknown) => {
      throw new Error("invalid", { cause: reason })
    })
    const bounds = [x, y, w, h] as const
    try {
      if (bitmap.width !== w || bitmap.height !== h) throw new Error("invalid")
      const previous =
        frame.dispose === "previous" ? context.getImageData(...bounds) : null

      if (!frame.blend) context.clearRect(...bounds)
      context.drawImage(bitmap, x, y)
      const pixels = context.getImageData(0, 0, width, height).data
      let delay = Math.max(20, Math.round(frame.delay / 10) * 10)
      // A single GIF delay field is an unsigned 16-bit centisecond count.
      while (delay > MAX_GIF_DELAY) {
        const part = Math.min(MAX_GIF_DELAY, delay - 20)
        encoder.addFrame(pixels, part)
        delay -= part
      }
      encoder.addFrame(pixels, delay)

      if (previous) context.putImageData(previous, x, y)
      if (frame.dispose === "background") context.clearRect(...bounds)
    } finally {
      bitmap.close()
    }
  }

  const animation = encoder.finish()
  // Use the first encoded GIF frame so the paused preview matches the download.
  const first = await createImageBitmap(animation)
  context.clearRect(0, 0, width, height)
  try {
    context.drawImage(first, 0, 0)
    return { animation, poster: await canvas.convertToBlob(), width, height }
  } finally {
    first.close()
  }
}
