export const mouseButtons = [
  { label: "primary", mask: 1 },
  { label: "middle", mask: 4 },
  { label: "secondary", mask: 2 },
  { label: "back", mask: 8 },
  { label: "forward", mask: 16 },
] as const

export type Point = { x: number; y: number }
export type Drag = { origin: Point; distance: number; active: boolean }

export function countPress(counts: readonly number[], button: number) {
  return counts.map((count, index) => count + Number(index === button))
}

export function trackDrag(drag: Drag | null, point: Point) {
  if (!drag?.active) return drag

  return {
    ...drag,
    distance: Math.max(
      drag.distance,
      Math.hypot(point.x - drag.origin.x, point.y - drag.origin.y)
    ),
  }
}

export function endDrag(drag: Drag | null) {
  if (!drag?.active) return drag
  return drag.distance > 0 ? { ...drag, active: false } : null
}

export function wheelUnit(mode: number) {
  if (mode === 1) return "lines"
  if (mode === 2) return "pages"
  return "pixels"
}
