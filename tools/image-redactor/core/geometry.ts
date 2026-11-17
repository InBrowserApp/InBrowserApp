import type { Point, Region, Shape, Style } from "../types"

export function rotate(point: Point, center: Point, degrees: number): Point {
  const angle = (degrees * Math.PI) / 180
  const x = point.x - center.x
  const y = point.y - center.y
  return {
    x: center.x + x * Math.cos(angle) - y * Math.sin(angle),
    y: center.y + x * Math.sin(angle) + y * Math.cos(angle),
  }
}

export function center(region: Region): Point {
  return { x: region.x + region.width / 2, y: region.y + region.height / 2 }
}

export function localPoint(region: Region, point: Point): Point {
  const unrotated = rotate(point, center(region), -region.rotation)
  return { x: unrotated.x - region.x, y: unrotated.y - region.y }
}

export function createRegion(
  id: string,
  shape: Shape,
  start: Point,
  end: Point,
  style: Style,
  points: readonly Point[] = [start, end]
): Region {
  const padding = shape === "brush" ? style.brushSize / 2 : 0
  const vertices = shape === "brush" ? points : [start, end]
  let minX = start.x,
    minY = start.y,
    maxX = start.x,
    maxY = start.y
  for (const point of vertices) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }
  const x = minX - padding
  const y = minY - padding
  return {
    ...style,
    id,
    shape,
    x,
    y,
    rotation: 0,
    width: Math.max(1, maxX + padding - x),
    height: Math.max(1, maxY + padding - y),
    points:
      shape === "brush" ? points.map((p) => ({ x: p.x - x, y: p.y - y })) : [],
  }
}

function segmentDistance(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = dx * dx + dy * dy
  const t =
    length === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            ((point.x - start.x) * dx + (point.y - start.y) * dy) / length
          )
        )
  return Math.hypot(point.x - start.x - t * dx, point.y - start.y - t * dy)
}

export function contains(region: Region, point: Point): boolean {
  const p = localPoint(region, point)
  if (region.shape === "brush") {
    return region.points.some(
      (vertex, i) =>
        segmentDistance(p, region.points[Math.max(0, i - 1)]!, vertex) <=
        region.brushSize / 2
    )
  }
  if (region.shape === "ellipse") {
    return (
      ((p.x - region.width / 2) / (region.width / 2)) ** 2 +
        ((p.y - region.height / 2) / (region.height / 2)) ** 2 <=
      1
    )
  }
  return p.x >= 0 && p.x <= region.width && p.y >= 0 && p.y <= region.height
}

export function resizeRegion(region: Region, point: Point): Region {
  const anchor = rotate(
    { x: region.x, y: region.y },
    center(region),
    region.rotation
  )
  const local = rotate(point, anchor, -region.rotation)
  const width = Math.max(4, local.x - anchor.x)
  const height = Math.max(4, local.y - anchor.y)
  const nextCenter = rotate(
    { x: anchor.x + width / 2, y: anchor.y + height / 2 },
    anchor,
    region.rotation
  )
  return {
    ...region,
    x: nextCenter.x - width / 2,
    y: nextCenter.y - height / 2,
    width,
    height,
    points: region.points.map((p) => ({
      x: (p.x * width) / region.width,
      y: (p.y * height) / region.height,
    })),
    brushSize:
      region.brushSize * Math.min(width / region.width, height / region.height),
  }
}

export function rotationAt(region: Region, point: Point, snap: boolean) {
  const origin = center(region)
  const degrees =
    (Math.atan2(point.y - origin.y, point.x - origin.x) * 180) / Math.PI + 90
  return normalizeRotation(
    snap ? Math.round(degrees / 15) * 15 : Math.round(degrees)
  )
}

export function normalizeRotation(degrees: number) {
  return ((((degrees + 180) % 360) + 360) % 360) - 180
}
