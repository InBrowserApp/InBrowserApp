import { useRef, useState } from "react"
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
import { FileText } from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Toolbar } from "./components/toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { state, loading, error, reader } = useReader(file, container, m)
  return (
    <DocumentWorkspace
      tool="xlsx-viewer"
      file={file}
      onFile={setFile}
      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
            file && !error ? "relative min-h-48 flex-1 bg-muted" : "hidden"
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
    </DocumentWorkspace>
  )
}
