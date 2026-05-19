import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
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

import {
  buildPageNumberLabel,
  resolvePageNumberCoordinates,
} from "../core/page-number-layout"
import { useObjectUrl } from "./use-object-url"
import { usePdfPagePreview } from "./use-pdf-page-preview"
import { formatBytes, formatMessage } from "./utils"

import type {
  PageNumberFormOptions,
  PdfPageNumberAdderMessages,
  PdfPageNumberResult,
} from "./types"
import type { PdfPagePreview } from "./use-pdf-page-preview"

type PreviewCardProps = Readonly<{
  file: File | null
  isGenerating: boolean
  messages: PdfPageNumberAdderMessages
  options: PageNumberFormOptions
  pageCount: number
  result: PdfPageNumberResult | null
  selectedPageCount: number
}>

const FALLBACK_PAGE_HEIGHT = 792
const FALLBACK_PAGE_WIDTH = 612

function PreviewCard({
  file,
  isGenerating,
  messages,
  options,
  pageCount,
  result,
  selectedPageCount,
}: PreviewCardProps) {
  const resultUrl = useObjectUrl(result?.blob ?? null)
  const { isRenderingPreview, preview } = usePdfPagePreview(file)
  const sampleTotal = pageCount || 12
  const label = buildPageNumberLabel(
    0,
    sampleTotal,
    options.startNumber,
    options.format
  )
  const fontFamily =
    options.fontFamily === "serif"
      ? '"Times New Roman", Times, serif'
      : "Helvetica, Arial, sans-serif"
  const selectedPagesLabel = pageCount
    ? selectedPageCount === pageCount
      ? messages.allPagesSelected
      : formatMessage(messages.selectedPagesCount, {
          count: selectedPageCount,
        })
    : messages.previewSamplePage

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.previewTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <PagePreview
            fontFamily={fontFamily}
            isRenderingPreview={isRenderingPreview}
            label={label}
            messages={messages}
            options={options}
            preview={preview}
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

function PagePreview({
  fontFamily,
  isRenderingPreview,
  label,
  messages,
  options,
  preview,
}: Readonly<{
  fontFamily: string
  isRenderingPreview: boolean
  label: string
  messages: PdfPageNumberAdderMessages
  options: PageNumberFormOptions
  preview: PdfPagePreview | null
}>) {
  const pageHeight = preview?.pageHeight ?? FALLBACK_PAGE_HEIGHT
  const pageWidth = preview?.pageWidth ?? FALLBACK_PAGE_WIDTH
  const textWidth = estimateTextWidth(label, options.fontSize, fontFamily)
  const coordinates = resolvePageNumberCoordinates({
    fontSize: options.fontSize,
    marginX: options.marginX,
    marginY: options.marginY,
    pageHeight,
    pageWidth,
    position: options.position,
    textWidth,
  })
  const textY = pageHeight - coordinates.y

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-muted/30 p-3">
      <div
        className="relative overflow-hidden rounded-sm border border-border bg-white text-black shadow-lg"
        style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}
      >
        {preview ? (
          <img
            alt=""
            className="size-full object-cover"
            height={preview.height}
            src={preview.imageUrl}
            width={preview.width}
          />
        ) : (
          <FallbackPage
            isRenderingPreview={isRenderingPreview}
            messages={messages}
          />
        )}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        >
          <text
            fill="currentColor"
            fontFamily={fontFamily}
            fontSize={options.fontSize}
            x={coordinates.x}
            y={textY}
          >
            {label}
          </text>
        </svg>
      </div>
    </div>
  )
}

function FallbackPage({
  isRenderingPreview,
  messages,
}: Readonly<{
  isRenderingPreview: boolean
  messages: PdfPageNumberAdderMessages
}>) {
  return (
    <>
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200" />
      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-200" />
      {isRenderingPreview ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {messages.readingPdfTitle}
        </div>
      ) : null}
    </>
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

function estimateTextWidth(
  label: string,
  fontSize: number,
  fontFamily: string
) {
  const averageGlyphWidth = fontFamily.includes("Times") ? 0.5 : 0.56

  return label.length * fontSize * averageGlyphWidth
}

export { PreviewCard }
