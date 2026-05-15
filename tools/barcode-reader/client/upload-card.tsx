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
import { ImageIcon, ImageUp, LoaderCircle, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { SUPPORTED_IMAGE_ACCEPT } from "../core/barcode-decoder"

import type { BarcodeReaderMessages } from "./types"

type UploadCardProps = Readonly<{
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isDecoding: boolean
  isDraggingOver: boolean
  messages: BarcodeReaderMessages
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadCard({
  fileInputRef,
  isDecoding,
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
          accept={SUPPORTED_IMAGE_ACCEPT}
          aria-hidden="true"
          className="hidden"
          data-testid="barcode-image-input"
          name="barcode-image"
          onChange={onFileChange}
          tabIndex={-1}
          type="file"
        />

        {selectedFile && previewUrl ? (
          <button
            aria-label={messages.changeImageLabel}
            className="flex w-full cursor-pointer appearance-none flex-col gap-4 rounded-xl bg-transparent p-0 text-start text-inherit focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
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
                decoding="async"
                height={288}
                src={previewUrl}
                width={640}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{messages.selectedImageLabel}</Badge>
              <span className="max-w-full min-w-0 truncate text-sm font-medium">
                {selectedFile.name}
              </span>
              <Badge variant="outline">
                {formatFileSize(selectedFile.size)}
              </Badge>
              {isDecoding ? (
                <Badge variant="secondary" className="gap-1">
                  <LoaderCircle className="animate-spin" />
                  {messages.decodingImageLabel}
                </Badge>
              ) : null}
            </div>
          </button>
        ) : (
          <button
            aria-label={messages.chooseImageLabel}
            className="flex w-full cursor-pointer appearance-none rounded-xl bg-transparent p-0 text-inherit focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
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
