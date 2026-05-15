type PngOptimizerOptions = Readonly<{
  interlace: boolean
  level: number
  optimiseAlpha: boolean
}>

type PngFileLike = Readonly<{
  name: string
  type: string
}>

type PngOptimizationResult = Readonly<{
  blob: Blob
  file: File
  optimizedBytes: number
  options: PngOptimizerOptions
  originalBytes: number
  outputName: string
  savedBytes: number
  savedPercent: number
}>

const DEFAULT_PNG_OPTIMIZER_OPTIONS = {
  interlace: false,
  level: 2,
  optimiseAlpha: true,
} as const satisfies PngOptimizerOptions

const MIN_PNG_OPTIMIZATION_LEVEL = 0
const MAX_PNG_OPTIMIZATION_LEVEL = 6
const PNG_MIME_TYPE = "image/png"
const PNG_EXTENSION = ".png"
const DEFAULT_PNG_OUTPUT_NAME = "optimized.png"
const INVALID_PNG_FILE_ERROR = "PNG_OPTIMIZER_INVALID_FILE"

function clampRounded(
  value: number,
  fallback: number,
  minimum: number,
  maximum: number
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(maximum, Math.max(minimum, Math.round(value)))
}

function normalizePngOptimizerOptions(
  options: Partial<PngOptimizerOptions> = {}
): PngOptimizerOptions {
  return {
    interlace: options.interlace === true,
    level: clampRounded(
      options.level ?? DEFAULT_PNG_OPTIMIZER_OPTIONS.level,
      DEFAULT_PNG_OPTIMIZER_OPTIONS.level,
      MIN_PNG_OPTIMIZATION_LEVEL,
      MAX_PNG_OPTIMIZATION_LEVEL
    ),
    optimiseAlpha: options.optimiseAlpha !== false,
  }
}

function isSupportedPngFile(file: PngFileLike) {
  const type = file.type.trim().toLowerCase()
  const name = file.name.trim().toLowerCase()

  return type === PNG_MIME_TYPE || name.endsWith(PNG_EXTENSION)
}

function assertSupportedPngFile(file: PngFileLike) {
  if (!isSupportedPngFile(file)) {
    throw new Error(INVALID_PNG_FILE_ERROR)
  }
}

function resolvePngOutputName(fileName: string) {
  const normalizedName = fileName.replace(/[/\\]+/g, "_").trim()

  if (!normalizedName) {
    return DEFAULT_PNG_OUTPUT_NAME
  }

  const withoutExtension = normalizedName
    .replace(new RegExp(`${PNG_EXTENSION}$`, "iu"), "")
    .trim()

  if (!withoutExtension) {
    return DEFAULT_PNG_OUTPUT_NAME
  }

  return `${withoutExtension}-optimized${PNG_EXTENSION}`
}

function calculatePngSavings(originalBytes: number, optimizedBytes: number) {
  const savedBytes = originalBytes - optimizedBytes
  const savedPercent =
    originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0

  return {
    savedBytes,
    savedPercent,
  }
}

function createPngOptimizationResult(
  file: File,
  blob: Blob,
  options: Partial<PngOptimizerOptions>
): PngOptimizationResult {
  const { savedBytes, savedPercent } = calculatePngSavings(file.size, blob.size)

  return {
    blob,
    file,
    optimizedBytes: blob.size,
    options: normalizePngOptimizerOptions(options),
    originalBytes: file.size,
    outputName: resolvePngOutputName(file.name),
    savedBytes,
    savedPercent,
  }
}

export {
  DEFAULT_PNG_OPTIMIZER_OPTIONS,
  DEFAULT_PNG_OUTPUT_NAME,
  INVALID_PNG_FILE_ERROR,
  MAX_PNG_OPTIMIZATION_LEVEL,
  MIN_PNG_OPTIMIZATION_LEVEL,
  PNG_MIME_TYPE,
  assertSupportedPngFile,
  calculatePngSavings,
  createPngOptimizationResult,
  isSupportedPngFile,
  normalizePngOptimizerOptions,
  resolvePngOutputName,
}
export type { PngOptimizationResult, PngOptimizerOptions }
