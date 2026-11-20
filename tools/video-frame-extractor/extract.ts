import { seekVideo } from "@workspace/raster-image/video"
import { formatTime } from "./core/timeline"
import type { Frame, ImageFormat } from "./types"

function encode(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Image encoding failed")),
      format,
      quality
    )
  })
}

export async function extractFrames(
  video: HTMLVideoElement,
  times: readonly number[],
  format: ImageFormat,
  basename: string,
  signal: AbortSignal,
  onProgress: (done: number) => void
) {
  const canvas = document.createElement("canvas")
  const previewCanvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const scale = Math.min(1, 400 / Math.max(canvas.width, canvas.height))
  previewCanvas.width = Math.max(1, Math.round(canvas.width * scale))
  previewCanvas.height = Math.max(1, Math.round(canvas.height * scale))

  try {
    const context = canvas.getContext("2d", { alpha: false })
    const previewContext = previewCanvas.getContext("2d", { alpha: false })
    if (!context || !previewContext) throw new Error("Canvas unavailable")
    const frames: Frame[] = []
    const ext = format === "image/jpeg" ? "jpg" : "png"
    for (const time of times) {
      signal.throwIfAborted()
      // A timestamp at the exact end refers to the last displayed frame.
      const seconds = time / 1000
      await seekVideo(
        video,
        seconds === video.duration ? Math.max(0, seconds - 0.001) : seconds,
        signal
      )
      signal.throwIfAborted()
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      previewContext.drawImage(
        canvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height
      )
      const [blob, preview] = await Promise.all([
        encode(canvas, format, 0.92),
        encode(previewCanvas, "image/jpeg", 0.8),
      ])
      signal.throwIfAborted()
      frames.push({
        time,
        blob,
        preview,
        name: `${basename}-${formatTime(time).replace(":", "-")}.${ext}`,
      })
      onProgress(frames.length)
    }
    return frames
  } finally {
    canvas.width = canvas.height = 0
    previewCanvas.width = previewCanvas.height = 0
  }
}

export function videoBasename(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      // oxlint-disable-next-line no-control-regex -- Strip control characters from download names.
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .trim()
      .slice(0, 120) || "video"
  )
}
