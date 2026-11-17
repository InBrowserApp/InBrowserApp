import { useCallback, useEffect, useRef, useState } from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { LayoutGrid } from "@workspace/ui/icons"
import { ObjectBrowser } from "./components/object-browser"
import { QueryEditor } from "./components/query-editor"
import { ResultTable } from "./components/result-table"
import { Structure } from "./components/structure"
import { previewQuery } from "./core/query"
import { useDatabase } from "./use-database"
import type { DatabaseObject, Messages } from "./types"
import sampleUrl from "./fixtures/sample.sqlite?url"

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [sql, setSql] = useState("SELECT name, type FROM sqlite_schema;")
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState("query")
  const [limit, setLimit] = useState(1000)
  const [sampleLoading, setSampleLoading] = useState(false)
  const [sampleError, setSampleError] = useState(false)
  const epoch = useRef(0)
  const db = useDatabase(file)
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"
  const cancelled = db.error?.key === "cancelled"

  function changeFile(next: File | null) {
    epoch.current++
    setFile(next)
    setSelected(null)
    setSql("SELECT name, type FROM sqlite_schema;")
    setTab("query")
    setSampleError(false)
    setSampleLoading(false)
  }
  const request = db.request
  const select = useCallback(
    (object: DatabaseObject) => {
      const query = previewQuery(object.name)
      setSelected(object.name)
      setSql(query)
      setTab("query")
      void request({ kind: "query", sql: query, limit })
    },
    [request, limit]
  )
  useEffect(() => {
    const first = db.metadata?.objects[0]
    if (first && selected === null && !db.busy) select(first)
  }, [db.metadata, db.busy, selected, select])

  async function sample() {
    const id = ++epoch.current
    setSampleLoading(true)
    setSampleError(false)
    try {
      const response = await fetch(sampleUrl)
      if (!response.ok) throw new Error("sample")
      const data = await response.blob()
      if (epoch.current === id) changeFile(new File([data], "sample.sqlite"))
    } catch {
      if (epoch.current === id) setSampleError(true)
    } finally {
      if (epoch.current === id) setSampleLoading(false)
    }
  }

  return (
    <DocumentWorkspace
      tool="sqlite-viewer"
      file={file}
      onFile={changeFile}
      accept=".db,.sqlite,.sqlite3,application/vnd.sqlite3,application/x-sqlite3"
      active={Boolean(db.metadata)}
      fitContent
      messages={m}
    >
      {cancelled ? (
        <p
          role="status"
          className="border-b px-4 py-3 text-sm text-muted-foreground"
        >
          {m.cancelled}
        </p>
      ) : db.error || sampleError ? (
        <Alert
          variant="destructive"
          className="rounded-none border-x-0 border-t-0"
          role="alert"
        >
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>
            {!db.error?.detail ? (
              <p>{db.error ? m[db.error.key] : m.sampleError}</p>
            ) : null}
            {db.error?.detail ? (
              <pre
                dir="ltr"
                className="max-h-24 overflow-auto text-xs break-all whitespace-pre-wrap"
              >
                {db.error.detail}
              </pre>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}
      {!file ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutGrid aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats}
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
          <Button
            variant="outline"
            onClick={() => void sample()}
            disabled={sampleLoading}
          >
            {sampleLoading ? <Spinner aria-hidden="true" /> : null}
            {sampleLoading ? m.opening : m.sample}
          </Button>
        </Empty>
      ) : null}
      {file && !db.metadata && db.busy ? (
        <p
          role="status"
          className="flex items-center justify-center gap-2 p-12"
        >
          <Spinner aria-hidden="true" />
          {m.opening}
        </p>
      ) : null}
      {db.metadata ? (
        <div className="grid min-h-0 min-w-0 flex-1 overflow-auto lg:grid-cols-[14rem_minmax(0,1fr)]">
          <ObjectBrowser
            objects={db.metadata.objects}
            selected={selected}
            onSelect={select}
            disabled={Boolean(db.busy)}
            messages={m}
            lang={lang}
          />
          <div className="flex min-w-0 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {selected ? (
                <h2
                  dir="auto"
                  className="min-w-0 truncate font-medium"
                  title={selected}
                >
                  {selected}
                </h2>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {m.emptyDatabase}
                </p>
              )}
              <Badge variant="secondary">SQLite {db.metadata.version}</Badge>
            </div>
            <Tabs
              value={tab}
              dir={direction}
              onValueChange={(value) => {
                setTab(value)
                if (value === "schema" && selected && !db.busy)
                  void db.request({ kind: "structure", name: selected })
              }}
            >
              <TabsList>
                <TabsTrigger value="query">{m.queryTab}</TabsTrigger>
                <TabsTrigger value="schema" disabled={Boolean(db.busy)}>
                  {m.schemaTab}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="query"
                className="flex min-w-0 flex-col gap-5 pt-3"
              >
                <QueryEditor
                  sql={sql}
                  onSql={setSql}
                  limit={limit}
                  onLimit={setLimit}
                  onRun={() => void db.request({ kind: "query", sql, limit })}
                  onCancel={db.cancel}
                  busy={Boolean(db.busy)}
                  invalid={Boolean(
                    db.error &&
                    [
                      "readOnlyError",
                      "singleStatement",
                      "emptyQuery",
                      "queryTooLarge",
                    ].includes(db.error.key)
                  )}
                  messages={m}
                  lang={lang}
                />
                {db.result ? (
                  <ResultTable
                    key={db.result.elapsed}
                    result={db.result}
                    title={m.results}
                    filename={file?.name}
                    messages={m}
                    lang={lang}
                  />
                ) : (
                  <p
                    role="status"
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    {db.busy ? m.running : m.notRun}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="schema" className="min-w-0 pt-3">
                <Structure
                  object={db.metadata.objects.find(
                    (object) => object.name === selected
                  )}
                  structure={db.structure}
                  messages={m}
                  lang={lang}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : null}
      <details className="border-t px-4 py-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer">{m.limitations}</summary>
        <p className="mt-2 max-w-prose">{m.limitsNote}</p>
      </details>
    </DocumentWorkspace>
  )
}
