import { useEffect, useMemo, useState } from "react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download } from "@workspace/ui/icons"
import { buildReport } from "../core/report"
import type { MediaInfoResult } from "mediainfo.js"
import type { Messages } from "../types"

export function Results({
  result,
  file,
  messages: m,
  language,
}: {
  result: MediaInfoResult
  file: File
  messages: Messages
  language: string
}) {
  const { metrics, sections, counts, report } = useMemo(
    () => buildReport(result, file, m, language),
    [result, file, m, language]
  )
  const json = useMemo(
    () =>
      JSON.stringify(
        { file: { name: file.name, size: file.size }, ...result },
        null,
        2
      ),
    [file, result]
  )
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" })
    )
    setUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [json])
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="min-w-0 rounded-xl border bg-muted/30 p-4"
          >
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-lg font-medium break-words">
              <bdi>{value}</bdi>
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {m.video}: {counts.Video}
          </Badge>
          <Badge variant="secondary">
            {m.audio}: {counts.Audio}
          </Badge>
          <Badge variant="secondary">
            {m.text}: {counts.Text}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            value={report}
            copyLabel={m.copyReport}
            copiedLabel={m.copied}
          />
          {url ? (
            <Button asChild size="sm" variant="outline">
              <a href={url} download={`${file.name}.mediainfo.json`}>
                <Download />
                {m.downloadJson}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <ToolPanelCard key={section.title}>
            <ToolPanelCardContent className="gap-3">
              <h2 className="font-heading text-base font-medium">
                {section.title}
              </h2>
              <dl className="divide-y text-sm">
                {section.rows.map(({ label, value }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5 first:pt-0 last:pb-0"
                  >
                    <dt className="break-words text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="min-w-0 break-words">
                      <bdi>{value}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
            </ToolPanelCardContent>
          </ToolPanelCard>
        ))}
      </div>
      <details className="min-w-0 rounded-xl border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          {m.rawData}
        </summary>
        <pre
          dir="ltr"
          className="mt-4 max-h-96 overflow-auto rounded-lg bg-muted/30 p-4 text-xs"
        >
          {json}
        </pre>
      </details>
    </div>
  )
}
