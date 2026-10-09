import { useEffect, useState } from "react"
import type { OFDDocument } from "@ofdjs/viewer"
import type { Messages } from "./types"

export function useDocument(file: File | null, m: Messages) {
  const [state, setState] = useState<{
    file: File
    document?: OFDDocument
    error?: string
  }>()
  useEffect(() => {
    setState(undefined)
    if (!file) return
    const controller = new AbortController()
    let document: OFDDocument | undefined
    void (async () => {
      try {
        const { openDocument } = await import("./open-document")
        controller.signal.throwIfAborted()
        document = await openDocument(file, controller.signal)
        if (controller.signal.aborted) return document.destroy()
        setState({ file, document })
      } catch (error) {
        if (controller.signal.aborted) return
        setState({
          file,
          error:
            error instanceof RangeError
              ? m.resourceLimit
              : error instanceof Error && error.message.includes("no pages")
                ? m.empty
                : m.invalid,
        })
      }
    })()
    return () => {
      controller.abort()
      document?.destroy()
    }
  }, [file, m])
  return state?.file === file ? state : undefined
}
