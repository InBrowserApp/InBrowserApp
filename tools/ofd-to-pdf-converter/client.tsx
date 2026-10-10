import { useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
import { Toolbar } from "./toolbar"
import { useDocument } from "./use-document"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "@workspace/pdf-reader/viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const { state, status, error, output } = useDocument(file, container, m)
  const position = output?.positions[state.page - 1]
  return (
    <>
      <DocumentWorkspace
        tool="ofd-to-pdf-converter"
        file={file}
        onFile={setFile}
        accept=".ofd,application/ofd"
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
              {output.substitutedFonts ? (
                <Alert className="shrink-0 rounded-none border-x-0 border-t-0">
                  <AlertTitle>{m.notes}</AlertTitle>
                  <AlertDescription>{m.fontNotice}</AlertDescription>
                </Alert>
              ) : null}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
                <p role="status" className="text-sm text-muted-foreground">
                  {m.ready
                    .replace("{pages}", String(output.positions.length))
                    .replace("{documents}", String(output.documents))}
                </p>
                <DocumentDownload
                  file={output.pdf}
                  filename={file!.name.replace(/\.ofd$/i, ".pdf")}
                  label={m.download}
                />
              </div>
              <Toolbar reader={output.reader} state={state} m={m} />
            </>
          ) : null}
          {status ? (
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 p-3">
              <p
                role="status"
                className="flex items-center gap-2 text-sm wrap-anywhere"
              >
                <Spinner className="shrink-0" />
                {status}
              </p>
              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                {m.cancel}
              </Button>
            </div>
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
          {position ? (
            <p className="shrink-0 border-t px-3 py-2 text-xs text-muted-foreground">
              {m.pageLabel
                .replace("{document}", String(position.document))
                .replace("{page}", String(position.page))}
            </p>
          ) : null}
        </div>
      </DocumentWorkspace>
      <p className="mt-2 text-xs text-muted-foreground">{m.fidelity}</p>
      <p className="mt-2 text-xs text-muted-foreground">{m.limitations}</p>
    </>
  )
}
