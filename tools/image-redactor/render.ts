import type { Region, Source } from "./types"
import { blurPixels } from "./core/blur"

// Canvas drawing is verified in the real-browser interaction and pixel checks.
/* v8 ignore start */
export function canvas(width: number, height: number) {
  const element = document.createElement("canvas")
  element.width = width
  element.height = height
  return element
}

function regionPath(region: Region) {
  const path = new Path2D()
  if (region.shape === "rectangle") path.rect(0, 0, region.width, region.height)
  else if (region.shape === "ellipse") {
    path.ellipse(
      region.width / 2,
      region.height / 2,
      region.width / 2,
      region.height / 2,
      0,
      0,
      Math.PI * 2
    )
  } else {
    const radius = region.brushSize / 2
    region.points.forEach((point, i) => {
      path.moveTo(point.x + radius, point.y)
      path.arc(point.x, point.y, radius, 0, Math.PI * 2)
      if (i === 0) return
      const previous = region.points[i - 1]!
      const angle = Math.atan2(point.y - previous.y, point.x - previous.x)
      const dx = Math.sin(angle) * radius
      const dy = -Math.cos(angle) * radius
      path.moveTo(previous.x + dx, previous.y + dy)
      path.lineTo(point.x + dx, point.y + dy)
      path.lineTo(point.x - dx, point.y - dy)
      path.lineTo(previous.x - dx, previous.y - dy)
      path.closePath()
    })
  }
  return path
}

function effectImage(source: HTMLCanvasElement, region: Region, scale: number) {
  const size = Math.max(1, region.strength * scale)
  const output = canvas(source.width, source.height)
  const ctx = output.getContext("2d")!
  if (region.effect === "pixelate") {
    const small = canvas(
      Math.max(1, Math.ceil(source.width / size)),
      Math.max(1, Math.ceil(source.height / size))
    )
    small.getContext("2d")!.drawImage(source, 0, 0, small.width, small.height)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(small, 0, 0, output.width, output.height)
  } else if (typeof ctx.filter === "string") {
    // Extend the edges before blurring so the effect stays opaque at image edges.
    const pad = Math.ceil(size * 3)
    const padded = canvas(source.width + pad * 2, source.height + pad * 2)
    const p = padded.getContext("2d")!
    p.drawImage(source, pad, pad)
    p.drawImage(source, 0, 0, source.width, 1, pad, 0, source.width, pad)
    p.drawImage(
      source,
      0,
      source.height - 1,
      source.width,
      1,
      pad,
      pad + source.height,
      source.width,
      pad
    )
    p.drawImage(padded, pad, 0, 1, padded.height, 0, 0, pad, padded.height)
    p.drawImage(
      padded,
      pad + source.width - 1,
      0,
      1,
      padded.height,
      pad + source.width,
      0,
      pad,
      padded.height
    )
    ctx.filter = `blur(${size}px)`
    ctx.drawImage(padded, -pad, -pad)
  } else {
    ctx.drawImage(source, 0, 0)
    const image = ctx.getImageData(0, 0, output.width, output.height)
    image.data.set(blurPixels(image.data, output.width, output.height, size))
    ctx.putImageData(image, 0, 0)
  }
  return output
}

export function render(
  output: HTMLCanvasElement,
  source: Source,
  regions: readonly Region[]
) {
  const ctx = output.getContext("2d")!
  const scale = output.width / source.width
  ctx.clearRect(0, 0, output.width, output.height)
  ctx.drawImage(source.image, 0, 0, output.width, output.height)
  const base = canvas(output.width, output.height)
  base.getContext("2d")!.drawImage(output, 0, 0)
  let previousKey = ""
  let effect: HTMLCanvasElement | null = null
  // Solid fills always win overlaps: adding blur cannot reveal a solid redaction.
  const ordered = [
    ...regions.filter((r) => r.effect !== "solid"),
    ...regions.filter((r) => r.effect === "solid"),
  ]
  for (const region of ordered) {
    if (region.effect !== "solid") {
      const key = `${region.effect}:${region.strength}`
      if (key !== previousKey) effect = effectImage(base, region, scale)
      previousKey = key
    }
    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(region.x + region.width / 2, region.y + region.height / 2)
    ctx.rotate((region.rotation * Math.PI) / 180)
    ctx.translate(-region.width / 2, -region.height / 2)
    ctx.clip(regionPath(region))
    // Keep the sampled image aligned with the source, not the rotated region.
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    if (region.effect === "solid") {
      ctx.fillStyle = region.color
      ctx.fillRect(0, 0, output.width, output.height)
    } else ctx.drawImage(effect!, 0, 0)
    ctx.restore()
  }
}

export async function exportImage(
  source: Source,
  regions: readonly Region[],
  format: string,
  quality: number
) {
  const output = canvas(source.width, source.height)
  render(output, source, regions)
  if (format === "jpeg") {
    const ctx = output.getContext("2d")!
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, output.width, output.height)
  }
  const blob = await new Promise<Blob | null>((resolve) =>
    output.toBlob(resolve, `image/${format}`, quality / 100)
  )
  if (!blob) throw new Error("EXPORT_FAILED")
  return blob
}
/* v8 ignore stop */
