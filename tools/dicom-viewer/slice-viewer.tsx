import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronUp, RotateCcw, SunMoon } from "@workspace/ui/icons"
import { Button } from "@workspace/ui/components/ui/button"
import { Slider } from "@workspace/ui/components/ui/slider"
import { rgba } from "./dicom-pixels"
import { Metadata } from "./metadata"
import { WindowField } from "./window-field"
import type { Frame, Image, Messages, Series, WindowLevel } from "./types"

function findSlice(series: Series, index: number) {
  let frameIndex = index
  for (const image of series.images) {
    if (frameIndex < image.frameCount) return { image, frameIndex }
    frameIndex -= image.frameCount
  }
  throw new RangeError("Slice index is out of range")
}

export function SliceViewer({
  series,
  messages,
  number,
}: {
  series: Series
  messages: Messages
  number: Intl.NumberFormat
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const drag = useRef<{ x: number; y: number; start: WindowLevel } | null>(null)
  const [index, setIndex] = useState(0)
  const [rendered, setRendered] = useState<{
    image: Image
    frameIndex: number
    frame?: Frame
  }>()
  const [windowOverride, setWindowOverride] = useState<WindowLevel>()
  const { frameCount } = series
  const { image, frameIndex } = findSlice(series, index)
  const result =
    rendered?.image === image && rendered.frameIndex === frameIndex
      ? rendered
      : undefined
  const frame = result?.frame
  const minWidth = frame?.windowFunction === "LINEAR" ? 1 : Number.MIN_VALUE
  const window = useMemo(() => {
    const requested = windowOverride ?? frame?.window
    return requested && requested.width < minWidth
      ? { ...requested, width: minWidth }
      : requested
  }, [frame, minWidth, windowOverride])
  const position = messages.slicePosition
    .replace("{current}", number.format(index + 1))
    .replace("{total}", number.format(frameCount))

  function move(delta: number) {
    setIndex((previous) =>
      Math.max(0, Math.min(frameCount - 1, previous + delta))
    )
  }

  useEffect(() => {
    let current = true
    void image.frame(frameIndex).then(
      (frame) => {
        if (current) setRendered({ image, frameIndex, frame })
      },
      () => {
        if (current) setRendered({ image, frameIndex })
      }
    )
    return () => {
      current = false
    }
  }, [image, frameIndex])

  useEffect(() => {
    if (!frame || !window) return
    const context = canvas.current?.getContext("2d")
    context?.putImageData(
      new ImageData(rgba(frame, window), frame.width, frame.height),
      0,
      0
    )
  }, [frame, window])

  useEffect(() => {
    const element = viewport.current!
    if (frameCount < 2) return
    const scroll = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY) return
      event.preventDefault()
      setIndex((index) =>
        Math.max(0, Math.min(frameCount - 1, index + Math.sign(event.deltaY)))
      )
    }
    element.addEventListener("wheel", scroll, { passive: false })
    return () => element.removeEventListener("wheel", scroll)
  }, [frameCount])

  return (
    <>
      <div className="overflow-hidden rounded-b-xl border bg-card">
        <div className="grid xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            {/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The viewport handles slice navigation with arrow keys. */}
            <div
              ref={viewport}
              tabIndex={frameCount > 1 ? 0 : undefined}
              role="region"
              aria-label={messages.viewport}
              className="[container-type:size] relative grid h-[clamp(17rem,52vw,34rem)] place-items-center overflow-hidden bg-neutral-950 text-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:h-[clamp(23rem,46vw,34rem)]"
              onKeyDown={(event) => {
                if (
                  frameCount < 2 ||
                  (event.key !== "ArrowUp" && event.key !== "ArrowDown")
                )
                  return
                event.preventDefault()
                move(event.key === "ArrowDown" ? 1 : -1)
              }}
              onPointerDown={(event) => {
                if (
                  !window ||
                  event.button !== 0 ||
                  event.pointerType === "touch"
                )
                  return
                drag.current = {
                  x: event.clientX,
                  y: event.clientY,
                  start: window,
                }
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={(event) => {
                if (!drag.current) return
                const { x, y, start } = drag.current
                const scale = Math.max(start.width / 240, 0.1)
                setWindowOverride({
                  width: Math.max(
                    minWidth,
                    0.01,
                    Math.round(
                      (start.width + (event.clientX - x) * scale) * 100
                    ) / 100
                  ),
                  level:
                    Math.round(
                      (start.level - (event.clientY - y) * scale) * 100
                    ) / 100,
                })
              }}
              onLostPointerCapture={() => {
                drag.current = null
              }}
            >
              {frame && (
                <canvas
                  ref={canvas}
                  width={frame.width}
                  height={frame.height}
                  role="img"
                  aria-label={position}
                  className="cursor-crosshair"
                  style={{
                    width: `min(100cqw, calc(100cqh * ${frame.aspectRatio}))`,
                    aspectRatio: frame.aspectRatio,
                  }}
                />
              )}
              {!result && (
                <p
                  role="status"
                  className="px-4 text-center text-sm text-neutral-300"
                >
                  {messages.loading}
                </p>
              )}
              {result && !frame && (
                <p
                  role="alert"
                  className="px-4 text-center text-sm text-neutral-300"
                >
                  {messages.previewError}
                </p>
              )}
              {frame && (
                <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 text-xs">
                  <span
                    className="max-w-[70%] truncate rounded-md bg-black/80 px-2 py-1 text-white"
                    dir="auto"
                    title={image.fileName}
                  >
                    {image.fileName}
                  </span>
                  <span
                    className="shrink-0 rounded-md bg-black/80 px-2 py-1 font-mono text-white"
                    dir="ltr"
                  >
                    {frame.width} × {frame.height}
                  </span>
                </div>
              )}
            </div>
            {/* oxlint-enable jsx-a11y/no-noninteractive-tabindex */}
            <div className="grid gap-2 border-t px-3 py-2">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  disabled={index === 0}
                  onClick={() => move(-1)}
                  aria-label={messages.previous}
                  title={messages.previous}
                >
                  <ChevronUp aria-hidden="true" />
                </Button>
                <Slider
                  className="min-w-10 flex-1"
                  value={[index]}
                  max={Math.max(1, frameCount - 1)}
                  disabled={frameCount === 1}
                  aria-label={messages.slice}
                  aria-valuetext={position}
                  onValueChange={([value = 0]) => setIndex(value)}
                />
                <Button
                  size="icon"
                  variant="outline"
                  disabled={index === frameCount - 1}
                  onClick={() => move(1)}
                  aria-label={messages.next}
                  title={messages.next}
                >
                  <ChevronDown aria-hidden="true" />
                </Button>
                <span className="shrink-0 text-xs font-medium tabular-nums sm:text-sm">
                  {position}
                </span>
              </div>
              {frameCount > 1 && (
                <p className="px-1 text-xs text-muted-foreground pointer-coarse:hidden">
                  {messages.scrollHint}
                </p>
              )}
            </div>
          </div>
          <div className="grid content-start gap-3 border-t p-4 xl:border-s xl:border-t-0">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <SunMoon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {messages.window}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                disabled={!windowOverride}
                onClick={() => setWindowOverride(undefined)}
              >
                <RotateCcw aria-hidden="true" />
                {messages.reset}
              </Button>
            </div>
            {window && (
              <div className="grid grid-cols-2 gap-3">
                <WindowField
                  label={messages.windowWidth}
                  value={window.width}
                  min={minWidth}
                  onValue={(width) => setWindowOverride({ ...window, width })}
                />
                <WindowField
                  label={messages.windowLevel}
                  value={window.level}
                  onValue={(level) => setWindowOverride({ ...window, level })}
                />
              </div>
            )}
            {window && (
              <p className="text-xs text-muted-foreground pointer-coarse:hidden">
                {messages.windowHint}
              </p>
            )}
          </div>
        </div>
      </div>
      <Metadata image={image} messages={messages} />
    </>
  )
}
