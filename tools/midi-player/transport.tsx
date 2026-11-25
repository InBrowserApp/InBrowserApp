import { useEffect, useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "@workspace/ui/icons"

import { usePlayback } from "./use-playback"
import type { MidiSource } from "./midi-source"
import type english from "./messages/en.json"

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

function timeText(seconds: number, lang: string) {
  const number = new Intl.NumberFormat(lang, { useGrouping: false })
  const padding = new Intl.NumberFormat(lang, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  const total = Math.floor(seconds)
  return `${number.format(Math.floor(total / 60))}:${padding.format(total % 60)}`
}

export function MidiTransport({
  source,
  messages: m,
  language,
}: {
  source: MidiSource
  messages: typeof english
  language: string
}) {
  const playback = usePlayback(source)
  const playButton = useRef<HTMLButtonElement>(null)
  const busy = playback.loading || playback.mixing
  const format = new Intl.NumberFormat(language)
  const current = timeText(playback.position, language)
  const duration = timeText(source.duration, language)

  useEffect(() => {
    if (document.activeElement === document.body) {
      playButton.current?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-4 rounded-xl border bg-card p-4 sm:p-6">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Button
              ref={playButton}
              type="button"
              size="lg"
              className="h-auto min-h-11 min-w-28 whitespace-normal aria-disabled:opacity-50"
              aria-disabled={busy}
              onClick={() => {
                if (!busy) void playback.playPause()
              }}
            >
              {busy ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                />
              ) : playback.playing ? (
                <Pause aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
              {playback.loading
                ? m.loading
                : playback.mixing
                  ? m.mixing
                  : playback.playing
                    ? m.pause
                    : m.play}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-11"
              aria-label={m.restart}
              title={m.restart}
              disabled={busy}
              onClick={() => playback.seek(0)}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-2" dir="ltr">
            <input
              type="range"
              className="block w-full cursor-pointer accent-primary disabled:opacity-50"
              min={0}
              max={source.duration}
              step="0.05"
              value={playback.position}
              disabled={busy}
              onChange={(event) =>
                playback.seek(event.currentTarget.valueAsNumber)
              }
              aria-label={m.position}
              aria-valuetext={current}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
              <span>{current}</span>
              <span>{duration}</span>
            </div>
          </div>
          {playback.error && (
            <p role="alert" className="text-sm text-destructive">
              {m[playback.error]}
            </p>
          )}
        </div>
        <div className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            {m.speed}
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring/50"
              value={playback.settings.rate}
              onChange={(event) =>
                playback.updateSettings({
                  ...playback.settings,
                  rate: Number(event.currentTarget.value),
                })
              }
            >
              {speeds.map((rate) => (
                <option key={rate} value={rate}>
                  {format.format(rate)}×
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-medium">
            {m.loop}
            <Switch
              dir="ltr"
              checked={playback.settings.loop}
              onCheckedChange={(loop) =>
                playback.updateSettings({ ...playback.settings, loop })
              }
            />
          </label>
        </div>
      </div>
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-medium">{m.tracks}</h2>
        <ul className="max-h-64 overflow-y-auto rounded-md border">
          {source.tracks.map((track, index) => {
            const name =
              track.name ||
              m.trackName.replace("{number}", format.format(index + 1))
            const muted = playback.muted.has(track.index)
            return (
              <li
                key={track.index}
                className="flex min-w-0 items-center justify-between gap-2 border-b px-3 py-1.5 text-sm last:border-0"
              >
                <bdi className="min-w-0 wrap-anywhere">{name}</bdi>
                <Button
                  type="button"
                  variant={muted ? "secondary" : "ghost"}
                  size="sm"
                  className="h-auto min-h-9 shrink-0 whitespace-normal"
                  aria-label={(muted ? m.unmuteTrack : m.muteTrack).replace(
                    "{track}",
                    name
                  )}
                  aria-disabled={busy}
                  onClick={() => void playback.toggleTrack(track.index)}
                >
                  {muted ? (
                    <VolumeX aria-hidden="true" />
                  ) : (
                    <Volume2 aria-hidden="true" />
                  )}
                  {muted ? m.unmute : m.mute}
                </Button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
