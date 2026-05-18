import type {
  PageNumberFontFamily,
  PageNumberFormat,
  PageNumberOptions,
  PageNumberPosition,
} from "./types"

const MIN_FONT_SIZE = 6
const MAX_FONT_SIZE = 72
const MIN_MARGIN_PT = 0
const MAX_MARGIN_PT = 144

const PAGE_NUMBER_FORMATS = [
  "number",
  "number-total",
] as const satisfies readonly PageNumberFormat[]
const PAGE_NUMBER_FONT_FAMILIES = [
  "serif",
  "sans-serif",
] as const satisfies readonly PageNumberFontFamily[]
const PAGE_NUMBER_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const satisfies readonly PageNumberPosition[]

const DEFAULT_PAGE_NUMBER_OPTIONS = {
  fontFamily: "serif",
  fontSize: 12,
  format: "number",
  marginX: 24,
  marginY: 24,
  pages: [],
  position: "bottom-center",
  startNumber: 1,
} as const satisfies PageNumberOptions

function clampInteger(
  value: number,
  fallback: number,
  min: number,
  max: number
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.trunc(value)))
}

function normalizePageNumberOptions(
  options: PageNumberOptions
): PageNumberOptions {
  return {
    ...options,
    fontSize: clampInteger(
      options.fontSize,
      DEFAULT_PAGE_NUMBER_OPTIONS.fontSize,
      MIN_FONT_SIZE,
      MAX_FONT_SIZE
    ),
    marginX: clampInteger(
      options.marginX,
      DEFAULT_PAGE_NUMBER_OPTIONS.marginX,
      MIN_MARGIN_PT,
      MAX_MARGIN_PT
    ),
    marginY: clampInteger(
      options.marginY,
      DEFAULT_PAGE_NUMBER_OPTIONS.marginY,
      MIN_MARGIN_PT,
      MAX_MARGIN_PT
    ),
    startNumber: clampInteger(
      options.startNumber,
      DEFAULT_PAGE_NUMBER_OPTIONS.startNumber,
      1,
      999999
    ),
  }
}

export {
  DEFAULT_PAGE_NUMBER_OPTIONS,
  MAX_FONT_SIZE,
  MAX_MARGIN_PT,
  MIN_FONT_SIZE,
  MIN_MARGIN_PT,
  PAGE_NUMBER_FONT_FAMILIES,
  PAGE_NUMBER_FORMATS,
  PAGE_NUMBER_POSITIONS,
  clampInteger,
  normalizePageNumberOptions,
}
