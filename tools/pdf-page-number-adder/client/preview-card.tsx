import { useEffect, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"

import { PreviewPage } from "./preview-page"
import { usePdfPagePreview } from "./use-pdf-page-preview"
import { formatMessage } from "./utils"

import type { PageNumberFormOptions, PdfPageNumberAdderMessages } from "./types"

type PreviewCardProps = Readonly<{
  file: File | null
  messages: PdfPageNumberAdderMessages
  options: PageNumberFormOptions
  pageCount: number
  selectedPages: readonly number[]
}>

function PreviewCard({
  file,
  messages,
  options,
  pageCount,
  selectedPages,
}: PreviewCardProps) {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
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
      <CardContent className="flex min-w-0 flex-col gap-3">
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

export { PreviewCard }
