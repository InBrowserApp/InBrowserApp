import { useState, type ReactNode } from "react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"
import { ArrowDown, ArrowUp, Eye, FileText, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { PDF_MERGER_ERROR, formatBytes } from "../core/pdf-merger"

import type { PdfMergerMessages, PdfQueueItem } from "../client/types"

type QueueCardProps = Readonly<{
  disabled: boolean
  inputSizeLabel: string
  items: readonly PdfQueueItem[]
  messages: PdfMergerMessages
  onClear: () => void
  onMoveDown: (index: number) => void
  onMoveUp: (index: number) => void
  onPreview: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  readyPageCount: number
}>

function QueueCard({
  disabled,
  inputSizeLabel,
  items,
  messages,
  onClear,
  onMoveDown,
  onMoveUp,
  onPreview,
  onRemove,
  onReorder,
  readyPageCount,
}: QueueCardProps) {
  const [draggedId, setDraggedId] = useState("")

  function getStatusLabel(item: PdfQueueItem) {
    if (item.status === "reading") {
      return messages.readingPdfLabel
    }

    if (item.errorCode === PDF_MERGER_ERROR.encrypted) {
      return messages.encryptedPdfError
    }

    if (item.status === "error") {
      return messages.invalidPdfError
    }

    const count = item.pageCount ?? 0
    const template =
      count === 1 ? messages.pageStatusLabel : messages.pagesStatusLabel
    return template.replace("{count}", String(count))
  }

  function handleDrop(targetIndex: number) {
    const sourceIndex = items.findIndex((item) => item.id === draggedId)
    setDraggedId("")

    if (sourceIndex >= 0) {
      onReorder(sourceIndex, targetIndex)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{messages.queueTitle}</CardTitle>
          <CardDescription>{messages.queueDescription}</CardDescription>
        </div>
        <CardAction>
          <Button
            className="max-w-full text-center whitespace-normal"
            disabled={disabled || items.length === 0}
            onClick={onClear}
            size="sm"
            type="button"
            variant="outline"
          >
            <Trash2 data-icon="inline-start" />
            {messages.clearAllLabel}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.fileCountLabel}: {items.length}
              </Badge>
              <Badge variant="outline">
                {messages.pageCountLabel}: {readyPageCount}
              </Badge>
              <Badge variant="outline">
                {messages.fileSizeLabel}: {inputSizeLabel}
              </Badge>
            </div>

            <TooltipProvider>
              <ol className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <li
                    className={cn(
                      "grid gap-3 rounded-lg border bg-background p-3 transition-colors sm:grid-cols-[3rem_minmax(0,1fr)_auto]",
                      draggedId === item.id && "border-primary bg-primary/5"
                    )}
                    draggable={!disabled}
                    key={item.id}
                    onDragEnd={() => {
                      setDraggedId("")
                    }}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.dataTransfer.dropEffect = "move"
                    }}
                    onDragStart={(event) => {
                      setDraggedId(item.id)
                      event.dataTransfer.effectAllowed = "move"
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      handleDrop(index)
                    }}
                  >
                    <div className="flex size-10 items-center justify-center self-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </div>

                    <div className="min-w-0 self-center">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-sm text-muted-foreground",
                          item.status === "error" && "text-destructive"
                        )}
                      >
                        {formatBytes(item.size)} · {getStatusLabel(item)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-1 self-center">
                      <IconButton
                        disabled={disabled || index === 0}
                        label={`${messages.moveUpLabel}: ${item.name}`}
                        onClick={() => {
                          onMoveUp(index)
                        }}
                      >
                        <ArrowUp />
                      </IconButton>
                      <IconButton
                        disabled={disabled || index === items.length - 1}
                        label={`${messages.moveDownLabel}: ${item.name}`}
                        onClick={() => {
                          onMoveDown(index)
                        }}
                      >
                        <ArrowDown />
                      </IconButton>
                      <IconButton
                        disabled={item.status === "error"}
                        label={`${messages.previewLabel}: ${item.name}`}
                        onClick={() => {
                          onPreview(item.id)
                        }}
                      >
                        <Eye />
                      </IconButton>
                      <IconButton
                        disabled={disabled}
                        label={`${messages.removeFileLabel}: ${item.name}`}
                        onClick={() => {
                          onRemove(item.id)
                        }}
                      >
                        <Trash2 />
                      </IconButton>
                    </div>
                  </li>
                ))}
              </ol>
            </TooltipProvider>
          </>
        ) : (
          <Empty className="min-h-64 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyQueueTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyQueueDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

type IconButtonProps = Readonly<{
  children: ReactNode
  disabled: boolean
  label: string
  onClick: () => void
}>

function IconButton({ children, disabled, label, onClick }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          size="icon"
          type="button"
          variant="ghost"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export { QueueCard }
