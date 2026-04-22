import { clamp, formatColor, sortStops } from "./gradient"

import type { BlendMode, GradientLayer } from "./gradient"

const CANVAS_BLEND_MODES = {
  normal: "source-over",
  multiply: "multiply",
  screen: "screen",
  overlay: "overlay",
  darken: "darken",
  lighten: "lighten",
  "color-dodge": "color-dodge",
  "color-burn": "color-burn",
  "hard-light": "hard-light",
  "soft-light": "soft-light",
  difference: "difference",
  exclusion: "exclusion",
  hue: "hue",
  saturation: "saturation",
  color: "color",
  luminosity: "luminosity",
} as const satisfies Record<BlendMode, GlobalCompositeOperation>

const CORNERS = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
] as const

function getLinearPoints(width: number, height: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  const vx = Math.cos(radians)
  const vy = Math.sin(radians)
  const halfWidth = width / 2
  const halfHeight = height / 2
  const t = Math.min(
    vx === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(vx),
    vy === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(vy)
  )

  return {
    x0: halfWidth - vx * t,
    y0: halfHeight - vy * t,
    x1: halfWidth + vx * t,
    y1: halfHeight + vy * t,
  }
}

function getCornerDistances(
  width: number,
  height: number,
  cx: number,
  cy: number
) {
  return CORNERS.map(([xFactor, yFactor]) =>
    Math.hypot(width * xFactor - cx, height * yFactor - cy)
  )
}

function getCircleRadius(
  layer: GradientLayer,
  width: number,
  height: number,
  cx: number,
  cy: number
) {
  const values = [cx, width - cx, cy, height - cy]
  if (layer.radialSize === "closest-side") {
    return Math.min(...values)
  }

  if (layer.radialSize === "farthest-side") {
    return Math.max(...values)
  }

  const distances = getCornerDistances(width, height, cx, cy)
  return layer.radialSize === "closest-corner"
    ? Math.min(...distances)
    : Math.max(...distances)
}

function getEllipseRadii(
  layer: GradientLayer,
  width: number,
  height: number,
  cx: number,
  cy: number
) {
  const left = cx
  const right = width - cx
  const top = cy
  const bottom = height - cy
  const ratio = height === 0 ? 1 : width / height

  if (layer.radialSize === "closest-side") {
    return { rx: Math.min(left, right), ry: Math.min(top, bottom) }
  }

  if (layer.radialSize === "farthest-side") {
    return { rx: Math.max(left, right), ry: Math.max(top, bottom) }
  }

  const radii = CORNERS.map(([xFactor, yFactor]) => {
    const dx = Math.abs(width * xFactor - cx)
    const dy = Math.abs(height * yFactor - cy)
    const ry = Math.sqrt((dx * dx) / (ratio * ratio) + dy * dy)
    return { rx: ratio * ry, ry }
  })

  return layer.radialSize === "closest-corner"
    ? radii.reduce((smallest, current) =>
        current.rx < smallest.rx ? current : smallest
      )
    : radii.reduce((largest, current) =>
        current.rx > largest.rx ? current : largest
      )
}

function drawLayersToCanvas(
  context: CanvasRenderingContext2D,
  layers: readonly GradientLayer[],
  width: number,
  height: number
) {
  context.clearRect(0, 0, width, height)

  for (const [index, layer] of layers.entries()) {
    context.globalCompositeOperation =
      index === 0 ? "source-over" : CANVAS_BLEND_MODES[layer.blendMode]

    if (layer.type === "linear") {
      const points = getLinearPoints(width, height, layer.angle)
      const gradient = context.createLinearGradient(
        points.x0,
        points.y0,
        points.x1,
        points.y1
      )
      for (const stop of sortStops(layer.stops)) {
        gradient.addColorStop(
          clamp(stop.position / 100, 0, 1),
          formatColor(stop.color, "rgba")
        )
      }
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
      continue
    }

    const cx = (layer.centerX / 100) * width
    const cy = (layer.centerY / 100) * height

    if (layer.type === "conic") {
      if (typeof context.createConicGradient !== "function") {
        return false
      }

      const gradient = context.createConicGradient(
        ((layer.angle - 90) * Math.PI) / 180,
        cx,
        cy
      )
      for (const stop of sortStops(layer.stops)) {
        gradient.addColorStop(
          clamp(stop.position / 100, 0, 1),
          formatColor(stop.color, "rgba")
        )
      }
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
      continue
    }

    const radii =
      layer.radialShape === "circle"
        ? { rx: getCircleRadius(layer, width, height, cx, cy), ry: 0 }
        : getEllipseRadii(layer, width, height, cx, cy)
    const rx = radii.rx
    const ry = layer.radialShape === "circle" ? radii.rx : radii.ry

    if (!rx || !ry) {
      continue
    }

    context.save()
    context.translate(cx, cy)
    context.scale(rx, ry)
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1)
    for (const stop of sortStops(layer.stops)) {
      gradient.addColorStop(
        clamp(stop.position / 100, 0, 1),
        formatColor(stop.color, "rgba")
      )
    }
    context.fillStyle = gradient
    context.fillRect(-cx / rx, -cy / ry, width / rx, height / ry)
    context.restore()
  }

  return true
}

export { drawLayersToCanvas }
