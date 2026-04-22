import { useState, type DragEvent } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
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
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"
import { FileText, TriangleAlert } from "@workspace/ui/icons"

import { formatBytes } from "../core/data-uri"
import type { FileToDataUriConverterMessages } from "../client/types"

type FileToDataUriInputCardProps = Readonly<{
  inputId: string
  messages: FileToDataUriConverterMessages
  selectedFile: File | null
  error: string | null
  onFilesSelected: (files: readonly File[]) => void
  onClearFile: () => void
}>

function FileToDataUriInputCard({
  inputId,
  messages,
  selectedFile,
  error,
  onFilesSelected,
  onClearFile,
}: FileToDataUriInputCardProps) {
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
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.file}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <label
          aria-label={messages.dragOrClick}
          className="flex flex-1 cursor-pointer"
          htmlFor={inputId}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div
              className={cn(
                "flex min-h-[18rem] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-8 text-center transition-colors hover:border-foreground/20 hover:bg-muted/45",
                isDraggingOver && "border-primary bg-primary/5"
              )}
            >
              <FileText className="size-12 text-muted-foreground" />
              <p className="mt-4 max-w-full truncate text-sm font-medium text-foreground">
                {selectedFile.name}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <Badge variant="secondary">
                  {formatBytes(selectedFile.size)}
                </Badge>
                <Badge variant="outline">
                  {selectedFile.type || messages.unknownType}
                </Badge>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {messages.dragOrClick}
              </p>
            </div>
          ) : (
            <Empty
              className={cn(
                "h-full min-h-[18rem] flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
                isDraggingOver && "border-primary bg-primary/5"
              )}
            >
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>{messages.file}</EmptyTitle>
                <EmptyDescription>{messages.dragOrClick}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </label>

        {selectedFile ? (
          <button
            className="w-fit text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={onClearFile}
            type="button"
          >
            {messages.clearFile}
          </button>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.readFailed}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <input
          className="sr-only"
          data-testid="file-to-data-uri-input"
          id={inputId}
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          type="file"
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { FileToDataUriInputCard }
