import { useEffect, useState } from "react"
import { loadImage } from "./browser"
import type { ImageSource } from "./types"

export function useImage(file: File | null) {
  const [result, setResult] = useState<{
    file: File
    source: ImageSource | null
    error: boolean
  } | null>(null)
  useEffect(() => {
    setResult(null)
    if (!file) return
    let disposed = false
    let loaded: ImageSource | null = null
    void loadImage(file)
      .then((source) => {
        loaded = source
        if (disposed) source.close()
        else setResult({ file, source, error: false })
      })
      .catch(() => {
        if (!disposed) setResult({ file, source: null, error: true })
      })
    return () => {
      disposed = true
      loaded?.close()
    }
  }, [file])
  return result?.file === file ? result : null
}
