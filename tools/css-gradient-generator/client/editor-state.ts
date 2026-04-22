import { clamp, createLayer } from "../core/gradient"
import { resolveGradientPreset } from "../core/presets"

import type { ColorFormat, GradientLayer } from "../core/gradient"
import type { GradientPresetId } from "../core/presets"

type EditorState = Readonly<{
  layers: readonly GradientLayer[]
  activeLayerId: string
  activeStopId: string
  outputFormat: ColorFormat
  exportWidth: number
  exportHeight: number
  presetId: GradientPresetId | null
}>

type ResolveStateOverrides = Readonly<{
  activeLayerId?: string
  activeStopId?: string
  presetId?: GradientPresetId | null
}>

const DEFAULT_PRESET_ID = "aurora" satisfies GradientPresetId
const DEFAULT_EXPORT_WIDTH = 1600
const DEFAULT_EXPORT_HEIGHT = 900
const STORAGE_KEY = "tools:css-gradient-generator:editor-state"

function materializePreset(id: GradientPresetId) {
  return resolveGradientPreset(id).layers.map((layer) => createLayer(layer))
}

function getLayer(layers: readonly GradientLayer[], layerId: string) {
  return layers.find((layer) => layer.id === layerId) ?? layers[0]!
}

function getStop(layer: GradientLayer, stopId: string) {
  return layer.stops.find((stop) => stop.id === stopId) ?? layer.stops[0]!
}

function normalizeDimension(value: number, fallback: number) {
  return Number.isFinite(value) ? clamp(value, 64, 4096) : fallback
}

function createInitialState(): EditorState {
  const layers = materializePreset(DEFAULT_PRESET_ID)

  return {
    layers,
    activeLayerId: layers[0]!.id,
    activeStopId: layers[0]!.stops[0]!.id,
    outputFormat: "hex",
    exportWidth: DEFAULT_EXPORT_WIDTH,
    exportHeight: DEFAULT_EXPORT_HEIGHT,
    presetId: DEFAULT_PRESET_ID,
  }
}

function resolveState(
  current: EditorState,
  nextLayers: readonly GradientLayer[],
  overrides: ResolveStateOverrides = {}
): EditorState {
  const nextLayer =
    nextLayers.find((layer) => layer.id === overrides.activeLayerId) ??
    nextLayers.find((layer) => layer.id === current.activeLayerId) ??
    nextLayers[0]!
  const nextStop =
    nextLayer.stops.find((stop) => stop.id === overrides.activeStopId) ??
    nextLayer.stops.find((stop) => stop.id === current.activeStopId) ??
    nextLayer.stops[0]!

  return {
    ...current,
    layers: nextLayers,
    activeLayerId: nextLayer.id,
    activeStopId: nextStop.id,
    presetId:
      overrides.presetId === undefined ? current.presetId : overrides.presetId,
  }
}

export {
  STORAGE_KEY,
  createInitialState,
  getLayer,
  getStop,
  materializePreset,
  normalizeDimension,
  resolveState,
}
export type { EditorState, ResolveStateOverrides }
