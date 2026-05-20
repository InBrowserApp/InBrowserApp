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
import { Download, FileText, LoaderCircle } from "@workspace/ui/icons"

import { formatBytes } from "../core/pdf-page-organizer"
import { useObjectUrl } from "./object-url"

import type { OrganizerResult, PdfPageOrganizerMessages } from "./types"

type ExportCardProps = Readonly<{
  canGenerate: boolean
  isGenerating: boolean
  messages: PdfPageOrganizerMessages
  onGenerate: () => void
  result: OrganizerResult | null
}>

function ExportCard({
  canGenerate,
  isGenerating,
  messages,
  onGenerate,
  result,
}: ExportCardProps) {
  const resultUrl = useObjectUrl(result?.blob ?? null)

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>{messages.exportTitle}</CardTitle>
        <CardDescription>{messages.exportDescription}</CardDescription>
      </CardHeader>
      <CardContent aria-live="polite" className="flex flex-col gap-4">
        {result ? (
          <div className="flex flex-col gap-4 border-y border-border/70 py-3">
            <div>
              <h3 className="text-base font-medium">
                {messages.resultReadyTitle}
              </h3>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {messages.outputFileLabel}
              </p>
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
          <Empty className="min-h-48 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {isGenerating ? (
                  <LoaderCircle className="motion-safe:animate-spin" />
                ) : (
                  <FileText />
                )}
              </EmptyMedia>
              <EmptyTitle>
                {isGenerating
                  ? messages.generatingLabel
                  : messages.emptyResultTitle}
              </EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
      <CardFooter className="flex-wrap justify-end gap-3">
        {resultUrl && result ? (
          <Button asChild className="max-w-full text-center whitespace-normal">
            <a download={result.fileName} href={resultUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadPdfLabel}
            </a>
          </Button>
        ) : null}
        <Button
          className="max-w-full text-center whitespace-normal"
          disabled={!canGenerate}
          onClick={onGenerate}
          type="button"
        >
          {isGenerating ? (
            <LoaderCircle
              className="motion-safe:animate-spin"
              data-icon="inline-start"
            />
          ) : (
            <FileText data-icon="inline-start" />
          )}
          {isGenerating ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ExportCard }
