import { useEffect, useRef, useState } from "react"
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
import { Tabs, TabsContent } from "@workspace/ui/components/ui/tabs"
import { acceptedFiles, defaultImportOptions, isDelimited } from "./formats"
import { ImportControls } from "./components/import-options"
import { Worksheets } from "./components/worksheets"
import { Toolbar } from "./components/toolbar"
import { useReader } from "./use-reader"
import type { Messages } from "./types"
import "./viewer.css"

export default function Client({ messages: m }: { messages: Messages }) {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr")
  useEffect(() => {
    setDirection(document.documentElement.dir === "rtl" ? "rtl" : "ltr")
  }, [])
  const container = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importOptions, setImportOptions] = useState(defaultImportOptions)
  const { state, loading, error, reader } = useReader(
    file,
    container,
    m,
    importOptions
  )
  return (
    <DocumentWorkspace
      tool="xlsx-viewer"
      file={file}
      onFile={(next) => {
        setImportOptions(defaultImportOptions)
        setFile(next)
      }}
      accept={acceptedFiles}
      active={Boolean(file && !error)}
      messages={m}
    >
      {file && isDelimited(file.name) ? (
        <ImportControls
          value={importOptions}
          onChange={setImportOptions}
          messages={m}
        />
      ) : null}
      {state.notices.length && !error ? (
        <details className="border-b px-3 py-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer">{m.compatibility}</summary>
          <ul className="mt-2 list-disc ps-4">
            {state.notices.map((notice) => (
              <li key={notice}>{m[notice]}</li>
            ))}
          </ul>
        </details>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Tabs
        dir={direction}
        value={String(state.sheet)}
        activationMode="manual"
        onValueChange={(value) => reader.current?.sheet(Number(value))}
        className="min-h-0 flex-1 gap-0 overflow-hidden"
      >
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
        <TabsContent
          forceMount
          value={String(state.sheet)}
          tabIndex={-1}
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
        </TabsContent>
        {reader.current && state.sheets.length ? (
          <Worksheets state={state} messages={m} />
        ) : null}
      </Tabs>
    </DocumentWorkspace>
  )
}
