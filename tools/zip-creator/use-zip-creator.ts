import { useEffect, useMemo, useRef, useState } from "react"

import {
  addItems,
  hasDirectory,
  indexItems,
  removeItems,
  zipFilename,
} from "./core/collection"
import { editItems } from "./core/edit"
import { createZip } from "./core/zip"

import type {
  EditAction,
  InputItem,
  Messages,
  Progress,
  ZipItem,
} from "./types"

type Result = Readonly<{ url: string; filename: string; bytes: number }>
type Status = "reading" | "creating" | null

export function useZipCreator(m: Messages) {
  const [items, setItems] = useState<readonly ZipItem[]>([])
  const [directory, setDirectory] = useState("")
  const [undoState, setUndoState] = useState<{
    items: readonly ZipItem[]
    directory: string
  } | null>(null)
  const [filename, setFilename] = useState("archive")
  const [level, setLevel] = useState(6)
  const [status, setStatus] = useState<Status>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const active = useRef<AbortController | null>(null)
  const resultUrl = useRef<string | null>(null)
  const index = useMemo(() => indexItems(items), [items])
  const current = hasDirectory(items, directory) ? directory : ""

  function clearResult() {
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current)
    resultUrl.current = null
    setResult(null)
  }

  useEffect(
    () => () => {
      active.current?.abort()
      active.current = null
      if (resultUrl.current) URL.revokeObjectURL(resultUrl.current)
    },
    []
  )

  function start(next: Status) {
    if (active.current) return null
    const controller = new AbortController()
    active.current = controller
    setStatus(next)
    setError("")
    if (!undoState) setNotice("")
    setProgress(null)
    return controller
  }

  function finish(controller: AbortController) {
    if (active.current !== controller) return
    active.current = null
    setStatus(null)
    setProgress(null)
  }

  async function add(
    read: (signal: AbortSignal) => Promise<readonly InputItem[]>,
    destination = current
  ) {
    const controller = start("reading")
    if (!controller) return
    try {
      const incoming = await read(controller.signal)
      controller.signal.throwIfAborted()
      const merged = addItems(items, incoming, destination)
      update(merged.items, merged.adjusted ? m.renamed : m.added)
    } catch (cause) {
      if (
        !controller.signal.aborted &&
        !(cause instanceof DOMException && cause.name === "AbortError")
      ) {
        setError(m.readError)
      }
    } finally {
      finish(controller)
    }
  }

  async function create() {
    const name = zipFilename(filename)
    if (!items.length || !name) return
    const controller = start("creating")
    if (!controller) return
    clearResult()
    try {
      const blob = await createZip(items, level, controller.signal, (value) => {
        if (active.current === controller) setProgress(value)
      })
      controller.signal.throwIfAborted()
      const url = URL.createObjectURL(blob)
      resultUrl.current = url
      setResult({ url, filename: name, bytes: blob.size })
    } catch {
      if (!controller.signal.aborted) setError(m.createError)
    } finally {
      finish(controller)
    }
  }

  function cancel() {
    active.current?.abort()
    active.current = null
    setStatus(null)
    setProgress(null)
    setNotice(m.cancelled)
  }

  function remove(path?: string) {
    if (active.current) return
    update(path === undefined ? [] : removeItems(items, path), m.removed)
  }

  function update(next: readonly ZipItem[], notice: string) {
    if (next === items) return
    clearResult()
    setUndoState({ items, directory: current })
    setItems(next)
    setNotice(notice)
    setError("")
  }

  function edit(action: EditAction, announceError = false) {
    if (active.current) return "invalidDestination" as const
    const result = editItems(items, action)
    if (!result.error) {
      update(result.items, m.updated)
      if (action.kind === "new-folder") setDirectory(result.path)
    } else if (announceError) {
      setError(m[result.error])
    }
    return result.error
  }

  function navigate(path: string) {
    if (!active.current && hasDirectory(items, path)) setDirectory(path)
  }

  function undo() {
    if (!undoState || active.current) return
    clearResult()
    setItems(undoState.items)
    setDirectory(undoState.directory)
    setUndoState(null)
    setNotice("")
  }

  function changeFilename(value: string) {
    clearResult()
    setFilename(value)
  }

  function changeLevel(value: string) {
    clearResult()
    setLevel(Number(value))
  }

  return {
    items,
    directory: current,
    index,
    filename,
    level,
    status,
    progress,
    error,
    notice,
    result,
    canUndo: undoState !== null,
    validName: zipFilename(filename) !== null,
    add,
    create,
    cancel,
    remove,
    undo,
    edit,
    navigate,
    changeFilename,
    changeLevel,
  }
}

export type Creator = ReturnType<typeof useZipCreator>
