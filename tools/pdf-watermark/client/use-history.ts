import { useCallback, useRef, useState } from "react"
import type { WatermarkLayer } from "../types"

function useHistory(initial: readonly WatermarkLayer[]) {
  const [state, setState] = useState({
    layers: initial,
    canUndo: false,
    canRedo: false,
  })
  const history = useRef({
    layers: initial,
    past: [] as (readonly WatermarkLayer[])[],
    future: [] as (readonly WatermarkLayer[])[],
    gesture: null as readonly WatermarkLayer[] | null,
  })
  const publish = useCallback(() => {
    const h = history.current
    setState({
      layers: h.layers,
      canUndo: h.past.length > 0,
      canRedo: h.future.length > 0,
    })
  }, [])
  const change = useCallback(
    (
      update: (layers: readonly WatermarkLayer[]) => readonly WatermarkLayer[]
    ) => {
      const h = history.current
      const next = update(h.layers)
      if (next === h.layers) return
      if (!h.gesture) {
        h.past = [...h.past.slice(-49), h.layers]
        h.future = []
      }
      h.layers = next
      publish()
    },
    [publish]
  )
  const begin = useCallback(() => {
    history.current.gesture = history.current.layers
  }, [])
  const end = useCallback(
    (cancel = false) => {
      const h = history.current
      if (!h.gesture) return
      if (cancel) h.layers = h.gesture
      else if (h.layers !== h.gesture) {
        h.past = [...h.past.slice(-49), h.gesture]
        h.future = []
      }
      h.gesture = null
      publish()
    },
    [publish]
  )
  const undo = useCallback(() => {
    const h = history.current
    const previous = h.past.at(-1)
    if (!previous || h.gesture) return
    h.past = h.past.slice(0, -1)
    h.future = [h.layers, ...h.future]
    h.layers = previous
    publish()
  }, [publish])
  const redo = useCallback(() => {
    const h = history.current
    const next = h.future[0]
    if (!next || h.gesture) return
    h.future = h.future.slice(1)
    h.past = [...h.past, h.layers]
    h.layers = next
    publish()
  }, [publish])
  return { ...state, change, begin, end, undo, redo }
}

export { useHistory }
