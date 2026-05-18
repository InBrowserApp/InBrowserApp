import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  LoaderCircle,
  RefreshCcw,
  Trash2,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatPageSize } from "../core/pdf-page-organizer"

import type {
  PdfPageEntry,
  PdfPageOrganizerMessages,
  PdfPagePreview,
} from "./types"
import type { PointerEvent as ReactPointerEvent } from "react"

type PageTileProps = Readonly<{
  disabled: boolean
  dragOverIndex: number | null
  index: number
  isRenderingPreviews: boolean
  messages: PdfPageOrganizerMessages
  onMoveDown: (index: number) => void
  onMoveUp: (index: number) => void
  onPointerDragEnd: (event: ReactPointerEvent) => void
  onPointerDragMove: (event: ReactPointerEvent) => void
  onPointerDragStart: (index: number, event: ReactPointerEvent) => void
  onRemove: (pageId: string) => void
  onRotateClockwise: (pageId: string) => void
  page: PdfPageEntry
  pageCount: number
  preview: PdfPagePreview | undefined
  previewError: string
}>

const INTERACTIVE_SELECTOR = "a,button,input,select,textarea,[role='button']"

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
  )
}

function PagePreview({
  isRenderingPreviews,
  messages,
  page,
  preview,
  previewError,
}: Readonly<{
  isRenderingPreviews: boolean
  messages: PdfPageOrganizerMessages
  page: PdfPageEntry
  preview: PdfPagePreview | undefined
  previewError: string
}>) {
  if (!preview) {
    const label =
      previewError ||
      (isRenderingPreviews
        ? messages.renderingPreviewsLabel
        : messages.previewUnavailableLabel)

    return (
      <div className="flex h-full min-h-44 items-center justify-center rounded-md border border-dashed bg-muted/30 text-muted-foreground">
        <div className="flex flex-col items-center gap-2 px-3 text-center text-xs">
          {isRenderingPreviews && !previewError ? (
            <LoaderCircle className="motion-safe:animate-spin" />
          ) : (
            <FileText />
          )}
          <span>{label}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-44 items-center justify-center overflow-hidden rounded-md border bg-muted/20 p-2">
      <img
        alt={`${messages.previewAltLabel} ${page.sourcePageNumber}`}
        className="max-h-full max-w-full object-contain shadow-sm transition-transform"
        draggable={false}
        src={preview.dataUrl}
        style={{ transform: `rotate(${page.rotation}deg)` }}
      />
    </div>
  )
}

function PageTile({
  disabled,
  dragOverIndex,
  index,
  isRenderingPreviews,
  messages,
  onMoveDown,
  onMoveUp,
  onPointerDragEnd,
  onPointerDragMove,
  onPointerDragStart,
  onRemove,
  onRotateClockwise,
  page,
  pageCount,
  preview,
  previewError,
}: PageTileProps) {
  return (
    <li
      aria-label={`${messages.sourcePageLabel} ${page.sourcePageNumber}`}
      className={cn(
        "group flex min-w-0 touch-none flex-col gap-3 rounded-lg border bg-background p-3 transition",
        !disabled && "cursor-grab select-none hover:border-foreground/20",
        dragOverIndex === index && "ring-2 ring-primary ring-offset-2",
        disabled && "opacity-75"
      )}
      data-page-index={index}
      onPointerCancel={onPointerDragEnd}
      onPointerDown={(event) => {
        if (disabled || isInteractiveTarget(event.target)) {
          return
        }

        event.preventDefault()
        event.currentTarget.setPointerCapture?.(event.pointerId)
        onPointerDragStart(index, event)
      }}
      onPointerMove={(event) => {
        if (disabled) {
          return
        }

        onPointerDragMove(event)
      }}
      onPointerUp={(event) => {
        if (disabled) {
          return
        }

        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }

        onPointerDragEnd(event)
      }}
    >
      <div className="relative aspect-[3/4] min-h-44">
        <PagePreview
          isRenderingPreviews={isRenderingPreviews}
          messages={messages}
          page={page}
          preview={preview}
          previewError={previewError}
        />
        <Badge className="absolute top-2 left-2" variant="secondary">
          {index + 1}
        </Badge>
        <span
          aria-label={`${messages.dragPageLabel}: ${messages.sourcePageLabel} ${page.sourcePageNumber}`}
          className="absolute top-2 right-2 rounded-md border bg-background/90 p-1 text-muted-foreground shadow-sm"
          role="img"
        >
          <GripVertical />
        </span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {messages.sourcePageLabel} {page.sourcePageNumber}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {messages.pageSizeLabel}: {formatPageSize(page.width, page.height)}
        </p>
        <p className="text-xs text-muted-foreground">
          {messages.rotationLabel}: {page.rotation} deg
        </p>
      </div>

      <div className="grid grid-cols-4 gap-1">
        <Button
          aria-label={`${messages.moveUpLabel}: ${messages.sourcePageLabel} ${page.sourcePageNumber}`}
          disabled={disabled || index === 0}
          onClick={() => {
            onMoveUp(index)
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowUp />
        </Button>
        <Button
          aria-label={`${messages.moveDownLabel}: ${messages.sourcePageLabel} ${page.sourcePageNumber}`}
          disabled={disabled || index === pageCount - 1}
          onClick={() => {
            onMoveDown(index)
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowDown />
        </Button>
        <Button
          aria-label={`${messages.rotateClockwiseLabel}: ${messages.sourcePageLabel} ${page.sourcePageNumber}`}
          disabled={disabled}
          onClick={() => {
            onRotateClockwise(page.id)
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          <RefreshCcw />
        </Button>
        <Button
          aria-label={`${messages.removePageLabel}: ${messages.sourcePageLabel} ${page.sourcePageNumber}`}
          disabled={disabled}
          onClick={() => {
            onRemove(page.id)
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  )
}

export { PageTile }
