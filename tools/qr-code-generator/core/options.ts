const ERROR_CORRECTION_LEVELS = ["L", "M", "Q", "H"] as const

type QrErrorCorrectionLevel = (typeof ERROR_CORRECTION_LEVELS)[number]

type QrGeneratorOptions = Readonly<{
  darkColor: string
  errorCorrectionLevel: QrErrorCorrectionLevel
  lightColor: string
  margin: number
  size: number
}>

type StoredQrGeneratorOptions = Partial<QrGeneratorOptions> | null | undefined

const DEFAULT_QR_GENERATOR_OPTIONS: QrGeneratorOptions = {
  darkColor: "#111827",
  errorCorrectionLevel: "M",
  lightColor: "#ffffff",
  margin: 2,
  size: 320,
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.round(value)))
}

function normalizeColor(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback
  }

  return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback
}

function normalizeErrorCorrectionLevel(value: unknown): QrErrorCorrectionLevel {
  return ERROR_CORRECTION_LEVELS.includes(value as QrErrorCorrectionLevel)
    ? (value as QrErrorCorrectionLevel)
    : DEFAULT_QR_GENERATOR_OPTIONS.errorCorrectionLevel
}

function normalizeQrGeneratorOptions(
  options?: StoredQrGeneratorOptions
): QrGeneratorOptions {
  return {
    darkColor: normalizeColor(
      options?.darkColor,
      DEFAULT_QR_GENERATOR_OPTIONS.darkColor
    ),
    errorCorrectionLevel: normalizeErrorCorrectionLevel(
      options?.errorCorrectionLevel
    ),
    lightColor: normalizeColor(
      options?.lightColor,
      DEFAULT_QR_GENERATOR_OPTIONS.lightColor
    ),
    margin: clampInteger(
      options?.margin,
      0,
      12,
      DEFAULT_QR_GENERATOR_OPTIONS.margin
    ),
    size: clampInteger(
      options?.size,
      128,
      1024,
      DEFAULT_QR_GENERATOR_OPTIONS.size
    ),
  }
}

function parseStoredQrGeneratorOptions(raw: string | null) {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as StoredQrGeneratorOptions
    return normalizeQrGeneratorOptions(parsed)
  } catch {
    return null
  }
}

function getRenderableQrPayload(payload: string) {
  return payload === "" ? " " : payload
}

function toQrRenderOptions(options: QrGeneratorOptions) {
  return {
    color: {
      dark: options.darkColor,
      light: options.lightColor,
    },
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    width: options.size,
  } as const
}

export {
  DEFAULT_QR_GENERATOR_OPTIONS,
  ERROR_CORRECTION_LEVELS,
  getRenderableQrPayload,
  normalizeQrGeneratorOptions,
  parseStoredQrGeneratorOptions,
  toQrRenderOptions,
}
export type { QrErrorCorrectionLevel, QrGeneratorOptions }
