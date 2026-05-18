import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Download, FileText, ImageIcon } from "@workspace/ui/icons"

import { formatBytes } from "../core/format"
import { safeDownloadName } from "../core/path"
import { HighlightedPreview } from "./highlighted-preview"

import type { ArchiveEntry } from "../core/types"
import type { ArchiveViewerMessages } from "../types"

type PreviewState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "text"; blob: Blob; language: string; text: string }>
  | Readonly<{ status: "image"; blob: Blob; objectUrl: string }>
  | Readonly<{ status: "pdf"; blob: Blob; objectUrl: string }>
  | Readonly<{ status: "unavailable"; message: string; blob: Blob | null }>

type PreviewDialogProps = Readonly<{
  entry: ArchiveEntry | null
  messages: ArchiveViewerMessages
  open: boolean
  preview: PreviewState
  textDownloadUrl: string | null
  onOpenChange: (open: boolean) => void
}>

function PreviewDialog({
  entry,
  messages,
  open,
  preview,
  textDownloadUrl,
  onOpenChange,
}: PreviewDialogProps) {
  const downloadUrl =
    preview.status === "image" || preview.status === "pdf"
      ? preview.objectUrl
      : textDownloadUrl
  const downloadableBlob =
    preview.status === "text" || preview.status === "unavailable"
      ? preview.blob
      : preview.status === "image" || preview.status === "pdf"
        ? preview.blob
        : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={messages.closePreview}
        className="flex max-h-[min(90vh,56rem)] flex-col gap-0 p-0 sm:max-w-5xl"
      >
        <DialogHeader className="border-b px-4 py-4 pe-12">
          <DialogTitle className="break-words">
            {entry?.path ?? messages.previewTitle}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{messages.previewDescription}</span>
            {entry ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatBytes(entry.size)}</span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {renderPreviewBody({ entry, messages, preview })}
        </div>
        <DialogFooter className="border-t bg-muted/50 p-4">
          {preview.status === "text" ? (
            <ToolCopyButton
              value={preview.text}
              copyLabel={messages.copyPreview}
              copiedLabel={messages.copiedPreview}
            />
          ) : null}
          {entry && downloadUrl && downloadableBlob ? (
            <Button asChild variant="outline" size="sm">
              <a href={downloadUrl} download={safeDownloadName(entry.path)}>
                <Download data-icon="inline-start" />
                {messages.downloadEntry}
              </a>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function renderPreviewBody(params: {
  entry: ArchiveEntry | null
  messages: ArchiveViewerMessages
  preview: PreviewState
}) {
  const { entry, messages, preview } = params

  if (!entry || preview.status === "idle") {
    return null
  }

  if (preview.status === "loading") {
    return (
      <div
        role="status"
        className="flex min-h-80 items-center justify-center gap-2 rounded-lg border"
      >
        <Spinner aria-hidden="true" />
        <span className="text-sm text-muted-foreground">
          {messages.loadingPreview}
        </span>
      </div>
    )
  }

  if (preview.status === "text") {
    return (
      <HighlightedPreview
        ariaLabel={messages.textPreviewLabel}
        language={preview.language}
        value={preview.text}
      />
    )
  }

  if (preview.status === "image") {
    return (
      <div
        role="region"
        aria-label={messages.imagePreviewLabel}
        className="flex min-h-80 items-center justify-center rounded-lg border bg-background/60 p-3"
      >
        <img
          src={preview.objectUrl}
          alt={entry.path}
          className="max-h-[70vh] max-w-full object-contain"
        />
      </div>
    )
  }

  if (preview.status === "pdf") {
    if (!canUseInlinePdfPreview()) {
      return (
        <Alert>
          <FileText aria-hidden="true" />
          <AlertDescription>{messages.noPreview}</AlertDescription>
        </Alert>
      )
    }

    return (
      <div
        role="region"
        aria-label={messages.pdfPreviewLabel}
        className="min-h-80 overflow-hidden rounded-lg border bg-background"
      >
        <iframe
          src={preview.objectUrl}
          title={`${messages.pdfPreviewLabel}: ${entry.path}`}
          className="h-[70vh] min-h-80 w-full border-0"
        />
      </div>
    )
  }

  if (preview.status === "unavailable") {
    return (
      <Alert>
        {preview.blob ? (
          <FileText aria-hidden="true" />
        ) : (
          <ImageIcon aria-hidden="true" />
        )}
        <AlertDescription>{preview.message}</AlertDescription>
      </Alert>
    )
  }

  return null
}

function canUseInlinePdfPreview(): boolean {
  if (typeof navigator === "undefined") return true

  const pdfNavigator = navigator as Navigator & {
    pdfViewerEnabled?: boolean
  }
  return pdfNavigator.pdfViewerEnabled !== false
}

export { PreviewDialog }
export type { PreviewState }
