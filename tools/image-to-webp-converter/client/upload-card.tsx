import { useState, type DragEvent } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { ImageUp, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { SUPPORTED_INPUT_ACCEPT } from "../core/webp-conversion"
import { formatBytes } from "./utils"

import type { ImageToWebpMessages } from "./types"

type UploadCardProps = Readonly<{
  files: readonly File[]
  inputId: string
  messages: ImageToWebpMessages
  onClearFiles: () => void
  onFilesSelected: (files: readonly File[]) => void
  onRemoveFile: (file: File) => void
}>

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function UploadCard({
  files,
  inputId,
  messages,
  onClearFiles,
  onFilesSelected,
  onRemoveFile,
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <label
          aria-label={messages.chooseImagesLabel}
          className="flex cursor-pointer"
          htmlFor={inputId}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Empty
            className={cn(
              "min-h-72 flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
              isDraggingOver && "border-primary bg-primary/5"
            )}
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageUp />
              </EmptyMedia>
              <EmptyTitle>{messages.chooseImagesLabel}</EmptyTitle>
              <EmptyDescription>{messages.uploadHint}</EmptyDescription>
              <EmptyDescription>
                {messages.supportedFormatsLabel}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </label>

        <input
          accept={SUPPORTED_INPUT_ACCEPT}
          className="sr-only"
          data-testid="image-to-webp-input"
          id={inputId}
          multiple
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          type="file"
        />

        {files.length ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="secondary">
                {messages.selectedImagesLabel}: {files.length}
              </Badge>
              <button
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                onClick={onClearFiles}
                type="button"
              >
                {messages.clearAllLabel}
              </button>
            </div>

            <ul className="grid gap-2">
              {files.map((file) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2"
                  key={fileKey(file)}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <Button
                    aria-label={`${messages.removeImageLabel}: ${file.name}`}
                    onClick={() => {
                      onRemoveFile(file)
                    }}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
      {files.length ? (
        <CardFooter>
          <label
            className="cursor-pointer text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            htmlFor={inputId}
          >
            {messages.changeImagesLabel}
          </label>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { UploadCard, fileKey }
