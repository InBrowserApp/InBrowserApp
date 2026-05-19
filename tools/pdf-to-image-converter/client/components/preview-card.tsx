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
import { Input } from "@workspace/ui/components/ui/input"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ChevronLeft, ChevronRight, ImageIcon } from "@workspace/ui/icons"

import { formatBytes, interpolate } from "../utils"

import type { PdfPageImage, PdfToImageMessages } from "../types"

type PreviewCardProps = Readonly<{
  image: PdfPageImage | null
  imageUrl: string | null
  isLoadingDocument: boolean
  isRendering: boolean
  messages: PdfToImageMessages
  numPages: number
  onPageChange: (page: number) => void
  page: number
}>

function PreviewCard({
  image,
  imageUrl,
  isLoadingDocument,
  isRendering,
  messages,
  numPages,
  onPageChange,
  page,
}: PreviewCardProps) {
  const hasDocument = numPages > 0
  const altText = interpolate(messages.previewAlt, { page })
  const pageSummary = interpolate(messages.pageSummary, {
    page,
    total: Math.max(1, numPages),
  })

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-[28rem] flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              aria-label={`${messages.pageLabel} ${Math.max(1, page - 1)}`}
              disabled={!hasDocument || page <= 1 || isRendering}
              onClick={() => onPageChange(page - 1)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <ChevronLeft />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {messages.pageLabel}
              </span>
              <Input
                aria-label={messages.pageInputLabel}
                className="w-20"
                disabled={!hasDocument || isRendering}
                max={Math.max(1, numPages)}
                min={1}
                onChange={(event) => {
                  onPageChange(Number(event.target.value))
                }}
                step={1}
                type="number"
                value={page}
              />
              <span className="text-sm text-muted-foreground">
                {pageSummary}
              </span>
            </div>
            <Button
              aria-label={`${messages.pageLabel} ${Math.min(
                Math.max(1, numPages),
                page + 1
              )}`}
              disabled={!hasDocument || page >= numPages || isRendering}
              onClick={() => onPageChange(page + 1)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <ChevronRight />
            </Button>
          </div>

          {image ? (
            <p className="text-sm text-muted-foreground">
              {interpolate(messages.imageDetails, {
                dpi: image.dpi,
                height: image.height,
                size: formatBytes(image.blob.size),
                width: image.width,
              })}
            </p>
          ) : null}
        </div>

        <div className="flex min-h-96 flex-1 items-center justify-center rounded-lg border bg-muted/30 p-3">
          {!hasDocument ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>{messages.emptyPreviewTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.emptyPreviewDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : isLoadingDocument || isRendering || !imageUrl ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner />
                </EmptyMedia>
                <EmptyTitle>{messages.renderingPreviewTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.renderingPreviewDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <img
              alt={altText}
              className="max-h-[70vh] max-w-full rounded-md bg-white object-contain shadow-sm"
              src={imageUrl}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { PreviewCard }
