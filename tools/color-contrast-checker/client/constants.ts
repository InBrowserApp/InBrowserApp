import type { RGBA } from "../core/color"
import type { ContrastCheckKey } from "./types"

const STORAGE_KEYS = {
  foreground: "tools:color-contrast-checker:foreground",
  background: "tools:color-contrast-checker:background",
} as const

const DEFAULT_FOREGROUND_INPUT = "#111111"
const DEFAULT_BACKGROUND_INPUT = "#ffffff"

const DEFAULT_FOREGROUND: RGBA = { r: 17, g: 17, b: 17, a: 1 }
const DEFAULT_BACKGROUND: RGBA = { r: 255, g: 255, b: 255, a: 1 }

const SWATCHES = [
  "#0F172AFF",
  "#111827FF",
  "#64748BFF",
  "#FFFFFFFF",
  "#EF4444FF",
  "#F97316FF",
  "#FACC15FF",
  "#22C55EFF",
  "#3B82F6FF",
  "#A855F7FF",
] as const

const CONTRAST_THRESHOLDS: ReadonlyArray<
  Readonly<{ key: ContrastCheckKey; minimumRatio: number }>
> = [
  { key: "aa-normal", minimumRatio: 4.5 },
  { key: "aa-large", minimumRatio: 3 },
  { key: "aaa-normal", minimumRatio: 7 },
  { key: "aaa-large", minimumRatio: 4.5 },
] as const

export {
  CONTRAST_THRESHOLDS,
  DEFAULT_BACKGROUND,
  DEFAULT_BACKGROUND_INPUT,
  DEFAULT_FOREGROUND,
  DEFAULT_FOREGROUND_INPUT,
  STORAGE_KEYS,
  SWATCHES,
}
