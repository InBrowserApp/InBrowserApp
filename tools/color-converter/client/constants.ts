import type { RGBA } from "../core/color"

const DEFAULT_COLOR: RGBA = {
  r: 52,
  g: 152,
  b: 219,
  a: 1,
}

const STORAGE_KEYS = {
  rgba: "tools:color-converter:rgba",
  showAlpha: "tools:color-converter:show-alpha",
} as const

const SWATCHES = [
  "#1D4ED8",
  "#0F766E",
  "#CA8A04",
  "#DC2626",
  "#7C3AED",
  "#DB2777",
  "#111827",
  "#FFFFFF",
] as const

export { DEFAULT_COLOR, STORAGE_KEYS, SWATCHES }
