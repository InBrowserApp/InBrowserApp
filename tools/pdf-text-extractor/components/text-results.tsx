import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Download,
  Eye,
  FileText,
  LoaderCircle,
  TriangleAlert,
} from "@workspace/ui/icons"

import type { PdfTextExtractorMessages } from "../client/types"
import type { PdfTextExtractionResult } from "../core/pdf-text"

type TextResultsProps = Readonly<{
  downloadFileName: string
  downloadUrl: string | null
  isLoading: boolean
  lang: string
  messages: PdfTextExtractorMessages
  result: PdfTextExtractionResult | null
}>

function TextResults({
  downloadFileName,
  downloadUrl,
  isLoading,
  lang,
  messages,
  result,
}: TextResultsProps) {
  if (isLoading) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>{messages.extractingTitle}</EmptyTitle>
          <EmptyDescription>{messages.extractingDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!result) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Eye aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>{messages.noFileTitle}</EmptyTitle>
          <EmptyDescription>{messages.noFileDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const hasText = result.text.trim().length > 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-heading text-base font-medium">
            {messages.documentResults}
          </h2>
          <p className="text-sm text-muted-foreground">
            {messages.resultsDescription}
          </p>
        </div>

        {hasText ? (
          <div className="grid gap-2 sm:min-w-72 sm:grid-cols-2">
            <ToolCopyButton
              value={result.text}
              copyLabel={messages.copyText}
              copiedLabel={messages.copiedText}
              className="w-full"
            />
            {downloadUrl ? (
              <Button asChild variant="outline" size="sm" className="w-full">
                <a download={downloadFileName} href={downloadUrl}>
                  <Download aria-hidden="true" data-icon="inline-start" />
                  {messages.downloadTxt}
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
        <Metric
          label={messages.pageCount}
          lang={lang}
          value={result.pageCount}
        />
        <Metric
          label={messages.textPages}
          lang={lang}
          value={result.textPages}
        />
        <Metric
          label={messages.emptyTextPages}
          lang={lang}
          value={result.emptyTextPages}
        />
        <Metric
          label={messages.likelyScannedPages}
          lang={lang}
          value={result.likelyScannedPages}
        />
        <Metric
          label={messages.characterCount}
          lang={lang}
          value={result.characterCount}
        />
        <Metric
          label={messages.wordCount}
          lang={lang}
          value={result.wordCount}
        />
      </dl>

      {result.likelyScannedPages > 0 ? (
        <Alert>
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{messages.scannedWarningTitle}</AlertTitle>
          <AlertDescription>{messages.scannedWarning}</AlertDescription>
        </Alert>
      ) : null}

      {hasText ? (
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-muted-foreground"
            htmlFor="pdf-text-extractor-output"
          >
            {messages.textPreviewLabel}
          </label>
          <Textarea
            id="pdf-text-extractor-output"
            readOnly
            value={result.text}
            className="min-h-[22rem] resize-y font-mono text-sm whitespace-pre-wrap"
          />
        </div>
      ) : (
        <Empty className="min-h-56 border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{messages.noTextTitle}</EmptyTitle>
            <EmptyDescription>{messages.noTextDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}

function Metric({
  label,
  lang,
  value,
}: Readonly<{
  label: string
  lang: string
  value: number
}>) {
  const formatter = new Intl.NumberFormat(lang)

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 min-h-7 text-lg font-medium break-words">
        {formatter.format(value)}
      </dd>
    </div>
  )
}

export { TextResults }
