import type { WatermarkPosition } from '../types'

const EDGE_PADDING = 24

export type RotatedBounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

const clamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    return value
  }

  return Math.min(Math.max(value, min), max)
}

export const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

export const normalizeRotation = (value: number, fallback = 0): number => {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return clamp(Math.trunc(value), -180, 180)
}

export const calculateLineHeight = (fontSize: number): number => {
  const safeFontSize = Math.max(1, fontSize)
  return safeFontSize * 1.2
}

export const calculateTextBlockHeight = (
  lineCount: number,
  fontSize: number,
  lineHeight: number,
): number => {
  if (lineCount < 1) {
    return Math.max(1, fontSize)
  }

  return fontSize + Math.max(0, lineCount - 1) * lineHeight
}

export const rotatePoint = (
  x: number,
  y: number,
  rotationInDegrees: number,
): { x: number; y: number } => {
  const angle = toRadians(rotationInDegrees)
  const cosine = Math.cos(angle)
  const sine = Math.sin(angle)

  return {
    x: x * cosine - y * sine,
    y: x * sine + y * cosine,
  }
}

export const getRotatedBounds = (
  width: number,
  height: number,
  rotationInDegrees: number,
): RotatedBounds => {
  const corners = [
    rotatePoint(0, 0, rotationInDegrees),
    rotatePoint(width, 0, rotationInDegrees),
    rotatePoint(0, height, rotationInDegrees),
    rotatePoint(width, height, rotationInDegrees),
  ]

  const xs = corners.map((corner) => corner.x)
  const ys = corners.map((corner) => corner.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export const resolveWatermarkPlacement = ({
  pageWidth,
  pageHeight,
  boxWidth,
  boxHeight,
  position,
  offsetX,
  offsetY,
  rotation,
}: {
  pageWidth: number
  pageHeight: number
  boxWidth: number
  boxHeight: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  rotation: number
}): {
  originX: number
  originY: number
  left: number
  bottom: number
  bounds: RotatedBounds
} => {
  const bounds = getRotatedBounds(boxWidth, boxHeight, rotation)
  const maxLeft = Math.max(0, pageWidth - bounds.width)
  const maxBottom = Math.max(0, pageHeight - bounds.height)

  let left = EDGE_PADDING
  let bottom = EDGE_PADDING

  if (position === 'top-center' || position === 'center' || position === 'bottom-center') {
    left = (pageWidth - bounds.width) / 2
  }

  if (position === 'top-right' || position === 'center-right' || position === 'bottom-right') {
    left = pageWidth - bounds.width - EDGE_PADDING
  }

  if (position === 'center-left' || position === 'center' || position === 'center-right') {
    bottom = (pageHeight - bounds.height) / 2
  }

  if (position === 'top-left' || position === 'top-center' || position === 'top-right') {
    bottom = pageHeight - bounds.height - EDGE_PADDING
  }

  left = clamp(left + offsetX, 0, maxLeft)
  bottom = clamp(bottom + offsetY, 0, maxBottom)

  return {
    originX: left - bounds.minX,
    originY: bottom - bounds.minY,
    left,
    bottom,
    bounds,
  }
}
