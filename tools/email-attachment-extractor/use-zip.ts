import { useEffect, useRef, useState } from "react"
import type { convert } from "./core/convert"

type Attachment = Awaited<ReturnType<typeof convert>>["attachments"][number]

export function useZip(attachments: Attachment[], selected: Set<number>) {
  const controller = useRef<AbortController | null>(null)
  const [state, setState] = useState<{
    selected: Set<number>
    loading?: boolean
    file?: Blob
    error?: boolean
  } | null>(null)
  useEffect(() => () => controller.current?.abort(), [attachments, selected])

  function cancel() {
    controller.current?.abort()
    setState(null)
  }
  async function prepare() {
    cancel()
    const run = new AbortController()
    controller.current = run
    setState({ selected, loading: true })
    try {
      const { createZip } = await import("./core/zip")
      run.signal.throwIfAborted()
      const file = await createZip(
        attachments.filter((_item, index) => selected.has(index)),
        run.signal
      )
      run.signal.throwIfAborted()
      setState({ selected, file })
    } catch {
      if (!run.signal.aborted) setState({ selected, error: true })
    }
  }
  return { state: state?.selected === selected ? state : null, prepare, cancel }
}
