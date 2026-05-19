type ImageFormat = "png" | "jpeg" | "webp"

type RenderPageOptions = Readonly<{
  dpi: number
  format: ImageFormat
  quality: number
}>

const IMAGE_FORMATS = ["png", "jpeg", "webp"] as const
const DEFAULT_DPI = 144
const MIN_DPI = 72
const MAX_DPI = 600
const DPI_PRESETS = [72, 96, 144, 200, 300, 600] as const
const DEFAULT_QUALITY = 0.92
const MIN_QUALITY = 0.1
const MAX_QUALITY = 1
const DEFAULT_RENDER_OPTIONS = {
  dpi: DEFAULT_DPI,
  format: "png",
  quality: DEFAULT_QUALITY,
} as const satisfies RenderPageOptions

function isImageFormat(value: string): value is ImageFormat {
  return IMAGE_FORMATS.includes(value as ImageFormat)
}

function getMimeType(format: ImageFormat) {
  switch (format) {
    case "jpeg":
      return "image/jpeg"
    case "webp":
      return "image/webp"
    case "png":
      return "image/png"
  }
}

function getExtension(format: ImageFormat) {
  switch (format) {
    case "jpeg":
      return "jpg"
    case "webp":
      return "webp"
    case "png":
      return "png"
  }
}

function shouldUseQuality(format: ImageFormat) {
  return format === "jpeg" || format === "webp"
}

function clampDpi(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_DPI
  }

  return Math.min(MAX_DPI, Math.max(MIN_DPI, Math.round(value)))
}

function dpiToScale(dpi: number) {
  return clampDpi(dpi) / 72
}

function clampQuality(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_QUALITY
  }

  return Math.min(MAX_QUALITY, Math.max(MIN_QUALITY, value))
}

function normalizeRenderOptions(
  options: Partial<RenderPageOptions> = {}
): RenderPageOptions {
  const requestedFormat = options.format
  const format =
    requestedFormat !== undefined && isImageFormat(requestedFormat)
      ? requestedFormat
      : DEFAULT_RENDER_OPTIONS.format

  return {
    dpi: clampDpi(options.dpi ?? DEFAULT_DPI),
    format,
    quality: shouldUseQuality(format)
      ? clampQuality(options.quality ?? DEFAULT_QUALITY)
      : DEFAULT_QUALITY,
  }
}

export {
  DEFAULT_DPI,
  DEFAULT_QUALITY,
  DEFAULT_RENDER_OPTIONS,
  DPI_PRESETS,
  MAX_DPI,
  MAX_QUALITY,
  MIN_DPI,
  MIN_QUALITY,
  clampDpi,
  clampQuality,
  dpiToScale,
  getExtension,
  getMimeType,
  isImageFormat,
  normalizeRenderOptions,
  shouldUseQuality,
}
export type { ImageFormat, RenderPageOptions }
