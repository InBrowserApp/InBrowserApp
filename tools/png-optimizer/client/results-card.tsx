import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
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
import { Download, ImageIcon } from "@workspace/ui/icons"

import { useObjectUrl } from "./object-url"
import { formatBytes, formatDelta, formatPercent } from "./utils"

import type { PngOptimizationResult } from "../core/png-optimizer"
import type { PngOptimizerMessages } from "./types"

type ResultsCardProps = Readonly<{
  isOptimizing: boolean
  messages: PngOptimizerMessages
  result: PngOptimizationResult | null
}>

function ResultsCard({ isOptimizing, messages, result }: ResultsCardProps) {
  const optimizedUrl = useObjectUrl(result?.blob ?? null)

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent aria-live="polite" className="gap-5">
        {result ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant={result.savedBytes > 0 ? "secondary" : "outline"}>
                {result.savedBytes > 0
                  ? `${messages.savedLabel}: ${formatDelta(
                      result.savedBytes,
                      result.savedPercent
                    )}`
                  : messages.noReductionLabel}
              </Badge>
              <Badge variant="outline">
                {messages.reductionLabel}: {formatPercent(result.savedPercent)}
              </Badge>
            </div>

            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-3">
                <dt className="text-xs text-muted-foreground">
                  {messages.originalSizeLabel}
                </dt>
                <dd className="font-mono text-sm">
                  {formatBytes(result.originalBytes)}
                </dd>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <dt className="text-xs text-muted-foreground">
                  {messages.optimizedSizeLabel}
                </dt>
                <dd className="font-mono text-sm">
                  {formatBytes(result.optimizedBytes)}
                </dd>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <dt className="text-xs text-muted-foreground">
                  {messages.levelLabel}
                </dt>
                <dd className="font-mono text-sm">{result.options.level}</dd>
              </div>
            </dl>
          </>
        ) : (
          <Empty className="min-h-64 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {isOptimizing
                  ? messages.optimizingButtonLabel
                  : messages.emptyResultTitle}
              </EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      {optimizedUrl && result ? (
        <ToolPanelCardFooter className="justify-end">
          <Button asChild>
            <a download={result.outputName} href={optimizedUrl}>
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.downloadOptimizedLabel}
            </a>
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { ResultsCard }
