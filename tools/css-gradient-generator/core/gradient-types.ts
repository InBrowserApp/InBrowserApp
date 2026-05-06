type GradientType = "linear" | "radial" | "conic"
type ColorSpace = "srgb" | "oklch"
type RadialShape = "circle" | "ellipse"
type RadialSize =
  | "closest-side"
  | "closest-corner"
  | "farthest-side"
  | "farthest-corner"
type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"
type ColorFormat = "hex" | "rgba"

type GradientStop = Readonly<{
  id: string
  color: string
  position: number
}>

type GradientStopSeed = Readonly<{
  id?: string
  color: string
  position: number
}>

type GradientLayer = Readonly<{
  id: string
  type: GradientType
  angle: number
  centerX: number
  centerY: number
  radialShape: RadialShape
  radialSize: RadialSize
  colorSpace: ColorSpace
  blendMode: BlendMode
  stops: readonly GradientStop[]
}>

type GradientLayerSeed = Readonly<{
  id?: string
  type: GradientType
  angle: number
  centerX: number
  centerY: number
  radialShape: RadialShape
  radialSize: RadialSize
  colorSpace: ColorSpace
  blendMode: BlendMode
  stops: readonly GradientStopSeed[]
}>

const GRADIENT_TYPES = ["linear", "radial", "conic"] as const
const COLOR_SPACES = ["srgb", "oklch"] as const
const RADIAL_SHAPES = ["circle", "ellipse"] as const
const RADIAL_SIZES = [
  "closest-side",
  "closest-corner",
  "farthest-side",
  "farthest-corner",
] as const
const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
] as const

const DEFAULT_STOPS: readonly GradientStopSeed[] = [
  { color: "#0EA5E9FF", position: 0 },
  { color: "#8B5CFFFF", position: 52 },
  { color: "#F43F5EFF", position: 100 },
]

const DEFAULT_LAYER: Readonly<Omit<GradientLayer, "id" | "stops">> = {
  type: "linear",
  angle: 135,
  centerX: 50,
  centerY: 50,
  radialShape: "circle",
  radialSize: "farthest-corner",
  colorSpace: "srgb",
  blendMode: "normal",
}

export {
  BLEND_MODES,
  COLOR_SPACES,
  DEFAULT_LAYER,
  DEFAULT_STOPS,
  GRADIENT_TYPES,
  RADIAL_SHAPES,
  RADIAL_SIZES,
}
export type {
  BlendMode,
  ColorFormat,
  ColorSpace,
  GradientLayer,
  GradientLayerSeed,
  GradientStop,
  GradientStopSeed,
  GradientType,
  RadialShape,
  RadialSize,
}
