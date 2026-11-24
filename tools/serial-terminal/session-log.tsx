import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Download, Pause, Play, Trash2 } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import { entryData, formatLog } from "./core/data"

import type { DataFormat, Entry } from "./core/data"
import type english from "./messages/en.json"

export const selectClass =
  "border-input bg-background h-9 min-w-0 rounded-md border px-2 text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-ring"

export function SessionLog({
  language,
  messages,
  entries,
  truncated,
  clear,
  getLog,
}: {
  language: string
  messages: typeof english
  entries: readonly Entry[]
  truncated: boolean
  clear: () => void
  getLog: () => readonly Entry[]
}) {
  const [display, setDisplay] = useState<DataFormat>("text")
  const [paused, setPaused] = useState(false)
  const logPanel = useRef<HTMLDivElement>(null)
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
  useEffect(() => {
    if (!paused && logPanel.current) {
      logPanel.current.scrollTop = logPanel.current.scrollHeight
    }
  }, [entries, paused])

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-end gap-2 border-b p-3 sm:p-4">
        <h2 className="w-full grow self-center text-sm font-semibold sm:w-auto">
          {messages.log}
        </h2>
        <label className="flex items-center gap-2 text-sm">
          {messages.displayMode}
          <select
            className={selectClass}
            value={display}
            onChange={(event) => setDisplay(event.target.value as DataFormat)}
          >
            <option value="text">{messages.text}</option>
            <option value="hex">{messages.hex}</option>
          </select>
        </label>
        <div className="ms-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={paused ? messages.resumeScroll : messages.pauseScroll}
            title={paused ? messages.resumeScroll : messages.pauseScroll}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={messages.download}
            title={messages.download}
            disabled={!entries.length}
            onClick={() =>
              downloadBlob(
                new Blob([formatLog(getLog(), display)], {
                  type: "text/plain;charset=utf-8",
                }),
                "serial-log.txt"
              )
            }
          >
            <Download aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={messages.clear}
            title={messages.clear}
            disabled={!entries.length}
            onClick={clear}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div
        ref={logPanel}
        role="region"
        aria-label={messages.log}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Give keyboard users access to the scrolling log.
        tabIndex={0}
        className="h-48 overflow-auto bg-muted/35 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:h-80 sm:px-4"
      >
        {entries.length === 0 ? (
          <p className="flex h-full items-center justify-center text-center text-muted-foreground">
            {messages.awaitingData}
          </p>
        ) : (
          <ol className="divide-y divide-border/60 font-mono" dir="ltr">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-2 py-1 text-xs sm:gap-3 sm:text-sm"
              >
                <time
                  className="text-muted-foreground tabular-nums"
                  dateTime={entry.time.toISOString()}
                >
                  {clock.format(entry.time)}
                </time>
                <span
                  className={
                    entry.direction === "RX"
                      ? "text-foreground"
                      : "font-semibold text-primary"
                  }
                >
                  {entry.direction}
                </span>
                <span className="wrap-anywhere whitespace-pre-wrap">
                  {entryData(entry, display)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
      {truncated && (
        <p className="border-t px-4 py-2 text-xs text-muted-foreground">
          {messages.retention}
        </p>
      )}
    </div>
  )
}
