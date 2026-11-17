import { useEffect, useState } from "react"
import type { Reply } from "./types"

type CompletedAnalysis = { file: File; reply: Reply }

export function useAnalysis(file: File | null) {
  const [completed, setCompleted] = useState<CompletedAnalysis | null>(null)
  const reply = completed?.file === file ? completed.reply : null
  const busy = file !== null && file.size > 0 && reply === null
  useEffect(() => {
    setCompleted(null)
    if (!file) return
    if (file.size === 0) {
      setCompleted({ file, reply: { error: "parseError" } })
      return
    }
    let active = true
    let worker: Worker | undefined
    const fail = () => {
      if (!active) return
      setCompleted({ file, reply: { error: "loadError" } })
      worker?.terminate()
    }
    try {
      worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
      worker.onmessage = (event: MessageEvent<Reply>) => {
        if (!active) return
        setCompleted({ file, reply: event.data })
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
