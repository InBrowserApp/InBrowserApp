import { useEffect, useState } from "react"
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist"

function usePreview(file: File | null, page: number) {
  const [state, setState] = useState<{
    file: File | null
    page: number
    url: string
    error: boolean
  }>({ file: null, page: 0, url: "", error: false })
  useEffect(() => {
    if (!file) return
    let canceled = false
    let loading: PDFDocumentLoadingTask | undefined
    let rendering: RenderTask | undefined
    async function render() {
      try {
        const [{ loadPdf }, bytes] = await Promise.all([
          import("./pdfjs"),
          file!.arrayBuffer(),
        ])
        if (canceled) return
        loading = loadPdf(new Uint8Array(bytes))
        const doc = await loading.promise
        const pdfPage = await doc.getPage(page)
        const base = pdfPage.getViewport({ scale: 1 })
        const viewport = pdfPage.getViewport({
          scale: Math.min(2, 1000 / Math.max(base.width, base.height)),
        })
        const canvas = document.createElement("canvas")
        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)
        const context = canvas.getContext("2d")
        if (!context) throw new Error("previewError")
        rendering = pdfPage.render({ canvas, canvasContext: context, viewport })
        await rendering.promise
        if (!canceled)
          setState({
            file,
            page,
            url: canvas.toDataURL("image/png"),
            error: false,
          })
      } catch {
        if (!canceled) setState({ file, page, url: "", error: true })
      } finally {
        await loading?.destroy()
      }
    }
    void render()
    return () => {
      canceled = true
      rendering?.cancel()
      void loading?.destroy()
    }
  }, [file, page])
  return file && (state.file !== file || state.page !== page)
    ? { url: "", error: false, loading: true }
    : {
        url: file ? state.url : "",
        error: file ? state.error : false,
        loading: false,
      }
}

export { usePreview }
