import { visibleSize, watermarkLayout } from "./layout"
import type { Options, PageGeometry } from "../types"

type Point = Readonly<{ x: number; y: number }>
type TransformStart = Readonly<{
  kind: "move" | "rotate" | "resize"
  pointer: Point
  center: Point
  anchor: Point
  diagonal: Point
  markWidth: number
  maxWidth: number
  options: Options
  page: Readonly<{ width: number; height: number }>
}>

function customPosition(
  page: PageGeometry,
  aspect: number,
  options: Options
): Options {
  const size = visibleSize(page)
  const center = watermarkLayout(page, aspect, options).centers[0]!
  return {
    ...options,
    position: "custom",
    x: Math.round((center.x / size.width) * 1000) / 10,
    y: Math.round((1 - center.y / size.height) * 1000) / 10,
  }
}

function beginTransform(
  kind: TransformStart["kind"],
  pointer: Point,
  page: PageGeometry,
  aspect: number,
  options: Options,
  corner: Point = { x: 1, y: 1 }
): TransformStart {
  const size = visibleSize(page)
  const layout = watermarkLayout(page, aspect, options)
  const center = {
    x: layout.centers[0]!.x,
    y: size.height - layout.centers[0]!.y,
  }
  const angle = (options.rotation * Math.PI) / 180
  const diagonal = {
    x:
      Math.cos(angle) * corner.x * layout.markWidth -
      Math.sin(angle) * corner.y * layout.markHeight,
    y:
      Math.sin(angle) * corner.x * layout.markWidth +
      Math.cos(angle) * corner.y * layout.markHeight,
  }
  return {
    kind,
    pointer,
    center,
    diagonal,
    markWidth: layout.markWidth,
    maxWidth: watermarkLayout(page, aspect, { ...options, size: 100 })
      .markWidth,
    anchor: { x: center.x - diagonal.x / 2, y: center.y - diagonal.y / 2 },
    options,
    page: size,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
function normalizeAngle(angle: number) {
  return ((((angle + 180) % 360) + 360) % 360) - 180
}

function transformOptions(
  start: TransformStart,
  pointer: Point,
  snap: boolean,
  tolerance: Point
): { options: Options; guideX: boolean; guideY: boolean } {
  const { options, center, page } = start
  let x = center.x
  let y = center.y
  let rotation = options.rotation
  let size = options.size
  let guideX = false
  let guideY = false
  if (start.kind === "move") {
    x += pointer.x - start.pointer.x
    y += pointer.y - start.pointer.y
    guideX = Math.abs(x - page.width / 2) <= tolerance.x
    guideY = Math.abs(y - page.height / 2) <= tolerance.y
    if (guideX) x = page.width / 2
    if (guideY) y = page.height / 2
  } else if (start.kind === "rotate") {
    const initial = Math.atan2(
      start.pointer.y - center.y,
      start.pointer.x - center.x
    )
    const next = Math.atan2(pointer.y - center.y, pointer.x - center.x)
    rotation = normalizeAngle(
      options.rotation + ((next - initial) * 180) / Math.PI
    )
    if (snap) rotation = Math.round(rotation / 15) * 15
    rotation = Math.round(rotation)
  } else {
    const { diagonal: d, anchor: a } = start
    const scale =
      ((d.x + pointer.x - start.pointer.x) * d.x +
        (d.y + pointer.y - start.pointer.y) * d.y) /
      (d.x * d.x + d.y * d.y)
    size = clamp(
      Math.round(((start.markWidth * scale) / page.width) * 100),
      1,
      100
    )
    const actual =
      Math.min((page.width * size) / 100, start.maxWidth) / start.markWidth
    x = a.x + (d.x * actual) / 2
    y = a.y + (d.y * actual) / 2
  }
  return {
    options: {
      ...options,
      position: "custom",
      x: Math.round(clamp((x / page.width) * 100, 0, 100) * 10) / 10,
      y: Math.round(clamp((y / page.height) * 100, 0, 100) * 10) / 10,
      size,
      rotation,
    },
    guideX,
    guideY,
  }
}

export { beginTransform, transformOptions, customPosition, normalizeAngle }
export type { Point, TransformStart }
