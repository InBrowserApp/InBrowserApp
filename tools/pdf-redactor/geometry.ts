import type { Point, Region } from "./types"

export function relativePoint(
  x: number,
  y: number,
  bounds: Pick<DOMRect, "left" | "top" | "width" | "height">
): Point {
  return {
    x: Math.min(1, Math.max(0, (x - bounds.left) / bounds.width)),
    y: Math.min(1, Math.max(0, (y - bounds.top) / bounds.height)),
  }
}

export function rectangle(start: Point, end: Point): Region {
  return {
    left: Math.min(start.x, end.x),
    right: Math.max(start.x, end.x),
    top: Math.min(start.y, end.y),
    bottom: Math.max(start.y, end.y),
  }
}
