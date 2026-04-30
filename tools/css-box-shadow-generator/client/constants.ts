const STORAGE_KEYS = {
  layers: "tools:css-box-shadow-generator:layers",
  activeLayerId: "tools:css-box-shadow-generator:active-layer-id",
  darkBackground: "tools:css-box-shadow-generator:dark-background",
} as const

const OFFSET_RANGE = { min: -120, max: 120 } as const
const BLUR_RANGE = { min: 0, max: 200 } as const
const SPREAD_RANGE = { min: -60, max: 60 } as const
const ALPHA_RANGE = { min: 0, max: 100 } as const

const SWATCHES = [
  "#00000033",
  "#00000066",
  "#00000099",
  "#0F172A33",
  "#FFFFFF33",
  "#FFFFFF66",
  "#38BDF866",
  "#6366F166",
  "#F9731666",
  "#F43F5E66",
] as const

export {
  ALPHA_RANGE,
  BLUR_RANGE,
  OFFSET_RANGE,
  SPREAD_RANGE,
  STORAGE_KEYS,
  SWATCHES,
}
