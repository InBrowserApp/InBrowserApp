import { useEffect, useState } from "react"
import type { Reply } from "./types"

export function useAnalysis(file: File | null) {
  const [reply, setReply] = useState<Reply | null>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setReply(null)
    setBusy(false)
    if (!file) return
    if (file.size === 0) {
      setReply({ error: "parseError" })
      return
    }
    let active = true
    let worker: Worker | undefined
    const fail = () => {
      if (!active) return
      setReply({ error: "loadError" })
      setBusy(false)
      worker?.terminate()
    }
    setBusy(true)
    try {
      worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
      worker.onmessage = (event: MessageEvent<Reply>) => {
        if (!active) return
        setReply(event.data)
        setBusy(false)
        worker?.terminate()
      }
      worker.onerror = fail
      worker.onmessageerror = fail
      worker.postMessage(file)
    } catch {
      fail()
    }
    return () => {
      active = false
      worker?.terminate()
    }
  }, [file])
  return { reply, busy }
}
