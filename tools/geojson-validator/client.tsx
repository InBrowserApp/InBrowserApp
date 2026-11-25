import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Check,
  FileCheck,
  FolderInput,
  Sparkles,
  TriangleAlert,
} from "@workspace/ui/icons"
import { validateGeoJson } from "./validate"
import type { Validation } from "./validate"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }
type Result = Validation | { kind: "readError" }

const example = JSON.stringify(
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Viewpoint" },
        geometry: { type: "Point", coordinates: [-122.41, 37.809] },
      },
    ],
  },
  null,
  2
)

function Results({
  result,
  messages: m,
  lang,
  summaryId,
  jump,
}: {
  result?: Result
  messages: Messages
  lang: string
  summaryId: string
  jump: (line: number, column: number) => void
}) {
  const format = new Intl.NumberFormat(lang)
  if (!result) return <p className="text-sm text-muted-foreground">{m.idle}</p>
  if (result.kind === "readError")
    return (
      <p id={summaryId} role="status" className="text-sm text-destructive">
        {m.readError}
      </p>
    )
  if (result.kind === "valid")
    return (
      <>
        <p
          id={summaryId}
          role="status"
          className="flex items-center gap-2 font-medium"
        >
          <Check
            aria-hidden="true"
            className="size-4 text-emerald-600 dark:text-emerald-400"
          />{" "}
          {m.valid}
        </p>
        <dl className="grid gap-2 text-sm">
          <div className="flex flex-wrap justify-between gap-1 border-t pt-2">
            <dt>{m.objectType}</dt>
            <dd dir="ltr" className="font-mono">
              {result.type}
            </dd>
          </div>
          {result.features !== undefined && (
            <div className="flex items-center justify-between gap-2 border-t pt-2">
              <dt>{m.features}</dt>
              <dd>{format.format(result.features)}</dd>
            </div>
          )}
        </dl>
      </>
    )
  return (
    <>
      <p
        id={summaryId}
        role="status"
        className="flex items-center gap-2 font-medium text-destructive"
      >
        <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
        {result.kind === "syntax" ? m.syntax : m.invalid}
      </p>
      {result.kind === "syntax" ? (
        <div className="space-y-2 text-sm">
          {result.line !== undefined && result.column !== undefined && (
            <button
              type="button"
              className="text-start underline underline-offset-4"
              onClick={() => jump(result.line!, result.column!)}
            >
              {m.location
                .replace("{line}", format.format(result.line))
                .replace("{column}", format.format(result.column))}
            </button>
          )}
          <p className="text-muted-foreground">{m.syntaxHelp}</p>
        </div>
      ) : (
        <>
          <ul className="max-h-80 divide-y overflow-auto rounded-md border px-3 text-sm">
            {result.issues.map(({ code, path }, index) => (
              <li key={index} className="space-y-1 py-2">
                <code
                  dir="ltr"
                  className="block wrap-anywhere text-muted-foreground"
                >
                  {path}
                </code>
                <p>{m[code]}</p>
              </li>
            ))}
          </ul>
          {result.limited && (
            <p className="text-sm text-muted-foreground">
              {m.limited.replace(
                "{count}",
                format.format(result.issues.length)
              )}
            </p>
          )}
        </>
      )}
    </>
  )
}

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [text, setText] = useState("")
  const [result, setResult] = useState<Result>()
  const picker = useRef<HTMLInputElement>(null)
  const editor = useRef<HTMLTextAreaElement>(null)
  const readId = useRef(0)
  const inputId = useId()
  const resultId = useId()

  function edit(next: string) {
    readId.current++
    setText(next)
    setResult(undefined)
  }

  function run(input: string) {
    edit(input)
    setResult(validateGeoJson(input))
  }

  function jump(line: number, column: number) {
    const element = editor.current
    if (!element) return
    const lines = element.value.split("\n")
    const start = lines
      .slice(0, line - 1)
      .reduce((offset, text) => offset + text.length + 1, 0)
    const bom = line === 1 && element.value.startsWith("\uFEFF") ? 1 : 0
    const position = Math.min(element.value.length, start + column - 1 + bom)
    element.focus()
    element.setSelectionRange(position, position)
  }

  async function open(file: File) {
    const id = ++readId.current
    try {
      const input = await file.text()
      if (id === readId.current) run(input)
    } catch {
      if (id === readId.current) setResult({ kind: "readError" })
    }
  }

  return (
    <section data-tool="geojson-validator" className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => picker.current?.click()}>
          <FolderInput aria-hidden="true" /> {m.open}
        </Button>
        <Button variant="ghost" onClick={() => run(example)}>
          <Sparkles aria-hidden="true" /> {m.example}
        </Button>
        <input
          ref={picker}
          hidden
          type="file"
          accept=".geojson,.json"
          aria-label={m.open}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) void open(file)
          }}
        />
      </div>
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardContent>
            <form
              className="grid min-w-0 gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                if (text.trim()) run(text)
              }}
            >
              <label htmlFor={inputId} className="font-medium">
                {m.input}
              </label>
              <Textarea
                id={inputId}
                ref={editor}
                dir="ltr"
                rows={12}
                spellCheck={false}
                value={text}
                className="field-sizing-fixed min-w-0 font-mono text-sm"
                aria-invalid={
                  result?.kind === "invalid" || result?.kind === "syntax"
                }
                aria-describedby={result ? resultId : undefined}
                onChange={(event) => edit(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!text.trim()}>
                  <FileCheck aria-hidden="true" /> {m.validate}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!text && !result}
                  onClick={() => {
                    edit("")
                    editor.current?.focus()
                  }}
                >
                  {m.clear}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent className="grid min-w-0 gap-3">
            <h2 className="font-semibold">{m.result}</h2>
            <Results
              result={result}
              messages={m}
              lang={lang}
              summaryId={resultId}
              jump={jump}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
