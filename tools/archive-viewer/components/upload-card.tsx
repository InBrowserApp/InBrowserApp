import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileArchive, Trash2, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ArchiveViewerMessages } from "../types"
import type { ChangeEventHandler, DragEventHandler, RefObject } from "react"

type UploadCardProps = Readonly<{
  accept: string
  archiveName: string | null
  archiveSize: string | null
  isDragging: boolean
  isParsing: boolean
  messages: ArchiveViewerMessages
  onClear: () => void
  onDragEnter: DragEventHandler<HTMLButtonElement>
  onDragLeave: DragEventHandler<HTMLButtonElement>
  onDragOver: DragEventHandler<HTMLButtonElement>
  onDrop: DragEventHandler<HTMLButtonElement>
  onInputChange: ChangeEventHandler<HTMLInputElement>
  onPickFile: () => void
  inputRef: RefObject<HTMLInputElement | null>
}>

function UploadCard({
  accept,
  archiveName,
  archiveSize,
  isDragging,
  isParsing,
  messages,
  onClear,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onInputChange,
  onPickFile,
  inputRef,
}: UploadCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle>{messages.uploadTitle}</CardTitle>
          <Badge variant="secondary">{messages.supportedFormats}</Badge>
        </div>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {archiveName ? (
          <div className="flex flex-col gap-4 rounded-lg border border-input bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileArchive aria-hidden="true" className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{archiveName}</p>
                <p className="text-sm text-muted-foreground">{archiveSize}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPickFile}
                disabled={isParsing}
              >
                <Upload data-icon="inline-start" />
                {messages.chooseAnother}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
                disabled={isParsing}
              >
                <Trash2 data-icon="inline-start" />
                {messages.clearArchive}
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            aria-label={messages.uploadHint}
            onClick={onPickFile}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={cn(
              "w-full rounded-lg border border-dashed border-input bg-background/60 text-left transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isDragging && "border-primary bg-primary/5"
            )}
          >
            <Empty className="min-h-56 border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12">
                  <FileArchive aria-hidden="true" className="size-5" />
                </EmptyMedia>
                <EmptyTitle>{messages.uploadHint}</EmptyTitle>
                <EmptyDescription>{messages.localOnlyNote}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          aria-label={messages.uploadAction}
          className="sr-only"
          onChange={onInputChange}
        />
      </CardContent>
      <CardFooter className="justify-start">
        <Button
          type="button"
          variant={archiveName ? "ghost" : "default"}
          size="sm"
          onClick={onPickFile}
          disabled={isParsing}
        >
          <Upload data-icon="inline-start" />
          {messages.uploadAction}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { UploadCard }
