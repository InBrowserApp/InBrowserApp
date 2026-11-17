import { useReducer, useRef, useState } from "react"
import { historyReducer, type History } from "../core/history"
import type { Region } from "../types"

export function useRegions() {
  const [history, dispatch] = useReducer(historyReducer<readonly Region[]>, {
    past: [],
    present: [],
    future: [],
  } satisfies History<readonly Region[]>)
  const [draft, setDraft] = useState<readonly Region[] | null>(null)
  const draftRef = useRef<readonly Region[] | null>(null)

  function preview(value: readonly Region[]) {
    draftRef.current = value
    setDraft(value)
  }
  function commit(value = draftRef.current) {
    if (value) dispatch({ type: "commit", value })
    cancel()
  }
  function cancel() {
    draftRef.current = null
    setDraft(null)
  }
  function undo() {
    cancel()
    dispatch({ type: "undo" })
  }
  function redo() {
    cancel()
    dispatch({ type: "redo" })
  }
  function reset() {
    cancel()
    dispatch({ type: "reset", value: [] })
  }

  return {
    regions: draft ?? history.present,
    preview,
    commit,
    cancel,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}
