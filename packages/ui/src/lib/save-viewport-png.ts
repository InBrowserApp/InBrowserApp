import { downloadBlob } from "./download-blob"

export async function saveViewportPng(
  source: HTMLCanvasElement,
  filename: string,
  {
    pixelRatio = 1,
    label,
    background,
  }: { pixelRatio?: number; label?: string; background?: string } = {}
) {
  const output = document.createElement("canvas")
  output.width = source.width
  output.height = source.height
  const context = output.getContext("2d")!
  if (background) {
    context.fillStyle = background
    context.fillRect(0, 0, output.width, output.height)
  }
  context.drawImage(source, 0, 0)
  if (label) {
    context.scale(pixelRatio, pixelRatio)
    const bottom = output.height / pixelRatio - 12
    context.font = "600 14px system-ui, sans-serif"
    context.textBaseline = "middle"
    context.direction = "ltr"
    context.fillStyle = "#172132"
    context.beginPath()
    context.roundRect(
      12,
      bottom - 32,
      context.measureText(label).width + 24,
      32,
      6
    )
    context.fill()
    context.fillStyle = "#fff"
    context.fillText(label, 24, bottom - 16)
  }

  const png = await new Promise<Blob | null>((resolve) =>
    output.toBlob(resolve)
  )
  if (!png) throw new Error("PNG encoding failed")
  downloadBlob(png, `${filename.replace(/\.[^.]*$/, "") || "model"}.png`)
}
