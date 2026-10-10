import { useEffect, useState } from "react"
import { failure } from "@workspace/pptx-markdown/errors"
import type { Messages } from "./types"

export function useDocument(file: File | null, m: Messages) {
  const [state, setState] = useState<{
    source: File
    text: string
    blob: Blob | null
    error: string
  } | null>(null)
  useEffect(() => {
    setState(null)
    if (!file) return
    const controller = new AbortController()
    const { signal } = controller
    function fail(reason: unknown) {
      if (!signal.aborted)
        setState({
          source: file!,
          text: "",
          blob: null,
          error: m[failure(reason)],
        })
    }
    if (!/\.(pptx|pptm|potx|potm|ppsx|ppsm)$/i.test(file.name) || !file.size) {
      fail(new Error("invalid"))
      return
    }
    void import("@workspace/pptx-markdown")
      .then(async ({ exportDocument }) => {
        signal.throwIfAborted()
        const result = await exportDocument({ file }, m.labels, signal)
        if (signal.aborted) return
        if (result.error) {
          fail(new Error(result.error))
          return
        }
        setState({
          source: file,
          text: result.text,
          blob: new Blob([result.text], {
            type: "text/markdown;charset=utf-8",
          }),
          error: "",
        })
      })
      .catch(fail)
    return () => controller.abort()
  }, [file, m])
  const current = state?.source === file ? state : null
  return {
    output: current?.blob ? current : null,
    error: current?.error ?? "",
    loading: Boolean(file && !current),
  }
}
