import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Scan,
} from "@workspace/ui/icons"
import type { Messages, PageResult, Reply, Request } from "./types"

type Fit = "page" | "width" | number
const INSET = 24

export function Reader({
  worker,
  total,
  m,
}: {
  worker: Worker
  total: number
  m: Messages
}) {
  const [page, setPage] = useState(1)
  const [fit, setFit] = useState<Fit>("page")
  const [area, setArea] = useState({ width: 0, height: 0 })
  const [result, setResult] = useState<PageResult>()
  const pending = useRef(false)
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const current = result?.page === page ? result : undefined
  const bitmap = current?.type === "page" ? current : undefined

  useEffect(() => {
    function receive({ data }: MessageEvent<Reply>) {
      if (data.type !== "page" && data.type !== "pageError") return
      pending.current = false
      setResult(data)
    }
    worker.addEventListener("message", receive)
    return () => worker.removeEventListener("message", receive)
  }, [worker])

  useEffect(() => {
    // Keep only one page request in flight so fast paging skips obsolete renders.
    if (pending.current || result?.page === page) return
    pending.current = true
    worker.postMessage({ type: "render", page } satisfies Request)
  }, [worker, page, result])

  useLayoutEffect(() => {
    const element = viewport.current!
    const observer = new ResizeObserver(() => {
      setArea({ width: element.clientWidth, height: element.clientHeight })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!bitmap || !canvas.current) return
    canvas.current
      .getContext("2d")
      ?.putImageData(
        new ImageData(bitmap.pixels, bitmap.width, bitmap.height),
        0,
        0
      )
    viewport.current?.scrollTo(0, 0)
  }, [bitmap])

  const availableWidth = Math.max(1, area.width - INSET)
  const availableHeight = Math.max(1, area.height - INSET)
  let zoom = typeof fit === "number" ? fit : 100
  if (typeof fit !== "number" && bitmap) {
    const widthScale = availableWidth / bitmap.cssWidth
    const cssHeight = (bitmap.cssWidth * bitmap.height) / bitmap.width
    const heightScale = availableHeight / cssHeight
    const scale =
      fit === "width" ? widthScale : Math.min(widthScale, heightScale)
    zoom = Math.max(1, Math.min(400, scale * 100))
  }
  const pagePosition = m.pagePosition
    .replace("{page}", String(page))
    .replace("{total}", String(total))

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-b px-2 py-1">
        <div className="flex items-center gap-1">
          <DocumentIconButton
            label={m.previous}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m.page}
            dir="ltr"
            className="w-16 tabular-nums"
            min={1}
            max={total}
            value={page}
            onCommit={setPage}
          />
          <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
            {m.pageCount.replace("{total}", String(total))}
          </span>
          <DocumentIconButton
            label={m.next}
            disabled={page === total}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
        </div>
        <div className="flex items-center gap-1">
          <DocumentIconButton
            label={m.zoomOut}
            disabled={zoom <= 1}
            onClick={() => setFit(Math.max(1, Math.floor(zoom / 1.25)))}
          >
            <Minus aria-hidden="true" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m.zoom}
            dir="ltr"
            className="w-16 tabular-nums"
            min={1}
            max={400}
            value={Math.round(zoom)}
            onCommit={setFit}
          />
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            %
          </span>
          <DocumentIconButton
            label={m.zoomIn}
            disabled={zoom >= 400}
            onClick={() => setFit(Math.min(400, Math.ceil(zoom * 1.25)))}
          >
            <Plus aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.fitPage}
            aria-pressed={fit === "page"}
            className="aria-pressed:bg-muted"
            onClick={() => setFit("page")}
          >
            <Scan aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.fitWidth}
            aria-pressed={fit === "width"}
            className="aria-pressed:bg-muted"
            onClick={() => setFit("width")}
          >
            <ArrowLeftRight aria-hidden="true" />
          </DocumentIconButton>
        </div>
      </div>
      <div
        ref={viewport}
        role="region"
        dir="ltr"
        aria-label={m.reader}
        aria-busy={!current}
        // The scrollable reading area needs focus for its keyboard shortcuts.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="min-h-0 flex-1 overflow-auto bg-muted/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
            return
          const shortcuts: Record<string, number | undefined> = {
            PageUp: Math.max(1, page - 1),
            PageDown: Math.min(total, page + 1),
            Home: 1,
            End: total,
          }
          const target = shortcuts[event.key]
          if (target === undefined) return
          event.preventDefault()
          setPage(target)
        }}
      >
        {bitmap ? (
          <div className="flex min-h-full w-max min-w-full flex-col items-center p-3">
            <canvas
              ref={canvas}
              width={bitmap.width}
              height={bitmap.height}
              role="img"
              aria-label={pagePosition}
              className="my-auto block h-auto max-w-none bg-white shadow-sm"
              style={{ width: (bitmap.cssWidth * zoom) / 100 }}
            />
          </div>
        ) : (
          <div
            role={current ? "alert" : "status"}
            dir="auto"
            className="flex min-h-full items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground"
          >
            {!current ? <Spinner aria-hidden="true" /> : null}
            {current ? m.pageError : m.loadingPage}
          </div>
        )}
      </div>
    </>
  )
}
