import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Toolbar } from "./toolbar"
import { failure } from "./failure"
import type { Document, Messages, Page } from "./types"

export function Reader({
  document,
  messages: m,
}: {
  document: Document
  messages: Messages
}) {
  const [number, setNumber] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [fit, setFit] = useState<"width" | "page" | null>("width")
  const [manualZoom, setZoom] = useState(100)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [result, setResult] = useState<{
    number: number
    page?: Page
    url?: string
    error?: string
  } | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const anchor = useRef<{ x: number; y: number } | null>(null)
  useEffect(() => {
    let stale = false
    let url: string | undefined
    setResult(null)
    void document
      .page(number - 1)
      .then((page) => {
        if (stale) return
        url = URL.createObjectURL(
          new Blob([page.svg], { type: "image/svg+xml" })
        )
        setResult({ number, page, url })
      })
      .catch((error: unknown) => {
        if (!stale)
          setResult({
            number,
            error:
              failure(error) === "resourceLimit"
                ? m.resourceLimit
                : m.pageError,
          })
      })
    return () => {
      stale = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [document, number, m])
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
  const current = result?.number === number ? result : null
  const page = current?.page
  const horizontal = rotation % 180 !== 0
  const width = page ? (horizontal ? page.height : page.width) : 1
  const height = page ? (horizontal ? page.width : page.height) : 1
  const zoom =
    fit && page && size.width && size.height
      ? Math.max(
          1,
          Math.floor(
            100 *
              Math.min(
                (size.width - 32) / width,
                fit === "page" ? (size.height - 32) / height : Infinity
              )
          )
        )
      : manualZoom
  function rememberPosition() {
    anchor.current = null
    const region = root.current!
    const bounds = paper.current?.getBoundingClientRect()
    if (!bounds?.width || !bounds.height) return
    const viewport = region.getBoundingClientRect()
    anchor.current = {
      x: (viewport.left + region.clientWidth / 2 - bounds.left) / bounds.width,
      y: (viewport.top + region.clientHeight / 2 - bounds.top) / bounds.height,
    }
  }
  useLayoutEffect(() => {
    const position = anchor.current
    const bounds = paper.current?.getBoundingClientRect()
    anchor.current = null
    if (!position || !bounds) return
    const region = root.current!
    const viewport = region.getBoundingClientRect()
    region.scrollBy(
      bounds.left +
        position.x * bounds.width -
        viewport.left -
        region.clientWidth / 2,
      bounds.top +
        position.y * bounds.height -
        viewport.top -
        region.clientHeight / 2
    )
  }, [zoom, fit, manualZoom])
  return (
    <>
      <Toolbar
        page={number}
        total={document.total}
        zoom={zoom}
        onPage={(value) => {
          anchor.current = null
          setNumber(value)
          root.current?.scrollTo(0, 0)
        }}
        onZoom={(value) => {
          if (fit === null && value === manualZoom) return
          rememberPosition()
          setFit(null)
          setZoom(value)
        }}
        onFit={(value) => {
          if (fit === value) return
          rememberPosition()
          setFit(value)
        }}
        onRotate={() => setRotation((value) => (value + 90) % 360)}
        messages={m}
      />
      <div
        ref={root}
        role="region"
        aria-label={m.reader}
        dir="ltr"
        className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain bg-muted p-4"
        // Scrollable pages must be keyboard reachable.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        {current?.error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.pageError}</AlertTitle>
            <AlertDescription>{current.error}</AlertDescription>
          </Alert>
        ) : page ? (
          <div className="flex min-h-full w-max min-w-full items-start justify-center">
            <div
              ref={paper}
              className="relative shrink-0 bg-white shadow-sm"
              style={{
                width: (width * zoom) / 100,
                height: (height * zoom) / 100,
              }}
            >
              <img
                width={page.width}
                height={page.height}
                src={current!.url}
                alt={`${m.page} ${number}`}
                draggable={false}
                className="absolute max-w-none"
                style={{
                  width: (page.width * zoom) / 100,
                  height: (page.height * zoom) / 100,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
                onError={() => setResult({ number, error: m.pageError })}
              />
            </div>
          </div>
        ) : (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-6"
          >
            <Spinner />
            {m.rendering}
          </p>
        )}
      </div>
      <details
        className="max-h-36 shrink-0 overflow-auto border-t px-3 py-1"
        open={page?.limited || undefined}
      >
        <summary className="cursor-pointer rounded-sm py-1 text-sm focus-visible:outline-2 focus-visible:outline-ring">
          {m.compatibility}
        </summary>
        <div className="flex flex-col gap-2 pb-2 text-xs text-muted-foreground">
          <p>{m.limited}</p>
          <p role={page?.limited ? "status" : undefined}>{m.contentNotice}</p>
          <p>{m.fontNotice}</p>
          <p>{m.visualOnly}</p>
          <p>{m.restrictionNotice}</p>
        </div>
      </details>
    </>
  )
}
