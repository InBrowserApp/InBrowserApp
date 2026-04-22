import {
  BLEND_MODES,
  COLOR_SPACES,
  DEFAULT_LAYER,
  DEFAULT_STOPS,
  GRADIENT_TYPES,
  RADIAL_SHAPES,
  RADIAL_SIZES,
} from "./gradient-types"
import { clamp, createId, normalizeHexColor } from "./gradient-color"

import type {
  ColorSpace,
  GradientLayer,
  GradientLayerSeed,
  GradientStop,
  GradientStopSeed,
  RadialShape,
} from "./gradient-types"

function createStop(
  color: string,
  position: number,
  id?: string
): GradientStop {
  return {
    id: id ?? createId("stop"),
    color: normalizeHexColor(color),
    position: clamp(position, 0, 100),
  }
}

function sortStops(stops: readonly GradientStop[]) {
  return [...stops].sort((left, right) => left.position - right.position)
}

function normalizeStops(stops?: readonly GradientStopSeed[]) {
  const source = stops && stops.length >= 2 ? stops : DEFAULT_STOPS

  return sortStops(
    source.map((stop) =>
      createStop(stop.color, stop.position, "id" in stop ? stop.id : undefined)
    )
  )
}

function normalizeOption<T extends string>(
  value: unknown,
  options: readonly T[],
  fallback: T
) {
  return options.includes(value as T) ? (value as T) : fallback
}

function createLayer(
  overrides: Partial<GradientLayerSeed> = {}
): GradientLayer {
  return {
    id: overrides.id ?? createId("layer"),
    type: normalizeOption(overrides.type, GRADIENT_TYPES, DEFAULT_LAYER.type),
    angle: clamp(Number(overrides.angle ?? DEFAULT_LAYER.angle), 0, 360),
    centerX: clamp(Number(overrides.centerX ?? DEFAULT_LAYER.centerX), 0, 100),
    centerY: clamp(Number(overrides.centerY ?? DEFAULT_LAYER.centerY), 0, 100),
    radialShape: normalizeOption(
      overrides.radialShape,
      RADIAL_SHAPES,
      DEFAULT_LAYER.radialShape
    ),
    radialSize: normalizeOption(
      overrides.radialSize,
      RADIAL_SIZES,
      DEFAULT_LAYER.radialSize
    ),
    colorSpace: normalizeOption(
      overrides.colorSpace,
      COLOR_SPACES,
      DEFAULT_LAYER.colorSpace
    ),
    blendMode: normalizeOption(
      overrides.blendMode,
      BLEND_MODES,
      DEFAULT_LAYER.blendMode
    ),
    stops: normalizeStops(overrides.stops),
  }
}

function cloneLayer(layer: GradientLayer) {
  return createLayer({
    ...layer,
    id: undefined,
    stops: layer.stops.map((stop) => ({
      color: stop.color,
      position: stop.position,
    })),
  })
}

function addStop(stops: readonly GradientStop[], preferredPosition?: number) {
  const sortedStops = sortStops(stops)
  const pairs = sortedStops.slice(1).map((stop, index) => ({
    left: sortedStops[index]!,
    right: stop,
  }))
  const widestPair = pairs.reduce(
    (widest, pair) =>
      pair.right.position - pair.left.position >
      widest.right.position - widest.left.position
        ? pair
        : widest,
    pairs[0] ?? {
      left: sortedStops[0] ?? createStop("#0EA5E9FF", 0),
      right:
        sortedStops[sortedStops.length - 1] ?? createStop("#F43F5EFF", 100),
    }
  )
  const position =
    preferredPosition === undefined
      ? Math.round((widestPair.left.position + widestPair.right.position) / 2)
      : clamp(preferredPosition, 0, 100)
  const fallback = sortedStops[0] ?? createStop("#0EA5E9FF", 0)
  const color = sortedStops.reduce(
    (nearest, stop) =>
      Math.abs(stop.position - position) < Math.abs(nearest.position - position)
        ? stop
        : nearest,
    fallback
  )

  return createStop(color.color, position)
}

function randomizeLayer(layer: GradientLayer): GradientLayer {
  const stopCount = 3 + Math.floor(Math.random() * 3)
  const positions = [0, 100]
  for (let index = 0; index < stopCount - 2; index += 1) {
    positions.push(5 + Math.random() * 90)
  }

  positions.sort((left, right) => left - right)

  const radialShape: RadialShape = Math.random() > 0.5 ? "circle" : "ellipse"
  const colorSpace: ColorSpace = Math.random() > 0.5 ? "srgb" : "oklch"

  return createLayer({
    ...layer,
    id: layer.id,
    angle: Math.round(Math.random() * 360),
    centerX: Math.round(10 + Math.random() * 80),
    centerY: Math.round(10 + Math.random() * 80),
    radialShape,
    radialSize:
      RADIAL_SIZES[Math.floor(Math.random() * RADIAL_SIZES.length)] ??
      layer.radialSize,
    colorSpace,
    stops: positions.map((position) => ({
      color:
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0")
          .toUpperCase() +
        "FF",
      position,
    })),
  })
}

export {
  addStop,
  cloneLayer,
  createLayer,
  createStop,
  randomizeLayer,
  sortStops,
}
