type Bounds = { x1: number; y1: number; x2: number; y2: number }
export type VectorLayer = {
  name: string
  label: string
  color: string
  visible: boolean
  bounds: Bounds
  content: string
}
export type VectorDrawing = {
  layers: VectorLayer[]
  millimetersPerUnit?: number
}

export function emptyBounds(): Bounds {
  return { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity }
}

export function include(target: Bounds, x: number, y: number) {
  target.x1 = Math.min(target.x1, x)
  target.y1 = Math.min(target.y1, y)
  target.x2 = Math.max(target.x2, x)
  target.y2 = Math.max(target.y2, y)
}

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

export function exportSvg(
  drawing: VectorDrawing,
  selected: ReadonlySet<string>
) {
  const layers = drawing.layers.filter((layer) => selected.has(layer.name))
  if (!layers.length) return undefined

  const bounds = emptyBounds()
  for (const {
    bounds: { x1, y1, x2, y2 },
  } of layers) {
    include(bounds, x1, y1)
    include(bounds, x2, y2)
  }
  const width = bounds.x2 - bounds.x1
  const height = bounds.y2 - bounds.y1
  const margin = (Math.max(width, height) || 1) * 0.025
  const scale = drawing.millimetersPerUnit ?? 1
  const unit = drawing.millimetersPerUnit ? "mm" : ""
  const w = width + margin * 2
  const h = height + margin * 2
  const viewBox = [bounds.x1 - margin, -bounds.y2 - margin, w, h].join(" ")
  const start = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w * scale}${unit}" height="${h * scale}${unit}">\n`
  const groups = layers.map(
    ({ name, content }) =>
      `<g data-layer="${escapeAttribute(name)}">\n${content}\n</g>\n`
  )
  return {
    svg: new Blob([start, ...groups, "</svg>\n"], { type: "image/svg+xml" }),
    width: width * scale,
    height: height * scale,
  }
}
