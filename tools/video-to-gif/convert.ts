import { seekVideo, waitForVideo } from "@workspace/raster-image/video"
import type { AnimationResult } from "@workspace/raster-image/animation-worker"
import type { GifPlan } from "./core/plan"
import type { EncodeCommand } from "./types"

async function request<T>(
  worker: Worker,
  command: EncodeCommand,
  signal: AbortSignal,
  transfer: Transferable[] = []
) {
  signal.throwIfAborted()
  const listeners = new AbortController()
  const options = { once: true, signal: listeners.signal }
  try {
    return await new Promise<T>((resolve, reject) => {
      worker.addEventListener(
        "message",
        (event) => resolve(event.data),
        options
      )
      worker.addEventListener("error", reject, options)
      signal.addEventListener("abort", () => reject(signal.reason), options)
      worker.postMessage(command, transfer)
    })
  } finally {
    listeners.abort()
  }
}

function makePoster(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) =>
      blob ? resolve(blob) : reject(new Error("Unable to encode GIF poster"))
    )
  })
}

export async function convertVideo(
  url: string,
  { width, height, frames }: GifPlan,
  signal: AbortSignal,
  onProgress: (done: number) => void
): Promise<AnimationResult> {
  const video = document.createElement("video")
  video.preload = "auto"
  video.muted = true
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) throw new Error("Canvas context unavailable")
  let worker: Worker | undefined

  try {
    const metadata = waitForVideo(video, "loadedmetadata", signal)
    video.src = url
    await metadata
    worker = new Worker(new URL("./encode.worker.ts", import.meta.url), {
      type: "module",
    })
    await request(worker, { type: "start", width, height }, signal)

    let poster: Blob | undefined
    for (const [index, frame] of frames.entries()) {
      await seekVideo(video, frame.time, signal)
      context.drawImage(video, 0, 0, width, height)
      poster ??= await makePoster(canvas)
      const { data: pixels } = context.getImageData(0, 0, width, height)
      // Transfer one frame at a time so long clips do not buffer raw pixels.
      await request(
        worker,
        { type: "frame", pixels, delay: frame.delay },
        signal,
        [pixels.buffer]
      )
      onProgress(index + 1)
    }

    const animation = await request<Blob>(worker, { type: "finish" }, signal)
    return { animation, poster: poster! }
  } finally {
    worker?.terminate()
    video.removeAttribute("src")
    video.load()
    canvas.width = canvas.height = 0
  }
}
