import { Badge } from "@workspace/ui/components/ui/badge"
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
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Download } from "@workspace/ui/icons"

import type { SvgDimensions } from "../core/svg-conversion"
import type { SvgToImageMessages, SvgToImageResult } from "./types"

type ResultCardProps = Readonly<{
  downloadUrl: string | null
  messages: SvgToImageMessages
  result: SvgToImageResult | null
  resultPreviewUrl: string | null
  selectedFile: File | null
  sourceDimensions: SvgDimensions | null
}>

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ResultCard({
  downloadUrl,
  messages,
  result,
  resultPreviewUrl,
  selectedFile,
  sourceDimensions,
}: ResultCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result && downloadUrl && resultPreviewUrl ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{result.format.toUpperCase()}</Badge>
              <Badge variant="outline">
                {result.dimensions.width} × {result.dimensions.height}
              </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {messages.originalLabel}
                </p>
                <p>
                  {messages.dimensionsLabel}:{" "}
                  {sourceDimensions
                    ? `${sourceDimensions.width} × ${sourceDimensions.height}`
                    : "—"}
                </p>
                <p>
                  {messages.fileSizeLabel}:{" "}
                  {selectedFile ? formatBytes(selectedFile.size) : "—"}
                </p>
              </div>

              <div className="grid gap-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {messages.outputLabel}
                </p>
                <p>
                  {messages.dimensionsLabel}: {result.dimensions.width} ×{" "}
                  {result.dimensions.height}
                </p>
                <p>
                  {messages.fileSizeLabel}: {formatBytes(result.blob.size)}
                </p>
                <p className="truncate">{result.fileName}</p>
              </div>
            </div>

            <div className="flex min-h-80 items-center justify-center rounded-xl border bg-[linear-gradient(135deg,rgba(161,161,170,0.08),rgba(228,228,231,0.18))] p-4">
              <img
                alt={messages.outputLabel}
                className="max-h-full max-w-full rounded-lg border bg-white/70 object-contain shadow-sm"
                src={resultPreviewUrl}
              />
            </div>

            <Button asChild>
              <a download={result.fileName} href={downloadUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadLabel}
              </a>
            </Button>
          </>
        ) : (
          <Empty className="border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyTitle>{messages.emptyResultTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
