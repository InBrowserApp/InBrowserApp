import type { PageNumberFormat, PageNumberPosition } from "./types"

type PageNumberCoordinatesInput = Readonly<{
  fontSize: number
  marginX: number
  marginY: number
  pageHeight: number
  pageWidth: number
  position: PageNumberPosition
  textWidth: number
}>

function buildPageNumberLabel(
  selectedPageIndex: number,
  totalPages: number,
  startNumber: number,
  format: PageNumberFormat
) {
  const currentPageNumber = startNumber + selectedPageIndex
  return format === "number-total"
    ? `${currentPageNumber}/${totalPages}`
    : `${currentPageNumber}`
}

function resolvePageNumberCoordinates({
  fontSize,
  marginX,
  marginY,
  pageHeight,
  pageWidth,
  position,
  textWidth,
}: PageNumberCoordinatesInput) {
  const top = position.startsWith("top")
  const center = position.endsWith("center")
  const right = position.endsWith("right")
  const maxX = Math.max(0, pageWidth - textWidth)
  const maxY = Math.max(0, pageHeight - fontSize)
  let x = marginX
  let y = top ? pageHeight - marginY - fontSize : marginY

  if (center) {
    x = (pageWidth - textWidth) / 2
  }

  if (right) {
    x = pageWidth - marginX - textWidth
  }

  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  }
}

export { buildPageNumberLabel, resolvePageNumberCoordinates }
