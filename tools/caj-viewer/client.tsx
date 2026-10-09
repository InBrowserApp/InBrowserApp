import { useEffect, useId, useRef, useState } from "react"
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
import { FileText, Maximize2, LayoutGrid, RotateCw } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { useDocument } from "./use-document"
import { Overview } from "./components/overview"
import type { Messages } from "./types"
import "pdfjs-dist/web/pdf_viewer.css"
import "@workspace/pdf-reader/viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const [file, setFile] = useState<File | null>(null)
  const [overview, setOverview] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const overviewButton = useRef<HTMLButtonElement>(null)
  const focusPage = useRef(false)
  const id = useId()
  const { reader, state, report, status, error } = useDocument(
    file,
    container,
    m
  )
  useEffect(() => {
    if (!overview && focusPage.current) {
      container.current?.focus({ preventScroll: true })
      focusPage.current = false
    }
  }, [overview])
  function selectedPage() {
    if (!window.matchMedia("(min-width: 640px)").matches) {
      focusPage.current = true
      setOverview(false)
    }
  }
  function closeOverview() {
    setOverview(false)
    overviewButton.current?.focus()
  }
  const notes = report
    ? [
        ["hn", "c8"].includes(report.format ?? "") ? m.experimental : "",
        report.substitutedGlyphs ? m.substituted : "",
        report.outlineWarnings || report.outlineOmitted ? m.outlineWarning : "",
      ].filter(Boolean)
    : []
  return (
    <DocumentWorkspace
      tool="caj-viewer"
      file={file}
      onFile={(next) => {
        setFile(next)
        setOverview(false)
      }}
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
        onKeyDownCapture={(event) => {
          if (event.key === "Escape" && overview) {
            event.preventDefault()
            event.stopPropagation()
            closeOverview()
          }
        }}
      >
        {reader && state.total ? (
          <DocumentToolbar
            messages={m}
            state={state}
            reader={reader}
            navigationActions={
              <DocumentIconButton
                ref={overviewButton}
                label={m.overview}
                aria-expanded={overview}
                aria-controls={overview ? id : undefined}
                onClick={() => setOverview((value) => !value)}
              >
                <LayoutGrid aria-hidden="true" />
              </DocumentIconButton>
            }
            actions={
              <>
                <DocumentIconButton
                  label={m.fitPage}
                  onClick={() => reader.zoom("page-fit")}
                >
                  <Maximize2 aria-hidden="true" />
                </DocumentIconButton>
                <DocumentIconButton label={m.rotate} onClick={reader.rotate}>
                  <RotateCw aria-hidden="true" />
                </DocumentIconButton>
              </>
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
        <div className="flex min-h-0 flex-1">
          {reader && overview ? (
            <Overview
              id={id}
              reader={reader}
              current={state.page}
              total={state.total}
              messages={m}
              onPage={(page) => {
                reader.page(page)
                selectedPage()
              }}
              onDestination={(destination) => {
                reader.destination(destination)
                selectedPage()
              }}
              onClose={closeOverview}
            />
          ) : null}
          <div
            className={cn(
              "relative min-h-0 min-w-0 flex-1 bg-muted",
              overview && "hidden sm:block"
            )}
          >
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
