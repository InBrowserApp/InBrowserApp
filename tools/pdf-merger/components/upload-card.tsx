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
import { FileText, Plus } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { PDF_MIME_TYPE } from "../core/pdf-merger"

import type { PdfMergerMessages } from "../client/types"

const PDF_ACCEPT = `${PDF_MIME_TYPE},.pdf`

type UploadCardProps = Readonly<{
  disabled: boolean
  inputId: string
  messages: PdfMergerMessages
  onFilesSelected: (files: readonly File[]) => void
}>

function UploadCard({
  disabled,
  inputId,
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
          aria-label={messages.addFilesLabel}
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
              "min-h-56 flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors",
              !disabled && "hover:border-foreground/20 hover:bg-muted/45",
              isDraggingOver && "border-primary bg-primary/5",
              disabled && "opacity-70"
            )}
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.addFilesLabel}</EmptyTitle>
              <EmptyDescription>
                {messages.supportedFormatsLabel}
              </EmptyDescription>
              <EmptyDescription>{messages.localOnlyNote}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </label>

        <input
          accept={PDF_ACCEPT}
          className="sr-only"
          data-testid="pdf-merger-input"
          disabled={disabled}
          id={inputId}
          multiple
          name="pdf-merger-files"
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          type="file"
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          className="max-w-full text-center whitespace-normal"
          disabled={disabled}
          onClick={() => {
            document.getElementById(inputId)?.click()
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus data-icon="inline-start" />
          {messages.changeFilesLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { UploadCard }
