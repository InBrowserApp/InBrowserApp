import { useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Plus, X } from "@workspace/ui/icons"
import { ViewerToolbar } from "./viewer-toolbar"
import { createViewport } from "./viewport"
import type Messages from "./messages/en.json"
import type { StepModel } from "./step-data"
import type { Viewport } from "./viewport"
import type { Vector3 } from "three"
import type { KeyboardEvent, PointerEvent } from "react"

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
  filename,
  lang,
  messages: m,
  focusOnOpen,
}: {
  model: StepModel
  filename: string
  lang: string
  messages: typeof Messages
  focusOnOpen: boolean
}) {
  const host = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null)
  const helpId = useId()
  const [viewport, setViewport] = useState<Viewport>()
  const [loadFailed, setLoadFailed] = useState(false)
  const [exportFailed, setExportFailed] = useState(false)
  const [unit, setUnit] = useState<Unit>("millimeter")
  const [measuring, setMeasuring] = useState(false)
  const [points, setPoints] = useState<Vector3[]>([])
  useEffect(() => {
    try {
      const viewer = createViewport(host.current!, model)
      setViewport(viewer)
      if (focusOnOpen && document.activeElement === document.body) {
        host.current?.focus({ preventScroll: true })
      }
      return () => viewer.dispose()
    } catch {
      setLoadFailed(true)
      return undefined
    }
  }, [model, focusOnOpen])

  const numberFormat = new Intl.NumberFormat(lang, {
    style: "unit",
    unit,
    unitDisplay: "short",
    maximumSignificantDigits: 5,
  })
  function format(mm: number) {
    return numberFormat.format(unit === "inch" ? mm / 25.4 : mm)
  }
  const [first, second] = points
  const distance =
    first && second ? `≈ ${format(first.distanceTo(second))}` : undefined

  function updatePoints(next: Vector3[]) {
    setPoints(next)
    viewport?.showMeasurement(next)
  }
  function selectPoint(x: number, y: number) {
    if (!measuring) return
    const point = viewport?.pick(x, y)
    if (point) updatePoints(first && !second ? [first, point] : [point])
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    pointer.current =
      event.button === 0 && event.isPrimary
        ? { id: event.pointerId, x: event.clientX, y: event.clientY }
        : null
  }
  function moved(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current
    return (
      !start ||
      start.id !== event.pointerId ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5
    )
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!viewport) return
    const direction = arrows[event.key]
    if (direction) viewport.rotate(...direction)
    else if (event.key === "+" || event.key === "=") viewport.zoom(0.8)
    else if (event.key === "-" || event.key === "−") viewport.zoom(1.25)
    else if (event.key === "Enter" && measuring) {
      const { left, top, width, height } =
        event.currentTarget.getBoundingClientRect()
      selectPoint(left + width / 2, top + height / 2)
    } else return
    event.preventDefault()
  }

  if (loadFailed)
    return (
      <Alert variant="destructive" className="m-3 w-auto">
        <AlertDescription>{m.renderError}</AlertDescription>
      </Alert>
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      {viewport && (
        <ViewerToolbar
          messages={m}
          viewport={viewport}
          measuring={measuring}
          onMeasure={() => setMeasuring(!measuring)}
          onSave={() => {
            setExportFailed(false)
            void viewport
              .save(filename, distance)
              .catch(() => setExportFailed(true))
          }}
        />
      )}
      <div
        ref={host}
        role="region"
        aria-label={m.viewport}
        aria-describedby={helpId}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The view supports camera and measurement keys.
        tabIndex={0}
        dir="ltr"
        className={`group/view relative h-[clamp(18rem,47dvh,35rem)] min-h-56 flex-1 touch-none overflow-hidden bg-slate-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring dark:bg-slate-900 ${measuring ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={onPointerDown}
        onPointerMove={(event) => {
          if (moved(event)) pointer.current = null
        }}
        onPointerUp={(event) => {
          if (!moved(event)) selectPoint(event.clientX, event.clientY)
          pointer.current = null
        }}
        onPointerCancel={() => {
          pointer.current = null
        }}
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
          <div
            className="flex min-h-11 shrink-0 items-center gap-2 border-t px-3 py-1 text-sm"
            aria-live="polite"
          >
            {distance ? (
              <>
                <span className="font-medium">
                  {m.distance}{" "}
                  <bdi className="ms-1 tabular-nums">{distance}</bdi>
                </span>
                <DocumentIconButton
                  label={m.clearMeasurement}
                  onClick={() => updatePoints([])}
                >
                  <X aria-hidden="true" />
                </DocumentIconButton>
              </>
            ) : measuring ? (
              <>
                <span>{first ? m.secondPoint : m.firstPoint}</span>
                {first && (
                  <DocumentIconButton
                    label={m.clearMeasurement}
                    onClick={() => updatePoints([])}
                  >
                    <X aria-hidden="true" />
                  </DocumentIconButton>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                <span className="pointer-coarse:hidden">{m.controls}</span>
                <span className="hidden pointer-coarse:inline">
                  {m.touchControls}
                </span>
              </p>
            )}
          </div>
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
          {exportFailed && (
            <Alert variant="destructive" className="m-3 w-auto">
              <AlertDescription>{m.exportError}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
