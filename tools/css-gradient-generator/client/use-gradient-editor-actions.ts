import { startTransition } from "react"

import {
  addStop as createAddedStop,
  cloneLayer,
  createLayer,
  parseGradientConfig,
  randomizeLayer as randomizeGradientLayer,
} from "../core/gradient"
import {
  exportPng as exportPngImage,
  updateActiveLayer as applyActiveLayerPatch,
  updateStop as applyStopPatch,
} from "./gradient-editor-helpers"
import {
  materializePreset,
  normalizeDimension,
  resolveState,
} from "./editor-state"

import type { Dispatch, SetStateAction } from "react"
import type { ColorFormat, GradientLayer, GradientStop } from "../core/gradient"
import type { UpdateActiveLayerPatch } from "./gradient-editor-helpers"
import type { GradientPresetId } from "../core/presets"
import type { EditorState, ResolveStateOverrides } from "./editor-state"

type MutateLayers = (
  updater: (layers: readonly GradientLayer[]) => readonly GradientLayer[],
  overrides?: ResolveStateOverrides
) => void

type CreateGradientEditorActionsOptions = Readonly<{
  activeLayer: GradientLayer
  activeStop: GradientStop
  jsonInput: string
  mutateLayers: MutateLayers
  setJsonInput: Dispatch<SetStateAction<string>>
  setShowExportError: Dispatch<SetStateAction<boolean>>
  setShowJsonError: Dispatch<SetStateAction<boolean>>
  setShowLayerError: Dispatch<SetStateAction<boolean>>
  setShowStopError: Dispatch<SetStateAction<boolean>>
  setState: Dispatch<SetStateAction<EditorState>>
  state: EditorState
}>

function createGradientEditorActions({
  activeLayer,
  activeStop,
  jsonInput,
  mutateLayers,
  setJsonInput,
  setShowExportError,
  setShowJsonError,
  setShowLayerError,
  setShowStopError,
  setState,
  state,
}: CreateGradientEditorActionsOptions) {
  return {
    addLayer() {
      setShowLayerError(false)
      const nextLayer = createLayer({
        blendMode: state.layers.length > 0 ? "screen" : "normal",
      })
      mutateLayers(
        (layers) => {
          const index = layers.findIndex((layer) => layer.id === activeLayer.id)
          return [
            ...layers.slice(0, index + 1),
            nextLayer,
            ...layers.slice(index + 1),
          ]
        },
        {
          activeLayerId: nextLayer.id,
          activeStopId: nextLayer.stops[0]!.id,
          presetId: null,
        }
      )
    },
    addStop(position?: number) {
      setShowStopError(false)
      const nextStop = createAddedStop(activeLayer.stops, position)
      mutateLayers(
        (layers) =>
          layers.map((layer) =>
            layer.id === activeLayer.id
              ? {
                  ...layer,
                  stops: [...layer.stops, nextStop].sort(
                    (left, right) => left.position - right.position
                  ),
                }
              : layer
          ),
        {
          activeLayerId: activeLayer.id,
          activeStopId: nextStop.id,
          presetId: null,
        }
      )
    },
    applyPreset(presetId: GradientPresetId) {
      setShowJsonError(false)
      setShowLayerError(false)
      setShowStopError(false)
      startTransition(() => {
        setState((current) =>
          resolveState(current, materializePreset(presetId), { presetId })
        )
      })
    },
    duplicateLayer(layerId: string) {
      setShowLayerError(false)
      const sourceLayer = state.layers.find((layer) => layer.id === layerId)
      if (!sourceLayer) {
        return
      }

      const duplicated = cloneLayer(sourceLayer)
      mutateLayers(
        (layers) => {
          const index = layers.findIndex((layer) => layer.id === layerId)
          return [
            ...layers.slice(0, index + 1),
            duplicated,
            ...layers.slice(index + 1),
          ]
        },
        {
          activeLayerId: duplicated.id,
          activeStopId: duplicated.stops[0]!.id,
          presetId: null,
        }
      )
    },
    exportPng() {
      return exportPngImage({
        exportHeight: state.exportHeight,
        exportWidth: state.exportWidth,
        layers: state.layers,
        setShowExportError,
      })
    },
    loadJson() {
      const parsed = parseGradientConfig(jsonInput)
      if (!parsed) {
        setShowJsonError(true)
        return
      }

      setShowJsonError(false)
      setShowLayerError(false)
      setShowStopError(false)
      startTransition(() => {
        setState((current) => resolveState(current, parsed, { presetId: null }))
        setJsonInput("")
      })
    },
    moveLayer(layerId: string, direction: -1 | 1) {
      setShowLayerError(false)
      mutateLayers(
        (layers) => {
          const index = layers.findIndex((layer) => layer.id === layerId)
          const nextIndex = index + direction
          if (index < 0 || nextIndex < 0 || nextIndex >= layers.length) {
            return layers
          }

          const nextLayers = [...layers]
          const moved = nextLayers[index]!
          nextLayers.splice(index, 1)
          nextLayers.splice(nextIndex, 0, moved)
          return nextLayers
        },
        { activeLayerId: layerId, presetId: null }
      )
    },
    randomizeAll() {
      setShowLayerError(false)
      setShowStopError(false)
      startTransition(() => {
        mutateLayers(
          (layers) => layers.map((layer) => randomizeGradientLayer(layer)),
          {
            activeLayerId: activeLayer.id,
            activeStopId: activeStop.id,
            presetId: null,
          }
        )
      })
    },
    randomizeLayer() {
      setShowStopError(false)
      mutateLayers(
        (layers) =>
          layers.map((layer) =>
            layer.id === activeLayer.id ? randomizeGradientLayer(layer) : layer
          ),
        {
          activeLayerId: activeLayer.id,
          activeStopId: activeStop.id,
          presetId: null,
        }
      )
    },
    removeLayer(layerId: string) {
      if (state.layers.length <= 1) {
        setShowLayerError(true)
        return
      }

      setShowLayerError(false)
      mutateLayers((layers) => layers.filter((layer) => layer.id !== layerId), {
        presetId: null,
      })
    },
    removeStop(stopId: string) {
      if (activeLayer.stops.length <= 2) {
        setShowStopError(true)
        return
      }

      setShowStopError(false)
      const remainingStops = activeLayer.stops.filter(
        (stop) => stop.id !== stopId
      )
      mutateLayers(
        (layers) =>
          layers.map((layer) =>
            layer.id === activeLayer.id
              ? {
                  ...layer,
                  stops: remainingStops,
                }
              : layer
          ),
        {
          activeLayerId: activeLayer.id,
          activeStopId: remainingStops[0]!.id,
          presetId: null,
        }
      )
    },
    setActiveLayer(layerId: string) {
      setShowLayerError(false)
      setState((current) =>
        resolveState(current, current.layers, { activeLayerId: layerId })
      )
    },
    setActiveStop(stopId: string) {
      setShowStopError(false)
      setState((current) => ({ ...current, activeStopId: stopId }))
    },
    setExportHeight(value: number) {
      setShowExportError(false)
      setState((current) => ({
        ...current,
        exportHeight: normalizeDimension(value, current.exportHeight),
      }))
    },
    setExportWidth(value: number) {
      setShowExportError(false)
      setState((current) => ({
        ...current,
        exportWidth: normalizeDimension(value, current.exportWidth),
      }))
    },
    setJsonInput,
    setOutputFormat(format: ColorFormat) {
      setState((current) => ({ ...current, outputFormat: format }))
    },
    updateActiveLayer(patch: UpdateActiveLayerPatch) {
      applyActiveLayerPatch({
        activeLayer,
        activeStop,
        mutateLayers,
        patch,
        setShowLayerError,
      })
    },
    updateStopColor(stopId: string, color: string) {
      applyStopPatch({
        activeLayer,
        mutateLayers,
        patch: { color },
        setShowStopError,
        stopId,
      })
    },
    updateStopPosition(stopId: string, position: number) {
      applyStopPatch({
        activeLayer,
        mutateLayers,
        patch: { position },
        setShowStopError,
        stopId,
      })
    },
  }
}

export { createGradientEditorActions }
