import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Check, Download, FileText, LoaderCircle } from "@workspace/ui/icons"

import { formatBytes } from "../core/pdf-page-organizer"
import { useObjectUrl } from "./object-url"

import type { OrganizerResult, PdfPageOrganizerMessages } from "./types"

type ExportCardProps = Readonly<{
  canGenerate: boolean
  isGenerating: boolean
  messages: PdfPageOrganizerMessages
  onGenerate: () => void
  pageCount: number
  result: OrganizerResult | null
}>

function ExportCard({
  canGenerate,
  isGenerating,
  messages,
  onGenerate,
  pageCount,
  result,
}: ExportCardProps) {
  const resultUrl = useObjectUrl(result?.blob ?? null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.exportTitle}</CardTitle>
        <CardDescription>{messages.exportDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          {result ? (
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 font-medium">
                <Check aria-hidden="true" className="size-4 shrink-0" />
                {messages.resultReadyTitle}
              </p>
              <p className="text-sm break-all text-muted-foreground">
                <bdi>{result.fileName}</bdi>
              </p>
              <p className="text-xs text-muted-foreground">
                {messages.pageCountLabel}: {result.pageCount}
                {" · "}
                <bdi>{formatBytes(result.blob.size)}</bdi>
              </p>
            </div>
          ) : (
            <Badge variant="secondary">
              {messages.outputPagesLabel}: {pageCount}
            </Badge>
          )}
          {pageCount === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {messages.noPagesError}
            </p>
          ) : null}
        </div>
        {resultUrl && result ? (
          <Button
            asChild
            className="h-auto min-h-11 shrink-0 whitespace-normal"
          >
            <a download={result.fileName} href={resultUrl}>
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.downloadPdfLabel}
            </a>
          </Button>
        ) : (
          <Button
            className="h-auto min-h-11 shrink-0 whitespace-normal"
            disabled={!canGenerate}
            onClick={onGenerate}
            type="button"
          >
            {isGenerating ? (
              <LoaderCircle
                aria-hidden="true"
                className="motion-safe:animate-spin"
                data-icon="inline-start"
              />
            ) : (
              <FileText aria-hidden="true" data-icon="inline-start" />
            )}
            {isGenerating ? messages.generatingLabel : messages.generateLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export { ExportCard }
