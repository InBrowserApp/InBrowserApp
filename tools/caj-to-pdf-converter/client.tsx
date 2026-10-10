import { useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { DocumentToolbar } from "@workspace/ui/components/tool/document-toolbar"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
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
import { useDocument } from "./use-document"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "@workspace/pdf-reader/viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const { reader, state, report, status, error, pdf } = useDocument(
    file,
    container,
    m
  )
  const notes = report
    ? [
        ["hn", "c8"].includes(report.format ?? "") ? m.experimental : "",
        report.substitutedGlyphs ? m.substituted : "",
        report.outlineWarnings || report.outlineOmitted ? m.outlineWarning : "",
      ].filter(Boolean)
    : []

  return (
    <DocumentWorkspace
      tool="caj-to-pdf-converter"
      file={file}
      onFile={setFile}
      accept=".caj,.kdh,.nh"
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
        {pdf && file ? (
          <div className="flex shrink-0 justify-end border-b p-2">
            <DocumentDownload
              file={pdf}
              filename={file.name.replace(/\.[^.]+$/, ".pdf")}
              label={m.download}
            />
          </div>
        ) : null}
        {reader && state.total ? (
          <DocumentToolbar messages={m} state={state} reader={reader} />
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
            // A scrollable preview needs keyboard focus for arrow keys.
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={m.reader}
            aria-busy={Boolean(status)}
          >
            <div className="pdfViewer" />
          </div>
        </div>
        {report ? (
          <details
            className="max-h-32 shrink-0 overflow-auto border-t px-3 py-1"
            open={notes.length ? true : undefined}
          >
            <summary className="cursor-pointer rounded-sm py-1 text-sm focus-visible:outline-2 focus-visible:outline-ring">
              {m.compatibility}
            </summary>
            <div className="flex flex-col gap-1 pb-2 text-xs text-muted-foreground">
              <p>
                {m.format.replace(
                  "{format}",
                  (report.format ?? "").toUpperCase()
                )}
              </p>
              {notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
              <p>{m.textHint}</p>
            </div>
          </details>
        ) : null}
      </div>
    </DocumentWorkspace>
  )
}
