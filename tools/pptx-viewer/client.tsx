import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
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
import { FileText, Folder, X } from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { DocumentToolbar as Toolbar } from "@workspace/ui/components/tool/document-toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import { Thumbnails } from "./components/thumbnails"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const input = useRef<HTMLInputElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { state, loading, error, reader } = useReader(file, container, m)
  function selectFile(next: File | null) {
    setFile(next)
  }
  return (
    <section
      data-tool="pptx-viewer"
      className="flex min-w-0 flex-col gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const next = event.dataTransfer.files[0]
        if (next) selectFile(next)
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => input.current?.click()}>
          <Folder data-icon="inline-start" />
          {file ? m.replace : m.open}
        </Button>
        {file ? (
          <>
            <span dir="auto" className="min-w-0 flex-1 truncate text-sm">
              {file.name}{" "}
              <span className="text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={m.clear}
              onClick={() => selectFile(null)}
            >
              <X />
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">{m.limits}</span>
        )}
        <input
          ref={input}
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="sr-only"
          aria-label={m.open}
          onChange={(event) => {
            const next = event.target.files?.[0]
            if (next) selectFile(next)
            event.target.value = ""
          }}
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="overflow-hidden rounded-xl border">
        {reader.current && state.total ? (
          <Toolbar messages={m} state={state} reader={reader.current} />
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
          className={file && !error ? "flex flex-col sm:flex-row" : "hidden"}
        >
          {reader.current && state.total ? (
            <Thumbnails reader={reader.current} state={state} messages={m} />
          ) : null}
          <div className="relative h-[70vh] min-h-80 min-w-0 flex-1 bg-muted">
            <div
              ref={container}
              className="pptx-reader-container absolute inset-0 overflow-auto"
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
    </section>
  )
}
