import { useState } from "react"
import { customPosition } from "../core/transform"
import { DEFAULT_OPTIONS } from "../types"
import type { Options, PageGeometry, WatermarkLayer } from "../types"
import { useHistory } from "./use-history"

const initial: readonly WatermarkLayer[] = [
  { id: "initial", options: DEFAULT_OPTIONS, image: null, range: "" },
]

function useLayerEditor(geometry: PageGeometry, invalidate: () => void) {
  const history = useHistory(initial)
  const [selectedId, select] = useState("initial")
  const selected =
    history.layers.find((layer) => layer.id === selectedId) ?? history.layers[0]
  const activeId = selected?.id ?? ""

  function updateLayer(
    id: string,
    update: (layer: WatermarkLayer) => WatermarkLayer
  ) {
    history.change((layers) =>
      layers.some((layer) => layer.id === id)
        ? layers.map((layer) => (layer.id === id ? update(layer) : layer))
        : layers
    )
    invalidate()
  }
  function optionsChange(id: string, options: Options) {
    const current = history.layers.find((layer) => layer.id === id)
    if (
      !current ||
      Object.entries(options).every(
        ([key, value]) => current.options[key as keyof Options] === value
      )
    )
      return
    updateLayer(id, (layer) => ({ ...layer, options }))
  }
  function add(kind: "text" | "image", file?: File) {
    if (history.layers.length >= 10 || (kind === "image" && !file)) return
    history.end()
    const id = crypto.randomUUID()
    history.change((layers) => [
      ...layers,
      {
        id,
        options: { ...DEFAULT_OPTIONS, kind },
        image: file ? { id: crypto.randomUUID(), file } : null,
        range: "",
      },
    ])
    select(id)
    invalidate()
  }
  function duplicate(aspect: number) {
    if (!selected || history.layers.length >= 10) return
    history.end()
    const id = crypto.randomUUID()
    const placed = customPosition(geometry, aspect, selected.options)
    const next = {
      ...selected,
      id,
      options: {
        ...placed,
        x: Math.min(100, placed.x + 3),
        y: Math.min(100, placed.y + 3),
      },
    }
    history.change((layers) => {
      const index = layers.findIndex((layer) => layer.id === activeId)
      return [...layers.slice(0, index + 1), next, ...layers.slice(index + 1)]
    })
    select(id)
    invalidate()
  }
  function remove(id = activeId) {
    history.end()
    const index = history.layers.findIndex((layer) => layer.id === id)
    const neighbor = history.layers[index - 1] ?? history.layers[index + 1]
    history.change((layers) => layers.filter((layer) => layer.id !== id))
    select(neighbor?.id ?? "")
    invalidate()
  }
  function reorder(direction: number) {
    history.end()
    history.change((layers) => {
      const index = layers.findIndex((layer) => layer.id === activeId)
      const target = index + direction
      if (index < 0 || target < 0 || target >= layers.length) return layers
      const result = [...layers]
      ;[result[index], result[target]] = [result[target]!, result[index]!]
      return result
    })
    invalidate()
  }
  function undo() {
    if (history.canUndo) {
      history.undo()
      invalidate()
    }
  }
  function redo() {
    if (history.canRedo) {
      history.redo()
      invalidate()
    }
  }
  return {
    ...history,
    activeId,
    select,
    updateLayer,
    optionsChange,
    add,
    duplicate,
    remove,
    reorder,
    undo,
    redo,
  }
}

export { useLayerEditor }
