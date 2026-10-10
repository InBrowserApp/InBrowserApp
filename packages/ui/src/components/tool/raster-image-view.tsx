import { useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { ZoomInput } from "./raster-image-zoom-input"
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
import type {
  RasterInfo,
  RasterPreview,
  RasterImageMessages,
} from "./raster-image-types"
import { RasterImageDetails } from "./raster-image-details"

const grid = {
  backgroundColor: "#fff",
  backgroundImage:
    "conic-gradient(#e2e4e8 25%, transparent 0 50%, #e2e4e8 0 75%, transparent 0)",
  backgroundSize: "24px 24px",
}

export function RasterImageView({
  preview,
  info,
  zoom,
  onZoom,
  background,
  onBackground,
  messages: m,
  download,
}: {
  preview: RasterPreview
  info: RasterInfo
  zoom: number | null
  onZoom: (zoom: number | null) => void
  background: string
  onBackground: (background: string) => void
  messages: RasterImageMessages
  download: { label: string; filename: string }
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{
    x: number
    y: number
    left: number
    top: number
  } | null>(null)
  const [objectUrl, setObjectUrl] = useState<{
    preview: RasterPreview
    url: string
  } | null>(null)
  const [loaded, setLoaded] = useState<RasterPreview | null>(null)
  const url = objectUrl?.preview === preview ? objectUrl.url : ""
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
    setFailed(false)
    try {
      const next = URL.createObjectURL(
        new Blob([preview.bytes], { type: preview.mime })
      )
      setObjectUrl({ preview, url: next })
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
        <div className="flex flex-wrap items-center gap-0.5">
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
        {url && loaded === preview && !failed ? (
          <Button asChild size="sm">
            <a
              href={url}
              download={download.filename}
              data-astro-prefetch="false"
            >
              {download.label}
            </a>
          </Button>
        ) : null}
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
              onLoad={() => setLoaded(preview)}
              onError={() => setFailed(true)}
            />
          ) : null}
        </div>
      </div>
      <RasterImageDetails
        preview={preview}
        info={info}
        messages={m}
        hint={hint}
      />
    </>
  )
}
