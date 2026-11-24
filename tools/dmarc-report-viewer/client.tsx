import { useId, useRef, useState } from "react"

import { ToolOpenTextFile } from "@workspace/ui/components/tool/tool-open-text-file"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { reportXmlFromBytes } from "./core/report-file"
import { readReport, type ReportResult } from "./core/report"
import { example } from "./example"
import { ReportView } from "./report-view"
import type english from "./messages/en.json"

export type Messages = typeof english

type State = (
  | { status: "idle" | "reading" }
  | ReportResult
  | { status: "error"; error: "readError" | "archiveContents" }
) & { filename?: string }

export default function Client({
  messages,
  language,
}: {
  messages: Messages
  language: string
}) {
  const id = useId()
  const operation = useRef(0)
  const [state, setState] = useState<State>({ status: "idle" })
  const [xml, setXml] = useState("")
  const [query, setQuery] = useState("")
  const { filename } = state

  function show(source: string) {
    operation.current++
    setQuery("")
    setState(readReport(source))
  }

  async function open(file: File) {
    const selected = ++operation.current
    const filename = file.name
    setQuery("")
    setState({ status: "reading", filename })
    try {
      const contents = await file.arrayBuffer()
      if (selected !== operation.current) return
      const source = reportXmlFromBytes(new Uint8Array(contents))
      setState(
        source === null
          ? { filename, status: "error", error: "archiveContents" }
          : { filename, ...readReport(source) }
      )
    } catch {
      if (selected === operation.current)
        setState({ filename, status: "error", error: "readError" })
    }
  }

  return (
    <div className="grid min-w-0 gap-5">
      <Card>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-medium">{messages.inputTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {messages.formats}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ToolOpenTextFile
                accept=".xml,.gz,.gzip,.zip"
                label={messages.open}
                onFile={(file) => void open(file)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setXml(example)
                  show(example)
                }}
              >
                {messages.example}
              </Button>
            </div>
          </div>
          {filename && (
            <p className="text-sm break-all text-muted-foreground">
              <bdi>{filename}</bdi>
            </p>
          )}
          {state.status === "reading" && (
            <p role="status" className="text-sm text-muted-foreground">
              {messages.reading}
            </p>
          )}
          {state.status === "error" && (
            <p role="alert" className="text-sm text-destructive">
              {messages[state.error]}
            </p>
          )}
          <details className="border-t pt-3">
            <summary className="cursor-pointer text-sm font-medium">
              {messages.paste}
            </summary>
            <form
              className="mt-3 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                show(xml)
              }}
            >
              <label htmlFor={id} className="sr-only">
                {messages.xml}
              </label>
              <Textarea
                id={id}
                dir="ltr"
                className="font-mono"
                rows={6}
                value={xml}
                spellCheck={false}
                autoCapitalize="none"
                onChange={(event) => setXml(event.target.value)}
              />
              <Button
                type="submit"
                className="justify-self-end"
                disabled={!xml.trim()}
              >
                {messages.view}
              </Button>
            </form>
          </details>
        </CardContent>
      </Card>
      <p className="sr-only" aria-live="polite">
        {state.status === "ready" && messages.summary}
      </p>
      {state.status === "ready" && (
        <ReportView
          report={state.report}
          messages={messages}
          language={language}
          query={query}
          onQueryChange={setQuery}
        />
      )}
    </div>
  )
}
