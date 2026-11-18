import { useEffect, useRef } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Download, LayoutGrid } from "@workspace/ui/icons"

import { drawComposition } from "../render"
import type { Composition } from "../core/layout"
import type { Messages, SourceImage } from "../types"

type Props = {
  images: readonly SourceImage[]
  composition: Composition
  background: string | null
  messages: Messages
  lang: string
  oversized: boolean
  exportFailed: boolean
  exporting: boolean
  onDownload: () => void
}

export function Preview({
  images,
  composition,
  background,
  lang,
  messages,
  oversized,
  exportFailed,
  exporting,
  onDownload,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { width, height } = composition
  const scale = Math.min(1, 1536 / Math.max(width, height))

  useEffect(() => {
    if (canvasRef.current) {
      drawComposition(canvasRef.current, composition, images, background, scale)
    }
  }, [background, composition, images, scale])

  const numbers = new Intl.NumberFormat(lang)
  const error = oversized
    ? messages.largeOutput
    : exportFailed
      ? messages.exportFailed
      : null
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4">
        <h2 className="font-heading text-base font-medium">
          {messages.preview}
        </h2>
        {images.length > 0 && (
          <span
            className="text-xs text-muted-foreground tabular-nums"
            dir="ltr"
          >
            {numbers.format(width)} × {numbers.format(height)} px
          </span>
        )}
      </div>
      <CardContent className="grid gap-3">
        {images.length > 0 ? (
          <>
            <div className="flex min-h-52 items-center justify-center rounded-lg border bg-muted/40 p-3">
              <canvas
                aria-label={messages.preview}
                className="block h-auto max-h-[28rem] w-auto max-w-full rounded-sm bg-[repeating-conic-gradient(var(--muted)_0%_25%,var(--background)_0%_50%)] bg-size-[16px_16px] object-contain"
                ref={canvasRef}
                role="img"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="status">
                {error}
              </p>
            )}
            <Button
              className="min-h-10 w-fit max-w-full justify-self-end whitespace-normal hover:bg-primary/90"
              disabled={exporting || oversized}
              onClick={onDownload}
              type="button"
            >
              <Download aria-hidden="true" data-icon="inline-start" />
              <span aria-live="polite">
                {exporting ? messages.exporting : messages.download}
              </span>
            </Button>
          </>
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 p-6 text-center text-muted-foreground">
            <LayoutGrid aria-hidden="true" className="size-6" />
            <p>{messages.emptyPreview}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
