import { useCallback, useEffect, useRef, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { navigationPage } from "../core/pages"
import { usePageImage } from "../use-page-image"
import { Toolbar } from "./toolbar"
import { Thumbnails } from "./thumbnails"
import type { OpenedComic } from "../use-comic"
import type { Fit, Messages, PageStatus } from "../types"

export function Reader({ comic, initial, m }: OpenedComic & { m: Messages }) {
  const [page, setPage] = useState(initial.index)
  const [rtl, setRtl] = useState(false)
  const [fit, setFit] = useState<Fit>("page")
  const [thumbnails, setThumbnails] = useState(false)
  const [statuses, setStatuses] = useState(() =>
    comic.pages.map((entry) => entry.status)
  )
  const [size, setSize] = useState({ width: 800, height: 500 })
  const viewport = useRef<HTMLDivElement>(null)
  const report = useCallback(
    (index: number, status: PageStatus) => {
      comic.pages[index]!.status = status
      setStatuses((current) =>
        current.map((value, i) => (i === index ? status : value))
      )
    },
    [comic]
  )
  const image = usePageImage(comic, page, initial, report)
  const entry = comic.pages[page]!
  const status = statuses[page]!
  const problem = status !== "ready" && status !== "unchecked" ? status : null
  const issues = statuses.filter(
    (value) => value !== "ready" && value !== "unchecked"
  ).length
  const scale =
    typeof fit === "number"
      ? fit / 100
      : image
        ? fit === "width"
          ? size.width / image.width
          : Math.min(size.width / image.width, size.height / image.height)
        : 1
  useEffect(() => {
    const element = viewport.current!
    const observer = new ResizeObserver(() =>
      setSize({
        width: Math.max(1, element.clientWidth - 24),
        height: Math.max(1, element.clientHeight - 24),
      })
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    viewport.current!.scrollTo(0, 0)
  }, [page])
  const position = m.pagePosition
    .replace("{page}", String(page + 1))
    .replace("{total}", String(comic.pages.length))
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <Toolbar
        m={m}
        page={page}
        total={comic.pages.length}
        rtl={rtl}
        setRtl={setRtl}
        fit={fit}
        setFit={setFit}
        zoom={Math.max(1, Math.round(scale * 100))}
        go={setPage}
        thumbnails={thumbnails}
        setThumbnails={setThumbnails}
      />
      {issues ? (
        <p
          role="status"
          className="shrink-0 px-3 py-1 text-xs text-muted-foreground"
        >
          {m.partial.replace("{count}", String(issues))}
        </p>
      ) : null}
      <div
        ref={viewport}
        role="region"
        aria-label={m.reader}
        aria-busy={!image && !problem}
        // The scrollable page canvas supports keyboard reading and navigation.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="min-h-24 flex-1 overflow-auto bg-muted p-3 outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ring"
        dir="ltr"
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
          )
            return
          const next = navigationPage(event.key, page, comic.pages.length, rtl)
          if (next !== null) {
            event.preventDefault()
            setPage(next)
          }
        }}
      >
        {problem ? (
          <Alert className="mx-auto max-w-lg">
            <AlertTitle>
              {m.unreadable} · {position}
            </AlertTitle>
            <AlertDescription>
              <p>{m[problem]}</p>
              {issues === comic.pages.length ? <p>{m.noReadable}</p> : null}
            </AlertDescription>
          </Alert>
        ) : image ? (
          <img
            src={image.url}
            alt={`${position}: ${entry.name}`}
            draggable={false}
            style={{ width: image.width * scale, height: image.height * scale }}
            className="mx-auto block max-w-none bg-background shadow-sm"
          />
        ) : (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-6"
          >
            <Spinner />
            {m.loadingPage}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t px-3 py-2 text-xs text-muted-foreground">
        <span role="status" className="shrink-0 tabular-nums">
          {position}
        </span>
        <span className="min-w-0 truncate" dir="auto" title={entry.name}>
          {entry.name}
        </span>
      </div>
      {thumbnails ? (
        <Thumbnails
          comic={comic}
          initial={initial}
          m={m}
          page={page}
          go={setPage}
          report={report}
        />
      ) : null}
    </div>
  )
}
