import { useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { DocumentToolbar } from "@workspace/ui/components/tool/document-toolbar"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileText, Maximize2 } from "@workspace/ui/icons"
import { useDocument } from "./use-document"
import { ReadingNotes } from "./reading-notes"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "@workspace/pdf-reader/viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const { reader, state, status, error, diagnostics } = useDocument(
    file,
    container,
    m
  )
  return (
    <DocumentWorkspace
      tool="typst-viewer"
      file={file}
      onFile={setFile}
      accept=".typ"
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
      <div
        className={file && !error ? "flex min-h-0 flex-1 flex-col" : "hidden"}
      >
        {reader && state.total ? (
          <DocumentToolbar
            messages={m}
            state={state}
            reader={reader}
            actions={
              <DocumentIconButton
                label={m.fitPage}
                onClick={() => reader.zoom("page-fit")}
              >
                <Maximize2 aria-hidden="true" />
              </DocumentIconButton>
            }
          />
        ) : null}
        {status ? (
          <p
            role="status"
            className="flex items-center justify-center gap-2 p-6"
          >
            <Spinner />
            {status}
          </p>
        ) : null}
        <div className="relative min-h-0 min-w-0 flex-1 bg-muted">
          <div
            ref={container}
            className="pdf-reader-container absolute inset-0 overflow-auto"
            dir="ltr"
            // A scrollable reading region needs keyboard focus for arrow keys.
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={m.reader}
            aria-busy={Boolean(status)}
          >
            <div className="pdfViewer" />
          </div>
        </div>
      </div>
      {file && (reader || error) ? (
        <ReadingNotes
          messages={m}
          diagnostics={diagnostics}
          failed={Boolean(error)}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
