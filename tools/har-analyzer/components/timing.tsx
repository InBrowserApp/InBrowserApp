import { PHASES } from "../core/parse"
import { formatTime } from "../core/analysis"
import { cn } from "@workspace/ui/lib/utils"
import type { Capture, Entry, Messages } from "../types"

const colors = {
  blocked: "bg-(--har-blocked)",
  dns: "bg-(--har-dns)",
  connect: "bg-(--har-connect)",
  send: "bg-(--har-send)",
  wait: "bg-(--har-wait)",
  receive: "bg-(--har-receive)",
}

export function Legend({ messages: m }: { messages: Messages }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {PHASES.map((phase) => (
        <li key={phase} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("size-2 rounded-xs", colors[phase])}
          />
          {m.phases[phase]}
        </li>
      ))}
    </ul>
  )
}

export function Waterfall({
  entry,
  capture,
  lang,
  messages: m,
}: {
  entry: Entry
  capture: Capture
  lang: string
  messages: Messages
}) {
  const scale = Math.max(capture.span, 1)
  const total = Math.max(
    entry.duration ?? 0,
    PHASES.reduce((sum, phase) => sum + (entry.timings[phase] ?? 0), 0),
    1
  )
  return (
    <div
      dir="ltr"
      className="relative h-5 w-full min-w-0 bg-muted/40 sm:min-w-48"
      role="img"
      aria-label={`${m.start}: ${formatTime(entry.started - capture.started, lang, m.unknown)}; ${m.time}: ${formatTime(entry.duration, lang, m.unknown)}`}
    >
      <div
        className="absolute inset-y-1 flex min-w-px overflow-hidden rounded-xs bg-muted-foreground/25"
        style={{
          left: `${(100 * (entry.started - capture.started)) / scale}%`,
          width: `${(100 * (entry.duration ?? 0)) / scale}%`,
        }}
      >
        {PHASES.map((phase) => (
          <span
            key={phase}
            className={colors[phase]}
            style={{ width: `${(100 * (entry.timings[phase] ?? 0)) / total}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function TimingDetails({
  entry,
  lang,
  messages: m,
}: {
  entry: Entry
  lang: string
  messages: Messages
}) {
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 text-sm">
        {[...PHASES, "ssl" as const].map((phase) => (
          <div key={phase} className="contents">
            <dt>{m.phases[phase]}</dt>
            <dd className="font-mono tabular-nums">
              {formatTime(entry.timings[phase], lang, m.unknown)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {m.sslNote}
      </p>
    </div>
  )
}
