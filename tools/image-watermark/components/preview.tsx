import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
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
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ImageIcon } from "@workspace/ui/icons"
import { drawWatermark } from "../render"
import type { WatermarkGeometry } from "../core/geometry"
import type { ImageSource, Messages, Options } from "../types"
import { TransformOverlay } from "./transform-overlay"

export function Preview({
  messages: m,
  source,
  logo,
  options,
  file,
  error,
  onChange,
}: {
  messages: Messages
  source: ImageSource | null
  logo: ImageSource | null
  options: Options
  file: File | null
  error: boolean
  onChange: (options: Options) => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [original, setOriginal] = useState(false)
  const [drawError, setDrawError] = useState(false)
  const [geometry, setGeometry] = useState<WatermarkGeometry | null>(null)
  const hintId = useId()
  useEffect(() => {
    if (!source) return
    const frame = requestAnimationFrame(() => {
      try {
        setGeometry(
          drawWatermark(canvas.current!, source, logo, options, 1200, original)
        )
        setDrawError(false)
      } catch {
        setDrawError(true)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [source, logo, options, original])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{m.previewTitle}</CardTitle>
          {source ? (
            <Button
              variant="outline"
              size="sm"
              aria-pressed={original}
              onClick={() => setOriginal(!original)}
            >
              {original ? m.watermarked : m.original}
            </Button>
          ) : null}
        </div>
        <CardDescription className="truncate" title={file?.name}>
          {file ? file.name : m.previewDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {source ? (
          <>
            <div className="flex min-h-64 items-center justify-center rounded-lg border bg-muted/30 p-7">
              <div
                className="relative w-full"
                style={{
                  aspectRatio: `${source.width} / ${source.height}`,
                  maxWidth: Math.min(
                    source.width,
                    (512 * source.width) / source.height
                  ),
                }}
              >
                <canvas
                  ref={canvas}
                  role="img"
                  aria-label={original ? m.original : m.previewTitle}
                  className="absolute inset-0 size-full"
                />
                {!original && !options.tiled && !drawError && geometry ? (
                  <TransformOverlay
                    canvas={canvas}
                    geometry={geometry}
                    options={options}
                    messages={m}
                    onChange={onChange}
                    hintId={hintId}
                  />
                ) : null}
              </div>
            </div>
            {!original && !options.tiled ? (
              <p
                id={hintId}
                className="text-xs text-pretty text-muted-foreground"
              >
                {m.editHint}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground tabular-nums">
              {m.dimensions
                .replace("{width}", String(source.width))
                .replace("{height}", String(source.height))}
            </p>
            {drawError ? (
              <Alert variant="destructive">
                <AlertDescription>{m.imageError}</AlertDescription>
              </Alert>
            ) : null}
          </>
        ) : (
          <Empty className="min-h-64 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {file ? (error ? m.errorTitle : m.loading) : m.emptyTitle}
              </EmptyTitle>
              <EmptyDescription>
                {error ? m.imageError : m.emptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
