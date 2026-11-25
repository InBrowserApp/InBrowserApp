import { useEffect, useState } from "react"
import { failure } from "@workspace/notebook"
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
import { PrintPreview } from "./print-preview"
import type { Messages } from "./types"

type Result = { source: File } & ({ html: string } | { error: string })

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const current = result?.source === file ? result : null
  const error = current && "error" in current ? current.error : null

  useEffect(() => {
    if (!file) return
    if (!/\.ipynb$/i.test(file.name) || !file.size) {
      setResult({
        source: file,
        error: file.size ? m.unsupported : m.emptyFile,
      })
      return
    }
    const task = new AbortController()
    void import("./print-document")
      .then(({ prepareNotebookPrint }) =>
        prepareNotebookPrint(file, lang, m, task.signal)
      )
      .then((html) => {
        if (!task.signal.aborted) setResult({ source: file, html })
      })
      .catch((reason: unknown) => {
        if (!task.signal.aborted)
          setResult({ source: file, error: m[failure(reason)] })
      })
    return () => task.abort()
  }, [file, lang, m])

  return (
    <DocumentWorkspace
      tool="ipynb-to-pdf-converter"
      file={file}
      onFile={(next) => {
        setResult(null)
        setFile(next)
      }}
      accept=".ipynb"
      active={Boolean(current && "html" in current)}
      messages={m}
    >
      {!file ? (
        <Empty className="min-h-48">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {file && !current ? (
        <p
          role="status"
          className="flex items-center justify-center gap-2 p-6 text-sm"
        >
          <Spinner />
          {m.loading}
        </p>
      ) : null}
      {error ? (
        <Alert variant="destructive" className="rounded-none border-0">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {current && "html" in current ? (
        <PrintPreview html={current.html} messages={m} />
      ) : null}
    </DocumentWorkspace>
  )
}
