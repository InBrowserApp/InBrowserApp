import { useEffect, useState } from "react"
import { failure } from "@workspace/spreadsheet-export/errors"
import type { Session } from "@workspace/spreadsheet-export/types"
import type { Messages } from "./types"

export function useWorkbook(file: File | null, m: Messages) {
  const [state, setState] = useState<{
    file: File
    session?: Session
    error?: string
  } | null>(null)
  useEffect(() => {
    setState(null)
    if (!file) return
    const controller = new AbortController()
    const { signal } = controller
    const fail = (reason: unknown) => {
      if (!signal.aborted) setState({ file, error: m[failure(reason)] })
    }
    if (!/\.(xlsx|xlsm|xltx|xltm)$/i.test(file.name) || !file.size) {
      fail(new Error("invalid"))
      return
    }
    void import("@workspace/spreadsheet-export")
      .then(async ({ openWorkbook }) => {
        signal.throwIfAborted()
        const session = await openWorkbook({ file }, signal)
        if (!signal.aborted) setState({ file, session })
      })
      .catch(fail)
    return () => controller.abort()
  }, [file, m])
  const current = state?.file === file ? state : null
  return {
    session: current?.session,
    error: current?.error,
    loading: Boolean(file && !current),
  }
}
