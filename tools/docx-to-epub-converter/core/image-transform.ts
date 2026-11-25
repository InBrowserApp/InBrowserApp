import { maximumPageZoom } from "@workspace/document-reader"
import type { ImageRun } from "./render"

export async function imageTransform(
  url: string,
  run: ImageRun,
  signal: AbortSignal
) {
  const { l = 0, t = 0, r = 0, b = 0 } = run.srcRect || {}
  const rotation = (((run.rotation ?? 0) % 360) * Math.PI) / 180
  const alpha = run.alpha ?? 1
  if (
    !l &&
    !t &&
    !r &&
    !b &&
    !rotation &&
    !run.flipH &&
    !run.flipV &&
    alpha === 1
  )
    return url
  const image = new Image()
  const canvas = document.createElement("canvas")
  try {
    image.src = url
    await image.decode()
    signal.throwIfAborted()
    const { naturalWidth: width, naturalHeight: height } = image
    const visibleWidth = (1 - l - r) * width
    const visibleHeight = (1 - t - b) * height
    if (!(visibleWidth > 0 && visibleHeight > 0)) return null
    const cos = Math.abs(Math.cos(rotation))
    const sin = Math.abs(Math.sin(rotation))
    const outputWidth = visibleWidth * cos + visibleHeight * sin
    const outputHeight = visibleWidth * sin + visibleHeight * cos
    const scale = Math.min(1, maximumPageZoom(outputWidth, outputHeight))
    canvas.width = Math.max(1, Math.ceil(outputWidth * scale - 1e-6))
    canvas.height = Math.max(1, Math.ceil(outputHeight * scale - 1e-6))
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new RangeError("image canvas")
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rotation)
    ctx.scale((run.flipH ? -1 : 1) * scale, (run.flipV ? -1 : 1) * scale)
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
    ctx.drawImage(
      image,
      l * width,
      t * height,
      visibleWidth,
      visibleHeight,
      -visibleWidth / 2,
      -visibleHeight / 2,
      visibleWidth,
      visibleHeight
    )
    return canvas.toDataURL("image/png")
  } finally {
    canvas.width = canvas.height = 0
    image.removeAttribute("src")
  }
}
