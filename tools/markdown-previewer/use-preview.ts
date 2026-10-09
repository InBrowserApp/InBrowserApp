import { useEffect, useState } from "react"
import type { buildMarkdownPreview } from "./core/markdown-preview"
import { preparePreview } from "./prepare-preview"

type Preview = ReturnType<typeof buildMarkdownPreview> &
  ReturnType<typeof preparePreview>

export function usePreview(
  source: string,
  untitled: string,
  renderHtml: boolean
) {
  const [preview, setPreview] = useState<Preview | null>(null)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(false)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    setPending(true)
    setError(false)
    let active = true
    let worker: Worker | undefined
    const dispose = () => {
      active = false
      worker?.terminate()
      worker = undefined
    }
    const fail = () => {
      if (!active) return
      setError(true)
      setPending(false)
      setPreview(null)
      dispose()
    }
    try {
      worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
      worker.onmessage = (
        event: MessageEvent<{
          preview?: ReturnType<typeof buildMarkdownPreview>
        }>
      ) => {
        if (!active) return
        try {
          if (!event.data.preview) throw new Error("PARSE")
          setPreview({
            ...event.data.preview,
            ...preparePreview(event.data.preview.html),
            toc: event.data.preview.toc.map((item) => ({
              ...item,
              id: `markdown-${item.id}`,
            })),
          })
          setPending(false)
          dispose()
        } catch {
          fail()
        }
      }
      worker.onerror = fail
      worker.onmessageerror = fail
      worker.postMessage({ source, untitled, renderHtml })
    } catch {
      fail()
    }
    return dispose
  }, [source, untitled, renderHtml, revision])
  return { preview, pending, error, retry: () => setRevision(revision + 1) }
}
