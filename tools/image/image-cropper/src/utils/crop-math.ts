import type { CropHandle, CropRect, ImageSource, PixelCropRect } from '../types'

const MIN_CROP_PIXELS = 24

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getNormalizedRatio(source: ImageSource, ratio: number) {
  return ratio * (source.height / source.width)
}

function roundToPixels(value: number, pixels: number) {
  return clamp(Math.round(value * pixels), 0, pixels)
}

function getMinimumNormalizedSize(source: ImageSource, ratio: number | null) {
  const minWidth = MIN_CROP_PIXELS / source.width
  const minHeight = MIN_CROP_PIXELS / source.height

  if (!ratio) {
    return { minWidth, minHeight }
  }

  const normalizedRatio = getNormalizedRatio(source, ratio)
  const width = Math.max(minWidth, minHeight * normalizedRatio)
  return {
    minWidth: width,
    minHeight: width / normalizedRatio,
  }
}

export function clampCropRect(rect: CropRect, source: ImageSource, ratio: number | null) {
  const { minWidth, minHeight } = getMinimumNormalizedSize(source, ratio)

  if (!ratio) {
    const width = clamp(rect.width, minWidth, 1)
    const height = clamp(rect.height, minHeight, 1)

    return {
      x: clamp(rect.x, 0, 1 - width),
      y: clamp(rect.y, 0, 1 - height),
      width,
      height,
    }
  }

  const normalizedRatio = getNormalizedRatio(source, ratio)
  let width = clamp(rect.width, minWidth, 1)
  let height = width / normalizedRatio

  if (height > 1) {
    height = 1
    width = height * normalizedRatio
  }

  return {
    x: clamp(rect.x, 0, 1 - width),
    y: clamp(rect.y, 0, 1 - height),
    width,
    height,
  }
}

export function createInitialCropRect(source: ImageSource, ratio: number | null): CropRect {
  const availableWidth = 0.88
  const availableHeight = 0.88

  if (!ratio) {
    return {
      x: (1 - availableWidth) / 2,
      y: (1 - availableHeight) / 2,
      width: availableWidth,
      height: availableHeight,
    }
  }

  const normalizedRatio = getNormalizedRatio(source, ratio)
  let width = availableWidth
  let height = width / normalizedRatio

  if (height > availableHeight) {
    height = availableHeight
    width = height * normalizedRatio
  }

  return {
    x: (1 - width) / 2,
    y: (1 - height) / 2,
    width,
    height,
  }
}

export function moveCropRect(rect: CropRect, deltaX: number, deltaY: number): CropRect {
  return {
    ...rect,
    x: clamp(rect.x + deltaX, 0, 1 - rect.width),
    y: clamp(rect.y + deltaY, 0, 1 - rect.height),
  }
}

function resizeFreeCropRect(
  rect: CropRect,
  handle: CropHandle,
  deltaX: number,
  deltaY: number,
  source: ImageSource,
) {
  const { minWidth, minHeight } = getMinimumNormalizedSize(source, null)
  let left = rect.x
  let top = rect.y
  let right = rect.x + rect.width
  let bottom = rect.y + rect.height

  if (handle.includes('w')) {
    left = clamp(left + deltaX, 0, right - minWidth)
  }
  if (handle.includes('e')) {
    right = clamp(right + deltaX, left + minWidth, 1)
  }
  if (handle.includes('n')) {
    top = clamp(top + deltaY, 0, bottom - minHeight)
  }
  if (handle.includes('s')) {
    bottom = clamp(bottom + deltaY, top + minHeight, 1)
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}

function resizeLockedCropRect(
  rect: CropRect,
  handle: CropHandle,
  deltaX: number,
  deltaY: number,
  source: ImageSource,
  ratio: number,
) {
  const normalizedRatio = getNormalizedRatio(source, ratio)
  const { minWidth } = getMinimumNormalizedSize(source, ratio)
  const currentWidth = rect.width
  const currentHeight = rect.height
  const anchorX = handle.includes('e') ? rect.x : rect.x + rect.width
  const anchorY = handle.includes('s') ? rect.y : rect.y + rect.height
  const horizontalSign = handle.includes('e') ? 1 : -1
  const verticalSign = handle.includes('s') ? 1 : -1
  const widthFromHorizontal = currentWidth + horizontalSign * deltaX
  const widthFromVertical = (currentHeight + verticalSign * deltaY) * normalizedRatio

  let width = Math.max(minWidth, widthFromHorizontal, widthFromVertical)

  const horizontalLimit = handle.includes('e') ? 1 - anchorX : anchorX
  const verticalLimit = (handle.includes('s') ? 1 - anchorY : anchorY) * normalizedRatio
  width = clamp(width, minWidth, Math.min(horizontalLimit, verticalLimit))

  const height = width / normalizedRatio

  return {
    x: handle.includes('e') ? anchorX : anchorX - width,
    y: handle.includes('s') ? anchorY : anchorY - height,
    width,
    height,
  }
}

export function resizeCropRect(
  rect: CropRect,
  handle: CropHandle,
  deltaX: number,
  deltaY: number,
  source: ImageSource,
  ratio: number | null,
) {
  if (!ratio || !['nw', 'ne', 'sw', 'se'].includes(handle)) {
    return resizeFreeCropRect(rect, handle, deltaX, deltaY, source)
  }

  return resizeLockedCropRect(rect, handle, deltaX, deltaY, source, ratio)
}

export function normalizedRectToPixels(rect: CropRect, source: ImageSource): PixelCropRect {
  const x = roundToPixels(rect.x, source.width)
  const y = roundToPixels(rect.y, source.height)
  const right = roundToPixels(rect.x + rect.width, source.width)
  const bottom = roundToPixels(rect.y + rect.height, source.height)

  return {
    x,
    y,
    width: Math.max(1, right - x),
    height: Math.max(1, bottom - y),
  }
}

export function setCropRatioKeepingCenter(
  rect: CropRect,
  source: ImageSource,
  ratio: number | null,
): CropRect {
  if (!ratio) {
    return clampCropRect(rect, source, null)
  }

  const normalizedRatio = getNormalizedRatio(source, ratio)
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const area = rect.width * rect.height
  let width = Math.sqrt(area * normalizedRatio)
  let height = width / normalizedRatio

  const maxWidth = Math.min(centerX, 1 - centerX) * 2
  const maxHeight = Math.min(centerY, 1 - centerY) * 2

  if (width > maxWidth || height > maxHeight) {
    const scale = Math.min(maxWidth / width, maxHeight / height)
    width *= scale
    height *= scale
  }

  return clampCropRect(
    {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    },
    source,
    ratio,
  )
}

export function moveCropRectByPixels(
  rect: CropRect,
  deltaX: number,
  deltaY: number,
  source: ImageSource,
) {
  return moveCropRect(rect, deltaX / source.width, deltaY / source.height)
}
