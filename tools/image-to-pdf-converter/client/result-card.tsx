import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Download, FileText } from "@workspace/ui/icons"

import { useObjectUrl } from "./object-url"
import { formatBytes, formatProgressLabel } from "./utils"

import type { ImageToPdfMessages, PdfResult } from "./types"
import type { PdfGenerationProgress } from "../core/options"

type ResultCardProps = Readonly<{
  isGenerating: boolean
  messages: ImageToPdfMessages
  progress: PdfGenerationProgress | null
  result: PdfResult | null
}>

function ResultCard({
  isGenerating,
  messages,
  progress,
  result,
}: ResultCardProps) {
  const resultUrl = useObjectUrl(result?.blob ?? null)
  const progressValue = progress?.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result ? (
          <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
            <div>
              <h3 className="text-base font-medium">
                {messages.resultReadyTitle}
              </h3>
              <p className="mt-1 text-sm break-all text-muted-foreground">
                {result.fileName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.pageCountLabel}: {result.pageCount}
              </Badge>
              <Badge variant="outline">
                {messages.outputSizeLabel}: {formatBytes(result.blob.size)}
              </Badge>
            </div>
          </div>
        ) : (
          <Empty className="min-h-56 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>
                {isGenerating
                  ? messages.generatingLabel
                  : messages.emptyResultTitle}
              </EmptyTitle>
              <EmptyDescription>
                {isGenerating && progress
                  ? formatProgressLabel(
                      messages.progressLabel,
                      progress.completed,
                      progress.total
                    )
                  : messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {isGenerating && progress ? (
          <div
            aria-label={formatProgressLabel(
              messages.progressLabel,
              progress.completed,
              progress.total
            )}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressValue}
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        ) : null}
      </CardContent>
      {resultUrl && result ? (
        <CardFooter className="justify-end">
          <Button asChild>
            <a download={result.fileName} href={resultUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadPdfLabel}
            </a>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { ResultCard }
