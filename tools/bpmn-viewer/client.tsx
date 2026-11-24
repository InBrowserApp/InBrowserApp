import { useEffect, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Download,
  Folder,
  Scan,
  Workflow,
  ZoomIn,
  ZoomOut,
} from "@workspace/ui/icons"
import example from "./example.bpmn?raw"

import "bpmn-js/dist/assets/diagram-js.css"
import "bpmn-js/dist/assets/bpmn-js.css"
import type Viewer from "bpmn-js/lib/NavigatedViewer"
import type Messages from "./messages/en.json"

type Status = "loading" | "ready" | "invalid" | "noLayout"
type Point = { x: number; y: number }
type Bounds = Point & { width: number; height: number }
type Canvas = {
  resized(): void
  viewbox(): { inner: Bounds; outer: Bounds }
  viewbox(box: Bounds): void
  zoom(scale?: number): number
  scroll(delta: { dx: number; dy: number }): void
}
type Diagram = { viewer: Viewer; canvas: Canvas }

function fit(canvas: Canvas) {
  const { inner, outer } = canvas.viewbox()
  const padding = 32
  if (outer.width <= padding || outer.height <= padding) return false

  const scale = Math.min(
    1,
    (outer.width - padding) / Math.max(1, inner.width),
    (outer.height - padding) / Math.max(1, inner.height)
  )
  const width = outer.width / scale
  const height = outer.height / scale
  canvas.viewbox({
    x: inner.x + (inner.width - width) / 2,
    y: inner.y + (inner.height - height) / 2,
    width,
    height,
  })
  return true
}

export default function Client({ messages: m }: { messages: typeof Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("loading")
  const [exportFailed, setExportFailed] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const diagram = useRef<Diagram>(null)
  const touch = useRef<(Point & { id: number }) | null>(null)
  const focusExample = useRef(false)
  const ready = status === "ready"

  function open(next: File | null, focusDiagram = false) {
    focusExample.current = focusDiagram
    setFile(next)
    setStatus("loading")
    setExportFailed(false)
  }

  useEffect(() => {
    if (!ready || !focusExample.current) return
    focusExample.current = false
    if (document.activeElement === document.body) {
      container.current?.querySelector("svg")?.focus({ preventScroll: true })
    }
  }, [ready])

  useEffect(() => {
    if (!file || !container.current) return
    const target = container.current
    let cancelled = false
    let viewer: Viewer | undefined
    let observer: ResizeObserver | undefined

    async function load(file: File) {
      try {
        const [{ default: NavigatedViewer }, { decodeWebDocument }, bytes] =
          await Promise.all([
            import("bpmn-js/lib/NavigatedViewer"),
            import("@workspace/web-document"),
            file.arrayBuffer(),
          ])
        if (cancelled) return
        const activeViewer = new NavigatedViewer({
          container: target,
          zoomScroll: { enabled: false },
        })
        viewer = activeViewer
        await activeViewer.importXML(decodeWebDocument(new Uint8Array(bytes)))
        if (cancelled) return

        const canvas = activeViewer.get<Canvas>("canvas")
        const { inner } = canvas.viewbox()
        if (inner.width === 0 && inner.height === 0) {
          setStatus("noLayout")
          return
        }

        function resize() {
          canvas.resized()
          if (!diagram.current && fit(canvas)) {
            diagram.current = { viewer: activeViewer, canvas }
            setStatus("ready")
          }
        }
        observer = new ResizeObserver(resize)
        observer.observe(target)
        resize()
      } catch (error) {
        if (cancelled) return
        setStatus(
          error instanceof Error && error.message === "no diagram to display"
            ? "noLayout"
            : "invalid"
        )
      }
    }

    void load(file)
    return () => {
      cancelled = true
      touch.current = null
      observer?.disconnect()
      viewer?.destroy()
      diagram.current = null
    }
  }, [file])

  function zoom(factor: number) {
    const canvas = diagram.current?.canvas
    if (canvas) canvas.zoom(Math.min(5, Math.max(0.01, canvas.zoom() * factor)))
  }

  async function downloadSvg(file: File) {
    const current = diagram.current
    if (!current) return
    setExportFailed(false)

    try {
      const { svg } = await current.viewer.saveSVG()
      if (diagram.current !== current) return
      if (!svg) throw new Error("Empty SVG export")

      const stem = file.name.replace(/\.(?:bpmn|xml)$/i, "") || "bpmn-diagram"
      const url = URL.createObjectURL(
        new Blob([svg], { type: "image/svg+xml" })
      )
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      const link = document.createElement("a")
      link.href = url
      link.download = `${stem}.svg`
      link.click()
    } catch {
      if (diagram.current === current) setExportFailed(true)
    }
  }

  return (
    <DocumentWorkspace
      tool="bpmn-viewer"
      file={file}
      onFile={open}
      accept=".bpmn,.xml,application/xml,text/xml"
      active={Boolean(file)}
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-72">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Workflow aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.formats}</EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button data-file-open onClick={chooseFile}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              variant="outline"
              onClick={(event) =>
                open(
                  new File([example], "approval-example.bpmn", {
                    type: "application/xml",
                  }),
                  event.detail === 0
                )
              }
            >
              {m.example}
            </Button>
          </div>
        </Empty>
      )}
    >
      {file && (
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={container}
            dir="ltr"
            role="region"
            aria-label={m.diagram}
            aria-hidden={!ready}
            data-suppress-language-suggestion={ready || undefined}
            className="min-h-0 flex-1 touch-none bg-white text-black"
            onPointerDown={(event) => {
              if (!ready || event.pointerType !== "touch" || !event.isPrimary)
                return
              touch.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
              }
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerMove={(event) => {
              const last = touch.current
              if (last?.id !== event.pointerId) return
              diagram.current?.canvas.scroll({
                dx: event.clientX - last.x,
                dy: event.clientY - last.y,
              })
              touch.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
              }
            }}
            onLostPointerCapture={() => {
              touch.current = null
            }}
          />
          {ready ? (
            <div className="absolute end-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1 rounded-lg border bg-background p-1 shadow-sm">
              <DocumentIconButton
                label={m.zoomOut}
                onClick={() => zoom(1 / 1.25)}
              >
                <ZoomOut aria-hidden="true" />
              </DocumentIconButton>
              <DocumentIconButton label={m.zoomIn} onClick={() => zoom(1.25)}>
                <ZoomIn aria-hidden="true" />
              </DocumentIconButton>
              <DocumentIconButton
                label={m.fit}
                onClick={() => {
                  if (diagram.current) fit(diagram.current.canvas)
                }}
              >
                <Scan aria-hidden="true" />
              </DocumentIconButton>
              <Button
                variant="outline"
                size="sm"
                className="max-sm:min-h-10"
                onClick={() => void downloadSvg(file)}
              >
                <Download data-icon="inline-start" aria-hidden="true" />
                {m.downloadSvg}
              </Button>
              {exportFailed && (
                <p
                  role="status"
                  className="max-w-60 basis-full px-2 py-1 text-sm text-destructive"
                >
                  {m.exportError}
                </p>
              )}
            </div>
          ) : (
            <div
              role="status"
              className="absolute inset-0 grid place-items-center bg-background px-6 text-center text-sm"
            >
              <p className="max-w-md">{m[status]}</p>
            </div>
          )}
        </div>
      )}
    </DocumentWorkspace>
  )
}
