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
import { FileText, Plus, RefreshCcw } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "../core/pdf-page-organizer"

import type { PdfPageOrganizerMessages } from "./types"

const PDF_ACCEPT = "application/pdf,.pdf"

type UploadCardProps = Readonly<{
  disabled: boolean
  file: File | null
  inputId: string
  isReading: boolean
  messages: PdfPageOrganizerMessages
  onFileSelected: (file: File | null) => void
  pageCount: number
}>

function UploadCard({
  disabled,
  file,
  inputId,
  isReading,
  messages,
  onFileSelected,
  pageCount,
}: UploadCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const title = file ? messages.selectedFileLabel : messages.uploadTitle
  const description = file ? messages.localOnlyNote : messages.uploadDescription

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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {file ? (
          <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <FileText />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium break-all">{file.name}</p>
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
            aria-label={messages.addPdfLabel}
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
                "min-h-52 flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors",
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
                  {isReading ? messages.readingPdfLabel : messages.addPdfLabel}
                </EmptyTitle>
                <EmptyDescription>
                  {messages.supportedFormatsLabel}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}

        <input
          accept={PDF_ACCEPT}
          className="hidden"
          data-testid="pdf-page-organizer-input"
          disabled={disabled}
          id={inputId}
          name="pdf-page-organizer-pdf"
          onChange={(event) => {
            onFileSelected(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
          type="file"
        />
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {file ? messages.supportedFormatsLabel : messages.localOnlyNote}
        </p>
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
          {file ? (
            <RefreshCcw data-icon="inline-start" />
          ) : (
            <Plus data-icon="inline-start" />
          )}
          {file ? messages.changePdfLabel : messages.addPdfLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { UploadCard }
