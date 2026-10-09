import { useEffect, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ImageIcon } from "@workspace/ui/icons"
import { IllustrationView } from "./illustration-view"
import type { Failure, Illustration, Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [ready, setReady] = useState<{
    file: File
    preview: Illustration
  } | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setReady(null)
    setError(null)
    setLoading(false)
    if (!file) return
    if (!/\.svgz?$/i.test(file.name)) {
      setError("unsupported")
      return
    }
    if (!file.size) {
      setError("emptyFile")
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    setLoading(true)
    void import("./open-document")
      .then(async ({ openDocument }) => {
        signal.throwIfAborted()
        const preview = await openDocument(file, signal)
        signal.throwIfAborted()
        setReady({ file, preview })
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (signal.aborted) return
        const message = reason instanceof Error ? reason.message : ""
        setError(
          reason instanceof RangeError
            ? "resourceLimit"
            : [
                  "invalid",
                  "compression",
                  "encoding",
                  "doctype",
                  "resourceLimit",
                ].includes(message)
              ? (message as Failure)
              : "renderError"
        )
        setLoading(false)
      })
    return () => controller.abort()
  }, [file])
  return (
    <DocumentWorkspace
      tool="svg-viewer"
      file={file}
      onFile={setFile}
      accept=".svg,.svgz,image/svg+xml"
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
        <p
          role="status"
          className="flex flex-1 items-center justify-center gap-2 p-6"
        >
          <Spinner />
          {m.loading}
        </p>
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
        <IllustrationView
          key={file.name + file.lastModified}
          preview={ready.preview}
          messages={m}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
