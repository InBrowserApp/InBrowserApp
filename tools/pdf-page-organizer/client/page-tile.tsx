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
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react"

type PageTileProps = Readonly<{
  disabled: boolean
  dragHintId: string
  dropPlacement: "before" | "after" | null
  index: number
  isDragSource: boolean
  isRenderingPreviews: boolean
  messages: PdfPageOrganizerMessages
  onMoveDown: (index: number) => void
  onMoveUp: (index: number) => void
  onPointerDragCancel: () => void
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
        className="max-h-full max-w-full object-contain shadow-sm transition-transform motion-reduce:transition-none"
        draggable={false}
        height={preview.height}
        src={preview.dataUrl}
        style={{ transform: `rotate(${page.rotation}deg)` }}
        width={preview.width}
      />
    </div>
  )
}

function PageTile({
  disabled,
  dragHintId,
  dropPlacement,
  index,
  isDragSource,
  isRenderingPreviews,
  messages,
  onMoveDown,
  onMoveUp,
  onPointerDragCancel,
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
  const pageLabel = `${messages.sourcePageLabel} ${page.sourcePageNumber}`
  const dragLabel = `${messages.dragPageLabel}: ${pageLabel}`
  const positionLabel = `${messages.outputPagesLabel} ${index + 1}`

  function handleDragHandlePointerDown(event: ReactPointerEvent) {
    if (disabled) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    onPointerDragStart(index, event)
  }

  function releasePointerCapture(event: ReactPointerEvent) {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleDragHandlePointerUp(event: ReactPointerEvent) {
    releasePointerCapture(event)

    if (disabled) {
      return
    }

    onPointerDragEnd(event)
  }

  function handleDragHandlePointerCancel(event: ReactPointerEvent) {
    releasePointerCapture(event)
    onPointerDragCancel()
  }

  function handleDragHandleKeyDown(event: ReactKeyboardEvent) {
    if (disabled) {
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      onMoveUp(index)
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      onMoveDown(index)
    }
  }

  return (
    <li
      aria-label={`${positionLabel}. ${pageLabel}`}
      className={cn(
        "group relative flex min-w-0 flex-col gap-2 rounded-md p-2 transition-colors",
        !disabled && "hover:bg-muted/40",
        isDragSource && "bg-muted/50 opacity-70",
        disabled && "opacity-75"
      )}
      data-page-index={index}
    >
      {dropPlacement ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute start-2 end-2 z-10 h-0.5 rounded-full bg-primary",
            dropPlacement === "before" ? "-top-1" : "-bottom-1"
          )}
        />
      ) : null}
      <div className="relative aspect-[3/4] min-h-44">
        <PagePreview
          isRenderingPreviews={isRenderingPreviews}
          messages={messages}
          page={page}
          preview={preview}
          previewError={previewError}
        />
        <Badge className="absolute start-2 top-2" variant="secondary">
          {index + 1}
        </Badge>
        <button
          aria-describedby={dragHintId}
          aria-label={dragLabel}
          className={cn(
            "absolute end-2 top-2 inline-flex size-8 touch-none items-center justify-center rounded-md border bg-background/95 text-muted-foreground shadow-sm transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
            !disabled &&
              "cursor-grab hover:border-foreground/30 hover:text-foreground active:cursor-grabbing",
            disabled && "cursor-not-allowed"
          )}
          disabled={disabled}
          onKeyDown={handleDragHandleKeyDown}
          onPointerCancel={handleDragHandlePointerCancel}
          onPointerDown={handleDragHandlePointerDown}
          onPointerMove={(event) => {
            if (!disabled) {
              onPointerDragMove(event)
            }
          }}
          onPointerUp={handleDragHandlePointerUp}
          title={dragLabel}
          type="button"
        >
          <GripVertical />
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="min-w-0 pe-1">
          <p className="truncate text-sm font-medium">{pageLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {messages.pageSizeLabel}: {formatPageSize(page.width, page.height)}
          </p>
          <p className="text-xs text-muted-foreground">
            {messages.rotationLabel}: {page.rotation} deg
          </p>
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-border/60 pt-1">
          <Button
            aria-label={`${messages.moveUpLabel}: ${pageLabel}`}
            className="size-8"
            disabled={disabled || index === 0}
            onClick={() => {
              onMoveUp(index)
            }}
            size="icon"
            title={`${messages.moveUpLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label={`${messages.moveDownLabel}: ${pageLabel}`}
            className="size-8"
            disabled={disabled || index === pageCount - 1}
            onClick={() => {
              onMoveDown(index)
            }}
            size="icon"
            title={`${messages.moveDownLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label={`${messages.rotateClockwiseLabel}: ${pageLabel}`}
            className="size-8"
            disabled={disabled}
            onClick={() => {
              onRotateClockwise(page.id)
            }}
            size="icon"
            title={`${messages.rotateClockwiseLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <RefreshCcw />
          </Button>
          <Button
            aria-label={`${messages.removePageLabel}: ${pageLabel}`}
            className="size-8"
            disabled={disabled}
            onClick={() => {
              onRemove(page.id)
            }}
            size="icon"
            title={`${messages.removePageLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </li>
  )
}

export { PageTile }
