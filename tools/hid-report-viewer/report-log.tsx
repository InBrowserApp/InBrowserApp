import { memo, useMemo } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Pause, Play, Trash2 } from "@workspace/ui/icons"

import { hex } from "./core/report"

import type english from "./messages/en.json"
import type { Report } from "./use-report-log"

type Messages = typeof english

const ReportRow = memo(function ReportRow({
  report,
  messages,
  clock,
}: {
  report: Report
  messages: Messages
  clock: Intl.DateTimeFormat
}) {
  return (
    <li className="space-y-1.5 px-4 py-2.5 text-sm">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <time
          className="font-mono tabular-nums"
          dateTime={report.time.toISOString()}
        >
          {clock.format(report.time)}
        </time>
        <span>
          {messages.reportId} <bdi className="font-mono">{report.reportId}</bdi>
        </span>
      </div>
      {report.bytes.length ? (
        <code
          dir="ltr"
          className="flex flex-wrap gap-1 font-mono text-xs sm:text-sm"
        >
          {Array.from(report.bytes, (byte, index) => (
            <span
              key={index}
              data-changed={report.changed[index]}
              title={report.changed[index] ? messages.changed : undefined}
              className="rounded px-1 data-[changed=true]:bg-primary/15 data-[changed=true]:font-semibold"
            >
              {hex(byte)}
              {report.changed[index] && (
                <span className="sr-only select-none"> {messages.changed}</span>
              )}
            </span>
          ))}
        </code>
      ) : (
        <p className="text-sm text-muted-foreground">{messages.emptyReport}</p>
      )}
    </li>
  )
})

export function ReportLog({
  language,
  messages,
  connected,
  reports,
  paused,
  clear,
  toggleCapture,
}: {
  language: string
  messages: Messages
  connected: boolean
  reports: readonly Report[]
  paused: boolean
  clear: () => void
  toggleCapture: () => void
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

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <h2 className="text-sm font-semibold">{messages.reports}</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!connected}
            onClick={toggleCapture}
          >
            {paused ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )}
            {paused ? messages.resume : messages.pause}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={!reports.length}
            onClick={clear}
            aria-label={messages.clear}
            title={messages.clear}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      {reports.length ? (
        <>
          <div
            role="region"
            aria-label={messages.reports}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Let keyboard users scroll the report list.
            tabIndex={0}
            className="max-h-80 overflow-auto border-t bg-muted/45"
          >
            <ol className="divide-y">
              {reports.map((report) => (
                <ReportRow
                  key={report.sequence}
                  report={report}
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
          {connected ? messages.waiting : messages.startHint}
        </p>
      )}
    </div>
  )
}
