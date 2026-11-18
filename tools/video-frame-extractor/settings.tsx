import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import type { Timing } from "./core/timeline"
import type { Messages } from "./types"

export function TimingFields({
  messages: m,
  timing,
  onChange,
  onAddTime,
  error,
}: {
  messages: Messages
  timing: Timing
  onChange: (update: Partial<Timing>) => void
  onAddTime: () => void
  error: boolean
}) {
  return (
    <>
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-medium">{m.mode}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          {(["timestamps", "interval"] as const).map((mode) => (
            <label
              key={mode}
              className="flex min-h-10 cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-center text-sm text-muted-foreground has-checked:bg-background has-checked:font-medium has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-ring has-disabled:cursor-default"
            >
              <input
                type="radio"
                name="frame-mode"
                className="sr-only"
                checked={timing.mode === mode}
                onChange={() => onChange({ mode })}
              />
              {m[mode]}
            </label>
          ))}
        </div>
      </fieldset>
      {timing.mode === "timestamps" ? (
        <div className="grid gap-2">
          <Label htmlFor="frame-timestamps">{m.timestamps}</Label>
          <Textarea
            id="frame-timestamps"
            dir="ltr"
            className="min-h-16 font-mono"
            value={timing.timestamps}
            aria-invalid={error}
            aria-describedby={
              error
                ? "frame-timestamp-hint frame-settings-error"
                : "frame-timestamp-hint"
            }
            onChange={(event) =>
              onChange({ timestamps: event.currentTarget.value })
            }
          />
          <p
            id="frame-timestamp-hint"
            className="text-sm text-muted-foreground"
          >
            {m.timestampHint}
          </p>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 justify-self-start sm:min-h-0"
            onClick={onAddTime}
          >
            {m.useCurrentTime}
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="frame-interval">{m.intervalSeconds}</Label>
            <Input
              id="frame-interval"
              type="number"
              className="min-h-11 sm:min-h-0"
              inputMode="decimal"
              min="0.001"
              step="0.001"
              dir="ltr"
              value={timing.interval}
              aria-invalid={error}
              aria-describedby={error ? "frame-settings-error" : undefined}
              onChange={(event) =>
                onChange({ interval: event.currentTarget.value })
              }
            />
          </div>
          <div className="grid gap-3 min-[390px]:grid-cols-2">
            <div className="grid content-start gap-2">
              <Label htmlFor="frame-start">{m.startSeconds}</Label>
              <Input
                id="frame-start"
                type="number"
                className="min-h-11 sm:min-h-0"
                inputMode="decimal"
                min="0"
                step="0.001"
                dir="ltr"
                value={timing.start}
                aria-invalid={error}
                aria-describedby={error ? "frame-settings-error" : undefined}
                onChange={(event) =>
                  onChange({ start: event.currentTarget.value })
                }
              />
            </div>
            <div className="grid content-start gap-2">
              <Label htmlFor="frame-end">{m.endSeconds}</Label>
              <Input
                id="frame-end"
                type="number"
                className="min-h-11 sm:min-h-0"
                inputMode="decimal"
                min="0"
                step="0.001"
                value={timing.end}
                placeholder={m.videoEnd}
                aria-invalid={error}
                aria-describedby={error ? "frame-settings-error" : undefined}
                onChange={(event) =>
                  onChange({ end: event.currentTarget.value })
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
