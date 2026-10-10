import { useRef, useState } from "react"
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
import { FileText } from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { DocumentToolbar as Toolbar } from "@workspace/ui/components/tool/document-toolbar"
import { useReader } from "./use-reader"
import { MarkdownExport } from "./markdown-export"
import type { Messages } from "./types"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { state, loading, error, reader } = useReader(file, container, m)
  function selectFile(next: File | null) {
    setFile(next)
  }
  return (
    <DocumentWorkspace
      tool="docx-viewer"
      file={file}
      onFile={selectFile}
      accept=".docx,.docm,.dotx,.dotm,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word.document.macroEnabled.12,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/vnd.ms-word.template.macroEnabled.12"
      active={Boolean(file && !error)}
      messages={m}
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {reader && file && state.total ? (
          <>
            <MarkdownExport
              reader={reader}
              filename={file.name}
              messages={m.markdown}
            />
            <Toolbar messages={m} state={state} reader={reader} />
          </>
        ) : null}
        {loading ? (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-6"
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
              <EmptyDescription>{m.privacy}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        <div
          className={
            file && !error ? "relative min-h-48 flex-1 bg-muted" : "hidden"
          }
        >
          <div
            ref={container}
            className="docx-reader-container absolute inset-0 overflow-auto"
            dir="ltr"
            // A scrollable reading region needs keyboard focus for arrow keys.
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={m.reader}
            aria-busy={loading}
          ></div>
        </div>
      </div>
    </DocumentWorkspace>
  )
}
