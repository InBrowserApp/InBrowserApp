import { useCallback, useEffect, useRef, useState } from "react"
import { failure } from "./core/decode"
import type { Failure, Request, Response } from "./types"
export type View = Exclude<Response, { error: Failure }>
type Command = Request extends infer T
  ? T extends Request
    ? Omit<T, "id">
    : never
  : never
export function useReader(file: File | null, encoding: string) {
  const worker = useRef<Worker | null>(null)
  const serial = useRef(0)
  const [view, setView] = useState<View | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [busy, setBusy] = useState(false)
  const request = useCallback((command: Command) => {
    if (!worker.current) return
    setBusy(true)
    try {
      worker.current.postMessage({ ...command, id: ++serial.current })
    } catch (reason) {
      setError(failure(reason))
      setBusy(false)
      worker.current.terminate()
      worker.current = null
    }
  }, [])
  useEffect(() => {
    setView(null)
    setError(null)
    setBusy(false)
    if (!file) return
    if (!/\.(txt|text|log)$/i.test(file.name)) {
      setError("unsupported")
      return
    }
    let owned: Worker
    try {
      owned = new Worker(new URL("./reader.worker.ts", import.meta.url), {
        type: "module",
      })
    } catch (reason) {
      setError(failure(reason))
      return
    }
    worker.current = owned
    const fail = (reason: unknown) => {
      if (worker.current !== owned) return
      setError(failure(reason))
      setBusy(false)
      owned.terminate()
      worker.current = null
    }
    owned.onmessage = (event: MessageEvent<Response>) => {
      const message = event.data
      if (worker.current !== owned || message.id !== serial.current) return
      setBusy(false)
      if ("error" in message) {
        setError(message.error)
        owned.terminate()
        worker.current = null
      } else
        setView((previous) =>
          message.match === null && previous
            ? { ...previous, id: message.id, match: null, target: undefined }
            : message
        )
    }
    owned.onerror = (event) => {
      event.preventDefault()
      fail(new Error(event.message))
    }
    owned.onmessageerror = () => fail(new Error("MESSAGE"))
    request({ kind: "open", file, encoding })
    return () => {
      owned.terminate()
      if (worker.current === owned) worker.current = null
    }
  }, [file, encoding, request])
  return { view, error, busy, request }
}
