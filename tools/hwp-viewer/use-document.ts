import { useEffect, useState } from "react"
import type { Document, Messages } from "./types"
import { failure } from "./failure"

export function useDocument(file: File | null, messages: Messages) {
  const [state, setState] = useState<{
    file: File
    document?: Document
    error?: string
  } | null>(null)
  useEffect(() => {
    if (!file) {
      setState(null)
      return
    }
    if (!/\.(hwp|hwpx)$/i.test(file.name) || !file.size) {
      setState({ file, error: messages.invalid })
      return
    }
    const controller = new AbortController()
    setState({ file })
    void import("./open")
      .then(({ openDocument }) => openDocument(file, controller.signal))
      .then((document) => {
        if (controller.signal.aborted) document.dispose()
        else setState({ file, document })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setState({ file, error: messages[failure(error)] })
      })
    return () => controller.abort()
  }, [file, messages])
  return state?.file === file ? state : null
}
