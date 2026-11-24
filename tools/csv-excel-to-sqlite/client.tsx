import { useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Check,
  Database,
  Download,
  FileText,
  LayoutGrid,
  Lock,
  Plus,
  Table2,
  Upload,
  X,
} from "@workspace/ui/icons"
import { TablePreview } from "./preview"
import { useConverter } from "./use-converter"
import type { Messages } from "./types"

const sampleFiles = [
  [
    "customers.csv",
    "id,name,city\n1,Ana García,Madrid\n2,Ken Ito,Osaka\n3,Maya Ali,Cairo",
  ],
  ["orders.csv", "id,customer_id,total\n1001,1,24.50\n1002,2,18\n1003,1,12.75"],
] as const

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState<string>()
  const state = useConverter()
  const hasFiles = state.entries.length > 0
  const table =
    state.tables.find(({ key }) => key === selected) ?? state.tables[0]
  const [firstImported, secondImported] = state.entries.filter(
    ({ result }) => result && "previews" in result
  )
  const databaseName =
    firstImported && !secondImported
      ? `${firstImported.file.name.replace(/\.[^.]+$/, "") || "data"}.sqlite`
      : "spreadsheets.sqlite"
  const viewerPath = `${lang === "en" ? "" : `/${lang}`}/tools/sqlite-viewer/`
  const viewerHref = state.url
    ? `${viewerPath}#${new URLSearchParams({ database: state.url, name: databaseName })}`
    : undefined

  return (
    <ToolPanelCard
      className="min-w-0 data-dragging:border-primary data-dragging:bg-accent/40"
      data-dragging={hasFiles && dragging ? "" : undefined}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = state.creating ? "none" : "copy"
        setDragging(!state.creating)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setDragging(false)
      }}
      onDrop={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        setDragging(false)
        if (!state.creating) state.add(Array.from(event.dataTransfer.files))
      }}
    >
      <ToolPanelCardContent className="gap-5">
        <input
          type="file"
          ref={input}
          accept=".csv,.xlsx,.xls"
          multiple
          hidden
          onChange={(event) => {
            state.add(Array.from(event.currentTarget.files ?? []))
            event.currentTarget.value = ""
          }}
        />
        <div
          className={
            hasFiles
              ? "flex flex-wrap items-center justify-between gap-3"
              : `flex min-h-56 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-5 text-center ${dragging ? "border-primary bg-accent" : "bg-muted/25"}`
          }
        >
          {hasFiles ? (
            <h2 className="font-medium">{m.sources}</h2>
          ) : (
            <>
              <div className="mb-1 rounded-lg border bg-background p-2.5 text-muted-foreground">
                <Table2 aria-hidden="true" className="size-6" />
              </div>
              <h2 className="font-semibold">{m.drop}</h2>
              <p className="text-sm text-muted-foreground">{m.formats}</p>
            </>
          )}
          <div
            className={
              hasFiles ? undefined : "mt-2 flex flex-wrap justify-center gap-2"
            }
          >
            <Button
              variant={hasFiles ? "outline" : "default"}
              disabled={state.creating}
              onClick={() => input.current?.click()}
            >
              {hasFiles ? (
                <Plus aria-hidden="true" />
              ) : (
                <Upload aria-hidden="true" />
              )}
              {hasFiles ? m.add : m.choose}
            </Button>
            {!hasFiles ? (
              <Button
                variant="outline"
                onClick={() =>
                  state.add(
                    sampleFiles.map(([name, csv]) => new File([csv], name))
                  )
                }
              >
                {m.sample}
              </Button>
            ) : null}
          </div>
          {!hasFiles ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock aria-hidden="true" className="size-3" />
              {m.privacy}
            </p>
          ) : null}
        </div>
        {hasFiles ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {state.entries.map(({ file, id, result }) => (
              <li
                key={id}
                className="flex min-w-0 items-center gap-2 rounded-md border py-1.5 ps-3 pe-1.5"
              >
                <FileText
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p dir="auto" className="truncate" title={file.name}>
                    {file.name}
                  </p>
                  {result && "error" in result ? (
                    <p role="alert" className="text-xs text-destructive">
                      {m[result.error]}
                    </p>
                  ) : null}
                </div>
                {!result ? (
                  <Spinner aria-hidden="true" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={m.remove.replace(
                      "{name}",
                      () => `\u2068${file.name}\u2069`
                    )}
                    disabled={state.creating}
                    onClick={() => state.remove(id)}
                  >
                    <X aria-hidden="true" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        {state.reading ? (
          <p role="status" className="text-sm text-muted-foreground">
            {m.reading}
          </p>
        ) : null}
        {table ? (
          <div className="grid min-w-0 gap-4 border-t pt-4 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-2">
              <h2 className="text-sm font-medium">{m.tables}</h2>
              <div className="flex max-h-52 flex-wrap gap-1 overflow-auto md:block">
                {state.tables.map(({ key, outputName, preview }) => (
                  <Button
                    key={key}
                    variant={table.key === key ? "secondary" : "ghost"}
                    size="sm"
                    className="max-w-full justify-start md:w-full"
                    title={preview.label}
                    aria-pressed={table.key === key}
                    onClick={() => setSelected(key)}
                  >
                    <Table2 aria-hidden="true" />
                    <bdi className="truncate">{outputName}</bdi>
                  </Button>
                ))}
              </div>
            </div>
            <TablePreview
              table={table}
              messages={m}
              disabled={state.creating}
              update={state.update}
            />
          </div>
        ) : null}
        {state.error ? (
          <Alert variant="destructive">
            <AlertDescription>{m.createError}</AlertDescription>
          </Alert>
        ) : null}
        {state.url ? (
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/25 p-3">
            <p
              role="status"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Check aria-hidden="true" className="size-4 shrink-0" />
              {m.ready}
            </p>
            <div className="flex w-full max-w-full flex-wrap gap-2 sm:w-auto">
              <Button
                asChild
                className="h-auto min-h-11 w-full max-w-full whitespace-normal sm:min-h-9 sm:w-auto"
              >
                <a href={state.url} download={databaseName}>
                  <Download aria-hidden="true" />
                  {m.download}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto min-h-11 w-full max-w-full whitespace-normal sm:min-h-9 sm:w-auto"
              >
                <a href={viewerHref} target="_blank" rel="noopener">
                  <LayoutGrid aria-hidden="true" />
                  {m.viewer}
                </a>
              </Button>
            </div>
          </div>
        ) : table ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
            <Button
              disabled={state.reading || state.creating}
              onClick={state.create}
              className="h-auto min-h-11 w-full max-w-full whitespace-normal sm:min-h-9 sm:w-auto"
            >
              {state.creating ? (
                <Spinner aria-hidden="true" />
              ) : (
                <Database aria-hidden="true" />
              )}
              {state.creating ? m.creating : m.convert}
            </Button>
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
