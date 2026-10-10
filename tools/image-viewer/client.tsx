import { useCallback, useEffect, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ImageIcon } from "@workspace/ui/icons"
import { failureOf } from "@workspace/raster-image/failure"
import { RasterImageReader } from "@workspace/ui/components/tool/raster-image-reader"
import { imageSession } from "@workspace/raster-image"
import { imageFilename } from "@workspace/raster-image/filename"
import { RasterExportOptions } from "@workspace/ui/components/tool/raster-export-options"
import type {
  Failure,
  OpenedImage,
  JpegOptions,
} from "@workspace/raster-image/types"
import type { Messages } from "./types"

type Session = ReturnType<typeof imageSession>
export default function Client({ messages: m }: { messages: Messages }) {
  const [format, setFormat] = useState<"png" | "jpg">("png")
  const [jpeg, setJpeg] = useState<JpegOptions>({
    quality: 90,
    background: "#ffffff",
  })
  const output = format === "jpg" ? jpeg : undefined
  const [selection, setSelection] = useState<{
    file: File | null
    id: number
    jpeg?: JpegOptions
  }>({ file: null, id: 0 })
  const file = selection.file
  function setFile(file: File | null) {
    setSelection((previous) => ({ file, id: previous.id + 1, jpeg: output }))
  }
  const [ready, setReady] = useState<{
    id: number
    image: OpenedImage
    session: Session
  } | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setReady(null)
    setError(null)
    setLoading(false)
    if (!file) return
    if (!file.size) {
      setError("emptyFile")
      return
    }
    const controller = new AbortController()
    setLoading(true)
    void Promise.resolve()
      .then(async () => {
        const session = imageSession(file, controller.signal)
        const image = await session.open(selection.jpeg)
        controller.signal.throwIfAborted()
        setReady({ id: selection.id, image, session })
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setError(failureOf(reason))
        setLoading(false)
        controller.abort()
      })
    return () => controller.abort()
  }, [file, selection])
  const renderImage = useCallback(
    (index: number) => {
      if (!ready) return Promise.reject(new Error("invalid"))
      return ready.session.render(index, output)
    },
    [ready, output]
  )
  return (
    <>
      <RasterExportOptions
        format={format}
        onFormat={setFormat}
        jpeg={jpeg}
        onJpeg={setJpeg}
        disabled={Boolean(file && ready?.id !== selection.id && !error)}
        messages={m.jpgExport}
      />
      <p className="mb-3 text-sm text-muted-foreground">
        {format === "jpg" ? m.jpgExport.note : m.pngNote}
      </p>
      <DocumentWorkspace
        tool="image-viewer"
        file={file}
        onFile={setFile}
        accept=".jpg,.jpeg,.png,.apng,.gif,.bmp,.webp,.avif,.tif,.tiff,.ico,.heic,.heif,.jxl,.jp2,.j2k,.jpf,.jpx,.jpm,.mj2"
        active={Boolean(file && !error)}
        messages={m}
      >
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription>{m[error]}</AlertDescription>
          </Alert>
        ) : null}
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
            <p role="status" className="flex items-center gap-2">
              <Spinner />
              {m.loading}
            </p>
            <Button variant="outline" onClick={() => setFile(null)}>
              {m.cancel}
            </Button>
          </div>
        ) : null}
        {!file ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>{m.drop}</EmptyTitle>
              <EmptyDescription>
                {m.formats}
                <br />
                {m.privacy}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {ready && ready.id === selection.id && file ? (
          <RasterImageReader
            key={selection.id}
            image={ready.image}
            render={renderImage}
            errorMessage={(reason) => m[failureOf(reason)]}
            download={{
              label: format === "jpg" ? m.jpgExport.download : m.downloadPng,
              filename: (index) =>
                imageFilename(file.name, ready.image.info, index, format),
            }}
            messages={
              format === "jpg"
                ? { ...m, compatibility: m.jpgExport.compatibility }
                : m
            }
          />
        ) : null}
      </DocumentWorkspace>
    </>
  )
}
