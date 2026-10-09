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
import { FileText } from "@workspace/ui/icons"
import { DocumentView } from "./document-view"
import { failure } from "./failure"
import type { DocDocument, Failure, Messages, Preview } from "./types"

type Ready = {
  file: File
  document: DocDocument
  preview: Preview
}

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [ready, setReady] = useState<Ready | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setReady(null)
    setError(null)
    setLoading(false)
    if (!file) return
    if (!/\.(doc|wps|wpt)$/i.test(file.name)) {
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
    void Promise.all([import("./open-document"), import("./preview")])
      .then(async ([{ openDocument }, { preparePreview }]) => {
        signal.throwIfAborted()
        const document = await openDocument(file, signal)
        signal.throwIfAborted()
        const preview = preparePreview(document, m)
        setReady({ file, document, preview })
        setLoading(false)
      })
      .catch((reason) => {
        if (!signal.aborted) {
          setError(failure(reason))
          setLoading(false)
        }
      })
    return () => {
      controller.abort()
    }
  }, [file, m])
  return (
    <DocumentWorkspace
      tool="doc-viewer"
      file={file}
      onFile={setFile}
      accept=".doc,.wps,.wpt,application/msword"
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
        <DocumentView
          key={ready.file.name}
          document={ready.document}
          preview={ready.preview}
          messages={m}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
