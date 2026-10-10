import { useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
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
import { Toolbar } from "./toolbar"
import { useDocument } from "./use-document"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "@workspace/pdf-reader/viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const { state, status, error, output } = useDocument(file, container, m)
  return (
    <>
      <DocumentWorkspace
        tool="cbz-to-pdf-converter"
        file={file}
        onFile={setFile}
        accept=".cbz,application/vnd.comicbook+zip"
        active={Boolean(file && !error)}
        messages={m}
      >
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription className="wrap-anywhere">
              {error}
            </AlertDescription>
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
        <div
          className={file && !error ? "flex min-h-0 flex-1 flex-col" : "hidden"}
        >
          {output ? (
            <>
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
                <p role="status" className="text-sm text-muted-foreground">
                  {m.pdfExport.ready.replace(
                    "{total}",
                    String(output.names.length)
                  )}
                </p>
                <DocumentDownload
                  file={output.pdf}
                  filename={file!.name.replace(/\.cbz$/i, ".pdf")}
                  label={m.pdfExport.download}
                />
              </div>
              <Toolbar reader={output.reader} state={state} m={m} />
            </>
          ) : null}
          {status ? (
            <p
              role="status"
              className="flex items-center justify-center gap-2 p-4 text-sm wrap-anywhere"
            >
              <Spinner className="shrink-0" />
              {status}
            </p>
          ) : null}
          <div className="relative min-h-32 min-w-0 flex-1 bg-muted">
            <div
              ref={container}
              className="pdf-reader-container absolute inset-0 overflow-auto"
              dir="ltr"
              // The scrollable PDF preview supports keyboard scrolling.
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              role="region"
              aria-label={m.reader}
              aria-busy={Boolean(status)}
            >
              <div className="pdfViewer" />
            </div>
          </div>
          {output ? (
            <p
              className="shrink-0 truncate border-t px-3 py-2 text-xs text-muted-foreground"
              dir="auto"
              title={output.names[state.page - 1]}
            >
              {output.names[state.page - 1]}
            </p>
          ) : null}
        </div>
      </DocumentWorkspace>
      <p className="mt-2 text-xs text-muted-foreground">{m.order}</p>
      <p className="mt-2 text-xs text-muted-foreground">{m.pdfExport.note}</p>
    </>
  )
}
