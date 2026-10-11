import { useEffect, useState } from "react"
import type { convert } from "./core/convert"
import { failure } from "./core/failure"
import type { Messages } from "./types"

type Output = Awaited<ReturnType<typeof convert>>

export function useDocument(file: File | null, m: Messages) {
  const [output, setOutput] = useState<(Output & { source: File }) | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setOutput(null)
    setError("")
    setLoading(false)
    if (!file) return
    if (!/\.(fb2|fbz|fb2\.zip)$/i.test(file.name) || !file.size) {
      setError(!file.size ? m.emptyFile : m.unsupported)
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    setLoading(true)
    let started = false
    void import("./core/convert")
      .then(async ({ convert }) => {
        signal.throwIfAborted()
        started = true
        const result = await convert(file, signal, m)
        signal.throwIfAborted()
        setOutput({ ...result, source: file })
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (signal.aborted) return
        setError(m[started ? failure(reason) : "engineUnavailable"])
        setLoading(false)
      })
    return () => controller.abort()
  }, [file, m])
  return {
    output: output?.source === file && !error && !loading ? output : null,
    error,
    loading,
  }
}
