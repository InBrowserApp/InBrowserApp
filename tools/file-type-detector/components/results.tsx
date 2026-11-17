import { Badge } from "@workspace/ui/components/ui/badge"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Binary, LoaderCircle } from "@workspace/ui/icons"
import type { Inspection, Messages } from "../types"

type ResultsProps = {
  result: Inspection | null
  loading: boolean
  messages: Messages
}

export function Results({ result, loading, messages: m }: ResultsProps) {
  const details = result
    ? [
        [m.detectedMime, result.detected?.mime ?? m.unknownType],
        [
          m.expectedExtensions,
          result.extensions.map((ext) => `.${ext}`).join(", ") || "—",
        ],
        [
          m.fileExtension,
          result.extension ? `.${result.extension}` : m.noExtension,
        ],
        [m.browserMime, result.browserMime || m.notReported],
      ]
    : []
  const report = result
    ? [
        result.fileName,
        `${m.fileSize}: ${result.fileSize} B`,
        m.status[result.status],
        ...details.map(([key, value]) => `${key}: ${value}`),
        "",
        m.hexTitle,
        result.hex,
        "",
        m.limitations,
      ].join("\n")
    : ""

  return (
    <ToolPanelCard className="min-w-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>{m.resultTitle}</CardTitle>
        <ToolCopyButton
          value={report}
          disabled={loading}
          copyLabel={m.copyReport}
          copiedLabel={m.copied}
        />
      </CardHeader>
      <ToolPanelCardContent className="gap-5" aria-busy={loading}>
        <div role="status" aria-atomic="true">
          {loading || !result ? (
            <Empty className="min-h-56 border-0 p-4">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {loading ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="motion-safe:animate-spin"
                    />
                  ) : (
                    <Binary aria-hidden="true" />
                  )}
                </EmptyMedia>
                <EmptyTitle>{loading ? m.loading : m.emptyTitle}</EmptyTitle>
                {!loading ? (
                  <EmptyDescription>{m.emptyDescription}</EmptyDescription>
                ) : null}
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="font-mono text-2xl font-semibold"
                  translate="no"
                >
                  {result.detected?.ext.toUpperCase() ?? m.unknownType}
                </span>
                <Badge
                  variant={
                    result.status === "mismatch" ? "destructive" : "secondary"
                  }
                >
                  {m.status[result.status]}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {m.statusDescription[result.status]}
              </p>
            </div>
          )}
        </div>
        {result && !loading ? (
          <dl className="divide-y text-sm">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 py-3 sm:grid-cols-[minmax(8rem,1fr)_minmax(0,1.4fr)] sm:gap-4"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd
                  className="min-w-0 font-mono break-all"
                  dir="ltr"
                  translate="no"
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
