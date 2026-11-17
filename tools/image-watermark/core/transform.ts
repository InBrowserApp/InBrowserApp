import type { Options } from "../types"
import {
  clamp,
  normalizeRotation,
  rotatePoint,
  watermarkPlan,
  type Point,
  type WatermarkGeometry,
} from "./geometry"

export const CORNERS = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
] as const
export type Corner = (typeof CORNERS)[number]
export type TransformAction = "move" | "rotate" | Corner

export function positionAt(
  options: Options,
  geometry: WatermarkGeometry,
  center: Point
): Options {
  const cosine = Math.abs(Math.cos(geometry.radians))
  const sine = Math.abs(Math.sin(geometry.radians))
  const halfWidth = (geometry.width * cosine + geometry.height * sine) / 2
  const halfHeight = (geometry.width * sine + geometry.height * cosine) / 2
  const minX = geometry.margin + halfWidth
  const minY = geometry.margin + halfHeight
  const travelX = geometry.imageWidth - 2 * minX
  const travelY = geometry.imageHeight - 2 * minY
  return {
    ...options,
    position: "custom",
    x: travelX > 1e-8 ? clamp(((center.x - minX) / travelX) * 100, 0, 100) : 50,
    y: travelY > 1e-8 ? clamp(((center.y - minY) / travelY) * 100, 0, 100) : 50,
  }
}

export function changeAroundCenter(
  options: Options,
  geometry: WatermarkGeometry,
  change: Partial<Pick<Options, "size" | "rotation">>
) {
  const next = { ...options, ...change }
  const plan = watermarkPlan(
    geometry.imageWidth,
    geometry.imageHeight,
    geometry.aspect,
    next
  )
  return positionAt(next, plan.geometry, geometry)
}

export function cornerSigns(corner: Corner): Point {
  return {
    x: corner.endsWith("Left") ? -1 : 1,
    y: corner.startsWith("top") ? -1 : 1,
  }
}

function maximumScale(
  geometry: WatermarkGeometry,
  opposite: Point,
  signs: Point
) {
  let maximum = Infinity
  for (const corner of CORNERS) {
    const cornerSign = cornerSigns(corner)
    const offset = rotatePoint(
      {
        x: ((cornerSign.x + signs.x) * geometry.width) / 2,
        y: ((cornerSign.y + signs.y) * geometry.height) / 2,
      },
      geometry.radians
    )
    for (const axis of ["x", "y"] as const) {
      const delta = offset[axis]
      if (Math.abs(delta) < 1e-8) continue
      const edge =
        delta > 0
          ? (axis === "x" ? geometry.imageWidth : geometry.imageHeight) -
            geometry.margin
          : geometry.margin
      maximum = Math.min(maximum, (edge - opposite[axis]) / delta)
    }
  }
  return maximum
}

export function transformOptions(
  options: Options,
  geometry: WatermarkGeometry,
  action: TransformAction,
  start: Point,
  point: Point,
  snap = false
): Options {
  const delta = { x: point.x - start.x, y: point.y - start.y }
  if (action === "move")
    return positionAt(options, geometry, {
      x: geometry.x + delta.x,
      y: geometry.y + delta.y,
    })
  if (action === "rotate") {
    const startAngle = Math.atan2(start.y - geometry.y, start.x - geometry.x)
    const nextAngle = Math.atan2(point.y - geometry.y, point.x - geometry.x)
    const rotation =
      options.rotation +
      normalizeRotation(((nextAngle - startAngle) * 180) / Math.PI)
    return changeAroundCenter(options, geometry, {
      rotation: normalizeRotation(
        snap ? Math.round(rotation / 15) * 15 : rotation
      ),
    })
  }
  const signs = cornerSigns(action)
  const diagonal = rotatePoint(
    { x: signs.x * geometry.width, y: signs.y * geometry.height },
    geometry.radians
  )
  const opposite = {
    x: geometry.x - diagonal.x / 2,
    y: geometry.y - diagonal.y / 2,
  }
  const projected =
    1 +
    (delta.x * diagonal.x + delta.y * diagonal.y) /
      (geometry.width ** 2 + geometry.height ** 2)
  const factor = clamp(projected, 0, maximumScale(geometry, opposite, signs))
  const size = clamp(
    (geometry.width / Math.min(geometry.imageWidth, geometry.imageHeight)) *
      100 *
      factor,
    5,
    80
  )
  const next = { ...options, size }
  const plan = watermarkPlan(
    geometry.imageWidth,
    geometry.imageHeight,
    geometry.aspect,
    next
  )
  const offset = rotatePoint(
    {
      x: (signs.x * plan.geometry.width) / 2,
      y: (signs.y * plan.geometry.height) / 2,
    },
    geometry.radians
  )
  return positionAt(next, plan.geometry, {
    x: opposite.x + offset.x,
    y: opposite.y + offset.y,
  })
}
