import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { RtfDocument } from "rtf-viewer"
import { DocumentToolbar } from "@workspace/ui/components/tool/document-toolbar"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Maximize2, TriangleAlert } from "@workspace/ui/icons"
import { PageView } from "./page-view"
import { diagnosticMessages } from "./diagnostics"
import { useSearch } from "./use-search"
import type { Messages } from "./types"

export function Reader({
  document: rtf,
  messages: m,
}: {
  document: RtfDocument
  messages: Messages
}) {
  const [page, setPage] = useState(1)
  const [fit, setFit] = useState<"width" | "page" | null>("width")
  const [manualZoom, setZoom] = useState(100)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const root = useRef<HTMLDivElement>(null)
  const anchor = useRef<{ x: number; y: number } | null>(null)
  const onPage = useCallback(
    (next: number) => {
      anchor.current = null
      setPage(Math.max(1, Math.min(rtf.pageCount, next)))
      root.current?.scrollTo(0, 0)
    },
    [rtf]
  )
  const search = useSearch(rtf, onPage, m)
  useEffect(() => {
    const element = root.current!
    const resize = () => {
      if (element.clientWidth && element.clientHeight)
        setSize({ width: element.clientWidth, height: element.clientHeight })
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const layout = rtf.getPageSize(page - 1)
  const zoom =
    fit && size.width && size.height
      ? Math.max(
          1,
          Math.floor(
            75 *
              Math.min(
                (size.width - 32) / layout.width,
                fit === "page" ? (size.height - 32) / layout.height : Infinity
              )
          )
        )
      : manualZoom
  function rememberPosition() {
    const region = root.current!
    anchor.current = {
      x: (region.scrollLeft + region.clientWidth / 2) / zoom,
      y: (region.scrollTop + region.clientHeight / 2) / zoom,
    }
  }
  useLayoutEffect(() => {
    const region = root.current!
    if (anchor.current) {
      region.scrollLeft = anchor.current.x * zoom - region.clientWidth / 2
      region.scrollTop = anchor.current.y * zoom - region.clientHeight / 2
      anchor.current = null
    }
  }, [zoom])
  const notes = diagnosticMessages(rtf.diagnostics, m)
  return (
    <>
      <DocumentToolbar
        messages={m}
        state={{
          page,
          total: rtf.pageCount,
          zoom,
          query: search.query,
          current: search.matches.length ? search.current + 1 : 0,
          matches: search.matches.length,
          searching: search.searching,
        }}
        reader={{
          page: onPage,
          zoom: (value) => {
            rememberPosition()
            if (value === "page-width") setFit("width")
            else {
              setFit(null)
              setZoom(value)
            }
          },
          find: search.find,
        }}
        actions={
          <DocumentIconButton
            label={m.fitPage}
            onClick={() => {
              rememberPosition()
              setFit("page")
            }}
          >
            <Maximize2 aria-hidden="true" />
          </DocumentIconButton>
        }
      />
      {search.error ? (
        <p role="alert" className="shrink-0 border-b px-3 py-2 text-sm">
          {search.error}
        </p>
      ) : null}
      <div
        ref={root}
        className="min-h-0 min-w-0 flex-1 overflow-auto bg-muted p-4"
        role="region"
        aria-label={m.reader}
        // A scrollable reading region needs keyboard focus for arrow keys.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        dir="ltr"
        onKeyDown={(event) => {
          const next =
            event.key === "PageDown"
              ? page + 1
              : event.key === "PageUp"
                ? page - 1
                : event.key === "Home" && event.ctrlKey
                  ? 1
                  : event.key === "End" && event.ctrlKey
                    ? rtf.pageCount
                    : null
          if (next !== null) {
            event.preventDefault()
            onPage(next)
          }
        }}
      >
        <div className="flex min-h-full w-max min-w-full items-start justify-center">
          <PageView
            document={rtf}
            page={page}
            zoom={zoom}
            match={search.match}
            messages={m}
          />
        </div>
      </div>
      <details className="max-h-36 shrink-0 overflow-auto border-t px-3 py-1">
        <summary className="cursor-pointer rounded-sm py-1 text-sm focus-visible:outline-2 focus-visible:outline-ring">
          {notes.length ? (
            <TriangleAlert aria-hidden="true" className="me-1 inline size-4" />
          ) : null}
          {notes.length ? m.limited : m.compatibility}
        </summary>
        <div className="flex flex-col gap-1 pb-2 text-xs text-muted-foreground">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
          <p>{m.layoutNote}</p>
        </div>
      </details>
    </>
  )
}
