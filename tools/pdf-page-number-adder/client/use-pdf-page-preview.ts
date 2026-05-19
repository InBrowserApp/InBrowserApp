import { useEffect, useState } from "react"

type PdfPagePreview = Readonly<{
  height: number
  imageUrl: string
  pageHeight: number
  pageWidth: number
  width: number
}>

const PREVIEW_TARGET_WIDTH = 480
const MAX_PREVIEW_SCALE = 1.5
const pdfWorkerUrl = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString()

function usePdfPagePreview(file: File | null) {
  const [preview, setPreview] = useState<PdfPagePreview | null>(null)
  const [isRenderingPreview, setIsRenderingPreview] = useState(false)

  useEffect(() => {
    let canceled = false

    if (!file) {
      setPreview(null)
      setIsRenderingPreview(false)
      return
    }

    setIsRenderingPreview(true)

    renderFirstPagePreview(file)
      .then((nextPreview) => {
        if (!canceled) {
          setPreview(nextPreview)
        }
      })
      .catch(() => {
        if (!canceled) {
          setPreview(null)
        }
      })
      .finally(() => {
        if (!canceled) {
          setIsRenderingPreview(false)
        }
      })

    return () => {
      canceled = true
    }
  }, [file])

  return { isRenderingPreview, preview }
}

async function renderFirstPagePreview(file: File): Promise<PdfPagePreview> {
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  })
  const pdfDocument = await loadingTask.promise

  try {
    const page = await pdfDocument.getPage(1)
    const baseViewport = page.getViewport({ scale: 1 })
    const scale = Math.min(
      MAX_PREVIEW_SCALE,
      PREVIEW_TARGET_WIDTH / baseViewport.width
    )
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("Canvas context unavailable")
    }

    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)

    await page.render({ canvas, canvasContext: context, viewport }).promise

    return {
      height: canvas.height,
      imageUrl: canvas.toDataURL("image/png"),
      pageHeight: baseViewport.height,
      pageWidth: baseViewport.width,
      width: canvas.width,
    }
  } finally {
    await pdfDocument.destroy()
  }
}

export { usePdfPagePreview }
export type { PdfPagePreview }
