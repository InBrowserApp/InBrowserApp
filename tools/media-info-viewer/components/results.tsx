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
import { InfoRows } from "./info-rows"
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
            <dd className="mt-2 text-sm font-medium break-words tabular-nums sm:text-lg">
              <bdi>{value}</bdi>
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["Video", m.video],
              ["Audio", m.audio],
              ["Text", m.text],
            ] as const
          ).map(([type, label]) =>
            counts[type] > 0 ? (
              <Badge
                key={type}
                asChild
                variant="secondary"
                className="min-h-11 px-3 sm:min-h-0 sm:px-2"
              >
                <a href={`#media-${type.toLowerCase()}-1`}>
                  {label}: {counts[type]}
                </a>
              </Badge>
            ) : (
              <Badge
                key={type}
                variant="secondary"
                className="min-h-11 px-3 sm:min-h-0 sm:px-2"
              >
                {label}: 0
              </Badge>
            )
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            value={report}
            copyLabel={m.copyReport}
            copiedLabel={m.copied}
            failedLabel={m.copyFailed}
            className="min-h-11 sm:min-h-0"
          />
          {url ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="min-h-11 sm:min-h-0"
            >
              <a href={url} download={`${file.name}.mediainfo.json`}>
                <Download />
                {m.downloadJson}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {sections
          .slice(1)
          .concat(sections.slice(0, 1))
          .map((section) => (
            <ToolPanelCard
              key={section.id}
              id={section.id}
              className="h-auto scroll-mt-6"
            >
              <ToolPanelCardContent className="gap-3">
                <h2 className="font-heading text-base font-medium">
                  {section.title}
                </h2>
                <InfoRows rows={section.rows.filter((row) => !row.advanced)} />
                {section.rows.some((row) => row.advanced) ? (
                  <details className="border-t pt-3">
                    <summary className="cursor-pointer py-3 text-sm font-medium sm:py-1">
                      {m.technicalDetails}
                    </summary>
                    <div className="mt-3">
                      <InfoRows
                        rows={section.rows.filter((row) => row.advanced)}
                      />
                    </div>
                  </details>
                ) : null}
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
