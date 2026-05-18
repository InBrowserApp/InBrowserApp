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
import { FileText, Plus, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { PDF_MIME_TYPE } from "../core/pdf-page-numbers"
import { formatBytes } from "./utils"

import type { PdfPageNumberAdderMessages } from "./types"

type UploadCardProps = Readonly<{
  disabled: boolean
  file: File | null
  inputId: string
  isReading: boolean
  messages: PdfPageNumberAdderMessages
  onFileSelected: (file: File | null) => void
  onRemoveFile: () => void
  pageCount: number
}>

function UploadCard({
  disabled,
  file,
  inputId,
  isReading,
  messages,
  onFileSelected,
  onRemoveFile,
  pageCount,
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
    onFileSelected(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <FileText />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-medium">
                  {messages.selectedPdf}
                </h3>
                <p className="mt-1 text-sm break-all text-muted-foreground">
                  {file.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.pageCountLabel}: {pageCount}
              </Badge>
              <Badge variant="outline">
                {messages.fileSizeLabel}: {formatBytes(file.size)}
              </Badge>
            </div>
          </div>
        ) : (
          <label
            aria-label={messages.dragDropOrClick}
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
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>
                  {isReading
                    ? messages.readingPdfTitle
                    : messages.dragDropOrClick}
                </EmptyTitle>
                <EmptyDescription>
                  {isReading
                    ? messages.readingPdfDescription
                    : messages.supportedFormats}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}

        <input
          accept={`${PDF_MIME_TYPE},.pdf`}
          className="sr-only"
          data-testid="pdf-page-number-input"
          disabled={disabled}
          id={inputId}
          name="pdf-page-number-file"
          onChange={(event) => {
            onFileSelected(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
          type="file"
        />
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {messages.localOnlyNote}
        </p>
        <div className="flex flex-wrap gap-2">
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
            {file ? messages.changeFile : messages.dragDropOrClick}
          </Button>
          {file ? (
            <Button
              disabled={disabled}
              onClick={onRemoveFile}
              size="sm"
              type="button"
              variant="outline"
            >
              <Trash2 data-icon="inline-start" />
              {messages.removeFile}
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  )
}

export { UploadCard }
