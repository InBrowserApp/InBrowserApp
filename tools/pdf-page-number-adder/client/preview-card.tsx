import { useEffect, useMemo, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
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
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
} from "@workspace/ui/icons"

import { PreviewPage } from "./preview-page"
import { useObjectUrl } from "./use-object-url"
import { usePdfPagePreview } from "./use-pdf-page-preview"
import { formatBytes, formatMessage } from "./utils"

import type {
  PageNumberFormOptions,
  PdfPageNumberAdderMessages,
  PdfPageNumberResult,
} from "./types"

type PreviewCardProps = Readonly<{
  file: File | null
  isGenerating: boolean
  messages: PdfPageNumberAdderMessages
  options: PageNumberFormOptions
  pageCount: number
  result: PdfPageNumberResult | null
  selectedPages: readonly number[]
}>

function PreviewCard({
  file,
  isGenerating,
  messages,
  options,
  pageCount,
  result,
  selectedPages,
}: PreviewCardProps) {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const resultUrl = useObjectUrl(result?.blob ?? null)
  const previewPageNumbers = useMemo(
    () => (selectedPages.length ? selectedPages : pageCount ? [1] : []),
    [pageCount, selectedPages]
  )
  const previewPageKey = previewPageNumbers.join(",")
  const previewIndex = Math.min(
    currentPreviewIndex,
    Math.max(0, previewPageNumbers.length - 1)
  )
  const previewPageNumber = previewPageNumbers[previewIndex] ?? 1
  const { isRenderingPreview, preview } = usePdfPagePreview(
    file,
    previewPageNumber
  )
  const fontFamily =
    options.fontFamily === "serif"
      ? '"Times New Roman", Times, serif'
      : "Helvetica, Arial, sans-serif"
  const selectedPageCount = selectedPages.length
  const selectedPagesLabel = pageCount
    ? selectedPageCount === pageCount
      ? messages.allPagesSelected
      : formatMessage(messages.selectedPagesCount, {
          count: selectedPageCount,
        })
    : messages.previewSamplePage
  const previewPageStatus = pageCount
    ? formatMessage(messages.previewPageStatus, {
        page: previewPageNumber,
        total: pageCount,
      })
    : messages.previewSamplePage

  useEffect(() => {
    setCurrentPreviewIndex(0)
  }, [file, previewPageKey])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <PreviewPage
            fontFamily={fontFamily}
            isRenderingPreview={isRenderingPreview}
            messages={messages}
            options={options}
            pageCount={pageCount}
            preview={preview}
            selectedPageIndex={previewIndex}
          />
          <PreviewNavigation
            canGoNext={previewIndex < previewPageNumbers.length - 1}
            canGoPrevious={previewIndex > 0}
            disabled={isRenderingPreview}
            messages={messages}
            onNext={() => {
              setCurrentPreviewIndex((index) =>
                Math.min(previewPageNumbers.length - 1, index + 1)
              )
            }}
            onPrevious={() => {
              setCurrentPreviewIndex((index) => Math.max(0, index - 1))
            }}
            status={previewPageStatus}
          />
          <p className="text-center text-sm text-muted-foreground">
            {selectedPagesLabel}
          </p>
        </div>
        <ResultPanel
          isGenerating={isGenerating}
          messages={messages}
          result={result}
          resultUrl={resultUrl}
        />
      </CardContent>
    </Card>
  )
}

function PreviewNavigation({
  canGoNext,
  canGoPrevious,
  disabled,
  messages,
  onNext,
  onPrevious,
  status,
}: Readonly<{
  canGoNext: boolean
  canGoPrevious: boolean
  disabled: boolean
  messages: PdfPageNumberAdderMessages
  onNext: () => void
  onPrevious: () => void
  status: string
}>) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        aria-label={messages.previousPreviewPageLabel}
        disabled={disabled || !canGoPrevious}
        onClick={onPrevious}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <ChevronLeft />
      </Button>
      <span
        aria-live="polite"
        className="min-w-0 rounded-full border bg-background px-3 py-1 text-center text-sm text-muted-foreground"
      >
        {status}
      </span>
      <Button
        aria-label={messages.nextPreviewPageLabel}
        disabled={disabled || !canGoNext}
        onClick={onNext}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <ChevronRight />
      </Button>
    </div>
  )
}

function ResultPanel({
  isGenerating,
  messages,
  result,
  resultUrl,
}: Readonly<{
  isGenerating: boolean
  messages: PdfPageNumberAdderMessages
  result: PdfPageNumberResult | null
  resultUrl: string | null
}>) {
  return (
    <div aria-live="polite" className="flex min-w-0 flex-col gap-4">
      <div>
        <h3 className="text-base font-medium">{messages.resultTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.resultDescription}
        </p>
      </div>
      {result ? (
        <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
          <div>
            <h4 className="text-sm font-medium">{messages.resultReadyTitle}</h4>
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
          {resultUrl ? (
            <Button
              asChild
              className="max-w-full text-center whitespace-normal"
            >
              <a download={result.fileName} href={resultUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadPdfLabel}
              </a>
            </Button>
          ) : null}
        </div>
      ) : (
        <Empty className="min-h-48 border border-dashed border-border/80 bg-muted/20">
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
    </div>
  )
}

export { PreviewCard }
