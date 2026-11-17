/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The canvas supports keyboard editing. */
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Minus, Plus } from "@workspace/ui/icons"
import { render } from "../render"
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
  const viewport = useRef<HTMLDivElement>(null)
  const output = useRef<HTMLCanvasElement>(null)
  const [bounds, setBounds] = useState({ width: 640, height: 440 })
  const [zoom, setZoom] = useState(1)
  const hintId = useId()
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
  }, [source, editor.regions])
  if (!source) return null
  const fit = Math.min(
    1,
    Math.max(1, bounds.width - 48) / source.width,
    Math.max(1, bounds.height - 64) / source.height
  )
  const scale = fit * zoom
  const previewWidth = Math.min(source.width, 1600)
  const hint =
    editor.tool === "select"
      ? messages.selectHint
      : editor.tool === "brush"
        ? messages.brushHint
        : messages.drawHint
  return (
    <>
      <div
        ref={viewport}
        className="h-[min(60vh,36rem)] min-h-72 overflow-auto bg-muted/30"
        dir="ltr"
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
              height={Math.round((previewWidth * source.height) / source.width)}
              className="pointer-events-none absolute inset-0 size-full"
              aria-hidden="true"
            />
            <svg
              viewBox={`0 0 ${source.width} ${source.height}`}
              role="application"
              tabIndex={0}
              aria-label={messages.canvasLabel}
              aria-describedby={hintId}
              className="absolute inset-0 size-full touch-none overflow-visible focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              style={{
                cursor: editor.tool === "select" ? "default" : "crosshair",
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
            aria-label={messages.zoomOut}
            disabled={zoom <= 0.5}
            onClick={() => setZoom((z) => Math.max(0.5, z / 1.25))}
          >
            <Minus aria-hidden="true" />
          </Button>
          <span className="min-w-12 text-center text-xs tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={messages.zoomIn}
            disabled={zoom >= 8}
            onClick={() => setZoom((z) => Math.min(8, z * 1.25))}
          >
            <Plus aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setZoom(1)}
          >
            {messages.fit}
          </Button>
        </div>
      </div>
    </>
  )
}
