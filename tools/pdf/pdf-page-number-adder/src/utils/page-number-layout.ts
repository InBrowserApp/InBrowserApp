import type { PageNumberFormat, PageNumberPosition } from '../types'

export const buildPageNumberLabel = (
  index: number,
  total: number,
  startNumber: number,
  format: PageNumberFormat,
): string => {
  const current = startNumber + index
  if (format === 'n-total') {
    return `${current}/${total}`
  }

  return `${current}`
}

export const resolvePageNumberCoordinates = ({
  pageWidth,
  pageHeight,
  textWidth,
  fontSize,
  marginX,
  marginY,
  position,
}: {
  pageWidth: number
  pageHeight: number
  textWidth: number
  fontSize: number
  marginX: number
  marginY: number
  position: PageNumberPosition
}): { x: number; y: number } => {
  let x = marginX
  let y = marginY

  if (position === 'top-left' || position === 'top-center' || position === 'top-right') {
    y = pageHeight - marginY - fontSize
  }

  if (position === 'top-center' || position === 'bottom-center') {
    x = (pageWidth - textWidth) / 2
  }

  if (position === 'top-right' || position === 'bottom-right') {
    x = pageWidth - marginX - textWidth
  }

  const maxX = Math.max(0, pageWidth - textWidth)
  const maxY = Math.max(0, pageHeight - fontSize)

  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  }
}
