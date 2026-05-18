import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
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
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, ImageIcon } from "@workspace/ui/icons"

import { useObjectUrl } from "./object-url"
import { ResultPreviewCard } from "./result-preview-card"
import {
  formatBytes,
  formatSizeChangeText,
  resolveSizeChangeTrend,
} from "./utils"

import type {
  AnimatedWebpBatchResult,
  GifToAnimatedWebpMessages,
} from "./types"

type ResultsCardProps = Readonly<{
  batchResult: AnimatedWebpBatchResult | null
  isConverting: boolean
  messages: GifToAnimatedWebpMessages
}>

function ResultsCard({
  batchResult,
  isConverting,
  messages,
}: ResultsCardProps) {
  const zipUrl = useObjectUrl(batchResult?.zipBlob ?? null)
  const results = batchResult?.results ?? []
  const totalOriginalBytes = results.reduce(
    (total, result) => total + result.file.size,
    0
  )
  const totalOutputBytes = results.reduce(
    (total, result) => total + result.blob.size,
    0
  )
  const totalSizeTrend = resolveSizeChangeTrend(
    totalOriginalBytes,
    totalOutputBytes
  )

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {results.length ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {results.length} {messages.outputLabel}
              </Badge>
              <Badge
                variant={
                  totalSizeTrend === "increase" ? "destructive" : "outline"
                }
              >
                {messages.totalSizeChangeLabel}:{" "}
                {formatSizeChangeText(totalOriginalBytes, totalOutputBytes)}
              </Badge>
              <Badge variant="outline">{formatBytes(totalOutputBytes)}</Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {results.map((result) => (
                <ResultPreviewCard
                  key={result.outputName}
                  messages={messages}
                  result={result}
                />
              ))}
            </div>
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>
                {isConverting
                  ? messages.convertingLabel
                  : messages.emptyResultTitle}
              </EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      {zipUrl && results.length > 1 ? (
        <ToolPanelCardFooter className="justify-end border-t">
          <Button asChild>
            <a download="animated-webp-images.zip" href={zipUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadZipLabel}
            </a>
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { ResultsCard }
