import type { Options, Watermark } from "../types"

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("imageError"))),
      "image/png"
    )
  )
}

async function renderText(
  options: Pick<Options, "text" | "font" | "color">
): Promise<Watermark> {
  const lines = options.text.trim().split(/\r?\n/)
  if (!options.text.trim() || options.text.length > 200 || lines.length > 5)
    throw new Error("textError")
  await document.fonts.ready
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("imageError")
  const family = options.font === "serif" ? "serif" : "sans-serif"
  const font = `600 72px ${family}`
  ctx.font = font
  const metrics = lines.map((line) => ctx.measureText(line))
  const width = Math.max(1, ...metrics.map((m) => m.width)) + 16
  const ascent = Math.max(72, ...metrics.map((m) => m.actualBoundingBoxAscent))
  const descent = Math.max(
    18,
    ...metrics.map((m) => m.actualBoundingBoxDescent)
  )
  const lineHeight = ascent + descent + 12
  const height = lineHeight * lines.length + 16
  const scale = Math.min(3, 4096 / width, 4096 / height)
  canvas.width = Math.ceil(width * scale)
  canvas.height = Math.ceil(height * scale)
  ctx.scale(scale, scale)
  ctx.font = font
  ctx.fillStyle = options.color
  ctx.textAlign = "center"
  lines.forEach((line, i) =>
    ctx.fillText(line, width / 2, 8 + ascent + i * lineHeight)
  )
  return {
    blob: await canvasBlob(canvas),
    width: canvas.width,
    height: canvas.height,
  }
}

async function readImage(file: File): Promise<Watermark> {
  if (
    (!/^image\/(png|jpeg)$/.test(file.type) &&
      !/\.(png|jpe?g)$/i.test(file.name)) ||
    file.size > 20 * 1024 * 1024
  )
    throw new Error("imageError")
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    if (
      !image.naturalWidth ||
      !image.naturalHeight ||
      image.naturalWidth * image.naturalHeight > 32_000_000
    )
      throw new Error("imageError")
    const scale = Math.min(
      1,
      2048 / Math.max(image.naturalWidth, image.naturalHeight)
    )
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("imageError")
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    return {
      blob: await canvasBlob(canvas),
      width: canvas.width,
      height: canvas.height,
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export { readImage, renderText }
