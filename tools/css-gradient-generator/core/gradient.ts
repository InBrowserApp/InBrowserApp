import {
  BLEND_MODES,
  COLOR_SPACES,
  DEFAULT_LAYER,
  DEFAULT_STOPS,
  GRADIENT_TYPES,
  RADIAL_SHAPES,
  RADIAL_SIZES,
} from "./gradient-types"
import {
  clamp,
  createId,
  formatColor,
  formatNumber,
  hexToRgba,
  normalizeHexColor,
} from "./gradient-color"
import {
  addStop,
  cloneLayer,
  createLayer,
  createStop,
  randomizeLayer,
  sortStops,
} from "./gradient-layer"

import type {
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
} from "./gradient-types"

function createGradientCss(layer: GradientLayer, format: ColorFormat) {
  const stops = sortStops(layer.stops)
    .map(
      (stop) =>
        formatColor(stop.color, format) +
        " " +
        formatNumber(stop.position) +
        "%"
    )
    .join(", ")
  const colorSpace = layer.colorSpace === "oklch" ? "in oklch" : ""

  if (layer.type === "linear") {
    const parts = [String(Math.round(layer.angle)) + "deg", colorSpace]
      .filter(Boolean)
      .join(" ")
    return "linear-gradient(" + parts + ", " + stops + ")"
  }

  if (layer.type === "radial") {
    const parts = [
      layer.radialShape + " " + layer.radialSize,
      "at " +
        formatNumber(layer.centerX) +
        "% " +
        formatNumber(layer.centerY) +
        "%",
      colorSpace,
    ]
      .filter(Boolean)
      .join(" ")
    return "radial-gradient(" + parts + ", " + stops + ")"
  }

  const conicParts = [
    "from " + Math.round(layer.angle) + "deg",
    "at " +
      formatNumber(layer.centerX) +
      "% " +
      formatNumber(layer.centerY) +
      "%",
    colorSpace,
  ]
    .filter(Boolean)
    .join(" ")
  return "conic-gradient(" + conicParts + ", " + stops + ")"
}

function createBackgroundImage(
  layers: readonly GradientLayer[],
  format: ColorFormat
) {
  return layers.map((layer) => createGradientCss(layer, format)).join(", ")
}

function createBlendModeCss(layers: readonly GradientLayer[]) {
  return layers.length > 1
    ? layers.map((layer) => layer.blendMode).join(", ")
    : ""
}

function createBackgroundImageDeclaration(
  layers: readonly GradientLayer[],
  format: ColorFormat
) {
  return "background-image: " + createBackgroundImage(layers, format) + ";"
}

function createBackgroundBlendModeDeclaration(
  layers: readonly GradientLayer[]
) {
  const blendMode = createBlendModeCss(layers)
  return blendMode ? "background-blend-mode: " + blendMode + ";" : ""
}

function createBackgroundDeclaration(
  layers: readonly GradientLayer[],
  format: ColorFormat
) {
  const base = "background: " + createBackgroundImage(layers, format) + ";"
  const blendMode = createBackgroundBlendModeDeclaration(layers)
  return blendMode ? base + "\n" + blendMode : base
}

function createCssOutput(
  layers: readonly GradientLayer[],
  format: ColorFormat
) {
  return [
    createBackgroundImageDeclaration(layers, format),
    createBackgroundBlendModeDeclaration(layers),
  ]
    .filter(Boolean)
    .join("\n")
}

function serializeGradientConfig(layers: readonly GradientLayer[]) {
  return JSON.stringify({ version: 1, layers }, null, 2)
}

function parseGradientConfig(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown
    let rawLayers: unknown

    if (Array.isArray(parsed)) {
      rawLayers = parsed
    } else if (parsed && typeof parsed === "object") {
      rawLayers = (parsed as { layers?: unknown }).layers
    }

    return Array.isArray(rawLayers) && rawLayers.length > 0
      ? rawLayers.map((layer) => createLayer(layer as GradientLayerSeed))
      : null
  } catch {
    return null
  }
}

export {
  BLEND_MODES,
  COLOR_SPACES,
  DEFAULT_LAYER,
  DEFAULT_STOPS,
  GRADIENT_TYPES,
  RADIAL_SHAPES,
  RADIAL_SIZES,
  addStop,
  clamp,
  cloneLayer,
  createBackgroundBlendModeDeclaration,
  createBackgroundDeclaration,
  createBackgroundImage,
  createBackgroundImageDeclaration,
  createBlendModeCss,
  createCssOutput,
  createGradientCss,
  createId,
  createLayer,
  createStop,
  formatColor,
  hexToRgba,
  normalizeHexColor,
  parseGradientConfig,
  randomizeLayer,
  serializeGradientConfig,
  sortStops,
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
