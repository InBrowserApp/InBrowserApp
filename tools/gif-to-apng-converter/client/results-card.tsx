import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import { Download, ImageIcon } from "@workspace/ui/icons"

import { APNG_ZIP_NAME } from "../core/apng-conversion"
import { useObjectUrl } from "./object-url"
import { ResultPreviewCard } from "./result-preview-card"
import { formatBytes, formatInteger } from "./utils"

import type { GifToApngBatchResult, GifToApngMessages } from "./types"

type ResultsCardProps = Readonly<{
  batchResult: GifToApngBatchResult | null
  isConverting: boolean
  locale: string
  messages: GifToApngMessages
}>

function ResultsCard({
  batchResult,
  isConverting,
  locale,
  messages,
}: ResultsCardProps) {
  const zipUrl = useObjectUrl(batchResult?.zipBlob ?? null)
  const results = batchResult?.results ?? []
  const totalOutputBytes = results.reduce(
    (total, result) => total + result.blob.size,
    0
  )

  return (
    <ToolPanelCard>
      <CardHeader className="border-b p-4">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent aria-live="polite" className="gap-5 p-4">
        {results.length ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.outputLabel}: {formatInteger(results.length, locale)}
              </Badge>
              <Badge variant="outline">
                {messages.totalOutputLabel}:{" "}
                {formatBytes(totalOutputBytes, locale)}
              </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {results.map((result) => (
                <ResultPreviewCard
                  key={result.outputName}
                  locale={locale}
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
                <ImageIcon aria-hidden="true" />
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
        <ToolPanelCardFooter className="justify-end border-t p-4">
          <Button asChild>
            <a download={APNG_ZIP_NAME} href={zipUrl}>
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.downloadZipLabel}
            </a>
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { ResultsCard }
