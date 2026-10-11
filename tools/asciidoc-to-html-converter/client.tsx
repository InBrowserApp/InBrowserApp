import { useState } from "react"
import { DocumentHtmlResult } from "@workspace/ui/components/tool/document-html-result"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertTitle,
  AlertDescription,
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
import { FileText } from "@workspace/ui/icons"
import { useDocument } from "./use-document"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const { output, error, loading } = useDocument(file, m)
  return (
    <>
      <DocumentWorkspace
        tool="asciidoc-to-html-converter"
        file={file}
        onFile={setFile}
        accept=".adoc,.asciidoc"
        active={Boolean(file && !error)}
        messages={m}
      >
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {!file ? (
          <Empty className="min-h-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{m.drop}</EmptyTitle>
              <EmptyDescription>{m.privacy}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {loading ? (
          <div className="flex flex-1 flex-wrap items-center justify-center gap-2 p-6">
            <p role="status" className="flex items-center gap-2 text-sm">
              <Spinner />
              {m.reading}
            </p>
            <Button variant="outline" size="sm" onClick={() => setFile(null)}>
              {m.cancel}
            </Button>
          </div>
        ) : null}
        {output ? (
          <DocumentHtmlResult
            html={output.preview.html}
            title={output.preview.title}
            file={output.file}
            filename={output.source.name.replace(
              /\.(adoc|asciidoc)$/i,
              ".html"
            )}
            messages={m}
          />
        ) : null}
      </DocumentWorkspace>
      <p className="mt-2 text-xs text-muted-foreground">{m.fidelity}</p>
      <p className="mt-2 text-xs text-muted-foreground">{m.limitations}</p>
    </>
  )
}
