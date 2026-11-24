import { useEffect, useId, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Label } from "@workspace/ui/components/ui/label"
import { AudioLines } from "@workspace/ui/icons"

import { BIN_HZ, MIN_DB } from "./core/spectrum"
import { SpectrumChart } from "./spectrum-chart"
import type englishMessages from "./messages/en.json"
import type { Response } from "./workers/analyze"

type Messages = typeof englishMessages

export function SpectrumPanel({
  file,
  spectrum,
  lang,
  messages: m,
}: {
  file: File
  spectrum: Response
  lang: string
  messages: Messages
}) {
  const id = useId()
  const [url, setUrl] = useState("")
  const [log, setLog] = useState(true)
  const [bin, setBin] = useState(spectrum.peak)
  const cursor = log ? Math.max(1, bin) : bin
  const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })
  const frequency = (index: number) => number.format(index * BIN_HZ) + " Hz"
  const level =
    (spectrum.levels[cursor] === MIN_DB ? "≤ " : "") +
    number.format(spectrum.levels[cursor]!) +
    " dBFS"

  useEffect(() => {
    const preview = URL.createObjectURL(file)
    setUrl(preview)
    return () => URL.revokeObjectURL(preview)
  }, [file])

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <AudioLines
              className="size-4 shrink-0 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            {m.spectrum}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor={id + "-scale"}>{m.scale}</Label>
            <select
              id={id + "-scale"}
              value={log ? "log" : "linear"}
              className="min-h-9 max-w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
              onChange={(event) => setLog(event.currentTarget.value === "log")}
            >
              <option value="log">{m.logarithmic}</option>
              <option value="linear">{m.linear}</option>
            </select>
          </div>
        </div>
        <div>
          <SpectrumChart
            levels={spectrum.levels}
            log={log}
            bin={cursor}
            lang={lang}
            onBin={setBin}
          />
          <div className="grid grid-cols-3 gap-2 pt-3 sm:gap-3">
            <dl className="contents">
              <div className="rounded-md bg-teal-50 px-2 py-2 sm:px-3 dark:bg-teal-950/35">
                <dt className="text-xs text-muted-foreground">{m.peak}</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">
                  {spectrum.peak ? <bdi>{frequency(spectrum.peak)}</bdi> : "–"}
                </dd>
              </div>
              <div className="rounded-md bg-muted/55 px-2 py-2 sm:px-3">
                <dt className="text-xs text-muted-foreground">{m.frequency}</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">
                  <bdi>{frequency(cursor)}</bdi>
                </dd>
              </div>
              <div className="rounded-md bg-muted/55 px-2 py-2 sm:px-3">
                <dt className="text-xs text-muted-foreground">{m.level}</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">
                  <bdi>{level}</bdi>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {spectrum.peak === 0 && (
          <p className="text-sm text-muted-foreground">{m.silent}</p>
        )}
        <div className="grid gap-2">
          <Label htmlFor={id + "-cursor"}>{m.cursor}</Label>
          <input
            id={id + "-cursor"}
            type="range"
            dir="ltr"
            className="min-h-5 w-full accent-teal-700 dark:accent-teal-300"
            min={log ? 1 : 0}
            max={spectrum.levels.length - 1}
            value={cursor}
            aria-valuetext={frequency(cursor) + ", " + level}
            aria-describedby={id + "-hint"}
            onChange={(event) => setBin(event.currentTarget.valueAsNumber)}
          />
          <p id={id + "-hint"} className="text-xs text-muted-foreground">
            {m.cursorHint}
          </p>
        </div>
        <div className="border-t pt-4">
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Preview plays user-supplied audio. */}
          <audio
            className="h-11 w-full"
            src={url || undefined}
            controls
            preload="metadata"
            aria-label={m.preview}
          />
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
