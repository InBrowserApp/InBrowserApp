import { useMemo, useRef, useState } from "react"
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
import { PdfPreviewToolbar } from "./pdf-preview-toolbar"
import { useWordPdfPreview } from "@workspace/ui/lib/use-word-pdf-preview"
import type { WordPdfEngine } from "@workspace/ui/lib/use-word-pdf-preview"

type Messages = Parameters<typeof useWordPdfPreview>[2] &
  Parameters<typeof PdfPreviewToolbar>[0]["m"] &
  Record<
    | "open"
    | "replace"
    | "clear"
    | "reader"
    | "privacy"
    | "focus"
    | "exitFocus"
    | "releaseFile"
    | "error"
    | "drop"
    | "notes"
    | "layoutNotice"
    | "ready"
    | "download"
    | "cancel"
    | "fidelity"
    | "limitations",
    string
  >

export type WordPdfVariant = WordPdfEngine & {
  legacy?: boolean
}

export function WordPdfConverter({
  tool,
  accept,
  formats,
  messages,
  variants,
  legacyNotes,
}: {
  tool: string
  accept: string
  formats?: string
  messages: Messages
  variants: readonly WordPdfVariant[]
  legacyNotes?: Pick<
    Messages,
    "fidelity" | "limitations" | "layoutNotice" | "unsupported"
  >
}) {
  const [file, setFile] = useState<File | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const variant = file
    ? variants.find(({ match }) => match.test(file.name))
    : undefined
  const m = useMemo(
    () =>
      variant?.legacy && legacyNotes
        ? { ...messages, ...legacyNotes }
        : messages,
    [variant, messages, legacyNotes]
  )
  const { state, status, error, output } = useWordPdfPreview(
    file,
    container,
    m,
    variant
  )
  return (
    <>
      <DocumentWorkspace
        tool={tool}
        file={file}
        onFile={setFile}
        accept={accept}
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
              <EmptyDescription>
                {formats ? (
                  <>
                    {formats}
                    <br />
                  </>
                ) : null}
                {m.privacy}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        <div
          className={file && !error ? "flex min-h-0 flex-1 flex-col" : "hidden"}
        >
          {output ? (
            <>
              <Alert className="shrink-0 rounded-none border-x-0 border-t-0">
                <AlertTitle>{m.notes}</AlertTitle>
                <AlertDescription>{m.layoutNotice}</AlertDescription>
              </Alert>
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
                <p role="status" className="text-sm text-muted-foreground">
                  {m.ready.replace("{pages}", String(output.pages))}
                </p>
                <DocumentDownload
                  file={output.pdf}
                  filename={output.source.name.replace(/\.[^.]+$/, ".pdf")}
                  label={m.download}
                />
              </div>
              <PdfPreviewToolbar reader={output.reader} state={state} m={m} />
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
        </div>
      </DocumentWorkspace>
      {variant ? (
        <>
          <p className="mt-2 text-xs text-muted-foreground">{m.fidelity}</p>
          <p className="mt-2 text-xs text-muted-foreground">{m.limitations}</p>
        </>
      ) : null}
    </>
  )
}
