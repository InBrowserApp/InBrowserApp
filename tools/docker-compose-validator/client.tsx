import { useId, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Check,
  FileCheck,
  FileText,
  LoaderCircle,
  Trash2,
  TriangleAlert,
  Upload,
} from "@workspace/ui/icons"
import type { ComposeIssue } from "./core/validate-compose"
import type EnglishMessages from "./messages/en.json"

const example = `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
  cache:
    image: redis:alpine
    volumes:
      - cache-data:/data

volumes:
  cache-data: {}
`

function ComposeValidator({ messages }: { messages: typeof EnglishMessages }) {
  const id = useId()
  const editor = useRef<HTMLTextAreaElement>(null)
  const filePicker = useRef<HTMLInputElement>(null)
  const revision = useRef(0)
  const [source, setSource] = useState("")
  const [issues, setIssues] = useState<ComposeIssue[]>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const invalid = issues && issues.length > 0
  const canValidate = !busy && Boolean(source.trim())
  const status =
    error ||
    (issues ? (invalid ? messages.invalid : messages.valid) : messages.idle)

  function replaceSource(value: string) {
    revision.current++
    setSource(value.replace(/\r\n?/g, "\n"))
    setIssues(undefined)
    setError("")
    setBusy(false)
  }

  async function validate() {
    const current = ++revision.current
    setBusy(true)
    setError("")
    try {
      const { validateCompose } = await import("./core/validate-compose")
      if (revision.current === current) setIssues(validateCompose(source))
    } catch {
      if (revision.current === current) setError(messages.checkError)
    } finally {
      if (revision.current === current) setBusy(false)
    }
  }

  async function openFile(file: File) {
    const current = ++revision.current
    setBusy(false)
    setError("")
    try {
      const value = await file.text()
      if (revision.current === current) replaceSource(value)
    } catch {
      if (revision.current === current) setError(messages.fileError)
    }
  }

  function goToIssue(offset: number, line: number) {
    const input = editor.current!
    input.focus()
    const end = input.value.indexOf("\n", offset)
    input.setSelectionRange(offset, end < 0 ? input.value.length : end)
    input.scrollTop =
      (line - 1) * parseFloat(getComputedStyle(input).lineHeight)
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card className="min-w-0">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <label htmlFor={id} className="font-medium">
            {messages.inputLabel}
          </label>
          <div className="flex flex-wrap gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => filePicker.current?.click()}
            >
              <Upload aria-hidden="true" />
              {messages.openFile}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => replaceSource(example)}
            >
              <FileText aria-hidden="true" />
              {messages.example}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <input
            ref={filePicker}
            hidden
            type="file"
            accept=".yaml,.yml"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]
              event.currentTarget.value = ""
              if (file) void openFile(file)
            }}
          />
          <Textarea
            id={id}
            ref={editor}
            dir="ltr"
            wrap="off"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="[field-sizing:fixed] h-72 min-w-0 resize-y overflow-auto font-mono leading-6"
            value={source}
            placeholder={messages.placeholder}
            onChange={(event) => replaceSource(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (
                (event.ctrlKey || event.metaKey) &&
                event.key === "Enter" &&
                canValidate
              ) {
                void validate()
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => void validate()}
              disabled={!canValidate}
            >
              {busy ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <FileCheck aria-hidden="true" />
              )}
              {messages.validate}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                replaceSource("")
                editor.current?.focus()
              }}
              disabled={!source}
            >
              <Trash2 aria-hidden="true" />
              {messages.clear}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0 self-start">
        <CardHeader>
          <h2 className="font-medium">{messages.results}</h2>
        </CardHeader>
        <CardContent className="grid gap-3">
          <p
            role="status"
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            {invalid || error ? (
              <TriangleAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-destructive"
              />
            ) : null}
            {issues && !invalid ? (
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
            ) : null}
            {status}
          </p>
          {invalid && (
            <ol className="grid max-h-80 gap-2 overflow-y-auto">
              {issues.map(({ path, message, code, location }) => (
                <li
                  key={JSON.stringify([location.offset, path, code ?? message])}
                >
                  <button
                    type="button"
                    className="grid w-full gap-1 rounded-md border bg-muted/30 p-3 text-start text-sm break-all hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                    onClick={() => goToIssue(location.offset, location.line)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {messages.location
                        .replace("{line}", String(location.line))
                        .replace("{column}", String(location.column))}
                    </span>
                    {path ? (
                      <code dir="ltr" className="w-fit max-w-full font-medium">
                        {path}
                      </code>
                    ) : null}
                    <bdi dir="ltr" className="block text-left break-words">
                      {code ? messages[code] : message}
                    </bdi>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ComposeValidator
