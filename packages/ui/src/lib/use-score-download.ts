import { useEffect, useRef, useState } from "react"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

export function useScoreDownload() {
  const [status, setStatus] = useState<"busy" | "error">()
  const revision = useRef(0)
  useEffect(
    () => () => {
      revision.current++
    },
    []
  )

  function reset() {
    revision.current++
    setStatus(undefined)
  }

  async function save(
    makeFile: () => Promise<{ blob: Blob; filename: string }>
  ) {
    if (status === "busy") return
    const expected = ++revision.current
    setStatus("busy")
    try {
      const { blob, filename } = await makeFile()
      if (expected !== revision.current) return
      downloadBlob(blob, filename)
      setStatus(undefined)
    } catch {
      if (expected === revision.current) setStatus("error")
    }
  }

  return { status, reset, save }
}
