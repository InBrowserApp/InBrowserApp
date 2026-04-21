import type { RGBA } from "../core/color"

const DEFAULT_COLOR: RGBA = {
  r: 52,
  g: 152,
  b: 219,
  a: 1,
}

const STORAGE_KEYS = {
  rgba: "tools:color-picker:rgba",
  showAlpha: "tools:color-picker:show-alpha",
} as const

export { DEFAULT_COLOR, STORAGE_KEYS }
