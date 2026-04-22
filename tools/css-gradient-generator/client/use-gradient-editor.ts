import { useDeferredValue, useEffect, useState } from "react"

import { createLayer } from "../core/gradient"
import { GRADIENT_PRESETS } from "../core/presets"
import { createGradientEditorActions } from "./use-gradient-editor-actions"
import {
  STORAGE_KEY,
  createInitialState,
  getLayer,
  getStop,
  normalizeDimension,
  resolveState,
} from "./editor-state"
import { useGradientDerived } from "./use-gradient-derived"

import type { ColorFormat, GradientLayer } from "../core/gradient"
import type { EditorState, ResolveStateOverrides } from "./editor-state"

function useGradientEditor() {
  const [state, setState] = useState<EditorState>(() => createInitialState())
  const [jsonInput, setJsonInput] = useState("")
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [showLayerError, setShowLayerError] = useState(false)
  const [showStopError, setShowStopError] = useState(false)
  const [showJsonError, setShowJsonError] = useState(false)
  const [showExportError, setShowExportError] = useState(false)
  const deferredLayers = useDeferredValue(state.layers)

  useEffect(() => {
    if (typeof window === "undefined") {
      setHasLoadedStorage(true)
      return
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setHasLoadedStorage(true)
      return
    }

    try {
      const parsed = JSON.parse(raw) as {
        activeLayerId?: string
        activeStopId?: string
        exportHeight?: number
        exportWidth?: number
        layers?: unknown[]
        outputFormat?: ColorFormat
      }
      const fallback = createInitialState()
      const nextLayers =
        Array.isArray(parsed.layers) && parsed.layers.length > 0
          ? parsed.layers.map((layer) => createLayer(layer as GradientLayer))
          : fallback.layers

      setState(
        resolveState(
          {
            ...fallback,
            outputFormat: parsed.outputFormat === "rgba" ? "rgba" : "hex",
            exportWidth: normalizeDimension(
              Number(parsed.exportWidth ?? fallback.exportWidth),
              fallback.exportWidth
            ),
            exportHeight: normalizeDimension(
              Number(parsed.exportHeight ?? fallback.exportHeight),
              fallback.exportHeight
            ),
            presetId: null,
          },
          nextLayers,
          {
            activeLayerId: parsed.activeLayerId,
            activeStopId: parsed.activeStopId,
            presetId: null,
          }
        )
      )
    } catch {}

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage || typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        layers: state.layers,
        activeLayerId: state.activeLayerId,
        activeStopId: state.activeStopId,
        outputFormat: state.outputFormat,
        exportWidth: state.exportWidth,
        exportHeight: state.exportHeight,
      })
    )
  }, [hasLoadedStorage, state])

  const activeLayer = getLayer(state.layers, state.activeLayerId)
  const activeStop = getStop(activeLayer, state.activeStopId)
  const derived = useGradientDerived({
    layers: state.layers,
    deferredLayers,
    outputFormat: state.outputFormat,
    exportWidth: state.exportWidth,
    exportHeight: state.exportHeight,
  })

  function mutateLayers(
    updater: (layers: readonly GradientLayer[]) => readonly GradientLayer[],
    overrides: ResolveStateOverrides = { presetId: null }
  ) {
    setState((current) =>
      resolveState(current, updater(current.layers), overrides)
    )
  }

  return {
    activeLayer,
    activeStop,
    ...derived,
    ...createGradientEditorActions({
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
    }),
    exportHeight: state.exportHeight,
    exportWidth: state.exportWidth,
    hasBlendModes: derived.backgroundBlendDeclaration.length > 0,
    jsonInput,
    layers: state.layers,
    outputFormat: state.outputFormat,
    presetId: state.presetId,
    presets: GRADIENT_PRESETS,
    showExportError,
    showJsonError,
    showLayerError,
    showStopError,
  }
}

export { useGradientEditor }
