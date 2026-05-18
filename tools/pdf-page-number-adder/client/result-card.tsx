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

import { useObjectUrl } from "./use-object-url"
import { formatBytes } from "./utils"

import type { PdfPageNumberAdderMessages, PdfPageNumberResult } from "./types"

type ResultCardProps = Readonly<{
  isGenerating: boolean
  messages: PdfPageNumberAdderMessages
  result: PdfPageNumberResult | null
}>

function ResultCard({ isGenerating, messages, result }: ResultCardProps) {
  const resultUrl = useObjectUrl(result?.blob ?? null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent aria-live="polite" className="flex flex-col gap-4">
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
                  ? messages.generatingTitle
                  : messages.emptyResultTitle}
              </EmptyTitle>
              <EmptyDescription>
                {isGenerating
                  ? messages.generatingDescription
                  : messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
      {resultUrl && result ? (
        <CardFooter className="justify-end">
          <Button asChild className="max-w-full text-center whitespace-normal">
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
