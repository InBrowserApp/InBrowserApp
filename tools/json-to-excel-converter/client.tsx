import { useDeferredValue, useId, useMemo, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FolderInput, Table2 } from "@workspace/ui/icons"
import { analyzeJson, type Spreadsheet } from "./core/table"
import type { Messages } from "./types"
import { Preview } from "./preview"

const example = JSON.stringify(
  [
    { name: "Maya", contact: { city: "Oslo" }, active: true, visits: 12 },
    { name: "Leo", contact: { city: "Lisbon" }, active: false, visits: 7 },
    { name: "Sam", contact: { city: "Seoul" }, active: true, visits: 19 },
  ],
  null,
  2
)

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const expandId = useId()
  const expandHintId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const editor = useRef<HTMLTextAreaElement>(null)
  const pendingFile = useRef<File | null>(null)
  const [{ text, filename }, setInput] = useState({ text: "", filename: "" })
  const [expand, setExpand] = useState(true)
  const [fileStatus, setFileStatus] = useState<"idle" | "reading" | "error">(
    "idle"
  )
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "writing" | "error"
  >("idle")
  const deferredText = useDeferredValue(text)
  const result = useMemo(
    () => analyzeJson(deferredText, expand),
    [deferredText, expand]
  )
  const current = text === deferredText
  const table = current && result.state === "ready" ? result.table : null
  const inputError =
    current && result.state === "error" ? m[result.error] : null
  const error = fileStatus === "error" ? m.readError : inputError

  function updateInput(value: string, name = filename) {
    pendingFile.current = null
    setInput({ text: value, filename: name })
    setFileStatus("idle")
    setDownloadStatus((status) => (status === "error" ? "idle" : status))
  }

  async function openFile(file: File) {
    pendingFile.current = file
    setFileStatus("reading")
    try {
      const value = await file.text()
      if (pendingFile.current === file) updateInput(value, file.name)
    } catch {
      if (pendingFile.current === file) setFileStatus("error")
    }
  }

  async function download(table: Spreadsheet) {
    setDownloadStatus("writing")
    try {
      const { downloadWorkbook } = await import("./core/workbook")
      const base = filename.replace(/\.json$/i, "").trim() || "converted"
      downloadWorkbook(table, `${base}.xlsx`)
      setDownloadStatus("idle")
    } catch {
      setDownloadStatus("error")
    }
  }

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>
            <Label htmlFor={inputId} className="text-base">
              {m.input}
            </Label>
          </CardTitle>
          <CardDescription id={hintId}>{m.inputHint}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInput.current?.click()}
            >
              {fileStatus === "reading" ? (
                <Spinner aria-hidden="true" data-icon="inline-start" />
              ) : (
                <FolderInput data-icon="inline-start" />
              )}
              {m.openFile}
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                event.currentTarget.value = ""
                if (file) void openFile(file)
              }}
            />
            {text.trim() ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ms-auto"
                onClick={() => {
                  updateInput("", "")
                  editor.current?.focus()
                }}
              >
                {m.clear}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  updateInput(example, "")
                  editor.current?.focus({ preventScroll: true })
                }}
              >
                {m.example}
              </Button>
            )}
          </div>
          <Textarea
            ref={editor}
            id={inputId}
            dir="ltr"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-invalid={Boolean(inputError)}
            aria-describedby={error ? `${hintId} ${errorId}` : hintId}
            className="min-h-56 flex-1 resize-y font-mono text-sm sm:min-h-72"
            value={text}
            onChange={(event) => updateInput(event.target.value)}
          />
          {error ? (
            <Alert variant="destructive">
              <AlertDescription id={errorId}>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            {m.preview}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="flex items-start gap-3">
            <Switch
              id={expandId}
              dir="ltr"
              checked={expand}
              aria-describedby={expandHintId}
              onCheckedChange={(value) => {
                setExpand(value)
                setDownloadStatus((status) =>
                  status === "error" ? "idle" : status
                )
              }}
            />
            <div className="space-y-1">
              <Label htmlFor={expandId}>{m.flatten}</Label>
              <p className="text-sm text-muted-foreground" id={expandHintId}>
                {m.flattenHint}
              </p>
            </div>
          </div>
          {table ? (
            <Preview table={table} messages={m} lang={lang} />
          ) : (
            <div className="flex min-h-36 flex-1 items-center justify-center rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              {m.emptyPreview}
            </div>
          )}
          {downloadStatus === "error" ? (
            <Alert variant="destructive">
              <AlertDescription>{m.downloadError}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end border-t">
          <Button
            type="button"
            disabled={
              !table || fileStatus === "reading" || downloadStatus === "writing"
            }
            aria-busy={downloadStatus === "writing"}
            onClick={table ? () => void download(table) : undefined}
          >
            {downloadStatus === "writing" ? (
              <Spinner aria-hidden="true" data-icon="inline-start" />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {m.download}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
