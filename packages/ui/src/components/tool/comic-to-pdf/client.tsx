import { useRef, useState } from "react"
import { DocumentWorkspace } from "../document-workspace"
import { DocumentDownload } from "../document-download"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty"
import { Button } from "../../ui/button"
import { Spinner } from "../../ui/spinner"
import { FileText, Folder } from "../../../icons"
import { Toolbar } from "./toolbar"
import { useDocument } from "./use-document"
import type { ComicPdfFormat, Messages } from "./types"

const inputFormats = {
  cbz: { accept: ".cbz,application/vnd.comicbook+zip", extension: /\.cbz$/i },
  cbr: {
    accept: ".cbr,.rar,application/vnd.comicbook-rar,application/vnd.rar",
    extension: /\.(?:cbr|rar)$/i,
  },
} as const

export default function Client({
  messages: m,
  format,
}: {
  messages: Messages
  format: ComicPdfFormat
}) {
  const { accept, extension } = inputFormats[format]
  const [file, setFile] = useState<File | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const { state, status, error, output } = useDocument(
    file,
    container,
    m,
    extension
  )
  return (
    <>
      <DocumentWorkspace
        tool={`${format}-to-pdf-converter`}
        file={file}
        onFile={setFile}
        accept={accept}
        active={Boolean(file && !error)}
        messages={
          format === "cbr" && status ? { ...m, clear: m.pdfExport.cancel } : m
        }
        renderEmpty={(chooseFile) => (
          <Empty className="min-h-60 bg-muted/30">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText aria-hidden="true" />
              </EmptyMedia>
              <Button
                data-file-open
                className="min-h-11 px-4"
                onClick={chooseFile}
              >
                <Folder data-icon="inline-start" aria-hidden="true" />
                {m.open}
              </Button>
            </EmptyHeader>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </Empty>
        )}
      >
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{m.error}</AlertTitle>
            <AlertDescription className="wrap-anywhere">
              {error}
            </AlertDescription>
          </Alert>
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
                  filename={output.source.name.replace(extension, ".pdf")}
                  label={m.pdfExport.download}
                />
              </div>
              <Toolbar reader={output.reader} state={state} m={m} />
            </>
          ) : null}
          {status ? (
            <div className="flex flex-wrap items-center justify-center gap-3 p-4">
              <p
                role="status"
                className="flex min-w-0 items-center gap-2 text-sm"
              >
                <Spinner className="shrink-0" />
                <span className="min-w-0 wrap-anywhere">{status}</span>
              </p>
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
      {format === "cbz" ? (
        <>
          <p className="mt-2 text-xs text-muted-foreground">{m.order}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {m.pdfExport.note}
          </p>
        </>
      ) : null}
    </>
  )
}
