import { useEffect, useState } from "react"
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
import { pngFilename } from "@workspace/raster-image/png"
import type { Failure, OpenedImage } from "@workspace/raster-image/types"
import type { Messages } from "./types"

type Session = ReturnType<typeof imageSession>
export default function Client({ messages: m }: { messages: Messages }) {
  const [selection, setSelection] = useState<{ file: File | null; id: number }>(
    { file: null, id: 0 }
  )
  const file = selection.file
  function setFile(file: File | null) {
    setSelection((previous) => ({ file, id: previous.id + 1 }))
  }
  const [ready, setReady] = useState<{
    file: File
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
        const image = await session.open()
        controller.signal.throwIfAborted()
        setReady({ file, image, session })
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setError(failureOf(reason))
        setLoading(false)
        controller.abort()
      })
    return () => controller.abort()
  }, [file])
  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">{m.pngNote}</p>
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
        {ready && ready.file === file ? (
          <RasterImageReader
            key={selection.id}
            image={ready.image}
            render={ready.session.render}
            errorMessage={(reason) => m[failureOf(reason)]}
            download={{
              label: m.downloadPng,
              filename: (index) =>
                pngFilename(file.name, ready.image.info, index),
            }}
            messages={m}
          />
        ) : null}
      </DocumentWorkspace>
    </>
  )
}
