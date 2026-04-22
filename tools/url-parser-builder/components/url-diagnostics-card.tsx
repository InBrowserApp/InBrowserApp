import { Badge } from "@workspace/ui/components/ui/badge"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"

import type { UrlDiagnostics } from "../core/url"
import type { UrlParserBuilderMessages } from "../types"

type UrlDiagnosticsCardProps = Readonly<{
  diagnostics: UrlDiagnostics
  normalizedUrl: string
  messages: UrlParserBuilderMessages
}>

function UrlDiagnosticsCard({
  diagnostics,
  normalizedUrl,
  messages,
}: UrlDiagnosticsCardProps) {
  return (
    <ToolPanelCard className="border-dashed">
      <CardHeader className="border-b">
        <CardTitle>{messages.diagnosticsLabel}</CardTitle>
      </CardHeader>

      <ToolPanelCardContent className="gap-5 pt-4">
        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {messages.rawUrlLabel}
          </p>
          <p className="mt-3 font-mono text-sm leading-6 break-all">
            {normalizedUrl}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <Metric label={messages.originLabel} value={diagnostics.origin} />
          <Metric
            label={messages.authorityLabel}
            value={diagnostics.authority}
          />
          <Metric label={messages.protocolLabel} value={diagnostics.protocol} />
          <Metric
            label={messages.hashLabel}
            value={diagnostics.hash || messages.noneLabel}
          />
          <Metric
            label={messages.queryCountLabel}
            value={String(diagnostics.queryCount)}
          />
        </dl>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{messages.pathSegmentsLabel}</p>
            <Badge variant="secondary">{diagnostics.pathSegments.length}</Badge>
          </div>
          {diagnostics.pathSegments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {diagnostics.pathSegments.map((segment) => (
                <Badge key={segment} variant="outline" className="font-mono">
                  {segment}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {messages.noneLabel}
            </p>
          )}
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string
  value: string
}>) {
  return (
    <div className="rounded-xl border bg-background/70 p-3">
      <dt className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-2 font-mono text-sm leading-6 break-all">{value}</dd>
    </div>
  )
}

export { UrlDiagnosticsCard }
