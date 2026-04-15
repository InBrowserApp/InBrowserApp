type PlaceholderBackgroundType = "solid" | "linear-gradient" | "radial-gradient"

type PlaceholderExportFormat = "png" | "jpeg" | "svg" | "webp"
type PlaceholderScale = 1 | 2 | 3

type PlaceholderOptions = Readonly<{
  backgroundColor: string
  backgroundType: PlaceholderBackgroundType
  fontSize: number
  gradientAngle: number
  gradientColor1: string
  gradientColor2: string
  height: number
  text: string
  textColor: string
  width: number
}>

type PlaceholderPreset = Readonly<{
  height: number
  id: string
  label: string
  width: number
}>

type PlaceholderSvgBackground = Readonly<{
  defs: string
  fill: string
}>

const MAX_DIMENSION = 4096
const MAX_FONT_SIZE = 500
const DEFAULT_PLACEHOLDER_OPTIONS: PlaceholderOptions = {
  backgroundColor: "#d4d4d8",
  backgroundType: "solid",
  fontSize: 0,
  gradientAngle: 45,
  gradientColor1: "#667eea",
  gradientColor2: "#764ba2",
  height: 600,
  text: "",
  textColor: "#52525b",
  width: 800,
}
const PLACEHOLDER_PRESETS = [
  { id: "hd", label: "HD 1280 × 720", width: 1280, height: 720 },
  { id: "full-hd", label: "Full HD 1920 × 1080", width: 1920, height: 1080 },
  { id: "square", label: "Square 1080 × 1080", width: 1080, height: 1080 },
  { id: "story", label: "Story 1080 × 1920", width: 1080, height: 1920 },
  { id: "cover", label: "Cover 1200 × 630", width: 1200, height: 630 },
  { id: "banner", label: "Banner 728 × 90", width: 728, height: 90 },
] as const satisfies readonly PlaceholderPreset[]
const PLACEHOLDER_SCALES = [
  1, 2, 3,
] as const satisfies readonly PlaceholderScale[]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizePlaceholderOptions(
  options: Partial<PlaceholderOptions>
): PlaceholderOptions {
  const width = clamp(
    Math.round(options.width ?? DEFAULT_PLACEHOLDER_OPTIONS.width) || 1,
    1,
    MAX_DIMENSION
  )
  const height = clamp(
    Math.round(options.height ?? DEFAULT_PLACEHOLDER_OPTIONS.height) || 1,
    1,
    MAX_DIMENSION
  )
  const fontSize = clamp(
    Math.round(options.fontSize ?? DEFAULT_PLACEHOLDER_OPTIONS.fontSize) || 0,
    0,
    MAX_FONT_SIZE
  )
  const rawAngle =
    options.gradientAngle ?? DEFAULT_PLACEHOLDER_OPTIONS.gradientAngle
  const normalizedAngle = ((Math.round(rawAngle) % 360) + 360) % 360

  return {
    backgroundColor:
      options.backgroundColor ?? DEFAULT_PLACEHOLDER_OPTIONS.backgroundColor,
    backgroundType:
      options.backgroundType ?? DEFAULT_PLACEHOLDER_OPTIONS.backgroundType,
    fontSize,
    gradientAngle: normalizedAngle,
    gradientColor1:
      options.gradientColor1 ?? DEFAULT_PLACEHOLDER_OPTIONS.gradientColor1,
    gradientColor2:
      options.gradientColor2 ?? DEFAULT_PLACEHOLDER_OPTIONS.gradientColor2,
    height,
    text: options.text ?? DEFAULT_PLACEHOLDER_OPTIONS.text,
    textColor: options.textColor ?? DEFAULT_PLACEHOLDER_OPTIONS.textColor,
    width,
  }
}

function normalizePlaceholderScale(scale: number): PlaceholderScale {
  if (scale <= 1) {
    return 1
  }

  if (scale >= 3) {
    return 3
  }

  return 2
}

function resolvePlaceholderText(options: PlaceholderOptions) {
  return options.text.trim() || `${options.width} × ${options.height}`
}

function resolvePlaceholderFontSize(options: PlaceholderOptions) {
  if (options.fontSize > 0) {
    return options.fontSize
  }

  return Math.round(Math.min(options.width, options.height) / 8)
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function buildPlaceholderSvgBackground(
  options: PlaceholderOptions
): PlaceholderSvgBackground {
  if (options.backgroundType === "linear-gradient") {
    return {
      defs: `<defs><linearGradient id="placeholder-gradient" gradientTransform="rotate(${options.gradientAngle}, 0.5, 0.5)"><stop offset="0%" stop-color="${options.gradientColor1}"/><stop offset="100%" stop-color="${options.gradientColor2}"/></linearGradient></defs>`,
      fill: "url(#placeholder-gradient)",
    }
  }

  if (options.backgroundType === "radial-gradient") {
    return {
      defs: `<defs><radialGradient id="placeholder-gradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${options.gradientColor1}"/><stop offset="100%" stop-color="${options.gradientColor2}"/></radialGradient></defs>`,
      fill: "url(#placeholder-gradient)",
    }
  }

  return {
    defs: "",
    fill: options.backgroundColor,
  }
}

function buildPlaceholderSvgMarkup(
  options: Partial<PlaceholderOptions>,
  scale = 1
) {
  const normalizedOptions = normalizePlaceholderOptions(options)
  const normalizedScale = normalizePlaceholderScale(scale)
  const width = normalizedOptions.width * normalizedScale
  const height = normalizedOptions.height * normalizedScale
  const fontSize =
    resolvePlaceholderFontSize(normalizedOptions) * normalizedScale
  const text = escapeXml(resolvePlaceholderText(normalizedOptions))
  const background = buildPlaceholderSvgBackground(normalizedOptions)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${background.defs}<rect width="100%" height="100%" fill="${background.fill}"/><text x="50%" y="50%" fill="${normalizedOptions.textColor}" font-size="${fontSize}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`
}

function buildPlaceholderPreviewDataUri(options: Partial<PlaceholderOptions>) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildPlaceholderSvgMarkup(options))}`
}

function buildPlaceholderFilename(
  options: Partial<PlaceholderOptions>,
  format: PlaceholderExportFormat,
  scale = 1
) {
  const normalizedOptions = normalizePlaceholderOptions(options)
  const normalizedScale = normalizePlaceholderScale(scale)
  const suffix = normalizedScale > 1 ? `@${normalizedScale}x` : ""
  const extension = format === "jpeg" ? "jpg" : format

  return `placeholder-${normalizedOptions.width}x${normalizedOptions.height}${suffix}.${extension}`
}

/* v8 ignore start -- browser canvas and clipboard APIs */
function drawPlaceholderToCanvas(
  canvas: HTMLCanvasElement,
  options: Partial<PlaceholderOptions>,
  scale = 1
) {
  const normalizedOptions = normalizePlaceholderOptions(options)
  const normalizedScale = normalizePlaceholderScale(scale)
  const width = normalizedOptions.width * normalizedScale
  const height = normalizedOptions.height * normalizedScale
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  canvas.width = width
  canvas.height = height

  if (normalizedOptions.backgroundType === "solid") {
    context.fillStyle = normalizedOptions.backgroundColor
  } else if (normalizedOptions.backgroundType === "linear-gradient") {
    const angle = (normalizedOptions.gradientAngle * Math.PI) / 180
    const x1 = width / 2 - Math.cos(angle) * (width / 2)
    const y1 = height / 2 - Math.sin(angle) * (height / 2)
    const x2 = width / 2 + Math.cos(angle) * (width / 2)
    const y2 = height / 2 + Math.sin(angle) * (height / 2)
    const gradient = context.createLinearGradient(x1, y1, x2, y2)
    gradient.addColorStop(0, normalizedOptions.gradientColor1)
    gradient.addColorStop(1, normalizedOptions.gradientColor2)
    context.fillStyle = gradient
  } else {
    const gradient = context.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    )
    gradient.addColorStop(0, normalizedOptions.gradientColor1)
    gradient.addColorStop(1, normalizedOptions.gradientColor2)
    context.fillStyle = gradient
  }

  context.fillRect(0, 0, width, height)
  context.fillStyle = normalizedOptions.textColor
  context.font = `${resolvePlaceholderFontSize(normalizedOptions) * normalizedScale}px system-ui, sans-serif`
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(
    resolvePlaceholderText(normalizedOptions),
    width / 2,
    height / 2
  )
}

async function createPlaceholderRasterBlob(
  options: Partial<PlaceholderOptions>,
  format: Exclude<PlaceholderExportFormat, "svg">,
  scale = 1,
  quality = 0.9
) {
  const canvas = document.createElement("canvas")
  drawPlaceholderToCanvas(canvas, options, scale)
  const mimeType =
    format === "png"
      ? "image/png"
      : format === "jpeg"
        ? "image/jpeg"
        : "image/webp"

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, format === "png" ? undefined : quality)
  })

  if (!blob) {
    throw new Error("CANVAS_EXPORT_FAILED")
  }

  return blob
}
/* v8 ignore end */

export {
  DEFAULT_PLACEHOLDER_OPTIONS,
  MAX_DIMENSION,
  MAX_FONT_SIZE,
  PLACEHOLDER_PRESETS,
  PLACEHOLDER_SCALES,
  buildPlaceholderFilename,
  buildPlaceholderPreviewDataUri,
  buildPlaceholderSvgMarkup,
  createPlaceholderRasterBlob,
  escapeXml,
  normalizePlaceholderOptions,
  normalizePlaceholderScale,
  resolvePlaceholderFontSize,
  resolvePlaceholderText,
}

export type { PlaceholderBackgroundType, PlaceholderOptions, PlaceholderScale }
