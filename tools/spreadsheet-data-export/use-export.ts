import { useEffect, useState } from "react"
import { failure } from "@workspace/spreadsheet-export/errors"
import type {
  Session,
  Options,
  Output,
} from "@workspace/spreadsheet-export/types"
import type { Messages } from "./types"

export function useExport(
  session: Session,
  options: Options,
  enabled: boolean,
  m: Messages
) {
  const [state, setState] = useState<{
    options: Options
    output?: Output
    blob?: Blob
    error?: string
  } | null>(null)
  useEffect(() => {
    setState(null)
    if (!enabled) return
    const controller = new AbortController()
    const { signal } = controller
    void session
      .export(options, signal)
      .then((output) => {
        if (!signal.aborted)
          setState({
            options,
            output,
            blob: new Blob([output.text], { type: output.mime }),
          })
      })
      .catch((reason: unknown) => {
        if (!signal.aborted) setState({ options, error: m[failure(reason)] })
      })
    return () => controller.abort()
  }, [session, options, enabled, m])
  const current = enabled && state?.options === options ? state : null
  return { ...current, loading: enabled && !current }
}
