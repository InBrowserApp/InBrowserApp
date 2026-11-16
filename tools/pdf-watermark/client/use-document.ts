import { useEffect, useRef, useState } from "react"
import { runPdfTask } from "./pdf-task"
import type { ExportLayer, Messages, Result, Source } from "../types"

function messageFor(error: unknown, messages: Messages, fallback: string) {
  const key = error instanceof Error ? error.message : ""
  return Object.hasOwn(messages, key)
    ? messages[key as keyof Messages]
    : fallback
}

function useDocument(messages: Messages) {
  const [source, setSource] = useState<Source | null>(null)
  const [status, setStatus] = useState<"idle" | "reading" | "generating">(
    "idle"
  )
  const [error, setError] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => controller.current?.abort(), [])

  function clear() {
    controller.current?.abort()
    setSource(null)
    setResult(null)
    setError("")
    setStatus("idle")
  }

  async function select(file: File | null) {
    if (!file) return
    clear()
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError(messages.unsupportedPdf)
      return
    }
    const current = new AbortController()
    controller.current = current
    setStatus("reading")
    try {
      const response = await runPdfTask(
        { type: "inspect", source: await file.arrayBuffer() },
        current.signal
      )
      if (!current.signal.aborted && response.ok && "pages" in response)
        setSource({ file, pages: response.pages })
    } catch (cause) {
      if (!current.signal.aborted)
        setError(messageFor(cause, messages, messages.readError))
    } finally {
      if (!current.signal.aborted) setStatus("idle")
    }
  }

  async function generate(layers: readonly ExportLayer[]) {
    if (!source) return
    const current = new AbortController()
    controller.current?.abort()
    controller.current = current
    setResult(null)
    setError("")
    setStatus("generating")
    try {
      const [bytes, requests] = await Promise.all([
        source.file.arrayBuffer(),
        Promise.all(
          layers.map(async (layer) => ({
            png: await layer.mark.blob.arrayBuffer(),
            options: layer.options,
            pages: layer.pages,
          }))
        ),
      ])
      const response = await runPdfTask(
        { type: "generate", source: bytes, layers: requests },
        current.signal
      )
      if (!current.signal.aborted && response.ok && "bytes" in response) {
        setResult({
          blob: new Blob([response.bytes], { type: "application/pdf" }),
          name: `${source.file.name.replace(/\.pdf$/i, "")}-watermarked.pdf`,
        })
      }
    } catch (cause) {
      if (!current.signal.aborted)
        setError(messageFor(cause, messages, messages.generateError))
    } finally {
      if (!current.signal.aborted) setStatus("idle")
    }
  }

  return {
    source,
    status,
    error,
    result,
    select,
    clear,
    generate,
    invalidate: () => setResult(null),
  }
}

export { useDocument, messageFor }
