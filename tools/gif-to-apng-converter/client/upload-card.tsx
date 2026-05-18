import { useRef, useState, type DragEvent } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import { ImageUp, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { GIF_MIME_TYPE } from "../core/apng-conversion"
import { formatBytes, formatInteger } from "./utils"

import type { GifToApngMessages } from "./types"

type UploadCardProps = Readonly<{
  files: readonly File[]
  inputId: string
  locale: string
  messages: GifToApngMessages
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
  locale,
  messages,
  onClearFiles,
  onFilesSelected,
  onRemoveFile,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function openFilePicker() {
    inputRef.current?.click()
  }

  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    onFilesSelected(Array.from(event.dataTransfer.files))
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b p-4">
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4 p-4">
        <button
          aria-label={messages.chooseFilesLabel}
          className="flex flex-1 cursor-pointer rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onClick={openFilePicker}
          onDragLeave={() => setIsDraggingOver(false)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type="button"
        >
          <Empty
            className={cn(
              "min-h-72 flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
              isDraggingOver && "border-primary bg-primary/5"
            )}
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageUp aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{messages.chooseFilesLabel}</EmptyTitle>
              <EmptyDescription>{messages.uploadHint}</EmptyDescription>
              <EmptyDescription>
                {messages.supportedFormatsLabel}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </button>

        <input
          accept={GIF_MIME_TYPE}
          aria-hidden="true"
          className="hidden"
          data-testid="gif-to-apng-input"
          id={inputId}
          multiple
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          ref={inputRef}
          tabIndex={-1}
          type="file"
        />

        {files.length ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="secondary">
                {messages.selectedFilesLabel}:{" "}
                {formatInteger(files.length, locale)}
              </Badge>
              <Button
                onClick={onClearFiles}
                size="sm"
                type="button"
                variant="ghost"
              >
                {messages.clearAllLabel}
              </Button>
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
                      {formatBytes(file.size, locale)}
                    </p>
                  </div>
                  <Button
                    aria-label={`${messages.removeFileLabel}: ${file.name}`}
                    onClick={() => onRemoveFile(file)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </ToolPanelCardContent>
      {files.length ? (
        <ToolPanelCardFooter className="justify-end border-t p-4">
          <Button
            onClick={openFilePicker}
            size="sm"
            type="button"
            variant="ghost"
          >
            {messages.changeFilesLabel}
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { UploadCard, fileKey }
