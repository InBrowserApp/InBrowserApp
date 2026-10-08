import { isDocumentLimitError } from "@workspace/document-reader"
import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import type { Messages, Reader, ReaderState } from "./types"

const initial: ReaderState = {
  page: 1,
  total: 0,
  zoom: 100,
  current: 0,
  matches: 0,
  searching: false,
  query: "",
}

export function useReader(
  file: File | null,
  container: RefObject<HTMLDivElement | null>,
  messages: Messages
) {
  const reader = useRef<Reader | null>(null)
  const [state, setState] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setState(initial)
    setError("")
    setLoading(false)
    if (!file || !container.current) return
    if (!file.name.toLowerCase().endsWith(".docx") || file.size === 0) {
      setError(messages.invalid)
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(messages.tooLarge)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    function report(reason: unknown) {
      if (signal.aborted) return
      setError(
        isDocumentLimitError(reason) ? messages.tooLarge : messages.invalid
      )
      setLoading(false)
      controller.abort()
      reader.current = null
    }
    setLoading(true)
    void import("./reader")
      .then(({ openReader }) => {
        signal.throwIfAborted()
        return openReader({
          file,
          container: element,
          signal,
          onChange: (update) => {
            if (!signal.aborted) setState((value) => ({ ...value, ...update }))
          },
          onError: report,
        })
      })
      .then((instance) => {
        if (signal.aborted) {
          instance.dispose()
          return
        }
        reader.current = instance
        setLoading(false)
      })
      .catch(report)
    return () => {
      controller.abort()
      reader.current = null
    }
  }, [file, container, messages])

  return {
    state,
    loading,
    error,
    reader,
  }
}
