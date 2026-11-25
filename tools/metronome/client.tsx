import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Hand, Minus, Play, Plus, Square } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { playMetronome, type MetronomeSettings } from "./playback"
import {
  limitTempo,
  maxBpm,
  minBpm,
  readTempo,
  recordTap,
  tapTimeoutMs,
} from "./tempo"
import type englishMessages from "./messages/en.json"

const defaults: MetronomeSettings = {
  bpm: 120,
  beats: 4,
  division: 1,
  accent: true,
  sound: true,
}

const selectStyle =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring/50"

type Playback = { audio: AudioContext; stop?: () => void }

function disposePlayback(playback: Playback | null) {
  if (!playback) return
  playback.stop?.()
  void playback.audio.close()
}

export default function Metronome({
  lang,
  messages: m,
}: {
  lang: string
  messages: typeof englishMessages
}) {
  const [settings, setSettings] = useState(defaults)
  const [draft, setDraft] = useState(String(defaults.bpm))
  const [playing, setPlaying] = useState(false)
  const [activeBeat, setActiveBeat] = useState<number | null>(null)
  const [tapPending, setTapPending] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const current = useRef(settings)
  const playback = useRef<Playback | null>(null)
  const taps = useRef<number[]>([])

  useEffect(() => {
    current.current = settings
  }, [settings])

  useEffect(
    () => () => {
      disposePlayback(playback.current)
      playback.current = null
    },
    []
  )

  useEffect(() => {
    if (!tapPending) return
    const timeout = window.setTimeout(() => setTapPending(false), tapTimeoutMs)
    return () => window.clearTimeout(timeout)
  }, [tapPending])

  function update<K extends keyof MetronomeSettings>(
    key: K,
    value: MetronomeSettings[K]
  ) {
    setSettings((previous) => ({ ...previous, [key]: value }))
  }

  function changeTempo(value: number) {
    const next = limitTempo(value)
    update("bpm", next)
    setDraft(String(next))
  }

  function tapTempo() {
    const result = recordTap(taps.current, performance.now())
    taps.current = result.taps
    setTapPending(result.bpm === null)
    if (result.bpm !== null) changeTempo(result.bpm)
  }

  function stopPlaying() {
    disposePlayback(playback.current)
    playback.current = null
    setPlaying(false)
    setActiveBeat(null)
  }

  async function togglePlayback() {
    if (playback.current) {
      stopPlaying()
      return
    }
    setAudioError(false)
    let run: Playback | undefined
    try {
      run = { audio: new AudioContext() }
      playback.current = run
      setPlaying(true)
      await run.audio.resume()
      if (playback.current === run) {
        run.stop = playMetronome(
          run.audio,
          () => current.current,
          setActiveBeat
        )
      }
    } catch {
      if (run && playback.current !== run) return
      stopPlaying()
      setAudioError(true)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <label htmlFor="metronome-tempo" className="text-sm font-medium">
            {m.tempo}
          </label>
          <div className="flex items-center gap-3" dir="ltr">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={m.slower}
              disabled={settings.bpm === minBpm}
              onClick={() => changeTempo(settings.bpm - 1)}
            >
              <Minus />
            </Button>
            <Input
              id="metronome-tempo"
              inputMode="numeric"
              value={draft}
              className="h-16 w-28 text-center font-heading text-4xl tabular-nums md:text-4xl"
              onChange={(event) => {
                const { value } = event.currentTarget
                setDraft(value)
                const bpm = readTempo(value, lang)
                if (bpm !== null && bpm >= minBpm && bpm <= maxBpm) {
                  update("bpm", Math.round(bpm))
                }
              }}
              onBlur={() => changeTempo(readTempo(draft, lang) ?? settings.bpm)}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur()
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={m.faster}
              disabled={settings.bpm === maxBpm}
              onClick={() => changeTempo(settings.bpm + 1)}
            >
              <Plus />
            </Button>
          </div>
          <input
            type="range"
            aria-label={m.tempo}
            min={minBpm}
            max={maxBpm}
            value={settings.bpm}
            onChange={(event) => changeTempo(event.currentTarget.valueAsNumber)}
            className="w-full cursor-pointer accent-primary focus-visible:rounded-full"
          />
        </div>
        <div
          aria-hidden="true"
          className="flex max-w-full items-center justify-center gap-1.5 sm:gap-2"
        >
          {Array.from({ length: settings.beats }, (_, beat) => (
            <span
              key={beat}
              className={cn(
                "aspect-square w-5 min-w-0 rounded-full border",
                activeBeat === beat
                  ? "border-primary bg-primary"
                  : "border-border bg-muted",
                beat === 0 && settings.accent && "border-foreground/40"
              )}
            />
          ))}
        </div>
        <div className="grid w-full max-w-md grid-cols-2 gap-2">
          <Button type="button" size="lg" onClick={() => void togglePlayback()}>
            {playing ? <Square /> : <Play />}
            {playing ? m.stop : m.start}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-auto min-h-10 whitespace-normal"
            onClick={tapTempo}
          >
            <Hand />
            <span aria-live="polite">
              {tapPending ? m.tapAgain : m.tapTempo}
            </span>
          </Button>
        </div>
        {audioError && (
          <p role="alert" className="text-sm text-destructive">
            {m.audioError}
          </p>
        )}
      </div>
      <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-1">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {m.beatsPerBar}
          <select
            className={selectStyle}
            value={settings.beats}
            onChange={(event) =>
              update("beats", Number(event.currentTarget.value))
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((beats) => (
              <option key={beats} value={beats}>
                {beats}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {m.subdivision}
          <select
            className={selectStyle}
            value={settings.division}
            onChange={(event) =>
              update("division", Number(event.currentTarget.value))
            }
          >
            <option value={1}>{m.onePerBeat}</option>
            <option value={2}>{m.twoPerBeat}</option>
            <option value={3}>{m.threePerBeat}</option>
            <option value={4}>{m.fourPerBeat}</option>
          </select>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm font-medium">
          {m.accent}
          <Switch
            dir="ltr"
            checked={settings.accent}
            onCheckedChange={(value) => update("accent", value)}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm font-medium">
          {m.sound}
          <Switch
            dir="ltr"
            checked={settings.sound}
            onCheckedChange={(value) => update("sound", value)}
          />
        </label>
      </div>
    </div>
  )
}
