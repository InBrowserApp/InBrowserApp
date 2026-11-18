export type Size = { width: number; height: number }
export type Layout = "horizontal" | "vertical" | "grid"
type Placement = Size & { x: number; y: number }
type Options = {
  layout: Layout
  columns: number
  gap: number
  match: Partial<Size> | null
}

function scaleToFit(image: Size, width: number, height: number): Size {
  const scale = Math.min(width / image.width, height / image.height)
  return {
    width: Math.max(1, Math.round(image.width * scale)),
    height: Math.max(1, Math.round(image.height * scale)),
  }
}

export function composeLayout(
  images: readonly Size[],
  { layout, columns, gap, match }: Options
) {
  const placements: Placement[] = []
  if (images.length === 0) return { width: 0, height: 0, placements }

  const widths = images.map((image) => image.width)
  const heights = images.map((image) => image.height)
  const width = match
    ? (match.width ?? Math.min(...widths))
    : Math.max(...widths)
  const height = match
    ? (match.height ?? Math.min(...heights))
    : Math.max(...heights)

  if (layout === "grid") {
    const count = Math.min(columns, images.length)
    const rows = Math.ceil(images.length / count)
    for (const [index, image] of images.entries()) {
      const size = match ? scaleToFit(image, width, height) : image
      placements.push({
        width: size.width,
        height: size.height,
        x:
          (index % count) * (width + gap) +
          Math.floor((width - size.width) / 2),
        y:
          Math.floor(index / count) * (height + gap) +
          Math.floor((height - size.height) / 2),
      })
    }
    return {
      width: count * width + (count - 1) * gap,
      height: rows * height + (rows - 1) * gap,
      placements,
    }
  }

  const horizontal = layout === "horizontal"
  let length = 0
  for (const image of images) {
    const size = match
      ? scaleToFit(
          image,
          horizontal ? Infinity : width,
          horizontal ? height : Infinity
        )
      : image
    placements.push({
      width: size.width,
      height: size.height,
      x: horizontal ? length : Math.floor((width - size.width) / 2),
      y: horizontal ? Math.floor((height - size.height) / 2) : length,
    })
    length += (horizontal ? size.width : size.height) + gap
  }
  return {
    width: horizontal ? length - gap : width,
    height: horizontal ? height : length - gap,
    placements,
  }
}

export type Composition = ReturnType<typeof composeLayout>

const MAX_CANVAS_SIDE = 16384
// Bound the RGBA backing store to 256 MiB before PNG encoding.
const MAX_CANVAS_AREA = 8192 * 8192

export function outputIsTooLarge({ width, height }: Size) {
  return (
    width > MAX_CANVAS_SIDE ||
    height > MAX_CANVAS_SIDE ||
    width * height > MAX_CANVAS_AREA
  )
}
