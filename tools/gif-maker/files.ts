import type { Frame, GifRequest, GifResult } from "./types"

export const IMAGE_ACCEPT =
  "image/png,image/jpeg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif"
export const DEFAULT_DURATION = "200"
export const DURATION_RANGE = { min: 20, max: 655350, step: 10 }

export async function readFrame(file: File, duration: string): Promise<Frame> {
  if (
    !/\.(png|jpe?g|webp|avif)$/i.test(file.name) &&
    !/^(image\/(png|jpeg|webp|avif))$/.test(file.type)
  ) {
    throw new Error("Unsupported image format")
  }
  const image = await createImageBitmap(file)
  try {
    const { width, height } = image
    const scale = Math.min(1, 144 / Math.max(width, height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height)
    return {
      id: crypto.randomUUID(),
      file,
      thumbnail: canvas.toDataURL(),
      width,
      height,
      duration,
    }
  } finally {
    image.close()
  }
}

export function requestGif(
  worker: Worker,
  request: GifRequest
): Promise<GifResult> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<GifResult | null>) => {
      if (event.data) resolve(event.data)
      else reject(new Error("GIF encoding failed"))
    }
    worker.onerror = reject
    worker.onmessageerror = reject
    worker.postMessage(request)
  })
}
