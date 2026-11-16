import type { Options, PageGeometry } from "../types"

function visibleSize(page: PageGeometry) {
  return page.rotation % 180 === 0
    ? { width: page.width, height: page.height }
    : { width: page.height, height: page.width }
}

function pageMatrix(
  page: PageGeometry
): [number, number, number, number, number, number] {
  const { x, y, width, height, rotation } = page
  if (rotation === 90) return [0, 1, -1, 0, x + width, y]
  if (rotation === 180) return [-1, 0, 0, -1, x + width, y + height]
  if (rotation === 270) return [0, -1, 1, 0, x, y + height]
  return [1, 0, 0, 1, x, y]
}

function watermarkLayout(page: PageGeometry, aspect: number, options: Options) {
  const { width, height } = visibleSize(page)
  const margin = Math.min(24, width / 10, height / 10)
  const angle = (-options.rotation * Math.PI) / 180
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  let markWidth = (width * options.size) / 100
  let markHeight = markWidth / aspect
  let boxWidth = Math.abs(cos) * markWidth + Math.abs(sin) * markHeight
  let boxHeight = Math.abs(sin) * markWidth + Math.abs(cos) * markHeight
  const scale = Math.min(
    1,
    (width - 2 * margin) / boxWidth,
    (height - 2 * margin) / boxHeight
  )
  markWidth *= scale
  markHeight *= scale
  boxWidth *= scale
  boxHeight *= scale
  const centers: { x: number; y: number }[] = []
  if (options.layout === "single") {
    if (options.position === "custom") {
      centers.push({
        x: (width * options.x) / 100,
        y: height * (1 - options.y / 100),
      })
      return { centers, markWidth, markHeight, cos, sin }
    }
    const col = options.position % 3
    const row = Math.floor(options.position / 3)
    centers.push({
      x: margin + boxWidth / 2 + (col * (width - 2 * margin - boxWidth)) / 2,
      y:
        height -
        margin -
        boxHeight / 2 -
        (row * (height - 2 * margin - boxHeight)) / 2,
    })
  } else {
    // Bound density even for unusually narrow or tall pages.
    const stepX = Math.max(boxWidth + options.spacing, width / 30)
    const stepY = Math.max(boxHeight + options.spacing, height / 30)
    const cols = Math.ceil(width / 2 / stepX)
    const rows = Math.ceil(height / 2 / stepY)
    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        centers.push({
          x: width / 2 + col * stepX,
          y: height / 2 + row * stepY,
        })
      }
    }
  }
  return { centers, markWidth, markHeight, cos, sin }
}

export { visibleSize, pageMatrix, watermarkLayout }
