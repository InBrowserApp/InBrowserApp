import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
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
import { Download, FileText, LoaderCircle } from "@workspace/ui/icons"

import { formatTemplate } from "./page-grid"

import type { PdfSplitterMessages } from "../client/types"

type SplitResult = Readonly<{
  blob: Blob
  fileCount: number
  filename: string
  kind: "pdf" | "zip"
}>

type ResultsCardProps = Readonly<{
  isGenerating: boolean
  messages: PdfSplitterMessages
  result: SplitResult | null
  resultUrl: string | null
}>

function ResultsCard({
  isGenerating,
  messages,
  result,
  resultUrl,
}: ResultsCardProps) {
  return (
    <Card className="gap-0 bg-muted/15 py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
        {result ? (
          <CardAction>
            <Badge variant="secondary">
              {formatTemplate(messages.resultFileCount, {
                count: result.fileCount,
              })}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent aria-live="polite" className="p-4">
        {result && resultUrl ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText />
              </div>
              <div className="min-w-0">
                <p className="font-medium">{messages.resultReady}</p>
                <p className="mt-1 text-sm break-words text-muted-foreground">
                  {result.filename}
                </p>
              </div>
            </div>

            <Button asChild className="w-full sm:w-auto">
              <a download={result.filename} href={resultUrl}>
                <Download data-icon="inline-start" />
                {result.kind === "zip"
                  ? messages.downloadZip
                  : messages.downloadPdf}
              </a>
            </Button>
          </div>
        ) : (
          <Empty className="min-h-48">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {isGenerating ? (
                  <LoaderCircle className="motion-safe:animate-spin" />
                ) : (
                  <FileText />
                )}
              </EmptyMedia>
              <EmptyTitle>
                {isGenerating ? messages.generating : messages.emptyResultTitle}
              </EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

export { ResultsCard }
export type { SplitResult }
