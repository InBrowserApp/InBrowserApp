import { useEffect, useId, useRef, useState } from "react"
import {
  Camera,
  LayoutGrid,
  Pause,
  Play,
  Plus,
  Ruler,
  Scan,
  X,
  ZoomIn,
  ZoomOut,
} from "../../../icons"
import { useWorkspaceFocus } from "../../../lib/use-workspace-focus"
import { cn } from "../../../lib/utils"
import { DocumentIconButton } from "../document-icon-button"
import { ViewportFocusButton, ViewportFrame } from "../viewport-focus"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import { modelLengthFormat } from "../../../lib/model-length-format"
import { useModelMeasurement } from "../../../lib/use-model-measurement"
import { createModelViewport } from "./viewport"
import type { KeyboardEvent } from "react"
import type { LengthUnit } from "../../../lib/model-length-format"
import type { OpenModel } from "./load-model"
import type { ModelViewerMessages } from "./messages"

const arrows: Record<string, [number, number]> = {
  ArrowLeft: [0.14, 0],
  ArrowRight: [-0.14, 0],
  ArrowUp: [0, -0.14],
  ArrowDown: [0, 0.14],
}

export default function ModelPanel({
  model,
  lang,
  messages: m,
}: {
  model: OpenModel
  lang: string
  messages: ModelViewerMessages
}) {
  const host = useRef<HTMLDivElement>(null)
  const helpId = useId()
  const focus = useWorkspaceFocus()
  const [viewportState, setViewportState] = useState<
    ReturnType<typeof createModelViewport> | "error"
  >()
  const viewport = viewportState === "error" ? undefined : viewportState
  const measurement = useModelMeasurement(viewport)
  const [wireframe, setWireframe] = useState(false)
  const [clip, setClip] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [unit, setUnit] = useState(model.unit)
  const [exportFailed, setExportFailed] = useState(false)
  useEffect(() => {
    try {
      const view = createModelViewport(host.current!, model)
      setViewportState(view)
      return () => view.dispose()
    } catch {
      setViewportState("error")
      return undefined
    }
  }, [model])

  if (viewportState === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.renderError}</AlertDescription>
      </Alert>
    )
  }

  const animations = model.animations ?? []
  const numberFormat = new Intl.NumberFormat(lang)
  const formatLength = modelLengthFormat(lang, model.unit, unit)
  const distance =
    measurement.distance === undefined
      ? undefined
      : `≈ ${formatLength(measurement.distance)}`
  const showMeasurement = measurement.active || distance !== undefined

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!viewport) return
    const direction = arrows[event.key]
    if (direction) {
      if (event.shiftKey) viewport.pan(direction[0] * 150, -direction[1] * 150)
      else viewport.rotate(...direction)
    } else if (event.key === "+" || event.key === "=") viewport.zoom(0.8)
    else if (event.key === "-" || event.key === "−") viewport.zoom(1.25)
    else if (event.key === "Enter" && measurement.active) {
      measurement.selectCenter(event.currentTarget)
    } else return
    event.preventDefault()
  }

  async function save() {
    setExportFailed(false)
    try {
      const label =
        distance && (unit ? distance : `${distance} · ${m.fileUnits}`)
      await viewport?.save(model.name, label)
    } catch {
      setExportFailed(true)
    }
  }

  return (
    <ViewportFrame label={m.viewport} focus={focus}>
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <DocumentIconButton label={m.fit} onClick={() => viewport?.fit()}>
            <Scan aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.zoomIn}
            onClick={() => viewport?.zoom(0.8)}
          >
            <ZoomIn aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.zoomOut}
            onClick={() => viewport?.zoom(1.25)}
          >
            <ZoomOut aria-hidden="true" />
          </DocumentIconButton>
          <Button
            size="sm"
            variant={wireframe ? "secondary" : "ghost"}
            aria-pressed={wireframe}
            onClick={() => {
              viewport?.setWireframe(!wireframe)
              setWireframe(!wireframe)
            }}
          >
            <LayoutGrid data-icon="inline-start" aria-hidden="true" />
            {m.wireframe}
          </Button>
          <Button
            size="sm"
            variant={measurement.active ? "secondary" : "ghost"}
            aria-pressed={measurement.active}
            disabled={!viewport}
            onClick={() => {
              if (playing) {
                viewport?.setPlayback(clip, false)
                setPlaying(false)
              }
              measurement.toggle()
            }}
          >
            <Ruler data-icon="inline-start" aria-hidden="true" />
            {m.measure}
          </Button>
        </div>
        {animations.length > 0 && (
          <div className="flex min-w-0 items-center gap-1">
            <select
              aria-label={m.animation}
              value={clip}
              className="h-8 max-w-44 min-w-0 truncate rounded-md border border-input bg-background px-2 text-sm"
              onChange={(event) => {
                const index = Number(event.target.value)
                measurement.clear()
                setClip(index)
                viewport?.setPlayback(index, playing)
              }}
            >
              {animations.map((animation, index) => (
                <option key={animation.uuid} value={index}>
                  {animation.name ||
                    m.clip.replace("{number}", numberFormat.format(index + 1))}
                </option>
              ))}
            </select>
            <DocumentIconButton
              label={playing ? m.pauseAnimation : m.playAnimation}
              disabled={!viewport}
              onClick={() => {
                if (!playing) measurement.reset()
                viewport?.setPlayback(clip, !playing)
                setPlaying(!playing)
              }}
            >
              {playing ? (
                <Pause aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
            </DocumentIconButton>
          </div>
        )}
        <div className="ms-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={!viewport}
            onClick={() => void save()}
          >
            <Camera data-icon="inline-start" aria-hidden="true" />
            {m.save}
          </Button>
          <ViewportFocusButton focus={focus} messages={m} />
        </div>
      </div>
      <div
        aria-live="polite"
        className={cn(
          showMeasurement &&
            "flex min-h-10 shrink-0 items-center gap-2 border-b px-3 py-1 text-sm"
        )}
      >
        {distance ? (
          <span className="font-medium">
            {m.distance} <bdi className="ms-1 tabular-nums">{distance}</bdi>
            {!unit && (
              <span className="ms-2 text-xs text-muted-foreground">
                {m.fileUnits}
              </span>
            )}
          </span>
        ) : measurement.active ? (
          <p>{measurement.count ? m.secondPoint : m.firstPoint}</p>
        ) : null}
        {measurement.count > 0 && (
          <DocumentIconButton
            label={m.clearMeasurement}
            onClick={measurement.clear}
          >
            <X aria-hidden="true" />
          </DocumentIconButton>
        )}
      </div>
      <div
        ref={host}
        className={cn(
          "group/view relative h-80 min-h-0 touch-none bg-muted outline-none group-data-focus/viewport:flex-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:h-[29rem]",
          measurement.active
            ? "cursor-crosshair"
            : "cursor-grab active:cursor-grabbing"
        )}
        role="region"
        aria-label={m.viewport}
        aria-describedby={helpId}
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight Enter"
        dir="ltr"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The viewport supports keyboard camera and measurement controls.
        tabIndex={0}
        {...measurement.pointerHandlers}
        onKeyDown={onKeyDown}
      >
        {measurement.active && (
          <Plus
            aria-hidden="true"
            className="pointer-events-none absolute start-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-orange-600 drop-shadow-sm group-focus-visible/view:block dark:text-orange-300"
          />
        )}
      </div>
      <p id={helpId} className="sr-only">
        {m.keyboardControls}
      </p>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-5 gap-y-1 border-t px-3 py-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p>
            {m.overall}{" "}
            <bdi className="font-mono text-foreground" dir="ltr">
              {(["x", "y", "z"] as const)
                .map(
                  (axis) =>
                    `${axis.toUpperCase()} ${formatLength(model.size[axis])}`
                )
                .join(" · ")}
            </bdi>
          </p>
          {model.unit ? (
            <select
              aria-label={m.unit}
              value={unit}
              className="h-8 max-w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
              onChange={(event) => setUnit(event.target.value as LengthUnit)}
            >
              <option value="millimeter">{m.millimeters}</option>
              <option value="meter">{m.meters}</option>
              <option value="inch">{m.inches}</option>
            </select>
          ) : (
            <span>{m.fileUnits}</span>
          )}
        </div>
        <p className="hidden pointer-coarse:block">{m.touchControls}</p>
        <p className="pointer-coarse:hidden">{m.controls}</p>
      </div>
      {exportFailed && (
        <Alert variant="destructive" className="m-2 w-auto">
          <AlertDescription>{m.exportError}</AlertDescription>
        </Alert>
      )}
    </ViewportFrame>
  )
}
