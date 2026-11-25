import { useState } from "react"
import { parseNumber } from "@workspace/localized-number"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Mic, MicOff, Volume2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { noteFrequency, noteName, readTuning, stringNotes } from "./tuning"
import { usePitchCapture } from "./use-pitch-capture"
import { useReferenceTone } from "./use-reference-tone"
import type englishMessages from "./messages/en.json"

type Mode = "chromatic" | keyof typeof stringNotes
const center = 440

export default function ChromaticTuner({
  lang,
  messages: m,
}: {
  lang: string
  messages: typeof englishMessages
}) {
  const [mode, setMode] = useState<Mode>("chromatic")
  const [stringIndex, setStringIndex] = useState(0)
  const [reference, setReference] = useState(center)
  const [draft, setDraft] = useState(String(center))
  const tone = useReferenceTone()
  const mic = usePitchCapture(tone.active)

  const strings = mode === "chromatic" ? [] : stringNotes[mode]
  const target = strings[stringIndex] ?? null
  const frequency = mic.frequency
  const result =
    frequency === null
      ? null
      : { frequency, ...readTuning(frequency, reference, target) }
  const running = mic.status === "starting" || mic.status === "listening"
  const message = result
    ? m[result.state]
    : mic.status === "starting"
      ? m.starting
      : mic.status === "listening"
        ? m.playHint
        : m.listenHint

  function updateReference() {
    const locale = lang === "th" ? "th-u-nu-thai" : lang
    const parsed = parseNumber(draft.normalize("NFKC"), locale)
    const value =
      parsed.kind === "valid"
        ? Math.min(480, Math.max(400, Math.round(parsed.value)))
        : reference
    setDraft(String(value))
    setReference(value)
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border bg-card p-4 sm:p-7">
        <div className="flex min-h-25 flex-col items-center gap-2 text-center">
          <span
            dir="ltr"
            className="font-heading text-5xl tabular-nums sm:text-6xl"
          >
            {result ? noteName(result.note) : "—"}
          </span>
          {result && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm tabular-nums">
              <bdi>
                {m.frequency.replace(
                  "{value}",
                  result.frequency.toLocaleString(lang, {
                    maximumFractionDigits: 1,
                  })
                )}
              </bdi>
              <bdi>
                {m.cents.replace(
                  "{value}",
                  result.cents.toLocaleString(lang, {
                    signDisplay: "exceptZero",
                  })
                )}
              </bdi>
            </div>
          )}
          <p
            role="status"
            className={cn(
              "text-sm",
              result?.state === "inTune"
                ? "font-medium text-emerald-700 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            {result && (
              <span className="sr-only">{noteName(result.note)} </span>
            )}
            {message}
          </p>
        </div>

        <div aria-hidden="true" className="w-full max-w-lg" dir="ltr">
          <div className="relative h-3 rounded-full border bg-muted">
            <span className="absolute inset-y-0 start-[45%] end-[45%] bg-emerald-500/35" />
            {result && (
              <span
                className="absolute -top-1 size-5 -translate-x-1/2 rounded-full border-2 border-card bg-primary"
                style={{
                  left: `${Math.min(50, Math.max(-50, result.cents)) + 50}%`,
                }}
              />
            )}
          </div>
          <div className="mt-2 flex justify-between px-0.5 text-xs text-muted-foreground tabular-nums">
            <span>−50</span>
            <span>−25</span>
            <span>0</span>
            <span>+25</span>
            <span>+50</span>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          className="h-auto min-h-10 whitespace-normal"
          onClick={() => (running ? mic.stop() : void mic.start())}
        >
          {running ? <MicOff /> : <Mic />}
          {running ? m.stop : m.start}
        </Button>
        {mic.status === "error" && (
          <p role="alert" className="text-center text-sm text-destructive">
            {m.microphoneError}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {m.mode}
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring/50"
            value={mode}
            onChange={(event) => {
              setMode(event.currentTarget.value as Mode)
              setStringIndex(0)
            }}
          >
            <option value="chromatic">{m.chromatic}</option>
            <option value="guitar">{m.guitar}</option>
            <option value="ukulele">{m.ukulele}</option>
          </select>
        </label>
        {strings.length > 0 && (
          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-sm font-medium">{m.strings}</legend>
            <div
              className={cn(
                "grid gap-1",
                mode === "guitar" ? "grid-cols-6" : "grid-cols-4"
              )}
              dir="ltr"
            >
              {strings.map((note, index) => (
                <Button
                  type="button"
                  key={note}
                  className="min-w-0 px-1"
                  aria-pressed={index === stringIndex}
                  variant={index === stringIndex ? "default" : "outline"}
                  onClick={() => setStringIndex(index)}
                >
                  {noteName(note)}
                </Button>
              ))}
            </div>
          </fieldset>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {m.reference}
          <Input
            dir="ltr"
            inputMode="numeric"
            value={draft}
            className="h-10 tabular-nums"
            onChange={(event) => setDraft(event.currentTarget.value)}
            onBlur={updateReference}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur()
            }}
          />
        </label>
        <Button
          type="button"
          className="h-auto min-h-10 whitespace-normal"
          variant="outline"
          disabled={tone.playing}
          onClick={() => void tone.play(noteFrequency(target ?? 69, reference))}
        >
          <Volume2 />
          {m.playReference}
        </Button>
        {tone.error && (
          <p role="alert" className="text-sm text-destructive">
            {m.toneError}
          </p>
        )}
      </div>
    </div>
  )
}
