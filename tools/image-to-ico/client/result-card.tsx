import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
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

import type { ImageToIcoMessages } from "./types"

type ResultCardProps = Readonly<{
  downloadUrl: string | null
  fileName: string
  messages: ImageToIcoMessages
  resultBlob: Blob | null
  sizes: readonly number[]
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
  fileName,
  messages,
  resultBlob,
  sizes,
}: ResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {resultBlob && downloadUrl ? (
          <>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Badge key={size} variant="outline">
                  {size} × {size}
                </Badge>
              ))}
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  {messages.sizesIncludedLabel}:
                </span>{" "}
                {sizes.map((size) => `${size}×${size}`).join(", ")}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  {messages.fileSizeLabel}:
                </span>{" "}
                {formatBytes(resultBlob.size)}
              </p>
            </div>
            <Button asChild>
              <a download={fileName} href={downloadUrl}>
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
