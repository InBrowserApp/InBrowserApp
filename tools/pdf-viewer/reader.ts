import {
  AnnotationMode,
  getDocument,
  GlobalWorkerOptions,
  PasswordResponses,
} from "pdfjs-dist"
import * as workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { PdfAssets } from "./pdf-assets"
import type { Reader, ReaderState } from "./types"

GlobalWorkerOptions.workerSrc = workerUrl.default

type Options = {
  file: File
  container: HTMLDivElement
  signal: AbortSignal
  onChange: (state: Partial<ReaderState>) => void
  onPassword: (submit: (password: string) => void, incorrect: boolean) => void
  onError: () => void
}

export async function openReader({
  file,
  container,
  signal: callerSignal,
  onChange,
  onPassword,
  onError,
}: Options): Promise<Reader> {
  const lifetime = new AbortController()
  const signal = AbortSignal.any([callerSignal, lifetime.signal])
  // pdf_viewer reads pdfjsLib from the core module's initialized global.
  const { EventBus, PDFSinglePageViewer, PDFLinkService, PDFFindController } =
    await import("pdfjs-dist/web/pdf_viewer.mjs")
  signal.throwIfAborted()
  const data = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const bus = new EventBus()
  const links = new PDFLinkService({
    eventBus: bus,
    externalLinkTarget: 2,
    externalLinkRel: "noopener noreferrer",
  })
  const find = new PDFFindController({ eventBus: bus, linkService: links })
  const options = {
    container,
    eventBus: bus,
    linkService: links,
    findController: find,
    annotationMode: AnnotationMode.ENABLE,
    maxCanvasPixels: 16_000_000,
    maxCanvasDim: 8192,
    enableAutoLinking: false,
    abortSignal: signal,
  }
  const viewer = new PDFSinglePageViewer(options)
  const resize = new ResizeObserver(() => {
    if (viewer.pdfDocument && viewer.currentScaleValue === "page-width") {
      viewer.currentScaleValue = "page-width"
    }
  })
  resize.observe(container)
  links.setViewer(viewer)
  const task = getDocument({
    data,
    BinaryDataFactory: PdfAssets,
    useWorkerFetch: false,
    useSystemFonts: true,
    enableXfa: false,
    verbosity: 0,
  })
  let disposed = false
  const dispose = () => {
    if (disposed) return
    disposed = true
    // PDF.js supports null for unloading, though its declaration omits it.
    viewer.setDocument(null!)
    links.setDocument(null)
    resize.disconnect()
    lifetime.abort()
    void viewer.l10n.destroy().catch(() => {})
    void task.destroy().catch(() => {})
  }
  signal.addEventListener("abort", dispose, { once: true })
  bus.on("pagesinit", () => {
    viewer.currentScaleValue = "page-width"
  })
  bus.on("pagechanging", ({ pageNumber }: { pageNumber: number }) =>
    onChange({ page: pageNumber })
  )
  bus.on("scalechanging", ({ scale }: { scale: number }) =>
    onChange({ zoom: Math.round(scale * 100) })
  )
  const matches = ({
    matchesCount,
  }: {
    matchesCount: { current: number; total: number }
  }) => {
    onChange({ current: matchesCount.current, matches: matchesCount.total })
  }
  bus.on("updatefindmatchescount", matches)
  bus.on(
    "updatefindcontrolstate",
    (event: {
      state: number
      matchesCount: { current: number; total: number }
    }) => {
      matches(event)
      onChange({ searching: event.state === 3 })
    }
  )
  bus.on("pagerendered", ({ error }: { error?: unknown }) => {
    if (error && !signal.aborted) onError()
  })
  task.onPassword = (submit: (password: string) => void, reason: number) =>
    onPassword(submit, reason === PasswordResponses.INCORRECT_PASSWORD)
  try {
    const document = await task.promise
    signal.throwIfAborted()
    if (document.numPages > 1000) throw new Error("TOO_LARGE")
    links.setDocument(document)
    viewer.setDocument(document)
    await viewer.firstPagePromise
    signal.throwIfAborted()
    onChange({ total: document.numPages, page: 1 })
  } catch (error) {
    dispose()
    throw error
  }
  let query = ""
  return {
    page: (page) => {
      viewer.currentPageNumber = page
    },
    zoom: (scale) => {
      if (scale === "page-width") viewer.currentScaleValue = scale
      else viewer.currentScale = scale / 100
    },
    find: (nextQuery, previous = false) => {
      onChange({
        query: nextQuery,
        searching: Boolean(nextQuery),
        current: 0,
        matches: 0,
      })
      bus.dispatch("find", {
        source: viewer,
        type: query === nextQuery ? "again" : "",
        query: nextQuery,
        caseSensitive: false,
        entireWord: false,
        highlightAll: true,
        findPrevious: previous,
        matchDiacritics: false,
      })
      query = nextQuery
    },
    dispose,
  }
}
