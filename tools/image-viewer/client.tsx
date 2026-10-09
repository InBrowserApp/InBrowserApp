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
import { failureOf } from "./core/failure"
import { ImageReader } from "./image-reader"
import { imageSession } from "./session"
import type { Failure, Messages, OpenedImage } from "./types"

type Session = ReturnType<typeof imageSession>
export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
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
        <ImageReader
          key={file.name + file.lastModified}
          image={ready.image}
          session={ready.session}
          messages={m}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
