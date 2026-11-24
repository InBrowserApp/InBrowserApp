import { useEffect, useId, useRef, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Database, Folder, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages, Request, Response, Source } from "./types"

export default function Client({ messages: m }: { messages: Messages }) {
  const [source, setSource] = useState<Source | null>(null)
  const [schemaOnly, setSchemaOnly] = useState(false)
  const [result, setResult] = useState<Response | null>(null)
  const [dragging, setDragging] = useState(false)
  const picker = useRef<HTMLInputElement>(null)
  const chooseButton = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  const schemaId = useId()
  const previewId = useId()

  function choose(next: Source | null, focus = false) {
    if (next === source) return
    restoreFocus.current = focus
    setResult(null)
    setSource(next)
  }

  useEffect(() => {
    if (!restoreFocus.current) return
    restoreFocus.current = false
    chooseButton.current?.focus({ preventScroll: true })
  }, [source])

  useEffect(() => {
    if (!source) return
    let worker: Worker
    try {
      worker = new Worker(new URL("./dump.worker.ts", import.meta.url), {
        type: "module",
      })
    } catch {
      setResult({ error: "failed" })
      return
    }
    const finish = (response: Response) => {
      setResult(response)
      worker.terminate()
    }
    worker.onmessage = ({ data }: MessageEvent<Response>) => finish(data)
    worker.onerror = () => finish({ error: "failed" })
    worker.postMessage({ source, schemaOnly } satisfies Request)
    return () => {
      worker.onmessage = null
      worker.onerror = null
      worker.terminate()
    }
  }, [source, schemaOnly])

  const name = source === "sample" ? "sample.sqlite" : (source?.name ?? "")
  const stem = name.replace(/\.[^.]+$/, "") || name

  return (
    <section
      aria-label={m.reader}
      data-tool="sqlite-to-sql"
      className="grid min-w-0 gap-4"
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        const file = event.dataTransfer.files[0]
        if (!file) return
        event.preventDefault()
        setDragging(false)
        choose(file)
      }}
    >
      <input
        ref={picker}
        type="file"
        accept=".db,.db3,.sqlite,.sqlite3,application/vnd.sqlite3,application/x-sqlite3"
        aria-label={m.open}
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) choose(file, true)
        }}
      />
      {!source ? (
        <div
          className={cn(
            "flex flex-col items-center gap-4 rounded-xl border border-dashed bg-muted/25 px-4 py-9 text-center transition-colors sm:py-12",
            dragging && "border-primary bg-primary/5"
          )}
        >
          <div className="rounded-lg border bg-background p-2.5 text-muted-foreground">
            <Database aria-hidden="true" className="size-6" />
          </div>
          <div>
            <p className="font-medium">{dragging ? m.releaseFile : m.drop}</p>
            <p className="mt-1 text-sm text-muted-foreground">{m.formats}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              ref={chooseButton}
              onClick={() => picker.current?.click()}
            >
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => choose("sample", true)}
            >
              {m.sample}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{m.privacy}</p>
        </div>
      ) : (
        <Card className={cn("py-0", dragging && "bg-primary/5 ring-primary")}>
          <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
            <Database
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span
              dir="auto"
              title={name}
              className="min-w-0 flex-1 truncate text-sm font-medium"
            >
              {dragging ? m.releaseFile : name}
            </span>
            <Button
              ref={chooseButton}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={m.replace}
              title={m.replace}
              onClick={() => picker.current?.click()}
            >
              <Folder aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={m.clear}
              title={m.clear}
              onClick={() => choose(null, true)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>

          <CardContent className="grid min-w-0 gap-4 px-4 pb-4">
            <div className="flex items-center gap-3">
              <Switch
                id={schemaId}
                dir="ltr"
                checked={schemaOnly}
                onCheckedChange={(checked) => {
                  setResult(null)
                  setSchemaOnly(checked)
                }}
                aria-describedby={`${schemaId}-description`}
              />
              <div className="min-w-0">
                <Label htmlFor={schemaId}>{m.schemaOnly}</Label>
                <p
                  id={`${schemaId}-description`}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  {m.schemaNote}
                </p>
              </div>
            </div>
            {!result ? (
              <p
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Spinner aria-hidden="true" />
                {m.working}
              </p>
            ) : "error" in result ? (
              <Alert variant="destructive">
                <AlertDescription>{m[result.error]}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid min-w-0 gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id={previewId} className="text-sm font-medium">
                    {m.preview}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {!result.dump.shortened && (
                      <ToolCopyButton
                        size="default"
                        value={result.dump.preview}
                        copyLabel={m.copy}
                        copiedLabel={m.copied}
                        failedLabel={m.copyFailed}
                      />
                    )}
                    <DocumentDownload
                      file={result.dump.blob}
                      filename={`${stem}${schemaOnly ? ".schema" : ""}.sql`}
                      label={m.download}
                    />
                  </div>
                </div>
                {result.dump.shortened && (
                  <p className="text-xs text-muted-foreground">
                    {m.previewLimit}
                  </p>
                )}
                <div
                  dir="ltr"
                  // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Allow keyboard scrolling in the SQL preview.
                  tabIndex={0}
                  role="region"
                  aria-labelledby={previewId}
                  className="max-h-80 overflow-auto rounded-lg border bg-muted/35 p-3 text-left font-mono text-xs leading-6 focus-visible:outline-2 focus-visible:outline-ring sm:text-sm"
                >
                  <pre>
                    <code>{result.dump.preview}</code>
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}
