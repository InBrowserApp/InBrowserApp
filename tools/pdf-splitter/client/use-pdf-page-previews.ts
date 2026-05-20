import { useEffect, useState } from "react"

import type { PdfPreview } from "./pdf-preview"

type PagePreviewMap = Readonly<Record<number, PdfPreview>>

function usePdfPagePreviews(file: File | null, pageCount: number) {
  const [previews, setPreviews] = useState<PagePreviewMap>({})

  useEffect(() => {
    let cancelled = false
    let loadingTask: { destroy(): Promise<void> } | null = null
    const previewUrls = new Set<string>()

    setPreviews({})

    if (!file || pageCount <= 0) {
      return () => {}
    }

    async function renderPreviews() {
      const { loadPdfPreviewDocument, renderPdfPagePreview } =
        await import("./pdf-preview")
      const bytes = new Uint8Array(await file!.arrayBuffer())

      if (cancelled) {
        return
      }

      const task = loadPdfPreviewDocument(bytes)
      loadingTask = task
      const document = await task.promise
      const totalPages = Math.min(pageCount, document.numPages)

      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        if (cancelled) {
          break
        }

        const preview = await renderPdfPagePreview(document, pageNumber)

        if (cancelled) {
          URL.revokeObjectURL(preview.src)
          break
        }

        previewUrls.add(preview.src)
        setPreviews((current) => ({
          ...current,
          [pageNumber]: preview,
        }))

        await waitForNextFrame()
      }
    }

    void renderPreviews().catch(() => {
      if (!cancelled) {
        setPreviews({})
      }
    })

    return () => {
      cancelled = true

      for (const previewUrl of previewUrls) {
        URL.revokeObjectURL(previewUrl)
      }

      void loadingTask?.destroy()
    }
  }, [file, pageCount])

  return previews
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !window.requestAnimationFrame) {
      globalThis.setTimeout(resolve, 0)
      return
    }

    window.requestAnimationFrame(() => {
      resolve()
    })
  })
}

export { usePdfPagePreviews }
export type { PagePreviewMap }
