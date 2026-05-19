import { computeSquareDrawLayout } from "../core/layout"
import type { RasterRenderSpec } from "../core/plan"

type RenderInput = Readonly<{
  spec: Pick<RasterRenderSpec, "size" | "marginPercent" | "background">
  image: HTMLImageElement
}>

const RASTER_MIME_TYPE = "image/png"

function clampBackgroundRadius(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.min(100, Math.max(0, value))
}

function backgroundRadiusToPixels(radiusPercent: number, size: number): number {
  return (clampBackgroundRadius(radiusPercent) / 100 / 2) * size
}

async function blobToUint8(blob: Blob): Promise<Uint8Array> {
  const buffer = await blob.arrayBuffer()
  return new Uint8Array(buffer)
}

/* v8 ignore start -- canvas APIs unavailable in headless test environment */

function createCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  return canvas
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  background: { color: string; radius: number } | null
): void {
  if (!background) {
    return
  }

  const radiusPx = backgroundRadiusToPixels(background.radius, size)
  ctx.save()
  ctx.beginPath()
  const r = Math.min(radiusPx, size / 2)

  if (r === 0) {
    ctx.rect(0, 0, size, size)
  } else if (
    typeof (ctx as unknown as { roundRect?: unknown }).roundRect === "function"
  ) {
    ;(
      ctx as unknown as {
        roundRect: (
          x: number,
          y: number,
          w: number,
          h: number,
          radii: number
        ) => void
      }
    ).roundRect(0, 0, size, size, r)
  } else {
    ctx.moveTo(r, 0)
    ctx.lineTo(size - r, 0)
    ctx.arcTo(size, 0, size, r, r)
    ctx.lineTo(size, size - r)
    ctx.arcTo(size, size, size - r, size, r)
    ctx.lineTo(r, size)
    ctx.arcTo(0, size, 0, size - r, r)
    ctx.lineTo(0, r)
    ctx.arcTo(0, 0, r, 0, r)
  }

  ctx.closePath()
  ctx.fillStyle = background.color
  ctx.fill()
  ctx.clip()
  ctx.restore()
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("CANVAS_TO_BLOB_FAILED"))
        return
      }
      resolve(blob)
    }, RASTER_MIME_TYPE)
  })
}

async function renderRaster({ spec, image }: RenderInput): Promise<Blob> {
  const canvas = createCanvas(spec.size)
  const ctx = canvas.getContext("2d", { alpha: true })

  if (!ctx) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  paintBackground(ctx, spec.size, spec.background)

  const layout = computeSquareDrawLayout({
    sourceWidth: image.naturalWidth || image.width,
    sourceHeight: image.naturalHeight || image.height,
    targetSize: spec.size,
    marginPercent: spec.marginPercent,
  })

  ctx.drawImage(image, layout.x, layout.y, layout.width, layout.height)

  return canvasToBlob(canvas)
}

/* v8 ignore stop */

export {
  backgroundRadiusToPixels,
  blobToUint8,
  clampBackgroundRadius,
  RASTER_MIME_TYPE,
  renderRaster,
}
