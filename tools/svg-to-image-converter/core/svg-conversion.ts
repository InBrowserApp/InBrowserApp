type SvgDimensions = Readonly<{
  height: number
  width: number
}>

type OutputFormat = "png" | "jpeg" | "webp"

const DEFAULT_SVG_DIMENSIONS: SvgDimensions = {
  height: 512,
  width: 512,
}
const DEFAULT_QUALITY = 92
const MAX_OUTPUT_DIMENSION = 8192

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeDimension(
  value: number | null | undefined,
  fallback: number
) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return clamp(Math.round(fallback), 1, MAX_OUTPUT_DIMENSION)
  }

  return clamp(Math.round(value) || 1, 1, MAX_OUTPUT_DIMENSION)
}

function normalizeQuality(value: number) {
  if (Number.isNaN(value)) {
    return DEFAULT_QUALITY
  }

  return clamp(Math.round(value), 1, 100)
}

function normalizeBackgroundColor(value: string, format: OutputFormat) {
  if (format !== "jpeg") {
    return value
  }

  if (value.startsWith("#") && value.length === 9) {
    return value.slice(0, 7)
  }

  return value
}

function resolveOutputSize(
  svgDimensions: SvgDimensions | null,
  width: number,
  height: number
) {
  const base = svgDimensions ?? DEFAULT_SVG_DIMENSIONS

  return {
    height: normalizeDimension(height, base.height),
    width: normalizeDimension(width, base.width),
  } satisfies SvgDimensions
}

function resolveLockedHeight(
  width: number,
  svgDimensions: SvgDimensions | null
) {
  const base = svgDimensions ?? DEFAULT_SVG_DIMENSIONS
  const safeWidth = normalizeDimension(width, base.width)
  const aspectRatio = base.width / base.height

  return clamp(
    Math.max(1, Math.round(safeWidth / aspectRatio)),
    1,
    MAX_OUTPUT_DIMENSION
  )
}

function resolveLockedWidth(
  height: number,
  svgDimensions: SvgDimensions | null
) {
  const base = svgDimensions ?? DEFAULT_SVG_DIMENSIONS
  const safeHeight = normalizeDimension(height, base.height)
  const aspectRatio = base.width / base.height

  return clamp(
    Math.max(1, Math.round(safeHeight * aspectRatio)),
    1,
    MAX_OUTPUT_DIMENSION
  )
}

function getOutputMimeType(format: OutputFormat) {
  if (format === "png") {
    return "image/png"
  }

  if (format === "jpeg") {
    return "image/jpeg"
  }

  return "image/webp"
}

function getOutputExtension(format: OutputFormat) {
  return format === "jpeg" ? "jpg" : format
}

function shouldShowQuality(format: OutputFormat) {
  return format !== "png"
}

function shouldFillBackground(format: OutputFormat, useBackground: boolean) {
  return format === "jpeg" ? true : useBackground
}

function deriveOutputFileName(originalName: string, format: OutputFormat) {
  const baseName = originalName.replace(/\.svg$/iu, "") || "converted"

  return `${baseName}.${getOutputExtension(format)}`
}

function buildSvgDataUrl(svgText: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`
}

function parseSvgLength(value: string | null) {
  if (!value) {
    return null
  }

  const trimmedValue = value.trim()

  if (trimmedValue === "" || trimmedValue.endsWith("%")) {
    return null
  }

  const match = trimmedValue.match(/^([0-9.]+)(px)?$/iu)

  if (!match) {
    return null
  }

  const parsed = Number(match[1])

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function parseViewBox(value: string | null) {
  if (!value) {
    return null
  }

  const parts = value
    .trim()
    .split(/[\s,]+/u)
    .map((part) => Number(part))

  if (parts.length < 4 || parts.some((part) => Number.isNaN(part))) {
    return null
  }

  const width = parts[2] as number
  const height = parts[3] as number

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null
  }

  return { height, width } satisfies SvgDimensions
}

function getSvgDimensions(svgText: string, invalidSvgError: string) {
  const parser = new DOMParser()
  const document = parser.parseFromString(svgText, "image/svg+xml")

  if (document.querySelector("parsererror")) {
    throw new Error(invalidSvgError)
  }

  const svg = document.querySelector("svg")

  if (!svg) {
    throw new Error(invalidSvgError)
  }

  const widthAttr = parseSvgLength(svg.getAttribute("width"))
  const heightAttr = parseSvgLength(svg.getAttribute("height"))
  const viewBox = parseViewBox(svg.getAttribute("viewBox"))

  let width = widthAttr
  let height = heightAttr

  if (viewBox && (!width || !height)) {
    if (!width && height) {
      width = (height * viewBox.width) / viewBox.height
    } else if (!height && width) {
      height = (width * viewBox.height) / viewBox.width
    }
  }

  if (viewBox && (!width || !height)) {
    width = width || viewBox.width
    height = height || viewBox.height
  }

  if (!width || !height) {
    return DEFAULT_SVG_DIMENSIONS
  }

  return { height, width } satisfies SvgDimensions
}

export {
  DEFAULT_QUALITY,
  DEFAULT_SVG_DIMENSIONS,
  MAX_OUTPUT_DIMENSION,
  buildSvgDataUrl,
  deriveOutputFileName,
  getOutputExtension,
  getOutputMimeType,
  getSvgDimensions,
  normalizeBackgroundColor,
  normalizeQuality,
  parseSvgLength,
  parseViewBox,
  resolveLockedHeight,
  resolveLockedWidth,
  resolveOutputSize,
  shouldFillBackground,
  shouldShowQuality,
}

export type { OutputFormat, SvgDimensions }
