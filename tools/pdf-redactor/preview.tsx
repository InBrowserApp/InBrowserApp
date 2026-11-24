import { useEffect, useId, useRef, useState } from "react"

import { LoaderCircle } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { rectangle, relativePoint } from "./geometry"
import { renderPage } from "./render-page"
import type { KeyboardEvent, PointerEvent } from "react"
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist"
import type { Messages, Point, Region } from "./types"

type Props = {
  document: PDFDocumentProxy
  page: number
  regions: readonly Region[]
  zoom: number
  pan: boolean
  busy: boolean
  messages: Messages
  onRegion: (region: Region) => void
}

const directions: Record<string, Point> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
}
const center = { x: 0.5, y: 0.5 }

type Gesture =
  | { pointer: number; start: Point; kind: "draw" }
  | { pointer: number; start: Point; scroll: Point; kind: "pan" }

export function Preview({
  document,
  page,
  regions,
  zoom,
  pan,
  busy,
  messages,
  onRegion,
}: Props) {
  const hintId = useId()
  const cursorElement = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<Point | null>(null)
  const [anchor, setAnchor] = useState<Point | null>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const [draft, setDraft] = useState<Region | null>(null)
  const [preview, setPreview] = useState<
    { width: number; height: number } | "error"
  >()

  useEffect(() => {
    const target = canvas.current!
    let active = true
    let sourcePage: PDFPageProxy | undefined
    let renderTask: RenderTask | undefined

    async function render() {
      try {
        sourcePage = await document.getPage(page)
        if (!active) return
        const { task, width, height } = renderPage(sourcePage, target, 2.5)
        renderTask = task
        await task.promise
        if (active) setPreview({ width, height })
      } catch {
        if (active) setPreview("error")
      } finally {
        sourcePage?.cleanup()
      }
    }

    void render()
    return () => {
      active = false
      renderTask?.cancel()
      target.width = 0
      target.height = 0
    }
  }, [document, page])

  useEffect(() => {
    cursorElement.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    })
  }, [cursor])

  function clearKeyboard() {
    setCursor(null)
    setAnchor(null)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (pan || busy || event.altKey || event.ctrlKey || event.metaKey) return
    const { key } = event
    const direction = Object.hasOwn(directions, key)
      ? directions[key]
      : undefined
    if (key !== "Enter" && key !== "Escape" && !direction) return
    event.preventDefault()
    const point = cursor ?? center
    if (direction) {
      const step = event.shiftKey ? 0.05 : 0.005
      setCursor({
        x: Math.min(1, Math.max(0, point.x + direction.x * step)),
        y: Math.min(1, Math.max(0, point.y + direction.y * step)),
      })
    } else if (key === "Escape") {
      clearKeyboard()
    } else if (!event.repeat) {
      if (!anchor) {
        setCursor(point)
        setAnchor(point)
      } else {
        const region = rectangle(anchor, point)
        if (region.right > region.left && region.bottom > region.top) {
          onRegion(region)
          setAnchor(null)
        }
      }
    }
  }

  function localPoint(event: PointerEvent<HTMLDivElement>) {
    return relativePoint(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect()
    )
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current || busy || event.button !== 0) return
    if (pan && event.pointerType === "touch") return
    clearKeyboard()
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = pan
      ? {
          pointer: event.pointerId,
          kind: "pan",
          start: { x: event.clientX, y: event.clientY },
          scroll: {
            x: scroll.current!.scrollLeft,
            y: scroll.current!.scrollTop,
          },
        }
      : { pointer: event.pointerId, kind: "draw", start: localPoint(event) }
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (current?.pointer !== event.pointerId) return
    if (current.kind === "pan") {
      scroll.current?.scrollTo(
        current.scroll.x + current.start.x - event.clientX,
        current.scroll.y + current.start.y - event.clientY
      )
    } else {
      setDraft(rectangle(current.start, localPoint(event)))
    }
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (current?.pointer !== event.pointerId) return
    gesture.current = null
    setDraft(null)
    if (current.kind !== "draw" || event.type !== "pointerup" || busy) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const region = rectangle(
      current.start,
      relativePoint(event.clientX, event.clientY, bounds)
    )
    if (
      (region.right - region.left) * bounds.width >= 3 &&
      (region.bottom - region.top) * bounds.height >= 3
    ) {
      onRegion(region)
    }
  }

  const selection = draft ?? (anchor && cursor && rectangle(anchor, cursor))
  const ready = preview && preview !== "error"
  const ratio = ready ? preview.width / preview.height : 1

  return (
    <div
      ref={scroll}
      dir="ltr"
      className="group/preview max-h-[min(68svh,46rem)] overflow-auto bg-muted/55 p-3 sm:p-4"
    >
      <p
        id={hintId}
        className={cn(
          "sr-only",
          !pan &&
            "text-sm text-muted-foreground group-has-[:focus-visible]/preview:not-sr-only group-has-[:focus-visible]/preview:mb-2"
        )}
      >
        {messages.keyboardHint}
      </p>
      {!ready && (
        <div
          className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"
          role="status"
        >
          {preview === "error" ? (
            messages.previewError
          ) : (
            <LoaderCircle
              className="size-5 animate-spin"
              aria-label={messages.opening}
            />
          )}
        </div>
      )}
      <div
        hidden={!ready}
        role="application"
        aria-label={messages.pagePreview}
        aria-describedby={pan ? undefined : hintId}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The page editor handles keyboard drawing.
        tabIndex={ready && !busy ? 0 : undefined}
        onKeyDown={onKeyDown}
        onBlur={clearKeyboard}
        className={cn(
          "relative mx-auto bg-white shadow-sm select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          busy
            ? "pointer-events-none"
            : pan
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-crosshair touch-none"
        )}
        style={{
          width: `min(${zoom * 100}%, ${zoom * 64 * ratio}svh, ${zoom * 52}rem)`,
          aspectRatio: ratio,
        }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={finish}
        onLostPointerCapture={finish}
      >
        <canvas ref={canvas} aria-hidden="true" className="block size-full" />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {regions.map((region, index) => (
            <Mark key={index} region={region} />
          ))}
          {selection && <Mark region={selection} draft />}
          {cursor && (
            <div
              ref={cursorElement}
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary ring-1 ring-black"
              style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Mark({ region, draft }: { region: Region; draft?: boolean }) {
  return (
    <div
      className={cn(
        "absolute bg-black",
        draft && "bg-black/75 ring-1 ring-primary"
      )}
      style={{
        left: `${region.left * 100}%`,
        top: `${region.top * 100}%`,
        width: `${(region.right - region.left) * 100}%`,
        height: `${(region.bottom - region.top) * 100}%`,
      }}
    />
  )
}
