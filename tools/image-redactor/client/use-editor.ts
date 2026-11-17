import { useEffect, useRef, useState } from "react"
import { exportImage } from "../render"
import type { Messages, Region, Source, Style, Tool } from "../types"
import { exampleSource, loadSource } from "./image-source"
import { useRegions } from "./use-regions"

export function useEditor(messages: Messages) {
  const history = useRegions()
  const [source, setSource] = useState<Source | null>(null)
  const [tool, setTool] = useState<Tool>("rectangle")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [style, setStyle] = useState<Style>({
    effect: "solid",
    color: "#171717",
    strength: 24,
    brushSize: 40,
  })
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [copiedRegions, setCopiedRegions] = useState<readonly Region[] | null>(
    null
  )
  const copied = copiedRegions === history.regions
  const [format, setFormat] = useState("png")
  const [quality, setQuality] = useState(92)
  const request = useRef(0)
  const selected = history.regions.find((r) => r.id === selectedId) ?? null

  useEffect(
    () => () => {
      request.current++
    },
    []
  )

  function open(next: Source) {
    setSource(next)
    history.reset()
    setSelectedId(null)
    setError("")
    setCopiedRegions(null)
    setTool("rectangle")
  }
  async function load(file: File | undefined) {
    if (!file) return
    const id = ++request.current
    setLoading(true)
    setError("")
    try {
      const next = await loadSource(file)
      if (id === request.current) open(next)
    } catch {
      if (id === request.current) setError(messages.imageError)
    } finally {
      if (id === request.current) setLoading(false)
    }
  }
  function example() {
    request.current++
    setLoading(false)
    open(exampleSource())
  }
  function changeStyle(
    patch: Partial<Style & { rotation: number }>,
    preview = false
  ) {
    setStyle((current) => ({ ...current, ...patch }))
    if (!selected) return
    const next = history.regions.map((r) =>
      r.id === selected.id ? { ...r, ...patch } : r
    )
    if (preview) history.preview(next)
    else history.commit(next)
  }
  function updateSelected(patch: Partial<Region>) {
    if (selected)
      history.commit(
        history.regions.map((r) =>
          r.id === selected.id ? { ...r, ...patch } : r
        )
      )
  }
  function remove() {
    if (selected)
      history.commit(history.regions.filter((r) => r.id !== selected.id))
    setSelectedId(null)
  }

  async function save(copy = false) {
    if (!source) return
    setBusy(true)
    setError("")
    setCopiedRegions(null)
    try {
      if (copy) {
        // Start the clipboard write during the click's user activation (Safari).
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": exportImage(source, history.regions, "png", quality),
          }),
        ])
        setCopiedRegions(history.regions)
      } else {
        const blob = await exportImage(source, history.regions, format, quality)
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        const extension =
          blob.type === "image/jpeg"
            ? "jpg"
            : blob.type === "image/webp"
              ? "webp"
              : "png"
        link.href = url
        link.download = `${source.name.replace(/\.[^.]+$/, "")}-redacted.${extension}`
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch {
      setError(copy ? messages.copyError : messages.exportError)
    } finally {
      setBusy(false)
    }
  }

  return {
    ...history,
    source,
    tool,
    setTool,
    selected,
    selectedId,
    setSelectedId,
    style,
    changeStyle,
    updateSelected,
    remove,
    load,
    example,
    loading,
    busy,
    error,
    copied,
    format,
    setFormat,
    quality,
    setQuality,
    save,
  }
}

export type Editor = ReturnType<typeof useEditor>
