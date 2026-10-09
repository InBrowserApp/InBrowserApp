import { useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { ZoomInput } from "./zoom-input"
import { Button } from "@workspace/ui/components/ui/button"
import {
  LayoutGrid,
  Maximize2,
  Minus,
  Moon,
  Plus,
  RotateCw,
  Sun,
} from "@workspace/ui/icons"
import type { ImageInfo, Preview, Messages } from "./types"

const grid = {
  backgroundColor: "#fff",
  backgroundImage:
    "conic-gradient(#e2e4e8 25%, transparent 0 50%, #e2e4e8 0 75%, transparent 0)",
  backgroundSize: "24px 24px",
}

export function ImageView({
  preview,
  info,
  zoom,
  onZoom,
  background,
  onBackground,
  messages: m,
}: {
  preview: Preview
  info: ImageInfo
  zoom: number | null
  onZoom: (zoom: number | null) => void
  background: string
  onBackground: (background: string) => void
  messages: Messages
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{
    x: number
    y: number
    left: number
    top: number
  } | null>(null)
  const [url, setUrl] = useState("")
  const [failed, setFailed] = useState(false)
  const [space, setSpace] = useState({ width: 1, height: 1 })
  const hint = useId()
  const scale =
    zoom ??
    Math.min(
      Math.max(1, space.width - 32) / preview.width,
      Math.max(1, space.height - 32) / preview.height
    )
  useEffect(() => {
    try {
      const next = URL.createObjectURL(
        new Blob([preview.png], { type: "image/png" })
      )
      setUrl(next)
      return () => URL.revokeObjectURL(next)
    } catch {
      setFailed(true)
    }
    return undefined
  }, [preview])
  useEffect(() => {
    const element = viewport.current!
    const measure = () =>
      setSpace({ width: element.clientWidth, height: element.clientHeight })
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    measure()
    return () => observer.disconnect()
  }, [])
  function changeZoom(next: number | null) {
    const element = viewport.current!
    const x =
      (element.scrollLeft + element.clientWidth / 2) /
      Math.max(element.clientWidth, preview.width * scale)
    const y =
      (element.scrollTop + element.clientHeight / 2) /
      Math.max(element.clientHeight, preview.height * scale)
    onZoom(next)
    requestAnimationFrame(() => {
      element.scrollLeft =
        next === null ? 0 : x * element.scrollWidth - element.clientWidth / 2
      element.scrollTop =
        next === null ? 0 : y * element.scrollHeight - element.clientHeight / 2
    })
  }
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b px-2 py-1">
        <div className="flex min-w-0 flex-wrap items-center gap-0.5">
          <DocumentIconButton
            label={m.zoomOut}
            onClick={() => changeZoom(scale / 1.25)}
          >
            <Minus aria-hidden="true" />
          </DocumentIconButton>
          <ZoomInput
            label={m.zoom}
            value={Math.round(scale * 10000) / 100}
            onChange={(value) => changeZoom(value / 100)}
          />
          <span aria-hidden="true" className="text-xs text-muted-foreground">
            %
          </span>
          <DocumentIconButton
            label={m.zoomIn}
            onClick={() => changeZoom(scale * 1.25)}
          >
            <Plus aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.fit}
            className="aria-pressed:bg-accent"
            aria-pressed={zoom === null}
            onClick={() => changeZoom(null)}
          >
            <Maximize2 aria-hidden="true" />
          </DocumentIconButton>
          <Button
            variant="ghost"
            size="sm"
            aria-label={m.actualSize}
            title={m.actualSize}
            onClick={() => changeZoom(1)}
          >
            1:1
          </Button>
        </div>
        <div className="flex items-center gap-0.5">
          <DocumentIconButton
            label={m.reset}
            onClick={() => {
              changeZoom(null)
              onBackground("checkerboard")
            }}
          >
            <RotateCw aria-hidden="true" />
          </DocumentIconButton>
          <div
            role="group"
            aria-label={m.background}
            className="flex items-center gap-0.5"
          >
            {(
              [
                ["checkerboard", LayoutGrid],
                ["light", Sun],
                ["dark", Moon],
              ] as const
            ).map(([value, Icon]) => (
              <DocumentIconButton
                key={value}
                label={m[value]}
                className="aria-pressed:bg-accent"
                aria-pressed={background === value}
                onClick={() => onBackground(value)}
              >
                <Icon aria-hidden="true" />
              </DocumentIconButton>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={viewport}
        role="region"
        aria-label={m.artwork}
        aria-describedby={hint}
        // The scrollable illustration must receive keyboard arrow navigation.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        dir="ltr"
        className="min-h-0 flex-1 cursor-grab overflow-auto overscroll-contain outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-ring active:cursor-grabbing"
        style={
          background === "checkerboard"
            ? grid
            : { backgroundColor: background === "light" ? "#fff" : "#17191d" }
        }
        onPointerDown={(event) => {
          if (event.button !== 0 || event.pointerType === "touch") return
          const element = event.currentTarget
          element.focus({ preventScroll: true })
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            left: element.scrollLeft,
            top: element.scrollTop,
          }
          element.setPointerCapture(event.pointerId)
          event.preventDefault()
        }}
        onPointerMove={(event) => {
          if (!drag.current) return
          event.currentTarget.scrollLeft =
            drag.current.left + drag.current.x - event.clientX
          event.currentTarget.scrollTop =
            drag.current.top + drag.current.y - event.clientY
        }}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onLostPointerCapture={() => {
          drag.current = null
        }}
      >
        <div
          className="grid min-h-full min-w-full place-items-center"
          style={{
            width: preview.width * scale,
            height: preview.height * scale,
          }}
        >
          {failed ? (
            <p
              role="alert"
              className="m-4 max-w-lg rounded-lg bg-background p-4 text-sm text-foreground"
            >
              {m.renderError}
            </p>
          ) : url ? (
            <img
              src={url}
              alt={m.artwork}
              draggable={false}
              className="block max-w-none select-none"
              style={{
                width: preview.width * scale,
                height: preview.height * scale,
              }}
              onError={() => setFailed(true)}
            />
          ) : null}
        </div>
      </div>
      <div className="shrink-0 border-t px-3 py-2 text-xs text-muted-foreground">
        <details className="max-h-36 overflow-auto">
          <summary className="cursor-pointer">
            {info.format} ·{" "}
            <span dir="ltr">
              {preview.width} × {preview.height} px
            </span>
            <span className="sr-only"> — {m.details}</span>
          </summary>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt>{m.detectedFormat}</dt>
            <dd>{info.format}</dd>
            <dt>{m.dimensions}</dt>
            <dd dir="ltr">
              {preview.width} × {preview.height} px
            </dd>
            {preview.delay > 0 ? (
              <>
                <dt>{m.duration}</dt>
                <dd>
                  {m.milliseconds.replace("{value}", String(preview.delay))}
                </dd>
              </>
            ) : null}
            <dt>{m.profile}</dt>
            <dd>{preview.profile ? m.present : m.absent}</dd>
          </dl>
          <p className="mt-2">{m.precision}</p>
          <p className="mt-2">{m.compatibility}</p>
          <p id={hint} className="mt-2">
            {m.panHint}
          </p>
          <a
            className="mt-2 inline-block underline underline-offset-2"
            href="/image-viewer-licenses/"
            target="_blank"
            rel="noreferrer"
          >
            {m.licenses}
          </a>
        </details>
      </div>
    </>
  )
}
