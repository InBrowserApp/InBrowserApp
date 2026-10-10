import { isDocumentLimitError } from "@workspace/document-reader"
import { useEffect, useState } from "react"
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
  const [loaded, setLoaded] = useState<{ file: File; reader: Reader } | null>(
    null
  )
  const [state, setState] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoaded(null)
    setState(initial)
    setError("")
    setLoading(false)
    if (!file || !container.current) return
    if (!/\.(docx|docm|dotx|dotm)$/i.test(file.name) || file.size === 0) {
      setError(messages.invalid)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    function report(reason: unknown) {
      if (signal.aborted) return
      setError(
        isDocumentLimitError(reason) ? messages.resourceLimit : messages.invalid
      )
      setLoading(false)
      controller.abort()
      setLoaded(null)
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
        setLoaded({ file, reader: instance })
        setLoading(false)
      })
      .catch(report)
    return () => {
      controller.abort()
    }
  }, [file, container, messages])

  return {
    state,
    loading,
    error,
    reader: loaded?.file === file && !error && !loading ? loaded.reader : null,
  }
}
