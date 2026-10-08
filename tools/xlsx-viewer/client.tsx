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
import { Toolbar } from "./components/toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const input = useRef<HTMLInputElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { state, loading, error, reader } = useReader(file, container, m)
  return (
    <section
      data-tool="xlsx-viewer"
      className="flex min-w-0 flex-col gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const next = event.dataTransfer.files[0]
        if (next) setFile(next)
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
              onClick={() => setFile(null)}
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
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          aria-label={m.open}
          onChange={(event) => {
            const next = event.target.files?.[0]
            if (next) setFile(next)
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
        {reader.current && state.sheets.length ? (
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
          className={
            file && !error ? "relative h-[70vh] min-h-80 bg-muted" : "hidden"
          }
        >
          <div
            ref={container}
            className="xlsx-reader-container absolute inset-0 overflow-hidden"
            dir="ltr"
            aria-busy={loading}
          ></div>
        </div>
      </div>
    </section>
  )
}
