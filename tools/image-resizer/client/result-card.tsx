import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, ImageUp } from "@workspace/ui/icons"

import type { ImageDimensions, ResizeResult } from "../core/resize-image"
import { formatFileSize } from "./constants"
import type { ImageResizerMessages } from "./types"

type ResultCardProps = Readonly<{
  messages: ImageResizerMessages
  result: ResizeResult | null
  resultPreviewUrl: string | null
  sourceDimensions: ImageDimensions | null
  sourcePreviewUrl: string | null
}>

export function ResultCard({
  messages,
  result,
  resultPreviewUrl,
  sourceDimensions,
  sourcePreviewUrl,
}: ResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {result && resultPreviewUrl && sourcePreviewUrl && sourceDimensions ? (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {messages.originalLabel}
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {sourceDimensions.width} × {sourceDimensions.height}
                  </Badge>
                </div>
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
                  <img
                    src={sourcePreviewUrl}
                    alt=""
                    className="h-72 w-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {messages.outputLabel}
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {result.outputWidth} × {result.outputHeight}
                  </Badge>
                </div>
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
                  <img
                    src={resultPreviewUrl}
                    alt=""
                    className="h-72 w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{result.mimeType}</Badge>
              <Badge variant="secondary">
                {formatFileSize(result.blob.size)}
              </Badge>
            </div>
          </>
        ) : (
          <Alert>
            <ImageUp />
            <AlertTitle>{messages.emptyResultTitle}</AlertTitle>
            <AlertDescription>
              {messages.emptyResultDescription}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {result && resultPreviewUrl ? (
        <CardFooter className="justify-end">
          <Button asChild>
            <a href={resultPreviewUrl} download={result.outputName}>
              <Download data-icon="inline-start" />
              {messages.downloadLabel}
            </a>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}
