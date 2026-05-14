import type * as React from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
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
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ImageIcon, ImageUp, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ImagePaletteExtractorMessages } from "./types"

type UploadCardProps = Readonly<{
  dimensions: { width: number; height: number } | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isDraggingOver: boolean
  messages: ImagePaletteExtractorMessages
  onClear: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSelectImage: () => void
  previewUrl: string | null
  selectedFile: File | null
}>

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadCard({
  dimensions,
  fileInputRef,
  isDraggingOver,
  messages,
  onClear,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  onSelectImage,
  previewUrl,
  selectedFile,
}: UploadCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <input
          ref={fileInputRef}
          accept="image/*"
          aria-label={messages.chooseImageLabel}
          className="sr-only"
          data-testid="image-input"
          onChange={onFileChange}
          type="file"
        />

        {selectedFile && previewUrl ? (
          <button
            aria-label={messages.changeImageLabel}
            className="flex w-full cursor-pointer appearance-none flex-col gap-4 bg-transparent p-0 text-left text-inherit"
            onClick={onSelectImage}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            type="button"
          >
            <div
              className={cn(
                "overflow-hidden rounded-xl border bg-muted/20 p-3 transition-colors",
                isDraggingOver && "border-foreground/30 bg-muted/45"
              )}
            >
              <img
                alt=""
                className="h-72 w-full rounded-lg object-contain"
                src={previewUrl}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="max-w-full min-w-0 truncate text-sm font-medium">
                {selectedFile.name}
              </span>
              <Badge variant="secondary">
                {formatFileSize(selectedFile.size)}
              </Badge>
              {dimensions ? (
                <Badge variant="outline" className="font-mono">
                  {dimensions.width} x {dimensions.height}
                </Badge>
              ) : null}
            </div>
          </button>
        ) : (
          <button
            aria-label={messages.chooseImageLabel}
            className="flex w-full cursor-pointer appearance-none bg-transparent p-0 text-inherit"
            onClick={onSelectImage}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            type="button"
          >
            <Empty
              className={cn(
                "min-h-[16rem] flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
                isDraggingOver && "border-foreground/30 bg-muted/45"
              )}
            >
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageUp />
                </EmptyMedia>
                <EmptyTitle>{messages.chooseImageLabel}</EmptyTitle>
                <EmptyDescription>{messages.uploadHint}</EmptyDescription>
                <EmptyDescription>
                  {messages.supportedFormatsLabel}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </button>
        )}
      </ToolPanelCardContent>
      {selectedFile ? (
        <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
          <Button onClick={onSelectImage} type="button" variant="outline">
            <ImageIcon data-icon="inline-start" />
            {messages.changeImageLabel}
          </Button>
          <Button onClick={onClear} type="button" variant="outline">
            <Trash2 data-icon="inline-start" />
            {messages.removeImageLabel}
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { UploadCard }
