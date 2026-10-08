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
    document = await DocxDocument.load(data, {
      useGoogleFonts: false,
      mode: "main",
      workerTimeoutMs: 30_000,
      resourceLimits: {
        maxArchiveEntryBytes: 32 * 1024 * 1024,
        maxTotalInflatedBytes: 128 * 1024 * 1024,
        maxArchiveEntries: 10_000,
      },
    })
    signal.throwIfAborted()
    if (!document.pageCount || document.pageCount > 1000)
      throw new Error("TOO_LARGE")
    let zoomMax = 4
    for (let index = 0; index < document.pageCount; index++) {
      const size = document.pageSize(index)
      const width = (size.widthPt * 4) / 3
      const height = (size.heightPt * 4) / 3
      if (!Number.isFinite(width * height) || width <= 0 || height <= 0)
        throw new Error("TOO_LARGE")
      zoomMax = Math.min(
        zoomMax,
        8192 / width,
        8192 / height,
        Math.sqrt(16_000_000 / width / height)
      )
    }
    if (zoomMax < 0.25) throw new Error("TOO_LARGE")
    container.append(canvas)
    viewer = DocxViewer.fromDocument(canvas, document, {
      container,
      dpr: 1,
      zoomMin: 0.25,
      zoomMax,
      enableTextSelection: true,
      enableHyperlinks: false,
      imageResources: {
        decodedByteBudget: 64 * 1024 * 1024,
        strategy: "strict",
      },
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
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}
