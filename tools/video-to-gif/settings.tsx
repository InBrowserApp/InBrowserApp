import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Slider } from "@workspace/ui/components/ui/slider"
import { milliseconds } from "./core/plan"
import type { Settings, VideoInfo } from "./core/plan"
import type { Messages } from "./types"

const FRAME_RATES = [5, 8, 10, 12, 15, 20]

export function GifSettings({
  messages: m,
  settings,
  info,
  error,
  onChange,
  scrubTo,
}: {
  messages: Messages
  settings: Settings
  info: VideoInfo
  error?: "rangeError" | "widthError" | "workLimit"
  onChange: (update: Partial<Settings>) => void
  scrubTo: (seconds: number) => void
}) {
  const start = Math.max(
    0,
    Math.min(info.duration - 1, milliseconds(settings.start) || 0)
  )
  const endInput = milliseconds(settings.end)
  const end = Math.max(
    start + 1,
    Math.min(info.duration, Number.isNaN(endInput) ? info.duration : endInput)
  )
  return (
    <>
      <div className="grid gap-1">
        <h2 className="font-semibold">{m.clip}</h2>
        <p id="gif-clip-hint" className="text-sm text-muted-foreground">
          {m.clipRange}
        </p>
        <Slider
          dir="ltr"
          className="my-1 min-h-8 [&_[data-slot=slider-thumb]]:size-4"
          value={[start / 1000, end / 1000]}
          max={info.duration / 1000}
          step={Math.min(0.01, info.duration / 1000)}
          minStepsBetweenThumbs={1}
          thumbLabels={[m.start, m.end]}
          aria-describedby="gif-clip-hint"
          onValueChange={([nextStart = start / 1000, nextEnd = end / 1000]) => {
            onChange({ start: String(nextStart), end: String(nextEnd) })
            scrubTo(nextStart !== start / 1000 ? nextStart : nextEnd)
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          {(["start", "end"] as const).map((field) => (
            <div className="grid content-start gap-2" key={field}>
              <Label htmlFor={`gif-${field}`}>{m[field]}</Label>
              <Input
                id={`gif-${field}`}
                type="number"
                inputMode="decimal"
                min={0}
                max={info.duration / 1000}
                step={0.001}
                dir="ltr"
                className="min-h-11 tabular-nums sm:min-h-0"
                value={settings[field]}
                aria-invalid={error === "rangeError"}
                aria-describedby={
                  error === "rangeError" ? "gif-settings-error" : undefined
                }
                onChange={(event) =>
                  onChange({ [field]: event.currentTarget.value })
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid content-start gap-2">
          <Label htmlFor="gif-fps">{m.frameRate}</Label>
          <select
            id="gif-fps"
            value={settings.fps}
            className="h-11 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:h-9"
            onChange={(event) =>
              onChange({ fps: Number(event.currentTarget.value) })
            }
          >
            {FRAME_RATES.map((fps) => (
              <option key={fps} value={fps}>
                {fps}
              </option>
            ))}
          </select>
        </div>
        <div className="grid content-start gap-2">
          <Label htmlFor="gif-width">{m.width}</Label>
          <Input
            id="gif-width"
            type="number"
            inputMode="numeric"
            min={1}
            max={info.maxWidth}
            dir="ltr"
            className="min-h-11 tabular-nums sm:min-h-0"
            value={settings.width}
            aria-invalid={error === "widthError"}
            aria-describedby={
              error === "widthError" ? "gif-settings-error" : undefined
            }
            onChange={(event) => onChange({ width: event.currentTarget.value })}
          />
        </div>
      </div>
    </>
  )
}
