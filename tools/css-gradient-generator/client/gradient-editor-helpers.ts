import { clamp, createLayer } from "../core/gradient"
import { drawLayersToCanvas } from "../core/render"

import type {
  GradientLayer,
  GradientStop,
  GradientType,
  RadialShape,
  RadialSize,
} from "../core/gradient"
import type { Dispatch, SetStateAction } from "react"
import type { ResolveStateOverrides } from "./editor-state"

type MutateLayers = (
  updater: (layers: readonly GradientLayer[]) => readonly GradientLayer[],
  overrides?: ResolveStateOverrides
) => void

type UpdateActiveLayerPatch = Partial<{
  angle: number
  centerX: number
  centerY: number
  blendMode: GradientLayer["blendMode"]
  colorSpace: GradientLayer["colorSpace"]
  radialShape: RadialShape
  radialSize: RadialSize
  type: GradientType
}>

function updateActiveLayer({
  activeLayer,
  activeStop,
  mutateLayers,
  patch,
  setShowLayerError,
}: Readonly<{
  activeLayer: GradientLayer
  activeStop: GradientStop
  mutateLayers: MutateLayers
  patch: UpdateActiveLayerPatch
  setShowLayerError: Dispatch<SetStateAction<boolean>>
}>) {
  setShowLayerError(false)
  mutateLayers(
    (layers) =>
      layers.map((layer) =>
        layer.id === activeLayer.id
          ? createLayer({ ...layer, ...patch })
          : layer
      ),
    {
      activeLayerId: activeLayer.id,
      activeStopId: activeStop.id,
      presetId: null,
    }
  )
}

function updateStop({
  activeLayer,
  mutateLayers,
  patch,
  setShowStopError,
  stopId,
}: Readonly<{
  activeLayer: GradientLayer
  mutateLayers: MutateLayers
  patch: { color?: string; position?: number }
  setShowStopError: Dispatch<SetStateAction<boolean>>
  stopId: string
}>) {
  setShowStopError(false)
  mutateLayers(
    (layers) =>
      layers.map((layer) =>
        layer.id === activeLayer.id
          ? {
              ...layer,
              stops: layer.stops
                .map((stop) =>
                  stop.id === stopId
                    ? {
                        ...stop,
                        color: patch.color ?? stop.color,
                        position:
                          patch.position === undefined
                            ? stop.position
                            : clamp(patch.position, 0, 100),
                      }
                    : stop
                )
                .sort((left, right) => left.position - right.position),
            }
          : layer
      ),
    { activeLayerId: activeLayer.id, activeStopId: stopId, presetId: null }
  )
}

async function exportPng({
  exportHeight,
  exportWidth,
  layers,
  setShowExportError,
}: Readonly<{
  exportHeight: number
  exportWidth: number
  layers: readonly GradientLayer[]
  setShowExportError: Dispatch<SetStateAction<boolean>>
}>) {
  setShowExportError(false)

  if (typeof document === "undefined") {
    setShowExportError(true)
    return
  }

  const canvas = document.createElement("canvas")
  canvas.width = exportWidth
  canvas.height = exportHeight
  const context = canvas.getContext("2d")

  if (!context) {
    setShowExportError(true)
    return
  }

  const rendered = drawLayersToCanvas(
    context,
    layers,
    exportWidth,
    exportHeight
  )
  if (!rendered || typeof canvas.toBlob !== "function") {
    setShowExportError(true)
    return
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png")
  })

  if (!blob) {
    setShowExportError(true)
    return
  }

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = objectUrl
  link.download = "css-gradient.png"
  link.click()
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 0)
}

export { exportPng, updateActiveLayer, updateStop }
export type { UpdateActiveLayerPatch }
