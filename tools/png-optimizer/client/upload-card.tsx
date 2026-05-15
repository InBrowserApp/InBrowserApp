import {
  useState,
  type DragEvent,
  type KeyboardEvent,
  type RefObject,
} from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import { ImageIcon, ImageUp, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { PNG_MIME_TYPE } from "../core/png-optimizer"
import { useObjectUrl } from "./object-url"
import { formatBytes } from "./utils"

import type { PngOptimizerMessages } from "./types"

type UploadCardProps = Readonly<{
  inputId: string
  inputRef: RefObject<HTMLInputElement | null>
  messages: PngOptimizerMessages
  onClearFile: () => void
  onFileSelected: (file: File | null) => void
  selectedFile: File | null
}>

function UploadCard({
  inputId,
  inputRef,
  messages,
  onClearFile,
  onFileSelected,
  selectedFile,
}: UploadCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const selectedFileUrl = useObjectUrl(selectedFile)

  function openFilePicker() {
    inputRef.current?.click()
  }

  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDragLeave() {
    setIsDraggingOver(false)
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    onFileSelected(event.dataTransfer.files?.[0] ?? null)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }

    event.preventDefault()
    openFilePicker()
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <button
          aria-label={messages.chooseFileLabel}
          className="flex w-full rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onClick={openFilePicker}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          type="button"
        >
          {selectedFile ? (
            <div
              className={cn(
                "grid min-h-72 flex-1 gap-4 rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 transition-colors sm:grid-cols-[12rem_minmax(0,1fr)]",
                isDraggingOver && "border-primary bg-primary/5"
              )}
            >
              <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-md border bg-background">
                {selectedFileUrl ? (
                  <img
                    alt={selectedFile.name}
                    className="max-h-44 w-full object-contain"
                    height={256}
                    src={selectedFileUrl}
                    width={384}
                  />
                ) : (
                  <ImageIcon
                    aria-hidden="true"
                    className="text-muted-foreground"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-3">
                <Badge className="w-fit" variant="secondary">
                  {messages.selectedFileLabel}
                </Badge>
                <div className="min-w-0">
                  <p className="truncate font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {messages.fileSizeLabel}: {formatBytes(selectedFile.size)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {messages.replaceFileLabel}
                </p>
              </div>
            </div>
          ) : (
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
                <EmptyTitle>{messages.dropzoneTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.dropzoneDescription}
                </EmptyDescription>
                <EmptyDescription>{messages.pngOnlyLabel}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </button>

        <input
          ref={inputRef}
          accept={`${PNG_MIME_TYPE},.png`}
          className="hidden"
          data-testid="png-optimizer-input"
          id={inputId}
          name="png-optimizer-file"
          onChange={(event) => {
            onFileSelected(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
          type="file"
        />
      </ToolPanelCardContent>
      {selectedFile ? (
        <ToolPanelCardFooter className="justify-end">
          <Button onClick={onClearFile} type="button" variant="outline">
            <Trash2 aria-hidden="true" data-icon="inline-start" />
            {messages.clearFileLabel}
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { UploadCard }
