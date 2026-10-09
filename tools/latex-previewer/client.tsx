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
import type { Diagnostic, Failure, Messages, Preview } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [error, setError] = useState<Failure | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setSource(null)
    setPreview(null)
    setDiagnostics([])
    setError(null)
    setLoading(false)
    if (!file) return
    if (!/\.(tex|latex)$/i.test(file.name)) {
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
    void Promise.all([import("./open-document"), import("./prepare-preview")])
      .then(async ([{ openDocument }, { preparePreview }]) => {
        signal.throwIfAborted()
        const result = await openDocument(file, signal, (text) => {
          if (!signal.aborted) setSource(text)
        })
        signal.throwIfAborted()
        setPreview(preparePreview(result.html, result.css, m))
        setDiagnostics(result.diagnostics)
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (signal.aborted) return
        setError(
          reason instanceof RangeError
            ? "resourceLimit"
            : reason instanceof Error &&
                ["encoding", "resourceLimit"].includes(reason.message)
              ? (reason.message as Failure)
              : "invalid"
        )
        setLoading(false)
      })
    return () => controller.abort()
  }, [file, m])
  return (
    <DocumentWorkspace
      tool="latex-previewer"
      file={file}
      onFile={setFile}
      accept=".tex,.latex,text/x-tex,application/x-tex"
      active={Boolean(file && (!error || source !== null))}
      messages={m}
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{m[error]}</AlertDescription>
        </Alert>
      ) : null}
      {loading ? (
        <p role="status" className="flex items-center justify-center gap-2 p-4">
          <Spinner />
          {m.loading}
        </p>
      ) : null}
      {!file ? (
        <Empty className="min-h-72">
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
      {source !== null && !loading ? (
        <DocumentView
          source={source}
          preview={preview}
          diagnostics={diagnostics}
          messages={m}
        />
      ) : (
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          <strong className="font-medium">{m.limitedPreview}. </strong>
          {m.subset}
        </p>
      )}
    </DocumentWorkspace>
  )
}
