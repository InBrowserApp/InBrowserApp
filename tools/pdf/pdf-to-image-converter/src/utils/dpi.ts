export const DEFAULT_DPI = 144

export const MIN_DPI = 72

export const MAX_DPI = 600

export const DPI_PRESETS = [72, 96, 144, 200, 300, 600] as const

export function clampDpi(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_DPI
  return Math.min(MAX_DPI, Math.max(MIN_DPI, Math.round(value)))
}

export function dpiToScale(dpi: number): number {
  const normalizedDpi = clampDpi(dpi)
  return normalizedDpi / 72
}
