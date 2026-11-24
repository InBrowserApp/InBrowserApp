import { useEffect, useState } from "react"

import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist"

type State =
  | { file: File; document: PDFDocumentProxy }
  | { file: File; error: true }

export function usePdf(file: File | null) {
  const [state, setState] = useState<State>()
  useEffect(() => {
    if (!file) return
    let active = true
    let task: PDFDocumentLoadingTask | undefined

    async function load(source: File) {
      try {
        const [{ openPdf }, buffer] = await Promise.all([
          import("./pdfjs"),
          source.arrayBuffer(),
        ])
        if (!active) return
        task = openPdf(new Uint8Array(buffer))
        const document = await task.promise
        if (active) setState({ file: source, document })
      } catch {
        if (active) setState({ file: source, error: true })
      }
    }

    void load(file)
    return () => {
      active = false
      void task?.destroy().catch(() => {})
    }
  }, [file])

  return state?.file === file ? state : undefined
}
