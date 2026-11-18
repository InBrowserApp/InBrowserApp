import { useId, useMemo, useRef, useState, type ChangeEvent } from "react"
import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"

import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileJson2, FileText } from "@workspace/ui/icons"

import { generateCode } from "./core/generate-code"
import type english from "./messages/en.json"
import "./highlight.css"

hljs.registerLanguage("typescript", typescript)

export type Messages = { readonly [Key in keyof typeof english]: string }

const sample = `{
  "users": [
    { "id": 1, "name": "Ava", "email": "ava@example.com", "roles": ["editor"] },
    { "id": 2, "name": "Sam", "email": null, "roles": [], "active": true }
  ],
  "nextCursor": null
}`

const formats = [
  { id: "typescript", label: "TypeScript", filename: "api-response.ts" },
  { id: "zod", label: "Zod", filename: "api-response.schema.ts" },
] as const

function CodePanel({
  code,
  format,
  messages,
}: {
  code: string
  format: (typeof formats)[number]
  messages: Messages
}) {
  const highlighted = useMemo(
    () => hljs.highlight(code, { language: "typescript" }).value,
    [code]
  )
  const file = useMemo(
    () => new Blob([code], { type: "text/plain;charset=utf-8" }),
    [code]
  )

  return (
    <>
      <ToolPanelCardContent>
        {code ? (
          <pre
            dir="ltr"
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Allow keyboard scrolling for long code.
            tabIndex={0}
            aria-label={`${format.label} · ${messages.outputLabel}`}
            className="json-typescript-code h-64 overflow-auto rounded-lg border border-input bg-background p-3 text-left font-mono text-sm wrap-anywhere whitespace-pre-wrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:h-80 lg:whitespace-pre"
          >
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        ) : (
          <div className="grid h-64 place-items-center rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground lg:h-80">
            {messages.emptyOutput}
          </div>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-wrap justify-end gap-2 border-t">
        <ToolCopyButton
          key={code ? "ready" : "empty"}
          value={code}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          size="default"
        />
        {code ? (
          <DocumentDownload
            file={file}
            filename={format.filename}
            label={messages.downloadLabel}
          />
        ) : (
          <Button type="button" disabled>
            <Download data-icon="inline-start" aria-hidden="true" />
            {messages.downloadLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </>
  )
}

export default function JsonToTypescriptZodClient({
  messages,
  dir,
}: {
  messages: Messages
  dir: "ltr" | "rtl"
}) {
  const inputId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const inputRevision = useRef(0)
  const [input, setInput] = useState("")
  const [fileFailed, setFileFailed] = useState(false)
  const [formatId, setFormatId] = useState("typescript")
  const result = useMemo(() => generateCode(input), [input])
  const error = fileFailed
    ? messages.fileReadError
    : result.status === "invalid"
      ? messages.invalidJson
      : ""

  function updateInput(text: string) {
    inputRevision.current += 1
    setFileFailed(false)
    setInput(text)
  }

  async function openFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file) return

    const revision = ++inputRevision.current
    setFileFailed(false)
    try {
      const text = await file.text()
      if (inputRevision.current === revision) setInput(text)
    } catch {
      if (inputRevision.current === revision) setFileFailed(true)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ToolPanelCard className="h-auto min-w-0">
          <CardHeader className="flex min-h-16 items-center border-b">
            <CardTitle>
              <label htmlFor={inputId}>{messages.inputLabel}</label>
            </CardTitle>
          </CardHeader>
          <ToolPanelCardContent>
            <Textarea
              name="json"
              id={inputId}
              dir="ltr"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-invalid={result.status === "invalid" || undefined}
              aria-describedby={error ? `${inputId}-error` : undefined}
              placeholder={messages.inputPlaceholder}
              value={input}
              onChange={(event) => updateInput(event.target.value)}
              className="h-64 resize-y font-mono text-sm lg:h-80"
            />
            <div
              aria-live="polite"
              className="text-sm text-destructive [&:not(:empty)]:mt-2"
              id={`${inputId}-error`}
            >
              {error}
            </div>
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="flex-wrap gap-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => updateInput(sample)}
            >
              <FileJson2 data-icon="inline-start" aria-hidden="true" />
              {messages.sampleLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInput.current?.click()}
            >
              <FileText data-icon="inline-start" aria-hidden="true" />
              {messages.openFileLabel}
            </Button>
            <input
              type="file"
              hidden
              ref={fileInput}
              accept=".json,application/json"
              onChange={(event) => void openFile(event)}
            />
          </ToolPanelCardFooter>
        </ToolPanelCard>

        <ToolPanelCard className="h-auto min-w-0">
          <Tabs
            value={formatId}
            onValueChange={setFormatId}
            dir={dir}
            className="gap-0"
          >
            <CardHeader className="flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b pt-4">
              <CardTitle>{messages.outputLabel}</CardTitle>
              <TabsList aria-label={messages.outputLabel}>
                {formats.map(({ id, label }) => (
                  <TabsTrigger key={id} value={id} className="px-2">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>
            {formats.map((format) => (
              <TabsContent
                key={format.id}
                value={format.id}
                aria-describedby={
                  format.id === "zod" ? `${inputId}-zod-help` : undefined
                }
                className="min-w-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <CodePanel
                  format={format}
                  code={result.status === "ok" ? result[format.id] : ""}
                  messages={messages}
                />
              </TabsContent>
            ))}
          </Tabs>
        </ToolPanelCard>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>{messages.inferenceHelp}</p>
        {formatId === "zod" && (
          <p id={`${inputId}-zod-help`}>{messages.zodHelp}</p>
        )}
      </div>
    </div>
  )
}
