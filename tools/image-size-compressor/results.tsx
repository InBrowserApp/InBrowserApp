import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Download, ImageIcon } from "@workspace/ui/icons"
import { readyImagesZip } from "./compress"
import type { DimensionConstraint } from "./compress"
import { fileKey } from "./batch"
import type { ImageOutcome } from "./batch"
import { message } from "./messages"
import type { Messages } from "./messages"
import { ResultPreview } from "./result-preview"

type Props = {
  outcomes: ImageOutcome[]
  limit: number
  formatSize: (bytes: number) => string
  number: Intl.NumberFormat
  dimensionMode: DimensionConstraint["mode"]
  messages: Messages
  previousResults: boolean
  id: string
  retrying: boolean
  onShrinkAndRetry: () => void
}

function useObjectUrl(blob: Blob | undefined) {
  const [preview, setPreview] = useState<{ blob: Blob; url: string }>()
  useEffect(() => {
    if (!blob) return
    const nextUrl = URL.createObjectURL(blob)
    setPreview({ blob, url: nextUrl })
    return () => URL.revokeObjectURL(nextUrl)
  }, [blob])
  return preview?.blob === blob ? (preview?.url ?? "") : ""
}

function ResultRow({
  outcome,
  limit,
  formatSize,
  messages,
}: Pick<Props, "limit" | "formatSize" | "messages"> & {
  outcome: ImageOutcome
}) {
  const { file, image, error } = outcome
  const url = useObjectUrl(image?.blob)
  const ready = image !== undefined && image.blob.size <= limit
  const dimensions = image ? `${image.width} × ${image.height} px` : ""
  const resized =
    image &&
    (image.width !== image.original.width ||
      image.height !== image.original.height)

  return (
    <li className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:px-5">
      <div className="row-span-2 flex size-11 items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground sm:row-span-1 sm:size-14">
        {image && url ? (
          <ResultPreview
            name={image.name}
            url={url}
            details={`${dimensions} · ${formatSize(image.blob.size)}`}
            messages={messages}
          />
        ) : (
          <ImageIcon aria-hidden="true" className="size-5" />
        )}
      </div>
      <div className="min-w-0">
        <p
          className="truncate text-sm font-medium"
          title={image?.name ?? file.name}
          dir="auto"
        >
          {image?.name ?? file.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {image && !ready ? (
            <p className="tabular-nums">
              {message(messages.overLimitDetail, {
                limit: formatSize(limit),
                actual: formatSize(image.blob.size),
              })}
            </p>
          ) : (
            <bdi dir="ltr" className="tabular-nums">
              {formatSize(file.size)}
              {image &&
                !image.originalKept &&
                ` → ${formatSize(image.blob.size)}`}
            </bdi>
          )}
          {image && (
            <bdi dir="ltr" className="tabular-nums">
              {resized &&
                `${image.original.width} × ${image.original.height} → `}
              {dimensions}
            </bdi>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-muted-foreground">{error}</p>}
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-auto sm:justify-end">
        {(!ready || Number.isFinite(limit)) && (
          <Badge
            variant={ready ? "secondary" : "outline"}
            className={
              ready
                ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                : error
                  ? "text-destructive"
                  : "border-amber-500/40 text-amber-800 dark:text-amber-300"
            }
          >
            {error
              ? messages.couldNotCompress
              : ready
                ? image.originalKept
                  ? messages.alreadyFits
                  : messages.withinLimit
                : messages.overLimit}
          </Badge>
        )}
        {ready && url && (
          <Button asChild variant="outline" size="sm">
            <a href={url} download={image.name}>
              <Download aria-hidden="true" />
              {messages.download}
            </a>
          </Button>
        )}
      </div>
    </li>
  )
}

export function CompressionResults({
  outcomes,
  limit,
  formatSize,
  number,
  dimensionMode,
  messages,
  id,
  previousResults,
  retrying,
  onShrinkAndRetry,
}: Props) {
  const ready = outcomes.flatMap(({ image }) =>
    image && image.blob.size <= limit ? [image] : []
  )
  const tooLarge = outcomes.some(
    ({ image }) => image && image.blob.size > limit
  )
  const canRetry = tooLarge && !previousResults && dimensionMode === "original"
  const [zipError, setZipError] = useState(false)
  const [zipping, setZipping] = useState(false)

  async function downloadZip() {
    setZipping(true)
    setZipError(false)
    try {
      const blob = await readyImagesZip(ready)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "compressed-images.zip"
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setZipError(true)
    } finally {
      setZipping(false)
    }
  }

  return (
    <section
      id={id}
      tabIndex={-1}
      className="scroll-mt-6 overflow-hidden rounded-xl border bg-card shadow-xs outline-none"
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-5">
        <div>
          <h2 id={`${id}-heading`} className="font-heading text-lg">
            {messages.results}
          </h2>
          {previousResults && (
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {messages.previousResults}
            </p>
          )}
          {Number.isFinite(limit) && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {message(messages.readyCount, {
                ready: number.format(ready.length),
                total: number.format(outcomes.length),
                limit: formatSize(limit),
              })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto whitespace-normal"
              onClick={onShrinkAndRetry}
              aria-disabled={retrying}
            >
              {messages.shrinkAndRetry}
            </Button>
          )}
          {ready.length > 1 && (
            <Button
              className="h-auto py-2 whitespace-normal"
              type="button"
              onClick={downloadZip}
              disabled={zipping}
            >
              <Download aria-hidden="true" />
              {messages.downloadZip}
            </Button>
          )}
        </div>
      </div>
      <ul className="divide-y">
        {outcomes.map((outcome) => (
          <ResultRow
            key={fileKey(outcome.file)}
            {...{ outcome, limit, formatSize, messages }}
          />
        ))}
      </ul>
      {((tooLarge && !previousResults && !canRetry) || zipError) && (
        <div className="space-y-1 border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground sm:px-5">
          {tooLarge && !previousResults && !canRetry && (
            <p>
              {dimensionMode === "exact"
                ? messages.tryExactLimit
                : messages.tryLargerLimit}
            </p>
          )}
          {zipError && <p role="alert">{messages.zipError}</p>}
        </div>
      )}
    </section>
  )
}
