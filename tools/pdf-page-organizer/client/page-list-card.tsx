import { useId, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
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
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import { PageTile } from "./page-tile"

import type {
  PdfPageEntry,
  PdfPageOrganizerMessages,
  PdfPagePreview,
} from "./types"
import type { PointerEvent as ReactPointerEvent } from "react"

type PageListCardProps = Readonly<{
  disabled: boolean
  isRenderingPreviews: boolean
  messages: PdfPageOrganizerMessages
  onMoveDown: (index: number) => void
  onMovePage: (fromIndex: number, toIndex: number) => void
  onMoveUp: (index: number) => void
  onRemove: (pageId: string) => void
  onReset: () => void
  onRotateClockwise: (pageId: string) => void
  pages: readonly PdfPageEntry[]
  previewError: string
  previews: Readonly<Record<number, PdfPagePreview>>
}>

type PointerDragState = Readonly<{
  fromIndex: number
  pointerId: number
}>

type DropPlacement = "before" | "after"

function getPageIndexFromPoint(clientX: number, clientY: number) {
  const element = document
    .elementFromPoint(clientX, clientY)
    ?.closest("[data-page-index]")
  const index = Number.parseInt(
    element?.getAttribute("data-page-index") ?? "",
    10
  )

  return Number.isInteger(index) ? index : null
}

function PageListCard({
  disabled,
  isRenderingPreviews,
  messages,
  onMoveDown,
  onMovePage,
  onMoveUp,
  onRemove,
  onReset,
  onRotateClockwise,
  pages,
  previewError,
  previews,
}: PageListCardProps) {
  const dragHintId = useId()
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const [pointerDrag, setPointerDrag] = useState<PointerDragState | null>(null)

  function clearDragState() {
    setDragOverIndex(null)
    setPointerDrag(null)
  }

  function handlePointerDragStart(index: number, event: ReactPointerEvent) {
    setPointerDrag({ fromIndex: index, pointerId: event.pointerId })
    setDragOverIndex(index)
  }

  function handlePointerDragMove(event: ReactPointerEvent) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) {
      return
    }

    const nextIndex = getPageIndexFromPoint(event.clientX, event.clientY)

    if (nextIndex !== null) {
      setDragOverIndex(nextIndex)
    }
  }

  function handlePointerDragEnd(event: ReactPointerEvent) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) {
      return
    }

    const toIndex =
      getPageIndexFromPoint(event.clientX, event.clientY) ?? dragOverIndex

    if (toIndex !== null && pointerDrag.fromIndex !== toIndex) {
      announceMove(pointerDrag.fromIndex, toIndex)
      onMovePage(pointerDrag.fromIndex, toIndex)
    }

    clearDragState()
  }

  function getDropPlacement(index: number): DropPlacement | null {
    if (
      !pointerDrag ||
      dragOverIndex !== index ||
      dragOverIndex === pointerDrag.fromIndex
    ) {
      return null
    }

    return dragOverIndex < pointerDrag.fromIndex ? "before" : "after"
  }

  function announceMove(fromIndex: number, toIndex: number) {
    const page = pages[fromIndex]

    if (!page) {
      return
    }

    setAnnouncement(
      `${messages.sourcePageLabel} ${page.sourcePageNumber}. ` +
        `${messages.outputPagesLabel} ${toIndex + 1}/${pages.length}.`
    )
  }

  function handleMoveDown(index: number) {
    if (index >= pages.length - 1) {
      return
    }

    announceMove(index, index + 1)
    onMoveDown(index)
  }

  function handleMoveUp(index: number) {
    if (index <= 0) {
      return
    }

    announceMove(index, index - 1)
    onMoveUp(index)
  }

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{messages.pagesTitle}</CardTitle>
          <CardDescription>{messages.pagesDescription}</CardDescription>
        </div>
        <CardAction>
          <Button
            className="max-w-full text-center whitespace-normal"
            disabled={disabled || pages.length === 0}
            onClick={onReset}
            size="sm"
            type="button"
            variant="outline"
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.resetPagesLabel}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {pages.length ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {messages.outputPagesLabel}: {pages.length}
              </Badge>
              {isRenderingPreviews ? (
                <Badge variant="outline">
                  {messages.renderingPreviewsLabel}
                </Badge>
              ) : null}
              {previewError ? (
                <Badge variant="outline">{previewError}</Badge>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground" id={dragHintId}>
              {messages.dragPagesHint}
            </p>

            <div aria-atomic="true" aria-live="polite" className="sr-only">
              {announcement}
            </div>

            <ol
              aria-describedby={dragHintId}
              className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3"
            >
              {pages.map((page, index) => (
                <PageTile
                  disabled={disabled}
                  dragHintId={dragHintId}
                  dropPlacement={getDropPlacement(index)}
                  index={index}
                  isDragSource={pointerDrag?.fromIndex === index}
                  isRenderingPreviews={isRenderingPreviews}
                  key={page.id}
                  messages={messages}
                  onMoveDown={handleMoveDown}
                  onMoveUp={handleMoveUp}
                  onPointerDragCancel={clearDragState}
                  onPointerDragEnd={handlePointerDragEnd}
                  onPointerDragMove={handlePointerDragMove}
                  onPointerDragStart={handlePointerDragStart}
                  onRemove={onRemove}
                  onRotateClockwise={onRotateClockwise}
                  page={page}
                  pageCount={pages.length}
                  preview={previews[page.sourcePageNumber]}
                  previewError={previewError}
                />
              ))}
            </ol>
          </>
        ) : (
          <Empty className="min-h-64 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyPagesTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyPagesDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

export { PageListCard }
