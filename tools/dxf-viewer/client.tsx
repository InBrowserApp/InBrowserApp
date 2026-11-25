import { useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Folder,
  Layers,
  Maximize2,
  Ruler,
  ZoomIn,
  ZoomOut,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { LayerInfo } from "dxf-viewer"
import type Messages from "./messages/en.json"
import { adjustDrawing, fitDrawing, openDrawing } from "./drawing"
import { DrawingLayers } from "./layers"
import type { Drawing } from "./drawing"

type ErrorKey = "binary" | "invalid" | "empty" | "webgl"

const pan = {
  ArrowLeft: [-0.1, 0],
  ArrowRight: [0.1, 0],
  ArrowUp: [0, 0.1],
  ArrowDown: [0, -0.1],
} as const

export default function DxfClient({
  messages: m,
  lang,
}: {
  messages: typeof Messages
  lang: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const mountedDrawing = useRef<Drawing>(null)
  const [selection, setSelection] = useState<{ file?: File }>()
  const [status, setStatus] = useState<"opening" | ErrorKey>()
  const [drawing, setDrawing] = useState<{
    name: string
    layers: LayerInfo[]
  }>()
  const [showLayers, setShowLayers] = useState(false)
  const [dragging, setDragging] = useState(false)
  const helpId = useId()
  const layersId = useId()

  useEffect(
    () => () => {
      mountedDrawing.current?.dispose()
      mountedDrawing.current = null
    },
    []
  )

  useEffect(() => {
    if (!selection) return
    const controller = new AbortController()
    const signal = controller.signal
    void (async () => {
      try {
        const file =
          selection.file ??
          new File([(await import("./bracket.dxf?raw")).default], "bracket.dxf")
        signal.throwIfAborted()
        const next = await openDrawing(file, stage.current!, lang, signal)
        if (signal.aborted) {
          next.dispose()
          return
        }
        mountedDrawing.current?.dispose()
        mountedDrawing.current = next
        next.show()
        setDrawing({
          name: file.name,
          layers: Array.from(next.viewer.GetLayers(true)),
        })
        setStatus(undefined)
      } catch (error) {
        if (signal.aborted) return
        const cause = error instanceof Error ? error.cause : undefined
        setStatus(
          cause === "binary" || cause === "empty" || cause === "webgl"
            ? cause
            : "invalid"
        )
      }
    })()
    return () => controller.abort()
  }, [selection, lang])

  function open(file?: File) {
    setSelection({ file })
    setStatus("opening")
  }

  function move(x: number, y: number, zoom?: number) {
    const viewer = mountedDrawing.current?.viewer
    if (viewer) adjustDrawing(viewer, x, y, zoom)
  }

  return (
    <section
      className={cn(
        "grid min-w-0 gap-3 rounded-lg",
        dragging && "ring-2 ring-ring"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) open(file)
      }}
    >
      <input
        ref={picker}
        type="file"
        accept=".dxf"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) open(file)
        }}
      />
      <p className="sr-only" role="status">
        {!status && drawing ? `${m.drawing} · ${drawing.name}` : ""}
      </p>
      {status && status !== "opening" && (
        <Alert variant="destructive">
          <AlertDescription>{m[status]}</AlertDescription>
        </Alert>
      )}
      <Empty
        className={
          drawing || status === "opening"
            ? "items-start gap-2 p-0"
            : "min-h-64 border border-dashed bg-muted/30"
        }
      >
        {!drawing && status !== "opening" && (
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Ruler aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        )}
        <div className="flex max-w-full flex-wrap items-center gap-2">
          <Button onClick={() => picker.current?.click()}>
            <Folder data-icon="inline-start" aria-hidden="true" />
            {m.open}
          </Button>
          <Button variant="outline" onClick={() => open()}>
            {m.example}
          </Button>
          {drawing && (
            <p
              dir="auto"
              className="max-w-full min-w-0 text-sm font-medium break-all"
            >
              {status && (
                <span className="me-2 text-muted-foreground">{m.previous}</span>
              )}
              {drawing.name}
            </p>
          )}
        </div>
        {status === "opening" && (
          <p role="status" className="flex items-center gap-2 text-sm">
            <Spinner aria-hidden="true" />
            {m.opening}
          </p>
        )}
      </Empty>
      <div
        hidden={!drawing && status !== "opening"}
        className="min-w-0 overflow-hidden rounded-lg border"
      >
        {drawing && (
          <div className="flex flex-wrap items-center gap-1.5 border-b px-2 py-1.5">
            <DocumentIconButton
              label={m.fit}
              onClick={() => {
                const viewer = mountedDrawing.current?.viewer
                if (viewer) fitDrawing(viewer)
              }}
            >
              <Maximize2 aria-hidden="true" />
            </DocumentIconButton>
            <DocumentIconButton
              label={m.zoomIn}
              onClick={() => move(0, 0, 0.8)}
            >
              <ZoomIn aria-hidden="true" />
            </DocumentIconButton>
            <DocumentIconButton
              label={m.zoomOut}
              onClick={() => move(0, 0, 1.25)}
            >
              <ZoomOut aria-hidden="true" />
            </DocumentIconButton>
            {drawing.layers.length > 0 && (
              <Button
                size="sm"
                variant={showLayers ? "secondary" : "ghost"}
                aria-expanded={showLayers}
                aria-controls={layersId}
                onClick={() => setShowLayers(!showLayers)}
              >
                <Layers data-icon="inline-start" aria-hidden="true" />
                {m.layers}
              </Button>
            )}
          </div>
        )}
        <div
          className={cn(
            "grid min-w-0",
            showLayers && drawing && "md:grid-cols-[15rem_minmax(0,1fr)]"
          )}
        >
          {drawing && (
            <DrawingLayers
              id={layersId}
              hidden={!showLayers}
              layers={drawing.layers}
              onToggle={(name, visible) => {
                mountedDrawing.current?.viewer.ShowLayer(name, visible)
                setDrawing({
                  ...drawing,
                  layers: drawing.layers.map((layer) =>
                    layer.name === name ? { ...layer, visible } : layer
                  ),
                })
              }}
            />
          )}
          <div
            ref={stage}
            dir="ltr"
            role="region"
            aria-label={m.drawing}
            aria-describedby={helpId}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The viewport supports keyboard pan and zoom.
            tabIndex={drawing ? 0 : -1}
            className="relative h-80 min-w-0 cursor-grab touch-none bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing sm:h-[29rem]"
            onKeyDown={(event) => {
              const vector = pan[event.key as keyof typeof pan]
              if (vector) move(vector[0], vector[1])
              else if (event.key === "+" || event.key === "=") move(0, 0, 0.8)
              else if (event.key === "-" || event.key === "−") move(0, 0, 1.25)
              else return
              event.preventDefault()
            }}
          />
        </div>
        <p id={helpId} className="sr-only">
          {m.keyboardControls}
        </p>
        {drawing && (
          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            <p className="hidden [@media(pointer:coarse)]:block">
              {m.touchControls}
            </p>
            <p className="[@media(pointer:coarse)]:hidden">{m.controls}</p>
          </div>
        )}
      </div>
    </section>
  )
}
