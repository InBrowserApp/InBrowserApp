import type { Options } from "../types"
import { watermarkLayout } from "./layout"

export type Point = { x: number; y: number }
export type WatermarkGeometry = Point & {
  imageWidth: number
  imageHeight: number
  width: number
  height: number
  aspect: number
  radians: number
  margin: number
}

export function watermarkPlan(
  imageWidth: number,
  imageHeight: number,
  aspect: number,
  options: Options
) {
  const shortSide = Math.min(imageWidth, imageHeight)
  const width = Math.min(
    (shortSide * options.size) / 100,
    shortSide * 0.8 * aspect
  )
  const height = width / aspect
  const layout = watermarkLayout(
    imageWidth,
    imageHeight,
    width,
    height,
    options
  )
  const geometry: WatermarkGeometry = {
    ...layout.centers[0]!,
    imageWidth,
    imageHeight,
    width: width * layout.scale,
    height: height * layout.scale,
    aspect,
    radians: layout.radians,
    margin: (shortSide * options.margin) / 100,
  }
  return { width, height, layout, geometry }
}

export function rotatePoint(point: Point, radians: number): Point {
  return {
    x: point.x * Math.cos(radians) - point.y * Math.sin(radians),
    y: point.x * Math.sin(radians) + point.y * Math.cos(radians),
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function normalizeRotation(degrees: number) {
  return ((((degrees + 180) % 360) + 360) % 360) - 180
}
