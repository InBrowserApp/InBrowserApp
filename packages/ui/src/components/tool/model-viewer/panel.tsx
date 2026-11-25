import { useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "../document-icon-button"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import {
  LayoutGrid,
  Maximize2,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
} from "../../../icons"
import { createModelViewport } from "./viewport"
import type { KeyboardEvent } from "react"
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
  const [viewport, setViewport] = useState<
    ReturnType<typeof createModelViewport> | "error"
  >()
  const [wireframe, setWireframe] = useState(false)
  const [clip, setClip] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    try {
      const view = createModelViewport(host.current!, model)
      setViewport(view)
      return () => view.dispose()
    } catch {
      setViewport("error")
      return undefined
    }
  }, [model])

  if (viewport === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.renderError}</AlertDescription>
      </Alert>
    )
  }
  const animations = model.animations ?? []
  const numberFormat = new Intl.NumberFormat(lang)
  const dimensions = new Intl.NumberFormat(lang, {
    maximumSignificantDigits: 5,
    ...(model.unit && {
      style: "unit",
      unit: model.unit,
      unitDisplay: "short",
    }),
  })
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!viewport || viewport === "error") return
    const direction = arrows[event.key]
    if (direction) {
      if (event.shiftKey) viewport.pan(direction[0] * 150, -direction[1] * 150)
      else viewport.rotate(...direction)
    } else if (event.key === "+" || event.key === "=") viewport.zoom(0.8)
    else if (event.key === "-" || event.key === "−") viewport.zoom(1.25)
    else return
    event.preventDefault()
  }
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="flex flex-wrap items-center gap-1.5 border-b bg-background px-2 py-1.5">
        <DocumentIconButton label={m.fit} onClick={() => viewport?.fit()}>
          <Maximize2 aria-hidden="true" />
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
        {animations.length > 0 && (
          <div className="ms-auto flex min-w-0 flex-wrap items-center justify-end gap-1.5">
            <Select
              value={String(clip)}
              onValueChange={(value) => {
                const index = Number(value)
                setClip(index)
                viewport?.setPlayback(index, playing)
              }}
            >
              <SelectTrigger
                size="sm"
                className="max-w-44"
                aria-label={m.animation}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {animations.map((animation, index) => (
                    <SelectItem key={animation.uuid} value={String(index)}>
                      {animation.name ||
                        m.clip.replace(
                          "{number}",
                          numberFormat.format(index + 1)
                        )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <DocumentIconButton
              label={playing ? m.pauseAnimation : m.playAnimation}
              disabled={!viewport}
              onClick={() => {
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
      </div>
      <div
        ref={host}
        className="relative h-80 cursor-grab touch-none bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing sm:h-[29rem]"
        role="region"
        aria-label={m.viewport}
        aria-describedby={helpId}
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight + -"
        dir="ltr"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The viewport supports keyboard camera controls.
        tabIndex={0}
        onKeyDown={onKeyDown}
      />
      <p id={helpId} className="sr-only">
        {m.keyboardControls}
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t px-3 py-2 text-xs text-muted-foreground">
        <p>
          {m.overall}{" "}
          <bdi className="font-mono text-foreground" dir="ltr">
            {(["x", "y", "z"] as const)
              .map(
                (axis) =>
                  `${axis.toUpperCase()} ${dimensions.format(model.size[axis])}`
              )
              .join(" · ")}
          </bdi>
        </p>
        <p className="hidden [@media(pointer:coarse)]:block">
          {m.touchControls}
        </p>
        <p className="[@media(pointer:coarse)]:hidden">{m.controls}</p>
      </div>
    </div>
  )
}
