import { useEffect, useId, useRef, useState } from "react"
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
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { FileText, LayoutGrid, Square } from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { DocumentToolbar as Toolbar } from "@workspace/ui/components/tool/document-toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import { Thumbnails } from "./components/thumbnails"

export default function Client({ messages: m }: { messages: Messages }) {
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { state, loading, error, reader } = useReader(file, container, m)
  const railId = useId()
  const [thumbnails, setThumbnails] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)")
    const update = () => setThumbnails(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  return (
    <DocumentWorkspace
      tool="ppt-viewer"
      file={file}
      onFile={setFile}
      accept=".ppt,.dps,.dpt,application/vnd.ms-powerpoint,application/vnd.ms-powerpoint.template"
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
        {reader.current && state.total ? (
          <Toolbar
            messages={m}
            state={state}
            reader={reader.current}
            actions={
              <>
                <DocumentIconButton
                  label={m.fitPage}
                  onClick={() => reader.current?.fitPage()}
                >
                  <Square aria-hidden="true" />
                </DocumentIconButton>
                <DocumentIconButton
                  label={m.thumbnails}
                  aria-expanded={thumbnails}
                  aria-controls={railId}
                  onClick={() => setThumbnails((open) => !open)}
                >
                  <LayoutGrid aria-hidden="true" />
                </DocumentIconButton>
              </>
            }
          />
        ) : null}
        {state.total > 0 && !error ? (
          <details className="shrink-0 border-b px-3 py-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
              {m.partial}
            </summary>
            <p className="mt-2 max-w-prose">{m.compatibility}</p>
            <p className="mt-1 max-w-prose">{m.fonts}</p>
          </details>
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
            file && !error
              ? "flex min-h-0 flex-1 flex-col sm:flex-row"
              : "hidden"
          }
        >
          {reader.current && state.total && thumbnails ? (
            <Thumbnails
              id={railId}
              reader={reader.current}
              state={state}
              messages={m}
            />
          ) : null}
          <div className="relative min-h-0 min-w-0 flex-1 bg-muted">
            <div
              ref={container}
              className="absolute inset-0 overflow-auto p-3 [&>canvas]:mx-auto [&>canvas]:block [&>canvas]:shadow-md"
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
      </div>
    </DocumentWorkspace>
  )
}
