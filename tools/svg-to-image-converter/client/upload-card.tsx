import { useState, type DragEvent } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
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
import { ImageUp } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { SvgDimensions } from "../core/svg-conversion"
import type { SvgToImageMessages } from "./types"

type UploadCardProps = Readonly<{
  inputId: string
  messages: SvgToImageMessages
  onFilesSelected: (files: readonly File[]) => void
  onRemoveFile: () => void
  selectedFile: File | null
  sourceDimensions: SvgDimensions | null
  sourcePreviewUrl: string | null
}>

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadCard({
  inputId,
  messages,
  onFilesSelected,
  onRemoveFile,
  selectedFile,
  sourceDimensions,
  sourcePreviewUrl,
}: UploadCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleDragLeave() {
    setIsDraggingOver(false)
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    onFilesSelected(Array.from(event.dataTransfer.files))
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {selectedFile && sourcePreviewUrl ? (
          <>
            <label
              className={cn(
                "block cursor-pointer overflow-hidden rounded-xl border border-dashed bg-muted/20 transition-colors",
                isDraggingOver
                  ? "border-primary bg-primary/5"
                  : "border-border/70 hover:border-foreground/20"
              )}
              htmlFor={inputId}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <span className="sr-only">{messages.changeFileLabel}</span>
              <img
                alt={messages.meta.name}
                className="h-72 w-full object-contain"
                src={sourcePreviewUrl}
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {selectedFile.name}
              </span>
              <Badge variant="secondary">
                {formatBytes(selectedFile.size)}
              </Badge>
              {sourceDimensions ? (
                <Badge variant="outline">
                  {sourceDimensions.width} × {sourceDimensions.height}
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label
                className="cursor-pointer text-muted-foreground underline underline-offset-4 hover:text-foreground"
                htmlFor={inputId}
              >
                {messages.changeFileLabel}
              </label>
              <button
                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                onClick={onRemoveFile}
                type="button"
              >
                {messages.removeFileLabel}
              </button>
            </div>
          </>
        ) : (
          <label
            aria-label={messages.chooseSvgLabel}
            className="flex flex-1 cursor-pointer"
            htmlFor={inputId}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Empty
              className={cn(
                "h-full min-h-[20rem] flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
                isDraggingOver && "border-primary bg-primary/5"
              )}
            >
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageUp />
                </EmptyMedia>
                <EmptyTitle>{messages.chooseSvgLabel}</EmptyTitle>
                <EmptyDescription>{messages.uploadHint}</EmptyDescription>
                <EmptyDescription>
                  {messages.supportedFormatsLabel}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}

        <input
          accept=".svg,image/svg+xml"
          className="sr-only"
          data-testid="svg-to-image-input"
          id={inputId}
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          type="file"
        />
      </CardContent>
    </Card>
  )
}
