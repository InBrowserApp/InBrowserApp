import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/ui/card"
import { Download } from "@workspace/ui/icons"

import { useObjectUrl } from "./object-url"
import { formatBytes, formatDeltaText, formatInteger } from "./utils"

import type { GifToApngResult } from "../core/apng-conversion"
import type { GifToApngMessages } from "./types"

type ResultPreviewCardProps = Readonly<{
  locale: string
  messages: GifToApngMessages
  result: GifToApngResult
}>

function ResultPreviewCard({
  locale,
  messages,
  result,
}: ResultPreviewCardProps) {
  const previewUrl = useObjectUrl(result.blob)
  const originalDimensions = `${formatInteger(
    result.originalWidth,
    locale
  )} x ${formatInteger(result.originalHeight, locale)}`
  const outputDimensions = `${formatInteger(result.outputWidth, locale)} x ${formatInteger(
    result.outputHeight,
    locale
  )}`

  return (
    <Card className="gap-0 overflow-hidden">
      <CardContent className="flex flex-col gap-4 p-4 pb-3">
        <div className="flex min-h-44 items-center justify-center rounded-lg border bg-[linear-gradient(135deg,rgba(161,161,170,0.10),rgba(228,228,231,0.22))] p-3">
          {previewUrl ? (
            <img
              alt={result.outputName}
              className="max-h-52 max-w-full rounded border bg-white/70 object-contain shadow-sm"
              height={result.outputHeight}
              src={previewUrl}
              width={result.outputWidth}
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{result.outputName}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">APNG</Badge>
            <Badge variant="outline">{outputDimensions}</Badge>
            <Badge variant="outline">
              {messages.frameCountLabel}:{" "}
              {formatInteger(result.frameCount, locale)}
            </Badge>
          </div>
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex justify-between gap-3">
            <dt>{messages.originalLabel}</dt>
            <dd className="text-right text-foreground">
              {originalDimensions}, {formatBytes(result.file.size, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{messages.outputLabel}</dt>
            <dd className="text-right text-foreground">
              {outputDimensions}, {formatBytes(result.blob.size, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{messages.outputSummaryLabel}</dt>
            <dd className="text-right text-foreground">
              {formatDeltaText(result.file.size, result.blob.size, locale)}
            </dd>
          </div>
        </dl>
      </CardContent>
      {previewUrl ? (
        <CardFooter className="justify-end p-3">
          <Button asChild variant="outline">
            <a download={result.outputName} href={previewUrl}>
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.downloadApngLabel}
            </a>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { ResultPreviewCard }
