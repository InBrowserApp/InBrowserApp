import { useState, type DragEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
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
  FileText,
  LoaderCircle,
  RefreshCcw,
  Shield,
  Upload,
} from "@workspace/ui/icons"
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

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = disabled ? "none" : "copy"
    if (!disabled) setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    if (!disabled) onFileSelected(event.dataTransfer.files?.[0] ?? null)
  }

  const chooseButton = (
    <Button
      className="h-auto min-h-11 shrink-0 whitespace-normal"
      disabled={disabled}
      onClick={() => document.getElementById(inputId)?.click()}
      type="button"
      variant={file ? "outline" : "default"}
    >
      {file ? (
        <RefreshCcw aria-hidden="true" data-icon="inline-start" />
      ) : (
        <Upload aria-hidden="true" data-icon="inline-start" />
      )}
      {file ? messages.changePdfLabel : messages.addPdfLabel}
    </Button>
  )

  return (
    <Card>
      {!file ? (
        <CardHeader>
          <CardTitle>{messages.uploadTitle}</CardTitle>
          <CardDescription>{messages.uploadDescription}</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent className="flex flex-col gap-4">
        <div
          className={cn("rounded-lg", isDraggingOver && "ring-2 ring-primary")}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setIsDraggingOver(false)
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {file ? (
            <div
              className="flex flex-wrap items-center justify-between gap-4"
              aria-live="polite"
              aria-busy={isReading}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileText
                  aria-hidden="true"
                  className="size-8 shrink-0 text-muted-foreground"
                />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {messages.selectedFileLabel}
                  </p>
                  <p className="mt-1 text-sm font-medium break-all">
                    <bdi>{file.name}</bdi>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isReading ? (
                      messages.readingPdfLabel
                    ) : (
                      <>
                        {messages.pageCountLabel}: {pageCount}
                      </>
                    )}
                    {" · "}
                    <bdi>{formatBytes(file.size)}</bdi>
                  </p>
                </div>
              </div>
              {isReading ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-5 motion-safe:animate-spin"
                />
              ) : null}
              {chooseButton}
            </div>
          ) : (
            <Empty
              className={cn(
                "min-h-64 border border-dashed bg-muted/20",
                isDraggingOver && "bg-primary/5"
              )}
            >
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Upload aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{messages.dropPdfLabel}</EmptyTitle>
                <EmptyDescription>
                  {messages.supportedFormatsLabel}
                </EmptyDescription>
              </EmptyHeader>
              {chooseButton}
            </Empty>
          )}
        </div>
        <input
          accept={PDF_ACCEPT}
          aria-label={messages.addPdfLabel}
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
        <p className="flex items-start justify-center gap-2 text-xs leading-5 text-muted-foreground">
          <Shield aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {messages.localOnlyNote}
        </p>
      </CardContent>
    </Card>
  )
}

export { UploadCard }
