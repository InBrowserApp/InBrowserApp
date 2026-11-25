import { useEffect, useId, useRef, useState } from "react"
import { modelLengthFormat } from "@workspace/ui/lib/model-length-format"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { createMeshConverterWorker } from "@workspace/ui/lib/mesh-converter-worker"
import { useMeshWorker } from "@workspace/ui/lib/use-mesh-worker"
import { useModelMeasurement } from "@workspace/ui/lib/use-model-measurement"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Plus, X } from "@workspace/ui/icons"
import { ViewerToolbar } from "./viewer-toolbar"
import { createViewport } from "./viewport"
import type Messages from "./messages/en.json"
import type { StepModel } from "./step-data"
import type { Viewport } from "./viewport"
import type { KeyboardEvent } from "react"

const axes = ["X", "Y", "Z"] as const
const arrows: Record<string, [number, number]> = {
  ArrowLeft: [0.12, 0],
  ArrowRight: [-0.12, 0],
  ArrowUp: [0, -0.12],
  ArrowDown: [0, 0.12],
}

type Unit = "millimeter" | "inch"

export default function ModelPanel({
  model,
  file,
  lang,
  messages: m,
  focusOnOpen,
}: {
  model: StepModel
  file: File
  lang: string
  messages: typeof Messages
  focusOnOpen: boolean
}) {
  const host = useRef<HTMLDivElement>(null)
  const helpId = useId()
  const [viewportState, setViewportState] = useState<Viewport | "error">()
  const [exportFailed, setExportFailed] = useState(false)
  const [unit, setUnit] = useState<Unit>("millimeter")
  const viewport = viewportState === "error" ? undefined : viewportState
  const measurement = useModelMeasurement(viewport)
  const measuring = measurement.active
  const {
    result: stl,
    status: stlStatus,
    run: exportStl,
  } = useMeshWorker<Blob>(
    async () => file,
    createMeshConverterWorker,
    (input) => ({ file: input, format: "step" })
  )
  useEffect(() => {
    if (stl)
      downloadBlob(
        stl.data,
        `${stl.name.replace(/\.[^.]*$/, "") || "model"}.stl`
      )
  }, [stl])
  useEffect(() => {
    try {
      const viewer = createViewport(host.current!, model)
      setViewportState(viewer)
      if (focusOnOpen && document.activeElement === document.body) {
        host.current?.focus({ preventScroll: true })
      }
      return () => viewer.dispose()
    } catch {
      setViewportState("error")
      return undefined
    }
  }, [model, focusOnOpen])

  if (viewportState === "error") {
    return (
      <Alert variant="destructive" className="m-3 w-auto">
        <AlertDescription>{m.renderError}</AlertDescription>
      </Alert>
    )
  }

  const format = modelLengthFormat(lang, "millimeter", unit)
  const distance =
    measurement.distance === undefined
      ? undefined
      : `≈ ${format(measurement.distance)}`

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!viewport) return
    const direction = arrows[event.key]
    if (direction) {
      if (event.shiftKey) viewport.pan(direction[0] * 150, -direction[1] * 150)
      else viewport.rotate(...direction)
    } else if (event.key === "+" || event.key === "=") viewport.zoom(0.8)
    else if (event.key === "-" || event.key === "−") viewport.zoom(1.25)
    else if (event.key === "Enter" && measuring) {
      measurement.selectCenter(event.currentTarget)
    } else return
    event.preventDefault()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      {viewport && (
        <ViewerToolbar
          messages={m}
          viewport={viewport}
          measuring={measuring}
          onMeasure={measurement.toggle}
          onSaveStl={() => void exportStl(file)}
          savingStl={stlStatus === "working"}
          onSave={() => {
            setExportFailed(false)
            void viewport
              .save(file.name, distance)
              .catch(() => setExportFailed(true))
          }}
        />
      )}
      {viewport && (
        <div
          className="flex min-h-11 shrink-0 items-center gap-2 border-b px-3 py-1 text-sm"
          aria-live="polite"
        >
          {distance ? (
            <span className="font-medium">
              {m.distance} <bdi className="ms-1 tabular-nums">{distance}</bdi>
            </span>
          ) : measuring ? (
            <span>{measurement.count ? m.secondPoint : m.firstPoint}</span>
          ) : (
            <p className="text-xs text-muted-foreground">
              <span className="pointer-coarse:hidden">{m.controls}</span>
              <span className="hidden pointer-coarse:inline">
                {m.touchControls}
              </span>
            </p>
          )}
          {measurement.count > 0 && (
            <DocumentIconButton
              label={m.clearMeasurement}
              onClick={measurement.clear}
            >
              <X aria-hidden="true" />
            </DocumentIconButton>
          )}
        </div>
      )}
      <div
        ref={host}
        role="region"
        aria-label={m.viewport}
        aria-describedby={helpId}
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight Enter"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The view supports camera and measurement keys.
        tabIndex={0}
        dir="ltr"
        data-suppress-language-suggestion={Boolean(viewport) || undefined}
        className={`group/view relative h-[clamp(17rem,38dvh,23rem)] min-h-56 flex-auto touch-none overflow-hidden bg-slate-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:h-[clamp(22rem,48dvh,35rem)] dark:bg-slate-900 ${measuring ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
        {...measurement.pointerHandlers}
        onKeyDown={onKeyDown}
      >
        {measuring && (
          <Plus
            aria-hidden="true"
            className="pointer-events-none absolute start-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-orange-600 drop-shadow-sm group-focus-visible/view:block dark:text-orange-300"
          />
        )}
      </div>
      <span id={helpId} className="sr-only">
        {m.keyboardControls}
      </span>
      {viewport && (
        <>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t bg-muted/25 px-3 py-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-medium">{m.overall}</span>
              <dl className="flex flex-wrap gap-x-4 gap-y-1 tabular-nums">
                {axes.map((axis, index) => (
                  <div key={axis} className="flex items-baseline gap-1.5">
                    <dt className="text-xs font-medium text-muted-foreground">
                      {axis}
                    </dt>
                    <dd>
                      <bdi>{format(model.size[index]!)}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <select
              aria-label={m.unit}
              value={unit}
              className="h-8 max-w-full rounded-md border border-input bg-background px-2 text-sm"
              onChange={(event) => setUnit(event.target.value as Unit)}
            >
              <option value="millimeter">{m.millimeters}</option>
              <option value="inch">{m.inches}</option>
            </select>
          </div>
          {(exportFailed || stlStatus === "failed") && (
            <Alert variant="destructive" className="m-3 w-auto">
              <AlertDescription>
                {stlStatus === "failed" ? m.stlExportError : m.exportError}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
