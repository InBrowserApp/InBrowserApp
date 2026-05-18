import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Download } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { useObjectUrl } from "./object-url"
import {
  formatBytes,
  formatSizeChangeText,
  resolveSizeChangeTrend,
} from "./utils"

import type { GifToAnimatedWebpResult } from "../core/animated-webp-conversion"
import type { GifToAnimatedWebpMessages } from "./types"

type ResultPreviewCardProps = Readonly<{
  messages: GifToAnimatedWebpMessages
  result: GifToAnimatedWebpResult
}>

function ResultPreviewCard({ messages, result }: ResultPreviewCardProps) {
  const previewUrl = useObjectUrl(result.blob)
  const sizeTrend = resolveSizeChangeTrend(result.file.size, result.blob.size)

  return (
    <article className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 p-4 pb-3">
        <div className="flex min-h-44 items-center justify-center rounded-lg border bg-[linear-gradient(135deg,rgba(161,161,170,0.10),rgba(228,228,231,0.22))] p-3">
          {previewUrl ? (
            <img
              alt={result.outputName}
              className="max-h-52 max-w-full rounded border bg-white/70 object-contain shadow-sm"
              height={result.outputHeight}
              loading="lazy"
              src={previewUrl}
              width={result.outputWidth}
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{result.outputName}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">Animated WebP</Badge>
            <Badge variant="outline">
              {result.outputWidth} × {result.outputHeight}
            </Badge>
          </div>
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex justify-between gap-3">
            <dt>{messages.originalLabel}</dt>
            <dd className="text-end text-foreground">
              {result.originalWidth} × {result.originalHeight},{" "}
              {formatBytes(result.file.size)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{messages.outputLabel}</dt>
            <dd className="text-end text-foreground">
              {result.outputWidth} × {result.outputHeight},{" "}
              {formatBytes(result.blob.size)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{messages.sizeChangeLabel}</dt>
            <dd
              className={cn(
                "text-end text-foreground",
                sizeTrend === "increase" && "text-destructive",
                sizeTrend === "decrease" &&
                  "text-emerald-600 dark:text-emerald-400"
              )}
            >
              {formatSizeChangeText(result.file.size, result.blob.size)}
            </dd>
          </div>
        </dl>
      </div>
      {previewUrl ? (
        <div className="flex justify-end border-t p-3">
          <Button asChild variant="outline">
            <a download={result.outputName} href={previewUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadWebpLabel}
            </a>
          </Button>
        </div>
      ) : null}
    </article>
  )
}

export { ResultPreviewCard }
