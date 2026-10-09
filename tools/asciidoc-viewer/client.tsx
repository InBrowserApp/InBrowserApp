import { useEffect, useState } from "react"
import type { Preview } from "./types"
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
import { FileText } from "@workspace/ui/icons"
import { DocumentView } from "./document-view"
import type { Failure, Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [ready, setReady] = useState<{
    file: File
    preview: Preview
  } | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setReady(null)
    setError(null)
    setLoading(false)
    if (!file) return
    if (!/\.(adoc|asciidoc)$/i.test(file.name)) {
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
      .then(async ({ openDocument, failure }) => {
        try {
          signal.throwIfAborted()
          const preview = await openDocument(file, signal, m)
          signal.throwIfAborted()
          setReady({ file, preview })
          setLoading(false)
        } catch (reason) {
          if (!signal.aborted) {
            setError(failure(reason))
            setLoading(false)
          }
        }
      })
      .catch(() => {
        if (!signal.aborted) {
          setError("invalid")
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [file, m])
  return (
    <DocumentWorkspace
      tool="asciidoc-viewer"
      file={file}
      onFile={setFile}
      accept=".adoc,.asciidoc"
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
              <FileText />
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
        <DocumentView preview={ready.preview} messages={m} />
      ) : null}
    </DocumentWorkspace>
  )
}
