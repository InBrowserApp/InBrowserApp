/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The canvas supports keyboard editing. */
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { ZoomIn, ZoomOut } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { render } from "../render"
import { previewDimensions } from "../core/preview"
import type { Messages } from "../types"
import type { Editor } from "./use-editor"
import { Selection } from "./selection"
import { useGestures } from "./use-gestures"

export function Stage({
  editor,
  messages,
}: {
  editor: Editor
  messages: Messages
}) {
  const { source } = editor
  const preview = source && previewDimensions(source.width, source.height)
  const previewWidth = preview?.width ?? 1
  const previewHeight = preview?.height ?? 1
  const viewport = useRef<HTMLDivElement>(null)
  const output = useRef<HTMLCanvasElement>(null)
  const [bounds, setBounds] = useState({ width: 640, height: 440 })
  const [zoom, setZoom] = useState(1)
  const hintId = useId()
  const keyboardHintId = useId()
  const gestures = useGestures(editor)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry)
        setBounds({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
    })
    observer.observe(viewport.current!)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    setZoom(1)
  }, [source])
  useEffect(() => {
    if (source && output.current) render(output.current, source, editor.regions)
  }, [source, editor.regions, previewWidth, previewHeight])
  if (!source) return null
  const fit = Math.min(
    1,
    Math.max(1, bounds.width - 48) / source.width,
    Math.max(1, bounds.height - 64) / source.height
  )
  const scale = fit * zoom
  const hint =
    editor.tool === "select"
      ? messages.selectHint
      : editor.tool === "pan"
        ? messages.panHint
        : editor.tool === "brush"
          ? messages.brushHint
          : messages.drawHint
  return (
    <>
      <div
        ref={viewport}
        className={cn(
          "min-h-72 overflow-auto bg-muted/30",
          editor.tool === "pan" &&
            "cursor-grab touch-none select-none active:cursor-grabbing"
        )}
        style={{
          height: `min(60vh, ${Math.max(288, Math.min(576, ((bounds.width - 48) * source.height) / source.width + 64))}px)`,
        }}
        dir="ltr"
        onPointerDown={gestures.panDown}
        onPointerMove={gestures.panMove}
        onPointerUp={gestures.panUp}
        onPointerCancel={gestures.cancel}
        onLostPointerCapture={gestures.cancel}
      >
        <div className="grid min-h-full w-max min-w-full place-items-center p-6">
          <div
            className="relative shrink-0 shadow-sm"
            style={{
              width: source.width * scale,
              height: source.height * scale,
              backgroundImage:
                "conic-gradient(#94a3b822 25%,transparent 0 50%,#94a3b822 0 75%,transparent 0)",
              backgroundSize: "16px 16px",
            }}
          >
            <canvas
              ref={output}
              width={previewWidth}
              height={previewHeight}
              className="pointer-events-none absolute inset-0 size-full"
              aria-hidden="true"
            />
            <svg
              viewBox={`0 0 ${source.width} ${source.height}`}
              role="application"
              tabIndex={0}
              aria-label={messages.canvasLabel}
              aria-describedby={`${hintId} ${keyboardHintId}`}
              className="absolute inset-0 size-full touch-none overflow-visible select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              style={{
                cursor:
                  editor.tool === "pan"
                    ? "inherit"
                    : editor.tool === "select"
                      ? "default"
                      : "crosshair",
              }}
              onPointerDown={gestures.down}
              onPointerMove={gestures.move}
              onPointerUp={gestures.up}
              onPointerCancel={gestures.cancel}
              onLostPointerCapture={gestures.cancel}
              onKeyDown={(event) => {
                if (event.key === "Escape") gestures.cancel()
              }}
            >
              {editor.selected && (
                <Selection
                  region={editor.selected}
                  scale={scale}
                  editor={editor}
                  messages={messages}
                />
              )}
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <p
          id={hintId}
          className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground"
        >
          {hint}
        </p>
        <div
          role="group"
          aria-label={messages.zoom}
          className="flex items-center gap-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="touch-manipulation pointer-coarse:size-10"
            aria-label={messages.zoomOut}
            title={messages.zoomOut}
            disabled={zoom <= 0.5}
            onClick={() => setZoom((z) => Math.max(0.5, z / 1.25))}
          >
            <ZoomOut aria-hidden="true" />
          </Button>
          <span className="min-w-12 text-center text-xs tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="touch-manipulation pointer-coarse:size-10"
            aria-label={messages.zoomIn}
            title={messages.zoomIn}
            disabled={zoom >= 8}
            onClick={() => setZoom((z) => Math.min(8, z * 1.25))}
          >
            <ZoomIn aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="touch-manipulation pointer-coarse:min-h-10"
            title={messages.fit}
            onClick={() => setZoom(1)}
          >
            {messages.fit}
          </Button>
        </div>
      </div>
      <p id={keyboardHintId} className="sr-only">
        {messages.canvasKeyboardHint}
      </p>
    </>
  )
}
