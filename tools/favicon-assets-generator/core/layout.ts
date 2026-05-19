type SquareDrawLayout = Readonly<{
  x: number
  y: number
  width: number
  height: number
}>

type SquareDrawLayoutInput = Readonly<{
  sourceWidth: number
  sourceHeight: number
  targetSize: number
  marginPercent: number
}>

function clampMarginPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(99, Math.max(0, value))
}

function computeSquareDrawLayout({
  sourceWidth,
  sourceHeight,
  targetSize,
  marginPercent,
}: SquareDrawLayoutInput): SquareDrawLayout {
  const safeSourceWidth = Math.max(1, Math.round(sourceWidth))
  const safeSourceHeight = Math.max(1, Math.round(sourceHeight))
  const safeTargetSize = Math.max(1, Math.round(targetSize))
  const margin = clampMarginPercent(marginPercent)
  const marginPixels = (margin / 2 / 100) * safeTargetSize
  const drawableSize = Math.max(1, safeTargetSize - marginPixels * 2)
  const longestSourceSide = Math.max(safeSourceWidth, safeSourceHeight)
  const scale = drawableSize / longestSourceSide
  const width = Math.max(1, Math.round(safeSourceWidth * scale))
  const height = Math.max(1, Math.round(safeSourceHeight * scale))
  const x = Math.round(marginPixels + (drawableSize - width) / 2)
  const y = Math.round(marginPixels + (drawableSize - height) / 2)

  return { x, y, width, height }
}

export { clampMarginPercent, computeSquareDrawLayout }
