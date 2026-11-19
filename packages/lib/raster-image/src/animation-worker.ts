import { frameRect } from "./animation-size"

export type AnimationRequest = {
  frames: { file: File; duration: number }[]
  width: number
  height: number
  scale: number
  plays: number
}

export type AnimationResult = {
  animation: Blob
  poster: Blob
}

export async function renderAnimationFrames(
  { frames, width, height, scale }: AnimationRequest,
  addFrame: (
    canvas: OffscreenCanvas,
    context: OffscreenCanvasRenderingContext2D,
    duration: number
  ) => void | Promise<void>
) {
  const canvas = new OffscreenCanvas(width, height)
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) throw new Error("Canvas context unavailable")

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
    await addFrame(canvas, context, frame.duration)
    poster ??= await canvas.convertToBlob()
  }

  if (!poster) throw new Error("No animation frames")
  return poster
}

export function serveAnimationEncoder(
  encode: (request: AnimationRequest) => Promise<AnimationResult>
) {
  self.onmessage = async (event: MessageEvent<AnimationRequest>) => {
    try {
      self.postMessage(await encode(event.data))
    } catch {
      self.postMessage(null)
    }
  }
}
