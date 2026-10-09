import {
  createPptxThumbnailRenderer,
  parsePresentation,
  PptxViewerError,
  setWasmSource,
} from "@extend-ai/react-pptx"
import { maximumPageZoom } from "@workspace/document-reader"
import wasmUrl from "./vendor/parser.wasm?url"
import { preparePresentation } from "./model"
import type { Reader, ReaderState } from "./types"

setWasmSource(wasmUrl)

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
  const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  if (
    ![0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
      (byte, i) => byte === signature[i]
    )
  )
    throw new PptxViewerError(
      "unsupported-format",
      "Unsupported presentation container"
    )
  const presentation = await parsePresentation(file, {
    signal,
    maxInputBytes: Number.MAX_SAFE_INTEGER,
  })
  signal.throwIfAborted()
  if (!presentation.document.slides.length) throw new Error("EMPTY")
  const texts = preparePresentation(presentation.document)
  const width = presentation.document.size.widthEmu / 9525
  const height = presentation.document.size.heightEmu / 9525
  const maxZoom = maximumPageZoom(width, height) * 100
  const renderer = createPptxThumbnailRenderer(presentation, {
    concurrency: 1,
    fonts: {
      loadEmbeddedFonts: false,
      waitForFonts: false,
      reportMissingFonts: false,
    },
  })
  const canvas = document.createElement("canvas")
  canvas.setAttribute("role", "img")
  container.append(canvas)
  let page = 1
  let zoom = 100
  let fit: "page" | "width" | null = "page"
  let disposed = false
  let pending: AbortController | undefined
  let query = ""
  let matches: number[] = []
  let current = -1
  const resize = new ResizeObserver(() => {
    if (fit) run(render())
  })
  function dispose() {
    if (disposed) return
    disposed = true
    signal.removeEventListener("abort", dispose)
    container.removeEventListener("keydown", keydown)
    pending?.abort()
    resize.disconnect()
    renderer.destroy()
    canvas.remove()
    canvas.width = canvas.height = 0
  }
  signal.addEventListener("abort", dispose, { once: true })
  function run(operation: Promise<void>) {
    void operation.catch((error: unknown) => {
      if (!disposed) onError(error)
    })
  }
  async function render() {
    if (disposed) return
    pending?.abort()
    const task = new AbortController()
    pending = task
    const availableWidth = Math.max(1, container.clientWidth - 24)
    const availableHeight = Math.max(1, container.clientHeight - 24)
    if (fit)
      zoom = Math.min(
        maxZoom,
        100 *
          (fit === "page"
            ? Math.min(availableWidth / width, availableHeight / height)
            : availableWidth / width)
      )
    // Drop the previous slide immediately, including its accessible text.
    canvas.width = canvas.height = 0
    canvas.removeAttribute("aria-label")
    onChange({ page, total: texts.length, zoom: Math.round(zoom) })
    try {
      const result = await renderer.renderSlide(page - 1, {
        maxWidth: (width * zoom) / 100,
        output: "canvas",
        signal: task.signal,
      })
      try {
        if (disposed || task.signal.aborted) return
        canvas.width = result.data.width
        canvas.height = result.data.height
        canvas.style.width = `${result.width}px`
        canvas.style.height = `${result.height}px`
        const context = canvas.getContext("2d")
        if (!context) throw new Error("TOO_LARGE")
        context.drawImage(result.data, 0, 0)
        canvas.setAttribute("aria-label", texts[page - 1] || file.name)
      } finally {
        result.data.width = result.data.height = 0
      }
    } catch (error) {
      if (!task.signal.aborted) throw error
    }
  }
  function goTo(value: number) {
    if (
      !Number.isInteger(value) ||
      value < 1 ||
      value > texts.length ||
      disposed
    )
      return
    page = value
    container.scrollTop = container.scrollLeft = 0
    run(render())
  }
  function keydown(event: KeyboardEvent) {
    if (
      event.target !== container ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return
    const next =
      event.key === "PageDown" || event.key === "ArrowRight"
        ? page + 1
        : event.key === "PageUp" || event.key === "ArrowLeft"
          ? page - 1
          : event.key === "Home"
            ? 1
            : event.key === "End"
              ? texts.length
              : null
    if (next !== null) {
      event.preventDefault()
      goTo(next)
    }
  }
  container.addEventListener("keydown", keydown)
  try {
    await render()
    signal.throwIfAborted()
    resize.observe(container)
    return {
      page: goTo,
      zoom: (value) => {
        fit = value === "page-width" ? "width" : null
        if (!fit) zoom = Math.min(maxZoom, Math.max(25, Number(value)))
        run(render())
      },
      fitPage: () => {
        fit = "page"
        run(render())
      },
      find: (value, previous = false) => {
        if (value !== query) {
          query = value
          matches = texts.flatMap((text, index) =>
            value
              ? Array.from(
                  {
                    length:
                      text.toLocaleLowerCase().split(value.toLocaleLowerCase())
                        .length - 1,
                  },
                  () => index + 1
                )
              : []
          )
          current = previous ? 0 : -1
        }
        if (matches.length) {
          current =
            (current + (previous ? -1 : 1) + matches.length) % matches.length
          goTo(matches[current]!)
        }
        onChange({
          query: value,
          matches: matches.length,
          current: matches.length ? current + 1 : 0,
          searching: false,
        })
      },
      thumbnail: async (target, number) => {
        if (disposed) return
        const result = await renderer.renderSlide(number - 1, {
          maxWidth: 144,
          maxHeight: 100,
          output: "canvas",
          signal,
        })
        try {
          if (disposed) return
          target.width = result.width
          target.height = result.height
          target.getContext("2d")?.drawImage(result.data, 0, 0)
        } finally {
          result.data.width = result.data.height = 0
        }
      },
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}
