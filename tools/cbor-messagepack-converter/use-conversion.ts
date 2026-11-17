import { useEffect, useRef, useState } from "react"
import type { Request, Result } from "./core/convert"
import type { Messages } from "./types"

export function useConversion(messages: Messages) {
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const active = useRef<{
    worker: Worker
    timer: ReturnType<typeof setTimeout>
  } | null>(null)
  function stop() {
    if (active.current) {
      active.current.worker.terminate()
      clearTimeout(active.current.timer)
      active.current = null
    }
  }
  useEffect(() => stop, [])
  function reset() {
    stop()
    setBusy(false)
    setResult(null)
    setError("")
  }
  function fail(message: string) {
    reset()
    setError(message)
  }
  function run(request: Request) {
    reset()
    setBusy(true)
    try {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
      const timer = setTimeout(() => fail(messages.timeoutError), 10000)
      active.current = { worker, timer }
      worker.onmessage = (
        event: MessageEvent<{ result?: Result; error?: string }>
      ) => {
        if (active.current?.worker !== worker) return
        stop()
        setBusy(false)
        if (event.data.result) setResult(event.data.result)
        else setError(event.data.error || messages.workerError)
      }
      worker.onerror = () => {
        if (active.current?.worker === worker) fail(messages.workerError)
      }
      worker.postMessage(request)
    } catch {
      fail(messages.workerError)
    }
  }
  return { result, error, busy, reset, fail, run }
}
