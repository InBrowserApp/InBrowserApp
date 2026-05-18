import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Braces } from "@workspace/ui/icons"
import {
  CheckTile,
  MetricTile,
  getVariantLabel,
  getVersionLabel,
} from "./result-tiles"
import { SegmentsGrid } from "./segments-grid"

import type {
  UuidValidationAnalysis,
  UuidValidatorMessages,
} from "../client/types"

type UuidResultsCardProps = Readonly<{
  analysis: UuidValidationAnalysis | null
  messages: UuidValidatorMessages
}>

function UuidResultsCard({ analysis, messages }: UuidResultsCardProps) {
  const isSpecialUuid = analysis?.kind === "nil" || analysis?.kind === "max"
  const description = analysis
    ? analysis.isValid
      ? isSpecialUuid
        ? messages.variantSpecial
        : messages.validDescription
      : messages.resultsDescription
    : messages.emptyDescription

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {analysis ? (
          <>
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label={messages.statusLabel}
                value={
                  <Badge variant={analysis.isValid ? "default" : "destructive"}>
                    {analysis.isValid
                      ? messages.validTitle
                      : messages.invalidTitle}
                  </Badge>
                }
              />
              <MetricTile
                label={messages.normalizedLabel}
                value={
                  <span className="font-mono text-sm break-all">
                    {analysis.normalized || messages.notAvailable}
                  </span>
                }
              />
              <MetricTile
                label={messages.versionLabel}
                value={getVersionLabel(analysis, messages)}
              />
              <MetricTile
                label={messages.variantLabel}
                value={getVariantLabel(analysis, messages)}
              />
            </section>

            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <CheckTile
                label={messages.formatCheckLabel}
                messages={messages}
                isPassing={analysis.isCanonicalFormat}
              />
              <CheckTile
                label={messages.versionCheckLabel}
                messages={messages}
                isPassing={analysis.isSupportedVersion}
              />
              <CheckTile
                label={messages.variantCheckLabel}
                messages={messages}
                isPassing={analysis.isSupportedVariant}
              />
              <MetricTile
                label={messages.byteLengthLabel}
                value={
                  analysis.byteLength === null
                    ? messages.notAvailable
                    : String(analysis.byteLength)
                }
              />
            </section>

            <section className="flex flex-col gap-3 rounded-md border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-medium">{messages.hexLabel}</h3>
                <ToolCopyButton
                  value={analysis.normalized}
                  copyLabel={messages.copyLabel}
                  copiedLabel={messages.copiedLabel}
                  disabled={!analysis.isValid}
                />
              </div>
              <p className="font-mono text-sm break-all">
                {analysis.hex || messages.notAvailable}
              </p>
            </section>

            <SegmentsGrid analysis={analysis} messages={messages} />
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Braces />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
              <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { UuidResultsCard }
