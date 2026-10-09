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
import { failureOf } from "./core/failure"
import { ImageView } from "./image-view"
import type { imageSession } from "./session"
import type { Failure, Messages, OpenedImage, Preview } from "./types"

export function ImageReader({
  image,
  session,
  messages: m,
}: {
  image: OpenedImage
  session: ReturnType<typeof imageSession>
  messages: Messages
}) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const [background, setBackground] = useState("checkerboard")
  const [preview, setPreview] = useState<Preview | null>(image.preview)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Failure | null>(null)
  const generation = useRef(0)
  useEffect(
    () => () => {
      generation.current++
    },
    []
  )
  async function select(next: number) {
    const current = ++generation.current
    setIndex(next)
    setPreview(null)
    setError(null)
    setLoading(true)
    try {
      const result = await session.render(next)
      if (current === generation.current) setPreview(result)
    } catch (reason) {
      if (current === generation.current) setError(failureOf(reason))
    } finally {
      if (current === generation.current) setLoading(false)
    }
  }
  return (
    <>
      {image.info.count > 1 ? (
        <div className="flex shrink-0 flex-wrap items-center gap-1 border-b px-2 py-1">
          <span className="ms-1 text-sm text-muted-foreground">
            {m[image.info.kind]}
          </span>
          <DocumentIconButton
            label={m.previous}
            disabled={loading || index === 0}
            onClick={() => void select(index - 1)}
          >
            <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m[image.info.kind]}
            className="w-20"
            min={1}
            max={image.info.count}
            value={index + 1}
            disabled={loading}
            onCommit={(value) => void select(value - 1)}
          />
          <span className="text-sm text-muted-foreground tabular-nums">
            {m.count.replace("{total}", String(image.info.count))}
          </span>
          <DocumentIconButton
            label={m.next}
            disabled={loading || index === image.info.count - 1}
            onClick={() => void select(index + 1)}
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
            <AlertDescription>{m[error]}</AlertDescription>
          </Alert>
        </div>
      ) : null}
      {preview ? (
        <ImageView
          key={index}
          preview={preview}
          info={image.info}
          zoom={zoom}
          onZoom={setZoom}
          background={background}
          onBackground={setBackground}
          messages={m}
        />
      ) : null}
    </>
  )
}
