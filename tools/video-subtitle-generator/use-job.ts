import { useEffect, useRef, useState } from "react"
import type { Controls } from "./types"

type Status = {
  label: keyof Controls
  progress?: number
  backend?: "webgpu" | "wasm"
}

export function useJob() {
  const active = useRef<AbortController | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [notice, setNotice] = useState<{
    label: keyof Controls
    error: boolean
  } | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setStatus(null)
  }

  async function run(
    initial: Status,
    failure: keyof Controls,
    work: (
      signal: AbortSignal,
      update: (status: Status, failure?: keyof Controls) => void
    ) => Promise<void>
  ) {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    const { signal } = controller
    let error = failure
    setStatus(initial)
    setNotice(null)
    try {
      await work(signal, (next, nextFailure) => {
        if (nextFailure) error = nextFailure
        if (!signal.aborted) setStatus(next)
      })
    } catch {
      if (!signal.aborted) setNotice({ label: error, error: true })
    } finally {
      if (active.current === controller) {
        active.current = null
        setStatus(null)
      }
    }
  }
  return { status, notice, setNotice, run, cancel }
}
