import { watermarkPlan } from "./core/geometry"
import { textDirection } from "./core/text-direction"
import type { ImageSource, Options } from "./types"

export function drawWatermark(
  canvas: HTMLCanvasElement,
  source: ImageSource,
  logo: ImageSource | null,
  options: Options,
  maxSide = Infinity,
  original = false
) {
  // Detached canvases must resolve locale-dependent glyphs like the preview.
  canvas.lang = document.documentElement.lang
  const ratio = Math.min(1, maxSide / Math.max(source.width, source.height))
  canvas.width = Math.max(1, Math.round(source.width * ratio))
  canvas.height = Math.max(1, Math.round(source.height * ratio))
  const context = canvas.getContext("2d")
  if (!context) throw new Error("CANVAS_UNAVAILABLE")
  context.scale(canvas.width / source.width, canvas.height / source.height)
  if (options.format === "image/jpeg") {
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, source.width, source.height)
  }
  context.drawImage(source.image, 0, 0, source.width, source.height)
  if (original || (options.kind === "image" ? !logo : !options.text.trim()))
    return null

  const lines = options.text.trim().split("\n")
  // Detached export canvases must use the same bidi direction as the preview.
  context.direction = textDirection(options.text)
  context.font = `600 100px ${options.font}`
  const baseWidth =
    options.kind === "image"
      ? logo!.width
      : Math.max(1, ...lines.map((line) => context.measureText(line).width))
  const baseHeight =
    options.kind === "image" ? logo!.height : lines.length * 120
  const { width, height, layout, geometry } = watermarkPlan(
    source.width,
    source.height,
    baseWidth / baseHeight,
    options
  )
  const size = width / baseWidth
  context.globalAlpha = options.opacity / 100
  context.fillStyle = options.color
  context.font = `600 ${100 * size}px ${options.font}`
  context.textAlign = "center"
  context.textBaseline = "middle"
  for (const center of layout.centers) {
    context.save()
    context.translate(center.x, center.y)
    context.rotate(layout.radians)
    context.scale(layout.scale, layout.scale)
    if (options.kind === "image") {
      context.drawImage(logo!.image, -width / 2, -height / 2, width, height)
    } else {
      lines.forEach((line, index) => {
        context.fillText(line, 0, -height / 2 + (index + 0.5) * 120 * size)
      })
    }
    context.restore()
  }
  return options.tiled ? null : geometry
}

export async function encodeImage(canvas: HTMLCanvasElement, options: Options) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, options.format, options.quality / 100)
  )
  if (!blob || blob.type !== options.format) throw new Error("ENCODING_FAILED")
  return blob
}
