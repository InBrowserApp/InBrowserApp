import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
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
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Download, Eye, FileText, ImageIcon } from "@workspace/ui/icons"

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
  | Readonly<{ status: "unavailable"; message: string; blob: Blob | null }>

type PreviewCardProps = Readonly<{
  entry: ArchiveEntry | null
  messages: ArchiveViewerMessages
  preview: PreviewState
  textDownloadUrl: string | null
}>

function PreviewCard({
  entry,
  messages,
  preview,
  textDownloadUrl,
}: PreviewCardProps) {
  const downloadUrl =
    preview.status === "image" ? preview.objectUrl : textDownloadUrl
  const downloadableBlob =
    preview.status === "text" || preview.status === "unavailable"
      ? preview.blob
      : preview.status === "image"
        ? preview.blob
        : null

  return (
    <Card className="min-h-[32rem] xl:sticky xl:top-24 xl:self-start">
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        {entry ? (
          <div className="rounded-lg border border-border/70 bg-background/60 p-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              {messages.selectedFile}
            </p>
            <p className="mt-1 font-medium break-words">{entry.path}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatBytes(entry.size)}
            </p>
          </div>
        ) : null}

        {renderPreviewBody({ entry, messages, preview })}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-start gap-2">
        {preview.status === "text" ? (
          <ToolCopyButton
            value={preview.text}
            copyLabel={messages.copyPreview}
            copiedLabel={messages.copiedPreview}
            variant="ghost"
          />
        ) : null}
        {entry && downloadUrl && downloadableBlob ? (
          <Button asChild variant="outline" size="sm">
            <a href={downloadUrl} download={safeDownloadName(entry.path)}>
              <Download data-icon="inline-start" />
              {messages.downloadEntry}
            </a>
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadEntry}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function renderPreviewBody(params: {
  entry: ArchiveEntry | null
  messages: ArchiveViewerMessages
  preview: PreviewState
}) {
  const { entry, messages, preview } = params

  if (!entry) {
    return (
      <Empty className="min-h-80 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Eye aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>{messages.previewPlaceholderTitle}</EmptyTitle>
          <EmptyDescription>
            {messages.previewPlaceholderDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
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
          className="max-h-[26rem] max-w-full object-contain"
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

export { PreviewCard }
export type { PreviewState }
