import { useEffect, useState } from "react"
import { createReader } from "./reader"
import type { Info, Row } from "./types"

export function useReader(file: File, start: number, size: number) {
  const [reader, setReader] = useState<ReturnType<typeof createReader> | null>(
    null
  )
  const [info, setInfo] = useState<Info | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<"error" | "pageError" | null>(null)
  useEffect(() => {
    let active = true
    const current = createReader()
    current
      .request<Info>({ type: "open", file })
      .then((result) => {
        if (!active) return
        setInfo(result)
        setReader(current)
      })
      .catch(() => {
        if (active) {
          setError("error")
          setLoading(false)
        }
      })
    return () => {
      active = false
      current.dispose()
    }
  }, [file])
  useEffect(() => {
    if (!reader || !info) return
    let active = true
    setLoading(true)
    setError(null)
    reader
      .request<Row[]>({
        type: "page",
        start,
        end: Math.min(start + size, info.rows),
      })
      .then((result) => {
        if (active) setRows(result)
      })
      .catch(() => {
        if (active) setError("pageError")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reader, info, start, size])
  return { info, rows, loading, error }
}
