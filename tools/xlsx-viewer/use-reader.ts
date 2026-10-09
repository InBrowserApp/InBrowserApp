import { extensions, extension } from "./formats"
import type { ImportOptions } from "./formats"
import { isDocumentLimitError } from "@workspace/document-reader"
import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import type { Messages, Reader, ReaderState } from "./types"

const initial: ReaderState = {
  notices: [],
  sheet: 0,
  sheets: [],
  zoom: 100,
  selection: null,
  empty: false,
  switching: false,
  copyStatus: "",
}

export function useReader(
  file: File | null,
  container: RefObject<HTMLDivElement | null>,
  messages: Messages,
  importOptions: ImportOptions
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
    if (!extensions.includes(extension(file.name)) || file.size === 0) {
      setError(messages.invalid)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const element = container.current
    function report(reason: unknown) {
      if (signal.aborted) return
      setError(
        isDocumentLimitError(reason) || reason instanceof RangeError
          ? messages.resourceLimit
          : reason instanceof Error && reason.message === "DELIMITED_INVALID"
            ? messages.delimitedInvalid
            : reason instanceof Error &&
                /password|encrypt/i.test(reason.message)
              ? messages.protected
              : messages.invalid
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
          importOptions,
          label: messages.reader,
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
  }, [file, container, messages, importOptions])

  return {
    state,
    loading,
    error,
    reader,
  }
}
