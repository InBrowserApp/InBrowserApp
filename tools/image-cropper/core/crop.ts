export type Dimensions = { width: number; height: number }
export type PixelCrop = Dimensions & { x: number; y: number }
export type Crop = PixelCrop & { unit: "%" }
export type Transform = {
  rotation: number
  flipHorizontal: boolean
  flipVertical: boolean
}

export const INITIAL_TRANSFORM: Transform = {
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
}

export function transformedDimensions(size: Dimensions, rotation: number) {
  return rotation % 180 === 0
    ? { width: size.width, height: size.height }
    : { width: size.height, height: size.width }
}

export function centeredCrop(size: Dimensions, aspect?: number): Crop {
  const ratio = aspect ?? size.width / size.height
  const width = Math.min(size.width, size.height * ratio)
  const height = width / ratio
  return {
    unit: "%",
    x: ((size.width - width) / size.width) * 50,
    y: ((size.height - height) / size.height) * 50,
    width: (width / size.width) * 100,
    height: (height / size.height) * 100,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min))
}

export function pixelCrop(crop: Crop, size: Dimensions): PixelCrop {
  const x = clamp(Math.round((crop.x * size.width) / 100), 0, size.width - 1)
  const y = clamp(Math.round((crop.y * size.height) / 100), 0, size.height - 1)
  return {
    x,
    y,
    width: clamp(
      Math.round((crop.width * size.width) / 100),
      1,
      size.width - x
    ),
    height: clamp(
      Math.round((crop.height * size.height) / 100),
      1,
      size.height - y
    ),
  }
}

export function updatePixelCrop(
  crop: Crop,
  size: Dimensions,
  field: keyof PixelCrop,
  value: number,
  aspect?: number
): Crop {
  const next = pixelCrop(crop, size)
  next[field] = clamp(
    Math.round(value),
    field === "x" || field === "y" ? 0 : 1,
    field === "x" || field === "width" ? size.width : size.height
  )
  if (aspect && (field === "width" || field === "height")) {
    const width = field === "width" ? next.width : next.height * aspect
    next.width = Math.max(
      1,
      Math.round(Math.min(width, size.width, size.height * aspect))
    )
    next.height = Math.max(1, Math.round(next.width / aspect))
  }
  next.width = Math.min(next.width, size.width)
  next.height = Math.min(next.height, size.height)
  next.x = Math.min(next.x, size.width - next.width)
  next.y = Math.min(next.y, size.height - next.height)
  return {
    unit: "%",
    x: (next.x / size.width) * 100,
    y: (next.y / size.height) * 100,
    width: (next.width / size.width) * 100,
    height: (next.height / size.height) * 100,
  }
}

export function outputName(name: string, mime: string) {
  const base = name.replace(/\.[^.]+$/, "") || "image"
  const extension =
    mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png"
  return `${base}-cropped.${extension}`
}
