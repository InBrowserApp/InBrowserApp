import { memo, useMemo } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Trash2 } from "@workspace/ui/icons"

import { noteName } from "./core/midi"

import type english from "./messages/en.json"
import type { Entry } from "./use-midi-log"

type Messages = typeof english

function detail(message: Entry["message"], messages: Messages) {
  switch (message.kind) {
    case "noteOn":
    case "noteOff":
      return `${noteName(message.note)} · ${messages.velocity} ${message.velocity}`
    case "controlChange":
      return `CC ${message.control} · ${message.value}`
    case "pitchBend":
      return String(message.value)
    default:
      return ""
  }
}

const MessageRow = memo(function MessageRow({
  entry,
  messages,
  clock,
}: {
  entry: Entry
  messages: Messages
  clock: Intl.DateTimeFormat
}) {
  const { message, data, time } = entry
  const summary = detail(message, messages)
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5 px-4 py-2.5 text-sm">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <time
            className="font-mono tabular-nums"
            dateTime={time.toISOString()}
          >
            {clock.format(time)}
          </time>
          {message.channel !== undefined && (
            <span>
              {messages.channel} {message.channel}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium">{messages[message.kind]}</span>
          {summary && <bdi className="wrap-anywhere">{summary}</bdi>}
        </div>
      </div>
      <code
        dir="ltr"
        className="max-w-full rounded-sm bg-background px-1.5 py-0.5 font-mono text-xs wrap-anywhere"
      >
        {data}
      </code>
    </li>
  )
})

export function MessageLog({
  language,
  messages,
  entries,
  pulses,
  emptyHint,
  clear,
}: {
  language: string
  messages: Messages
  entries: Entry[]
  pulses: number
  emptyHint: string
  clear: () => void
}) {
  const clock = useMemo(
    () =>
      new Intl.DateTimeFormat(language, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hourCycle: "h23",
      }),
    [language]
  )
  const number = useMemo(() => new Intl.NumberFormat(language), [language])

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <h2 className="text-sm font-semibold">{messages.log}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.clockPulses}{" "}
            <strong className="font-mono text-foreground tabular-nums">
              {number.format(pulses)}
            </strong>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={messages.clear}
            title={messages.clear}
            disabled={!entries.length && !pulses}
            onClick={clear}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      {entries.length ? (
        <>
          <div
            role="region"
            aria-label={messages.log}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Provide keyboard access to the scrolling log.
            tabIndex={0}
            className="max-h-80 overflow-auto border-t bg-muted/45"
          >
            <ol className="divide-y">
              {entries.map((entry) => (
                <MessageRow
                  key={entry.id}
                  entry={entry}
                  messages={messages}
                  clock={clock}
                />
              ))}
            </ol>
          </div>
          <p className="border-t px-4 py-2 text-xs text-muted-foreground">
            {messages.retention}
          </p>
        </>
      ) : (
        <p className="border-t bg-muted/45 p-4 text-sm text-muted-foreground">
          {emptyHint}
        </p>
      )}
    </div>
  )
}
