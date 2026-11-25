import {
  officeLoadOptions,
  assertOfficeArchive,
  imageResources,
  maximumPageZoom,
} from "@workspace/document-reader"
import { DocxDocument, DocxViewer } from "@silurus/ooxml/docx"
import type { Reader, ReaderState } from "./types"

export async function openReader({
  file,
  container,
  signal,
  onChange,
  onError,
}: {
  file: File
  container: HTMLDivElement
  signal: AbortSignal
  onChange: (state: Partial<ReaderState>) => void
  onError: (error: unknown) => void
}): Promise<Reader> {
  signal.throwIfAborted()
  const data = await file.arrayBuffer()
  assertOfficeArchive(data, "docx")
  signal.throwIfAborted()
  let document: DocxDocument | undefined
  let viewer: ReturnType<typeof DocxViewer.fromDocument> | undefined
  let resize: ResizeObserver | undefined
  const canvas = window.document.createElement("canvas")
  let disposed = false
  let fit = true
  let query = ""
  let searchGeneration = 0
  function dispose() {
    if (disposed) return
    disposed = true
    signal.removeEventListener("abort", dispose)
    resize?.disconnect()
    viewer?.destroy()
    document?.destroy()
    canvas.remove()
    canvas.width = canvas.height = 0
  }
  function run(operation: Promise<unknown>) {
    void operation.catch((error: unknown) => {
      if (!disposed) onError(error)
    })
  }
  try {
    document = await DocxDocument.load(data, officeLoadOptions)
    signal.throwIfAborted()
    if (!document.pageCount) throw new Error("INVALID")
    let zoomMax = 4
    for (let index = 0; index < document.pageCount; index++) {
      const size = document.pageSize(index)
      const width = (size.widthPt * 4) / 3
      const height = (size.heightPt * 4) / 3
      zoomMax = Math.min(zoomMax, maximumPageZoom(width, height))
    }
    container.append(canvas)
    viewer = DocxViewer.fromDocument(canvas, document, {
      container,
      dpr: 1,
      zoomMin: 0.25,
      zoomMax,
      enableTextSelection: true,
      enableHyperlinks: false,
      imageResources,
      onPageChange: (page, total) => {
        if (!disposed) onChange({ page: page + 1, total })
      },
      onScaleChange: (scale) => {
        if (!disposed) onChange({ zoom: Math.round(scale * 100) })
      },
      onError: (error) => {
        if (!disposed) onError(error)
      },
    })
    signal.addEventListener("abort", dispose, { once: true })
    await viewer.fitWidth()
    signal.throwIfAborted()
    onChange({
      total: document.pageCount,
      page: 1,
      zoom: Math.round(viewer.getScale() * 100),
    })
    resize = new ResizeObserver(() => {
      if (fit && !disposed) run(viewer!.fitWidth())
    })
    resize.observe(container)
    async function find(value: string, previous: boolean) {
      const generation = ++searchGeneration
      onChange({ query: value, searching: Boolean(value) })
      if (!value) {
        query = ""
        viewer!.clearFind()
        onChange({ current: 0, matches: 0, searching: false })
        return
      }
      if (value !== query) {
        const matches = await viewer!.findText(value)
        if (disposed || generation !== searchGeneration) return
        query = value
        onChange({ matches: matches.length })
      }
      const match = await (previous ? viewer!.findPrev() : viewer!.findNext())
      if (!disposed && generation === searchGeneration)
        onChange({
          current: match ? match.matchIndex + 1 : 0,
          searching: false,
        })
    }
    return {
      page: (page) => {
        container.scrollTop = 0
        run(viewer!.goToPage(page - 1))
      },
      zoom: (value) => {
        fit = value === "page-width"
        run(fit ? viewer!.fitWidth() : viewer!.setScale(Number(value) / 100))
      },
      find: (value, previous = false) => run(find(value, previous)),
      exportMarkdown: async (labels, exportSignal) => {
        if (disposed) throw new Error("invalid")
        exportSignal.throwIfAborted()
        signal.throwIfAborted()
        const { exportDocument } = await import("@workspace/docx-markdown")
        exportSignal.throwIfAborted()
        signal.throwIfAborted()
        if (disposed) throw new Error("invalid")
        return exportDocument(
          { model: document!.document },
          labels,
          exportSignal
        )
      },
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}
