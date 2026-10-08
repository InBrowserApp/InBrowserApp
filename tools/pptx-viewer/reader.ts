import {
  officeLoadOptions,
  assertOfficeArchive,
  imageResources,
  maximumPageZoom,
} from "@workspace/document-reader"
import { PptxPresentation, PptxViewer } from "@silurus/ooxml/pptx"
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
  assertOfficeArchive(data, "pptx")
  signal.throwIfAborted()
  let document: PptxPresentation | undefined
  let viewer: ReturnType<typeof PptxViewer.fromPresentation> | undefined
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
    document = await PptxPresentation.load(data, officeLoadOptions)
    signal.throwIfAborted()
    if (!document.slideCount) throw new Error("EMPTY")
    if (document.slideCount > 1000) throw new Error("TOO_LARGE")
    // Presentation dimensions are EMUs (9,525 EMUs per CSS pixel).
    const zoomMax = maximumPageZoom(
      document.slideWidth / 9525,
      document.slideHeight / 9525
    )
    container.append(canvas)
    viewer = PptxViewer.fromPresentation(canvas, document, {
      dpr: 1,
      zoomMin: 0.25,
      zoomMax,
      enableTextSelection: true,
      enableMediaPlayback: false,
      enableHyperlinks: false,
      imageResources,
      onSlideChange: (page, total) => {
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
      total: document.slideCount,
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
        run(viewer!.goToSlide(page - 1))
      },
      zoom: (value) => {
        fit = value === "page-width"
        run(fit ? viewer!.fitWidth() : viewer!.setScale(Number(value) / 100))
      },
      find: (value, previous = false) => run(find(value, previous)),
      thumbnail: (target, page) => {
        if (disposed) return Promise.resolve()
        return document!.renderSlide(target, page - 1, {
          width: Math.min(
            144,
            (100 * document!.slideWidth) / document!.slideHeight
          ),
          dpr: 1,
          imageResources,
        })
      },
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}
