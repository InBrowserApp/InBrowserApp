import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileText, RefreshCcw, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "../core/pdf-document"

import type { PdfSplitterMessages } from "../client/types"

type UploadCardProps = Readonly<{
  isDraggingOver: boolean
  messages: PdfSplitterMessages
  onClick: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
}>

type PdfSummaryProps = Readonly<{
  file: File
  messages: PdfSplitterMessages
  onChangeFile: () => void
  onRemoveFile: () => void
  pageCount: number
}>

function UploadCard({
  isDraggingOver,
  messages,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: UploadCardProps) {
  return (
    <button
      aria-label={messages.dragDropOrClick}
      className={cn(
        "flex min-h-[18rem] w-full cursor-pointer touch-manipulation appearance-none rounded-xl border border-dashed border-border/80 bg-card p-6 text-card-foreground transition-[border-color,background-color] hover:border-foreground/25 hover:bg-muted/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        isDraggingOver && "border-foreground/30 bg-muted/25"
      )}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      type="button"
    >
      <Empty className="min-h-full flex-1 rounded-none border-0 p-0">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className={cn(
              "size-10 rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-5",
              isDraggingOver && "bg-foreground text-background"
            )}
          >
            <FileText />
          </EmptyMedia>
          <EmptyTitle className="text-base">
            {messages.dragDropOrClick}
          </EmptyTitle>
          <EmptyDescription>{messages.supportedFormats}</EmptyDescription>
          <EmptyDescription>{messages.uploadHint}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </button>
  )
}

function PdfSummary({
  file,
  messages,
  onChangeFile,
  onRemoveFile,
  pageCount,
}: PdfSummaryProps) {
  return (
    <Card className="min-h-[18rem] justify-between gap-0 py-0">
      <CardContent className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileText />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {messages.selectedPdf}
            </p>
            <p className="mt-1 font-medium break-words">{file.name}</p>
          </div>
        </div>

        <dl className="divide-y rounded-lg bg-muted/35 px-3 text-sm">
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-muted-foreground">{messages.fileSize}</dt>
            <dd className="font-medium">{formatBytes(file.size)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-muted-foreground">{messages.pageCount}</dt>
            <dd className="font-medium">{pageCount || "-"}</dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="grid gap-2 bg-transparent sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <Button
          className="w-full"
          onClick={onChangeFile}
          type="button"
          variant="outline"
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.changeFile}
        </Button>
        <Button
          className="w-full"
          onClick={onRemoveFile}
          type="button"
          variant="outline"
        >
          <Trash2 data-icon="inline-start" />
          {messages.removeFile}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { PdfSummary, UploadCard }
