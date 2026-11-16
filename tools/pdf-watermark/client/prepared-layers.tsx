import { useCallback, useEffect, useState } from "react"
import { useWatermark } from "./use-watermark"
import { parsePages } from "../core/page-range"
import { messageFor } from "./use-document"
import type {
  Messages,
  PreparedLayer,
  Watermark,
  WatermarkLayer,
} from "../types"

type Preparation = Readonly<{
  stamp: string
  mark: Watermark | null
  error: string
  preparing: boolean
}>
function stamp(layer: WatermarkLayer) {
  const { kind, text, font, color } = layer.options
  return JSON.stringify([kind, text, font, color, layer.image?.id])
}

function PreparationTask({
  layer,
  onReady,
}: Readonly<{
  layer: WatermarkLayer
  onReady: (id: string, preparation: Preparation) => void
}>) {
  const result = useWatermark(layer.options, layer.image?.file ?? null)
  const key = stamp(layer)
  useEffect(() => {
    onReady(layer.id, {
      stamp: key,
      mark: result.mark,
      error: result.error,
      preparing: result.preparing,
    })
  }, [key, layer.id, onReady, result.error, result.mark, result.preparing])
  return null
}

function usePreparedLayers(
  layers: readonly WatermarkLayer[],
  count: number,
  messages: Messages
) {
  const [preparations, setPreparations] = useState<Record<string, Preparation>>(
    {}
  )
  const ids = layers.map((layer) => layer.id).join(",")
  useEffect(() => {
    const active = new Set(ids.split(","))
    setPreparations((previous) => {
      const next = Object.entries(previous).filter(([id]) => active.has(id))
      return next.length === Object.keys(previous).length
        ? previous
        : Object.fromEntries(next)
    })
  }, [ids])
  const onReady = useCallback((id: string, preparation: Preparation) => {
    setPreparations((previous) => ({ ...previous, [id]: preparation }))
  }, [])
  const prepared: PreparedLayer[] = layers.map((layer) => {
    const item = preparations[layer.id]
    const current = item?.stamp === stamp(layer)
    let pages: readonly number[] = []
    let rangeError = ""
    try {
      if (count) pages = parsePages(layer.range, count)
    } catch (error) {
      rangeError = messageFor(error, messages, messages.rangeInvalid)
    }
    return {
      layer,
      mark: current ? item.mark : null,
      error: current ? item.error : "",
      preparing: current ? item.preparing : true,
      pages,
      rangeError,
    }
  })
  return {
    prepared,
    tasks: layers.map((layer) => (
      <PreparationTask key={layer.id} layer={layer} onReady={onReady} />
    )),
  }
}

export { usePreparedLayers }
