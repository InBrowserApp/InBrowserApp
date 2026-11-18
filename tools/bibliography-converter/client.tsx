import { useId, useRef, useState, type ChangeEvent } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ArrowLeftRight, Download, FolderInput } from "@workspace/ui/icons"

import {
  example,
  formatOptions,
  formats,
  type Format,
  type InputFormat,
} from "./formats"
import type { Conversion } from "./core/convert"
import type en from "./messages/en.json"

export type Messages = typeof en

type View =
  | { state: "converting" | "fileError" | "inputError" | "outputError" }
  | (Extract<Conversion, { state: "converted" }> & { file: Blob })
  | null

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"

const editorClass =
  "field-sizing-fixed h-52 resize-y font-mono text-sm leading-relaxed sm:h-64 lg:h-72"

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const id = useId()
  const picker = useRef<HTMLInputElement>(null)
  const revision = useRef(0)
  const [input, setInput] = useState("")
  const [source, setSource] = useState<InputFormat>("auto")
  const [target, setTarget] = useState<Format>("ris")
  const [view, setView] = useState<View>(null)

  const result = view?.state === "converted" ? view : null
  const busy = view?.state === "converting"
  const error =
    view && view.state !== "converted" && view.state !== "converting"
      ? m[view.state]
      : null
  const number = new Intl.NumberFormat(lang)
  const list = new Intl.ListFormat(lang)

  function invalidate() {
    setView(null)
    return ++revision.current
  }

  async function openFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file) return
    const current = invalidate()
    try {
      const text = await file.text()
      if (revision.current !== current) return
      setInput(text)
      setSource("auto")
    } catch {
      if (revision.current === current) setView({ state: "fileError" })
    }
  }

  async function convert() {
    const current = ++revision.current
    setView({ state: "converting" })
    try {
      const { convertReferences } = await import("./core/convert")
      if (revision.current !== current) return
      const conversion = convertReferences(input, source, target)
      if (conversion.state === "converted") {
        const file = new Blob([conversion.output], {
          type: formats[target].mime,
        })
        setView({ ...conversion, file })
      } else {
        setView(conversion)
      }
    } catch {
      if (revision.current === current) setView({ state: "outputError" })
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader className="gap-2">
            <label htmlFor={`${id}-source`} className="text-sm font-medium">
              {m.input}
            </label>
            <select
              id={`${id}-source`}
              className={selectClass}
              value={source}
              onChange={(event) => {
                setSource(event.target.value as InputFormat)
                invalidate()
              }}
            >
              <option value="auto">{m.auto}</option>
              {formatOptions.map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="grid flex-1 gap-3">
            <Textarea
              aria-label={m.paste}
              aria-invalid={view?.state === "inputError"}
              aria-describedby={error ? `${id}-error` : undefined}
              className={editorClass}
              dir="ltr"
              spellCheck={false}
              value={input}
              placeholder={m.paste}
              onChange={(event) => {
                setInput(event.target.value)
                invalidate()
              }}
            />
            {error && (
              <p
                id={`${id}-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex-wrap gap-2 border-t">
            <input
              ref={picker}
              type="file"
              accept=".bib,.ris,.json,.txt,text/plain,application/json"
              hidden
              onChange={(event) => void openFile(event)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => picker.current?.click()}
              >
                <FolderInput data-icon="inline-start" aria-hidden="true" />
                {m.open}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setInput(example)
                  setSource("auto")
                  invalidate()
                }}
              >
                {m.example}
              </Button>
            </div>
            <Button
              type="button"
              className="ms-auto max-sm:w-full"
              disabled={busy || !input.trim()}
              onClick={() => void convert()}
            >
              <ArrowLeftRight data-icon="inline-start" aria-hidden="true" />
              {busy ? m.converting : m.convert}
            </Button>
          </CardFooter>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="gap-2">
            <label htmlFor={`${id}-target`} className="text-sm font-medium">
              {m.output}
            </label>
            <select
              id={`${id}-target`}
              className={selectClass}
              value={target}
              onChange={(event) => {
                setTarget(event.target.value as Format)
                invalidate()
              }}
            >
              {formatOptions.map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="grid flex-1">
            <Textarea
              aria-label={m.converted}
              className={editorClass}
              dir="ltr"
              spellCheck={false}
              readOnly
              value={result?.output ?? ""}
              placeholder={m.empty}
            />
          </CardContent>
          <CardFooter className="flex-wrap justify-end gap-2 border-t">
            <span
              role="status"
              className="me-auto text-sm text-muted-foreground"
            >
              {result &&
                m.entries.replace("{count}", number.format(result.count))}
            </span>
            <div className="flex flex-wrap justify-end gap-2">
              <ToolCopyButton
                key={result ? "result" : "empty"}
                size="default"
                value={result?.output ?? ""}
                copyLabel={m.copy}
                copiedLabel={m.copied}
              />
              {result ? (
                <DocumentDownload
                  file={result.file}
                  filename={`references.${formats[target].extension}`}
                  label={m.download}
                />
              ) : (
                <Button type="button" disabled>
                  <Download data-icon="inline-start" aria-hidden="true" />
                  {m.download}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {result && (
        <Card aria-labelledby={`${id}-duplicates`}>
          <CardHeader>
            <h2 id={`${id}-duplicates`} className="font-heading font-semibold">
              {m.duplicates}
            </h2>
          </CardHeader>
          <CardContent className="text-sm">
            {result.duplicates.length ? (
              <ul className="divide-y">
                {result.duplicates.map(({ reason, entries, title }) => (
                  <li
                    key={`${reason}-${entries[0]}`}
                    className="grid gap-1 py-3 first:pt-0 last:pb-0"
                  >
                    {title && (
                      <p className="font-medium wrap-anywhere">
                        <bdi>{title}</bdi>
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {m.duplicateEntries.replace(
                        "{numbers}",
                        list.format(
                          entries.map((entry) => number.format(entry))
                        )
                      )}
                      {" · "}
                      {reason === "doi" ? m.byDoi : m.byMetadata}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{m.noDuplicates}</p>
            )}
          </CardContent>
        </Card>
      )}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {m.fidelity}
      </p>
    </div>
  )
}
