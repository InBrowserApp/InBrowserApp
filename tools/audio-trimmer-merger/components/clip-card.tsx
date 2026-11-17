import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  ArrowDown,
  ArrowUp,
  Play,
  Square,
  Trash2,
  Undo2,
  Copy,
} from "@workspace/ui/icons"
import {
  formatDuration,
  frameRange,
  SAMPLE_RATE,
  validRange,
} from "../core/audio"
import type { AudioClip, AudioEditorMessages } from "../types"

export function ClipCard({
  clip,
  index,
  count,
  messages: m,
  disabled,
  playing,
  onRange,
  onMove,
  onRemove,
  onDuplicate,
  onPlay,
  onStop,
}: {
  clip: AudioClip
  index: number
  count: number
  messages: AudioEditorMessages
  disabled: boolean
  playing: boolean
  onRange: (range: { start: number; end: number }) => void
  onMove: (direction: number) => void
  onRemove: () => void
  onDuplicate: () => void
  onPlay: () => void
  onStop: () => void
}) {
  const id = useId()
  const valid = validRange(clip.start, clip.end, clip.buffer.duration)
  const [first, last] = frameRange(clip.start, clip.end, clip.buffer.length)
  const position = (time: number) =>
    Number.isFinite(time)
      ? Math.max(0, Math.min(100, (time / clip.buffer.duration) * 100))
      : 0
  const start = position(clip.start)
  const end = position(clip.end)
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Badge variant="secondary">{index + 1}</Badge>
          <CardTitle
            className="min-w-0 [overflow-wrap:anywhere] break-words"
            title={clip.name}
          >
            <bdi>{clip.name}</bdi>
          </CardTitle>
        </div>
        <div className="flex shrink-0 gap-1 self-end">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={disabled || index === 0}
            aria-label={m.moveUpButton}
            title={m.moveUpButton}
            onClick={() => onMove(-1)}
          >
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={disabled || index === count - 1}
            aria-label={m.moveDownButton}
            title={m.moveDownButton}
            onClick={() => onMove(1)}
          >
            <ArrowDown aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={disabled}
            aria-label={m.duplicateButton}
            title={m.duplicateDescription}
            onClick={onDuplicate}
          >
            <Copy aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={disabled}
            aria-label={m.removeButton}
            title={m.removeButton}
            onClick={onRemove}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div dir="ltr" className="flex flex-col gap-3">
          <div
            className="relative overflow-hidden rounded-md border bg-muted/40"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 border-x-2 border-primary bg-primary/10"
              style={{
                left: `${start}%`,
                width: `${Math.max(0, end - start)}%`,
              }}
            />
            <svg
              viewBox="0 0 720 88"
              preserveAspectRatio="none"
              className="relative h-24 w-full text-primary"
            >
              {clip.peaks.map((peak, i) => (
                <rect
                  key={i}
                  x={i * 4}
                  y={44 - Math.max(1, peak * 39)}
                  width={2}
                  height={Math.max(2, peak * 78)}
                  rx={1}
                  fill="currentColor"
                  opacity={
                    (i / clip.peaks.length) * 100 >= start &&
                    (i / clip.peaks.length) * 100 <= end
                      ? 1
                      : 0.25
                  }
                />
              ))}
            </svg>
          </div>
          <Slider
            dir="ltr"
            disabled={disabled}
            thumbLabels={[m.startLabel, m.endLabel]}
            min={0}
            max={clip.buffer.duration}
            step={0.001}
            minStepsBetweenThumbs={1}
            value={valid ? [clip.start, clip.end] : [0, clip.buffer.duration]}
            onValueChange={(values) =>
              onRange({ start: values[0]!, end: values[1]! })
            }
          />
          <div className="flex justify-between font-mono text-xs text-muted-foreground tabular-nums">
            <span>0:00.000</span>
            <span>{formatDuration(clip.buffer.duration)}</span>
          </div>
        </div>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!valid}>
            <FieldLabel htmlFor={`${id}-start`}>{m.startLabel}</FieldLabel>
            <Input
              id={`${id}-start`}
              name="clip-start"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              min={0}
              max={clip.buffer.duration}
              step="0.001"
              dir="ltr"
              disabled={disabled}
              aria-invalid={!valid}
              aria-describedby={!valid ? `${id}-error` : undefined}
              value={Number.isNaN(clip.start) ? "" : clip.start}
              onChange={(event) =>
                onRange({ start: event.target.valueAsNumber, end: clip.end })
              }
            />
          </Field>
          <Field data-invalid={!valid}>
            <FieldLabel htmlFor={`${id}-end`}>{m.endLabel}</FieldLabel>
            <Input
              id={`${id}-end`}
              name="clip-end"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              min={0}
              max={clip.buffer.duration}
              step="0.001"
              dir="ltr"
              disabled={disabled}
              aria-invalid={!valid}
              aria-describedby={!valid ? `${id}-error` : undefined}
              value={Number.isNaN(clip.end) ? "" : clip.end}
              onChange={(event) =>
                onRange({ start: clip.start, end: event.target.valueAsNumber })
              }
            />
          </Field>
        </FieldGroup>
        {!valid ? (
          <FieldError id={`${id}-error`}>{m.rangeError}</FieldError>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={disabled || !valid}
              onClick={playing ? onStop : onPlay}
            >
              {playing ? (
                <Square data-icon="inline-start" aria-hidden="true" />
              ) : (
                <Play data-icon="inline-start" aria-hidden="true" />
              )}
              {playing ? m.stopButton : m.previewButton}
            </Button>
            <Button
              variant="ghost"
              type="button"
              disabled={disabled}
              onClick={() => onRange({ start: 0, end: clip.buffer.duration })}
            >
              <Undo2 data-icon="inline-start" aria-hidden="true" />
              {m.resetButton}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {m.durationLabel}:{" "}
            <bdi className="font-mono tabular-nums">
              {valid ? formatDuration((last - first) / SAMPLE_RATE) : "—"}
            </bdi>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
