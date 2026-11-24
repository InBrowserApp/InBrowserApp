import { useEffect, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Activity } from "@workspace/ui/icons"

import type englishMessages from "./messages/en.json"

export function TempoPanel({
  file,
  bpm,
  lang,
  messages: m,
}: {
  file: File
  bpm: number | null
  lang: string
  messages: typeof englishMessages
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const preview = URL.createObjectURL(file)
    setUrl(preview)
    return () => URL.revokeObjectURL(preview)
  }, [file])

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-4">
        {bpm === null ? (
          <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            {m.noTempo}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg bg-muted/65 p-4 sm:p-5">
              <div className="flex flex-col gap-2">
                <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Activity className="size-4 shrink-0" aria-hidden="true" />
                  {m.tempo}
                </h2>
                <bdi className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                    {bpm.toLocaleString(lang)}
                  </span>
                  <span className="text-lg font-medium text-muted-foreground">
                    BPM
                  </span>
                </bdi>
              </div>
              <ToolCopyButton
                value={String(bpm)}
                copyLabel={m.copy}
                copiedLabel={m.copied}
                className="min-h-11 whitespace-normal sm:min-h-9"
              />
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              {(
                [
                  [m.half, bpm / 2],
                  [m.double, bpm * 2],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border px-3 py-2 sm:px-4"
                >
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-base font-semibold tabular-nums">
                    <bdi>{value.toLocaleString(lang)} BPM</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
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
