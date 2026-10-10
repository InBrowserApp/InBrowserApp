import { useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileText } from "@workspace/ui/icons"
import { useDocument } from "./use-document"
import { DocumentTextExport } from "@workspace/ui/components/tool/document-text-export"
import type { Messages } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const { output, loading, error } = useDocument(file, m)
  return (
    <DocumentWorkspace
      tool="docx-to-markdown-converter"
      file={file}
      onFile={setFile}
      accept=".docx,.docm,.dotx,.dotm"
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
              <FileText />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {loading ? (
        <p role="status" className="flex items-center justify-center gap-2 p-6">
          <Spinner aria-hidden="true" />
          {m.converting}
        </p>
      ) : null}
      {output?.blob && file ? (
        <DocumentTextExport
          text={output.text}
          blob={output.blob}
          filename={file.name.replace(/\.[^.]+$/, ".md")}
          messages={m}
        />
      ) : null}
      {output ? (
        <details className="shrink-0 border-t p-3 text-sm">
          <summary className="cursor-pointer font-medium">{m.notes}</summary>
          <div className="mt-2 max-h-32 space-y-2 overflow-auto text-muted-foreground">
            <p>{m.formatNote}</p>
            <p>{m.omittedNote}</p>
          </div>
        </details>
      ) : null}
    </DocumentWorkspace>
  )
}
