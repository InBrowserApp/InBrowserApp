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
import { Folder, Scan, Workflow, ZoomIn, ZoomOut } from "@workspace/ui/icons"
import type { PdfPageSizeLabels } from "@workspace/ui/components/tool/pdf-page-size-select"
import { DiagramDownloads } from "./diagram-downloads"
import example from "./example.bpmn?raw"

import "bpmn-js/dist/assets/diagram-js.css"
import "bpmn-js/dist/assets/bpmn-js.css"
import type Viewer from "bpmn-js/lib/NavigatedViewer"
import type { PageSize } from "@workspace/svg-pdf"
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
  const inset = 16
  const bottomInset = 44
  const availableWidth = outer.width - 2 * inset
  const availableHeight = outer.height - inset - bottomInset
  if (availableWidth <= 0 || availableHeight <= 0) return false

  const scale = Math.min(
    1,
    availableWidth / Math.max(1, inner.width),
    availableHeight / Math.max(1, inner.height)
  )
  const width = outer.width / scale
  const height = outer.height / scale
  canvas.viewbox({
    x: inner.x + (inner.width - width) / 2,
    y:
      inner.y +
      (inner.height - height) / 2 +
      (bottomInset - inset) / (2 * scale),
    width,
    height,
  })
  return true
}

export default function Client({
  messages: m,
  language = "en",
  paperSizes,
}: {
  messages: typeof Messages
  language?: string
  paperSizes?: PdfPageSizeLabels
}) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("loading")
  const [pageSize, setPageSize] = useState<PageSize>("original")
  const container = useRef<HTMLDivElement>(null)
  const diagram = useRef<Diagram>(null)
  const touch = useRef<(Point & { id: number }) | null>(null)
  const focusExample = useRef(false)
  const ready = status === "ready"

  function open(next: File | null, focusDiagram = false) {
    focusExample.current = focusDiagram
    setFile(next)
    setStatus("loading")
  }

  useEffect(() => {
    if (!ready || !diagram.current) return
    const { canvas } = diagram.current
    canvas.resized()
    fit(canvas)
    if (!focusExample.current) return
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

  return (
    <DocumentWorkspace
      tool={paperSizes ? "bpmn-to-pdf-converter" : "bpmn-viewer"}
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
      {file && ready && (
        <DiagramDownloads
          filename={file.name}
          getViewer={() => diagram.current?.viewer}
          language={language}
          messages={m}
          paperSizes={paperSizes}
          size={pageSize}
          onSizeChange={setPageSize}
        >
          <DocumentIconButton label={m.zoomOut} onClick={() => zoom(1 / 1.25)}>
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
        </DiagramDownloads>
      )}
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
          {!ready && (
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
