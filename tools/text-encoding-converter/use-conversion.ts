import { useEffect, useState } from "react"
import type {
  ConversionRequest,
  ConversionResult,
  WorkerResponse,
} from "./types"

type State = {
  request: ConversionRequest
  result: ConversionResult | null
  failed: boolean
}

export function useConversion(request: ConversionRequest | null) {
  const [state, setState] = useState<State | null>(null)
  useEffect(() => {
    if (!request) return
    let active = true
    let worker: Worker | undefined
    // Debounce typing and terminate obsolete work on every input/settings change.
    const timeout = setTimeout(() => {
      const finish = (response: WorkerResponse) => {
        if (!active) return
        setState({
          request,
          result: "result" in response ? response.result : null,
          failed: "failed" in response,
        })
        worker?.terminate()
      }
      try {
        worker = new Worker(new URL("./worker.ts", import.meta.url), {
          type: "module",
        })
        worker.onmessage = (event: MessageEvent<WorkerResponse>) =>
          finish(event.data)
        worker.onerror = (event) => {
          event.preventDefault()
          finish({ failed: true })
        }
        worker.postMessage(request)
      } catch {
        finish({ failed: true })
      }
    }, 150)
    return () => {
      active = false
      clearTimeout(timeout)
      worker?.terminate()
    }
  }, [request])
  const current = request && state?.request === request ? state : null
  return {
    result: current?.result ?? null,
    failed: current?.failed ?? false,
    loading: Boolean(request && !current),
  }
}
