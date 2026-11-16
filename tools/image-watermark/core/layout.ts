import { POSITIONS, type Options } from "../types"

export function watermarkLayout(
  width: number,
  height: number,
  markWidth: number,
  markHeight: number,
  options: Options
) {
  const radians = (options.rotation * Math.PI) / 180
  const cosine = Math.abs(Math.cos(radians))
  const sine = Math.abs(Math.sin(radians))
  const shortSide = Math.min(width, height)
  const margin = (shortSide * options.margin) / 100
  const rotatedWidth = markWidth * cosine + markHeight * sine
  const rotatedHeight = markWidth * sine + markHeight * cosine
  const scale = Math.min(
    1,
    (width - 2 * margin) / rotatedWidth,
    (height - 2 * margin) / rotatedHeight
  )
  const boxWidth = rotatedWidth * scale
  const boxHeight = rotatedHeight * scale
  const centers: { x: number; y: number }[] = []

  if (options.tiled) {
    const gap = (shortSide * options.spacing) / 100
    // Bound draw calls even for extreme panoramas with a tiny short side.
    const stepX = Math.max(boxWidth + gap, width / 80)
    const stepY = Math.max(boxHeight + gap, height / 80)
    for (let y = -boxHeight / 2; y < height + boxHeight; y += stepY) {
      for (let x = -boxWidth / 2; x < width + boxWidth; x += stepX) {
        centers.push({ x, y })
      }
    }
  } else {
    const position = POSITIONS.indexOf(
      options.position as (typeof POSITIONS)[number]
    )
    const column =
      options.position === "custom"
        ? Math.max(0, Math.min(100, options.x)) / 100
        : (position % 3) / 2
    const row =
      options.position === "custom"
        ? Math.max(0, Math.min(100, options.y)) / 100
        : Math.floor(position / 3) / 2
    centers.push({
      x: margin + boxWidth / 2 + (width - 2 * margin - boxWidth) * column,
      y: margin + boxHeight / 2 + (height - 2 * margin - boxHeight) * row,
    })
  }
  return { centers, radians, scale }
}
