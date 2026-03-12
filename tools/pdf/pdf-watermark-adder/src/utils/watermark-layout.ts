import type { WatermarkLayoutMode, WatermarkPosition, WatermarkTilePreset } from '../types'

const EDGE_PADDING = 24
const TILE_GAP_MIN = 0
const TILE_GAP_MAX = 200
// Small text watermarks can legitimately need thousands of placements to cover a page.
// Keep a high cap so dense tiling still reaches the page edges without exploding runtime.
const MAX_TILE_PLACEMENTS = 5000

export const WATERMARK_TILE_PRESETS: Record<WatermarkTilePreset, { gapX: number; gapY: number }> = {
  sparse: { gapX: 120, gapY: 100 },
  medium: { gapX: 70, gapY: 60 },
  dense: { gapX: 30, gapY: 20 },
}

export type RotatedBounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

export type WatermarkPlacement = {
  originX: number
  originY: number
  left: number
  bottom: number
  bounds: RotatedBounds
}

const clamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    return value
  }

  return Math.min(Math.max(value, min), max)
}

const createPlacement = (
  left: number,
  bottom: number,
  bounds: RotatedBounds,
): WatermarkPlacement => ({
  originX: left - bounds.minX,
  originY: bottom - bounds.minY,
  left,
  bottom,
  bounds,
})

const resolveSinglePlacementFromBounds = ({
  pageWidth,
  pageHeight,
  position,
  offsetX,
  offsetY,
  bounds,
}: {
  pageWidth: number
  pageHeight: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  bounds: RotatedBounds
}): WatermarkPlacement => {
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

  return createPlacement(left, bottom, bounds)
}

const resolveTilePlacementsFromBounds = ({
  pageWidth,
  pageHeight,
  bounds,
  tileGapX,
  tileGapY,
}: {
  pageWidth: number
  pageHeight: number
  bounds: RotatedBounds
  tileGapX: number
  tileGapY: number
}): WatermarkPlacement[] => {
  const stepX =
    bounds.width * (1 + sanitizeTileGap(tileGapX, WATERMARK_TILE_PRESETS.medium.gapX) / 100)
  const stepY =
    bounds.height * (1 + sanitizeTileGap(tileGapY, WATERMARK_TILE_PRESETS.medium.gapY) / 100)
  const horizontalOverflow = bounds.width + stepX / 2
  const verticalOverflow = bounds.height + stepY / 2
  const placements: WatermarkPlacement[] = []

  let rowIndex = 0
  for (
    let bottom = -verticalOverflow;
    bottom <= pageHeight + verticalOverflow;
    bottom += stepY, rowIndex += 1
  ) {
    const rowOffset = rowIndex % 2 === 0 ? 0 : stepX / 2

    for (
      let left = -horizontalOverflow - rowOffset;
      left <= pageWidth + horizontalOverflow;
      left += stepX
    ) {
      placements.push(createPlacement(left, bottom, bounds))
      if (placements.length >= MAX_TILE_PLACEMENTS) {
        return placements
      }
    }
  }

  return placements
}

export const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

export const normalizeRotation = (value: number, fallback = 0): number => {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return clamp(Math.trunc(value), -180, 180)
}

export const sanitizeTileGap = (value: number, fallback: number): number => {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return clamp(Math.trunc(value), TILE_GAP_MIN, TILE_GAP_MAX)
}

export const resolveTilePreset = (
  tileGapX: number,
  tileGapY: number,
): WatermarkTilePreset | null => {
  const normalizedGapX = sanitizeTileGap(tileGapX, WATERMARK_TILE_PRESETS.medium.gapX)
  const normalizedGapY = sanitizeTileGap(tileGapY, WATERMARK_TILE_PRESETS.medium.gapY)

  for (const [preset, gaps] of Object.entries(WATERMARK_TILE_PRESETS) as Array<
    [WatermarkTilePreset, { gapX: number; gapY: number }]
  >) {
    if (normalizedGapX === gaps.gapX && normalizedGapY === gaps.gapY) {
      return preset
    }
  }

  return null
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
}): WatermarkPlacement => {
  const bounds = getRotatedBounds(boxWidth, boxHeight, rotation)

  return resolveSinglePlacementFromBounds({
    pageWidth,
    pageHeight,
    position,
    offsetX,
    offsetY,
    bounds,
  })
}

export const resolveWatermarkPlacements = ({
  pageWidth,
  pageHeight,
  boxWidth,
  boxHeight,
  position,
  offsetX,
  offsetY,
  rotation,
  layoutMode,
  tileGapX,
  tileGapY,
}: {
  pageWidth: number
  pageHeight: number
  boxWidth: number
  boxHeight: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  rotation: number
  layoutMode: WatermarkLayoutMode
  tileGapX: number
  tileGapY: number
}): WatermarkPlacement[] => {
  const bounds = getRotatedBounds(boxWidth, boxHeight, rotation)

  if (layoutMode === 'tile') {
    return resolveTilePlacementsFromBounds({
      pageWidth,
      pageHeight,
      bounds,
      tileGapX,
      tileGapY,
    })
  }

  return [
    resolveSinglePlacementFromBounds({
      pageWidth,
      pageHeight,
      position,
      offsetX,
      offsetY,
      bounds,
    }),
  ]
}
