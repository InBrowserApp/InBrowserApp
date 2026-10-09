import { useEffect, useState } from "react"
import type { RtfDocument } from "rtf-viewer"
import { failure } from "./failure"
import type { Messages } from "./types"

export function useDocument(file: File | null, m: Messages) {
  const [state, setState] = useState<{
    file: File
    document?: RtfDocument
    error?: string
  }>()
  useEffect(() => {
    setState(undefined)
    if (!file) return
    const controller = new AbortController()
    let document: RtfDocument | undefined
    void (async () => {
      try {
        const { openDocument } = await import("./open-document")
        controller.signal.throwIfAborted()
        document = await openDocument(file, controller.signal)
        if (controller.signal.aborted) return document.destroy()
        setState({ file, document })
      } catch (error) {
        if (!controller.signal.aborted)
          setState({ file, error: failure(error, m) })
      }
    })()
    return () => {
      controller.abort()
      document?.destroy()
    }
  }, [file, m])
  return state?.file === file ? state : undefined
}
