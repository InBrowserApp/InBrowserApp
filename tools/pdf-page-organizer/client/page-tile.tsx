import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  RotateCw,
  Trash2,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatPageSize } from "../core/pdf-page-organizer"
import { PagePreview } from "./page-preview"

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
    if (disabled || event.button !== 0) {
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
        "group @container relative flex min-w-0 flex-col gap-2 rounded-lg border p-2 select-none",
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
            "absolute end-2 top-2 inline-flex size-11 touch-none items-center justify-center rounded-md border bg-background/95 text-muted-foreground shadow-sm",
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
          <GripVertical aria-hidden="true" />
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="min-w-0 pe-1">
          <p className="truncate text-sm font-medium">{pageLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {messages.pageSizeLabel}:{" "}
            <bdi>{formatPageSize(page.width, page.height)}</bdi>
          </p>
          <p className="text-xs text-muted-foreground">
            {messages.rotationLabel}: <bdi>{page.rotation}°</bdi>
          </p>
        </div>

        <div className="grid grid-cols-2 place-items-center gap-1 border-t border-border/60 pt-1 @min-[12rem]:grid-cols-4">
          <Button
            aria-label={`${messages.moveUpLabel}: ${pageLabel}`}
            className="size-11"
            disabled={disabled || index === 0}
            onClick={() => {
              onMoveUp(index)
            }}
            size="icon"
            title={`${messages.moveUpLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button
            aria-label={`${messages.moveDownLabel}: ${pageLabel}`}
            className="size-11"
            disabled={disabled || index === pageCount - 1}
            onClick={() => {
              onMoveDown(index)
            }}
            size="icon"
            title={`${messages.moveDownLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <ArrowDown aria-hidden="true" />
          </Button>
          <Button
            aria-label={`${messages.rotateClockwiseLabel}: ${pageLabel}`}
            className="size-11"
            disabled={disabled}
            onClick={() => {
              onRotateClockwise(page.id)
            }}
            size="icon"
            title={`${messages.rotateClockwiseLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <RotateCw aria-hidden="true" />
          </Button>
          <Button
            aria-label={`${messages.removePageLabel}: ${pageLabel}`}
            className="size-11"
            disabled={disabled}
            onClick={() => {
              onRemove(page.id)
            }}
            size="icon"
            title={`${messages.removePageLabel}: ${pageLabel}`}
            type="button"
            variant="ghost"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
    </li>
  )
}

export { PageTile }
