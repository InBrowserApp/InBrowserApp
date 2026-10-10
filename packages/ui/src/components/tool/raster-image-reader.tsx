import { useEffect, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import { RasterImageView } from "./raster-image-view"
import type {
  RasterImageMessages,
  RasterImage,
  RasterPreview,
} from "./raster-image-types"

export function RasterImageReader({
  image,
  render,
  errorMessage,
  download,
  messages: m,
}: {
  image: RasterImage
  render: (index: number) => Promise<RasterPreview>
  errorMessage: (reason: unknown) => string
  download: { label: string; filename: (index: number) => string }
  messages: RasterImageMessages
}) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const [background, setBackground] = useState("checkerboard")
  const firstRender = useRef(render)
  const initial = index === 0 && render === firstRender.current
  const [result, setResult] = useState<{
    index: number
    render: typeof render
    preview?: RasterPreview
    error?: unknown
  } | null>(null)
  const current = result?.index === index && result.render === render
  const preview = initial ? image.preview : current ? result.preview : null
  const loading = !initial && !current
  const error =
    !initial && current && !result.preview ? errorMessage(result.error) : null
  useEffect(() => {
    if (initial) return
    let active = true
    void render(index).then(
      (preview) => {
        if (active) setResult({ index, render, preview })
      },
      (error: unknown) => {
        if (active) setResult({ index, render, error })
      }
    )
    return () => {
      active = false
    }
  }, [index, render, initial])
  return (
    <>
      {image.info.count > 1 ? (
        <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1">
          <span
            title={m[image.info.kind]}
            className="ms-1 min-w-0 truncate text-sm text-muted-foreground"
          >
            {m[image.info.kind]}
          </span>
          <DocumentIconButton
            label={m.previous}
            disabled={loading || index === 0}
            onClick={() => setIndex(index - 1)}
          >
            <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m[image.info.kind]}
            className="w-16 shrink-0 sm:w-20"
            min={1}
            max={image.info.count}
            value={index + 1}
            disabled={loading}
            onCommit={(value) => setIndex(value - 1)}
          />
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {m.count.replace("{total}", String(image.info.count))}
          </span>
          <DocumentIconButton
            label={m.next}
            disabled={loading || index === image.info.count - 1}
            onClick={() => setIndex(index + 1)}
          >
            <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
        </div>
      ) : null}
      {image.info.poster ||
      (image.info.kind === "frame" && image.info.count > 1) ? (
        <p className="shrink-0 border-b bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {image.info.poster ? m.poster : m.animation}
        </p>
      ) : null}
      {loading ? (
        <p
          role="status"
          className="flex flex-1 items-center justify-center gap-2 p-6"
        >
          <Spinner />
          {m.loadingItem}
        </p>
      ) : null}
      {error ? (
        <div className="flex-1 p-3">
          <Alert variant="destructive">
            <AlertTitle>{m.itemError}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : null}
      {preview ? (
        <RasterImageView
          key={index}
          preview={preview}
          info={image.info}
          zoom={zoom}
          onZoom={setZoom}
          background={background}
          onBackground={setBackground}
          messages={m}
          download={{
            label: download.label,
            filename: download.filename(index),
          }}
        />
      ) : null}
    </>
  )
}
