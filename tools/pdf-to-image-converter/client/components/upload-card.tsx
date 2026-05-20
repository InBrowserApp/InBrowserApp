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
import { FileText, Trash2, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "../utils"

import type { PdfToImageMessages } from "../types"

type UploadCardProps = Readonly<{
  disabled: boolean
  file: File | null
  inputId: string
  isLoadingDocument: boolean
  messages: PdfToImageMessages
  numPages: number
  onClear: () => void
  onOpenPicker: () => void
  onSelectFile: (file: File | null) => void
}>

const ACCEPTED_PDF_TYPES = "application/pdf,.pdf"

function UploadCard({
  disabled,
  file,
  inputId,
  isLoadingDocument,
  messages,
  numPages,
  onClear,
  onOpenPicker,
  onSelectFile,
}: UploadCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    if (disabled) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    if (disabled) return
    event.preventDefault()
    setIsDraggingOver(false)
    onSelectFile(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {file ? (
          <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">
                  {messages.selectedPdfTitle}
                </h3>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {file.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {messages.fileSizeLabel}: {formatBytes(file.size)}
              </Badge>
              {numPages > 0 ? (
                <Badge variant="secondary">
                  {messages.pageCountLabel}: {numPages}
                </Badge>
              ) : null}
            </div>
          </div>
        ) : (
          <label
            aria-label={messages.addPdfLabel}
            className={cn(
              "flex",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            htmlFor={disabled ? undefined : inputId}
            onDragLeave={() => setIsDraggingOver(false)}
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
                  {isLoadingDocument
                    ? messages.loadingDocumentLabel
                    : messages.addPdfLabel}
                </EmptyTitle>
                <EmptyDescription>
                  {messages.supportedFormatsLabel}
                </EmptyDescription>
                <EmptyDescription>{messages.localOnlyNote}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}

        <input
          accept={ACCEPTED_PDF_TYPES}
          className="sr-only"
          data-testid="pdf-to-image-input"
          disabled={disabled}
          id={inputId}
          name="pdf-to-image-file"
          onChange={(event) => {
            onSelectFile(event.target.files?.[0] ?? null)
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
          {file ? (
            <Button
              disabled={disabled}
              onClick={onClear}
              size="sm"
              type="button"
              variant="outline"
            >
              <Trash2 data-icon="inline-start" />
              {messages.removePdfLabel}
            </Button>
          ) : null}
          <Button
            disabled={disabled}
            onClick={onOpenPicker}
            size="sm"
            type="button"
            variant="outline"
          >
            <Upload data-icon="inline-start" />
            {file ? messages.changePdfLabel : messages.addPdfLabel}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export { UploadCard }
