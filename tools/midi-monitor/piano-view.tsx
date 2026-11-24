import { useState } from "react"

import { noteName, pianoKeys } from "./core/midi"

import type { HeldNote } from "./core/midi"
import type english from "./messages/en.json"

const octaves = Array.from({ length: 11 }, (_, index) => index - 1)

export function PianoView({
  notes,
  messages,
}: {
  notes: HeldNote[]
  messages: typeof english
}) {
  const [octave, setOctave] = useState(3)
  const keys = pianoKeys(octave)
  const white = keys.filter((key) => !key.black)
  const black = keys.filter((key) => key.black)
  const active = new Set(notes.map((note) => note.note))

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{messages.keyboard}</h2>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {messages.octave}
          <select
            value={octave}
            onChange={(event) => setOctave(Number(event.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {octaves.map((value) => (
              <option key={value} value={value}>
                C{value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        aria-hidden="true"
        dir="ltr"
        className="relative flex h-22 overflow-hidden rounded-md border border-zinc-300 bg-zinc-200 sm:h-32 dark:border-zinc-700"
      >
        {white.map((key) => (
          <div
            key={key.note}
            title={key.name}
            data-active={active.has(key.note)}
            className="flex min-w-0 flex-1 items-end justify-center border-e border-zinc-300 bg-white pb-1.5 text-[10px] text-zinc-700 last:border-e-0 data-[active=true]:bg-sky-300 dark:border-zinc-700 dark:bg-zinc-200 dark:data-[active=true]:bg-sky-400"
          >
            {key.name.startsWith("C") && key.name}
          </div>
        ))}
        {black.map((key) => (
          <div
            key={key.note}
            title={key.name}
            data-active={active.has(key.note)}
            style={{
              left: `${(white.findIndex((item) => item.note > key.note) * 100) / white.length}%`,
              width: `${60 / white.length}%`,
            }}
            className="absolute top-0 h-3/5 -translate-x-1/2 rounded-b-sm border border-t-0 border-zinc-800 bg-zinc-800 data-[active=true]:border-sky-800 data-[active=true]:bg-sky-600"
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
        <span className="text-muted-foreground">{messages.heldNotes}</span>
        {notes.length === 0 ? (
          <span>{messages.none}</span>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {notes.map((note) => (
              <li
                key={`${note.channel}-${note.note}`}
                className="rounded-md bg-muted px-2 py-1 text-xs"
              >
                <bdi className="font-semibold">{noteName(note.note)}</bdi>
                {" · "}
                {messages.velocity} {note.velocity}
                <span className="sr-only">
                  {" "}
                  · {messages.channel} {note.channel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
