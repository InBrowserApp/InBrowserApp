import { useEffect, useRef, useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Trash2, TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import {
  clamp,
  createGradientCss,
  formatColor,
  normalizeHexColor,
} from "../core/gradient"

import type { GradientLayer, GradientStop } from "../core/gradient"
import type { CssGradientGeneratorMessages } from "../types"

type StopsCardProps = Readonly<{
  activeLayer: GradientLayer
  activeStopId: string
  messages: CssGradientGeneratorMessages
  onAddStop: () => void
  onAddStopAtPosition: (position: number) => void
  onRemoveStop: (stopId: string) => void
  onSelectStop: (stopId: string) => void
  onStopColorChange: (stopId: string, color: string) => void
  onStopPositionChange: (stopId: string, position: number) => void
  showError: boolean
}>

function StopRow({
  active,
  messages,
  onColorChange,
  onPositionChange,
  onRemove,
  onSelect,
  stop,
}: Readonly<{
  active: boolean
  messages: CssGradientGeneratorMessages
  onColorChange: (color: string) => void
  onPositionChange: (position: number) => void
  onRemove: () => void
  onSelect: () => void
  stop: GradientStop
}>) {
  const [colorDraft, setColorDraft] = useState(stop.color)

  useEffect(() => {
    setColorDraft(stop.color)
  }, [stop.color])

  function commitColor() {
    const nextColor = normalizeHexColor(colorDraft)
    setColorDraft(nextColor)
    onColorChange(nextColor)
  }

  return (
    <div
      className={cn(
        "grid gap-3 rounded-2xl border p-4 transition-colors",
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
      onFocusCapture={onSelect}
      onPointerDown={onSelect}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 size-8 shrink-0 rounded-lg border border-black/10 shadow-sm"
          style={{ backgroundColor: formatColor(stop.color, "rgba") }}
        />
        <div className="grid flex-1 gap-3">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
            <div className="grid gap-1">
              <div className="text-xs font-medium text-muted-foreground">
                {messages.stopColor}
              </div>
              <Input
                aria-label={messages.stopColor}
                onBlur={commitColor}
                onChange={(event) => {
                  setColorDraft(event.target.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    commitColor()
                  }
                }}
                placeholder="#0EA5E9FF"
                value={colorDraft}
              />
            </div>

            <div className="grid gap-1">
              <div className="text-xs font-medium text-muted-foreground">
                {messages.stopPosition}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  aria-label={messages.stopPosition}
                  onChange={(event) => {
                    onPositionChange(Number(event.target.value))
                  }}
                  type="number"
                  value={Math.round(stop.position)}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <Slider
            max={100}
            min={0}
            onValueChange={(values) => {
              onPositionChange(values[0] ?? stop.position)
            }}
            value={[stop.position]}
          />
        </div>

        <Button onClick={onRemove} size="sm" type="button" variant="ghost">
          <Trash2 data-icon="inline-start" />
          {messages.deleteStop}
        </Button>
      </div>
    </div>
  )
}

function StopsCard({
  activeLayer,
  activeStopId,
  messages,
  onAddStop,
  onAddStopAtPosition,
  onRemoveStop,
  onSelectStop,
  onStopColorChange,
  onStopPositionChange,
  showError,
}: StopsCardProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [draggingStopId, setDraggingStopId] = useState<string | null>(null)

  useEffect(() => {
    if (!draggingStopId) {
      return
    }

    const draggingId = draggingStopId

    function updatePosition(clientX: number) {
      const track = trackRef.current
      if (!track) {
        return
      }

      const rect = track.getBoundingClientRect()
      if (!rect.width) {
        return
      }

      onStopPositionChange(
        draggingId,
        clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
      )
    }

    function handlePointerMove(event: PointerEvent) {
      updatePosition(event.clientX)
    }

    function handlePointerUp() {
      setDraggingStopId(null)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [draggingStopId, onStopPositionChange])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{messages.stopsTitle}</CardTitle>
            <CardDescription>{messages.trackHint}</CardDescription>
          </div>

          <Button onClick={onAddStop} size="sm" type="button">
            {messages.addStop}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        {showError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{messages.minStopsHint}</AlertDescription>
          </Alert>
        ) : null}

        <div
          className="relative h-16 rounded-2xl border bg-slate-100 shadow-inner"
          data-testid="gradient-track"
          onPointerDown={(event) => {
            const track = trackRef.current
            if (!track || event.target !== event.currentTarget) {
              return
            }

            const rect = track.getBoundingClientRect()
            onAddStopAtPosition(
              ((event.clientX - rect.left) / rect.width) * 100
            )
          }}
          ref={trackRef}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ backgroundImage: createGradientCss(activeLayer, "hex") }}
          />
          {activeLayer.stops.map((stop) => (
            <button
              aria-label={
                messages.stopPosition + " " + Math.round(stop.position)
              }
              className={cn(
                "absolute top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110",
                stop.id === activeStopId ? "ring-2 ring-primary" : ""
              )}
              key={stop.id}
              onClick={() => {
                onSelectStop(stop.id)
              }}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onSelectStop(stop.id)
                setDraggingStopId(stop.id)
              }}
              style={{
                backgroundColor: formatColor(stop.color, "rgba"),
                left: stop.position + "%",
              }}
              type="button"
            />
          ))}
        </div>

        <div className="grid gap-3">
          {activeLayer.stops.map((stop) => (
            <StopRow
              active={stop.id === activeStopId}
              key={stop.id}
              messages={messages}
              onColorChange={(color) => {
                onStopColorChange(stop.id, color)
              }}
              onPositionChange={(position) => {
                onStopPositionChange(stop.id, position)
              }}
              onRemove={() => {
                onRemoveStop(stop.id)
              }}
              onSelect={() => {
                onSelectStop(stop.id)
              }}
              stop={stop}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { StopsCard }
