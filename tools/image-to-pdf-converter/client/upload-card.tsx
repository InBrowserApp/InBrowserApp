import { useState, type DragEvent } from "react"

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
import { ImageUp, Plus } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { SUPPORTED_IMAGE_ACCEPT } from "./image-processing"

import type { ImageToPdfMessages } from "./types"

type UploadCardProps = Readonly<{
  disabled: boolean
  inputId: string
  isAddingImages: boolean
  messages: ImageToPdfMessages
  onFilesSelected: (files: readonly File[]) => void
}>

function UploadCard({
  disabled,
  inputId,
  isAddingImages,
  messages,
  onFilesSelected,
}: UploadCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    if (disabled) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    if (disabled) {
      return
    }

    event.preventDefault()
    setIsDraggingOver(false)
    onFilesSelected(Array.from(event.dataTransfer.files))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <label
          aria-label={messages.addImagesLabel}
          className={cn(
            "flex",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          htmlFor={disabled ? undefined : inputId}
          onDragLeave={() => {
            setIsDraggingOver(false)
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Empty
            className={cn(
              "min-h-64 flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors",
              !disabled && "hover:border-foreground/20 hover:bg-muted/45",
              isDraggingOver && "border-primary bg-primary/5",
              disabled && "opacity-70"
            )}
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageUp />
              </EmptyMedia>
              <EmptyTitle>
                {isAddingImages
                  ? messages.readingImagesLabel
                  : messages.addImagesLabel}
              </EmptyTitle>
              <EmptyDescription>{messages.pasteHint}</EmptyDescription>
              <EmptyDescription>
                {messages.supportedFormatsLabel}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </label>

        <input
          accept={SUPPORTED_IMAGE_ACCEPT}
          className="sr-only"
          data-testid="image-to-pdf-input"
          disabled={disabled}
          id={inputId}
          multiple
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          type="file"
        />
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {messages.localOnlyNote}
        </p>
        <Button
          disabled={disabled}
          onClick={() => {
            document.getElementById(inputId)?.click()
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus data-icon="inline-start" />
          {messages.changeImagesLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { UploadCard }
