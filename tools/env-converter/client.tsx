import {
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ArrowLeftRight, Download, FileText } from "@workspace/ui/icons"

import { Diagnostics } from "./components/diagnostics"
import { DIRECTIONS, FILE_TYPES, FORMAT_LABELS, SAMPLE_ENV } from "./constants"
import { convert } from "./core/convert"
import { interpolate, type Direction, type Messages } from "./types"

export default function EnvConverterClient({
  messages,
}: {
  messages: Messages
}) {
  const id = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [direction, setDirection] = useState<Direction>("env-json")
  const [input, setInput] = useState(SAMPLE_ENV)
  const [fileError, setFileError] = useState(false)
  const { from, to } = DIRECTIONS.find((item) => item.value === direction)!
  const deferredInput = useDeferredValue(input)
  const result = useMemo(
    () => convert(deferredInput, from, to),
    [deferredInput, from, to]
  )
  const canExport = result.state === "converted" && input === deferredInput
  const errors = result.diagnostics.filter(
    (item) => item.severity === "error"
  ).length
  const warnings = result.diagnostics.length - errors

  function updateInput(value: string) {
    setInput(value.replace(/\r\n?/g, "\n"))
    setFileError(false)
  }

  function changeDirection(next: Direction) {
    const nextFrom = DIRECTIONS.find((item) => item.value === next)!.from
    if (nextFrom !== from && canExport)
      updateInput(convert(input, from, nextFrom).output)
    setDirection(next)
  }

  function focusLine(line: number) {
    const textarea = inputRef.current!
    const start = input
      .split("\n")
      .slice(0, line - 1)
      .reduce((length, text) => length + text.length + 1, 0)
    textarea.focus()
    textarea.setSelectionRange(
      start,
      input.indexOf("\n", start) === -1
        ? input.length
        : input.indexOf("\n", start)
    )
    const lineHeight =
      Number.parseFloat(getComputedStyle(textarea).lineHeight) || 20
    textarea.scrollTop = Math.max(0, (line - 2) * lineHeight)
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    try {
      updateInput(await file.text())
    } catch {
      setFileError(true)
    }
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([result.output], {
        type:
          to === "json"
            ? "application/json;charset=utf-8"
            : "text/plain;charset=utf-8",
      })
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = to === "env" ? ".env" : `converted.${to}`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{messages.privacyLabel}</p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 space-y-2">
          <Label htmlFor={`${id}-direction`}>{messages.conversionLabel}</Label>
          <select
            id={`${id}-direction`}
            name="conversion"
            value={direction}
            onChange={(event) =>
              changeDirection(event.target.value as Direction)
            }
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            dir="ltr"
          >
            {DIRECTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {messages[item.label] as string}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={!canExport || !result.output}
          onClick={() => changeDirection(`${to}-${from}` as Direction)}
        >
          <ArrowLeftRight aria-hidden="true" data-icon="inline-start" />
          {messages.swapLabel}
        </Button>
        <div
          className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground sm:ms-auto"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            {result.state === "empty"
              ? messages.emptyLabel
              : interpolate(messages.variablesLabel, {
                  count: Object.keys(result.values).length,
                })}
          </span>
          {errors ? (
            <span className="text-destructive">
              {interpolate(messages.errorsLabel, { count: errors })}
            </span>
          ) : null}
          {warnings ? (
            <span className="text-amber-800 dark:text-amber-300">
              {interpolate(messages.warningsLabel, { count: warnings })}
            </span>
          ) : null}
          {canExport && !warnings ? <span>{messages.readyLabel}</span> : null}
        </div>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader className="border-b">
            <CardTitle>
              <label htmlFor={`${id}-input`}>
                {messages.inputLabel} ·{" "}
                <bdi dir="ltr">{FORMAT_LABELS[from]}</bdi>
              </label>
            </CardTitle>
            <CardDescription>{messages.inputDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              ref={inputRef}
              id={`${id}-input`}
              name="configuration-input"
              aria-invalid={errors > 0}
              aria-describedby={`${id}-diagnostics`}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              wrap="off"
              dir="ltr"
              value={input}
              onChange={(event) => updateInput(event.target.value)}
              placeholder={messages.inputPlaceholder}
              className="field-sizing-fixed min-h-56 resize-y font-mono leading-6 sm:min-h-80"
            />
            {fileError ? (
              <p role="alert" className="text-sm text-destructive">
                {messages.fileErrorLabel}
              </p>
            ) : null}
            <Diagnostics
              id={`${id}-diagnostics`}
              diagnostics={result.diagnostics}
              messages={messages}
              onLine={focusLine}
            />
          </CardContent>
          <CardFooter className="flex-wrap gap-2 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <FileText aria-hidden="true" data-icon="inline-start" />
              {messages.importLabel}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept={FILE_TYPES[from]}
              className="sr-only"
              tabIndex={-1}
              aria-label={messages.importLabel}
              onChange={(event) => {
                void importFile(event)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                updateInput(
                  from === "env"
                    ? SAMPLE_ENV
                    : convert(SAMPLE_ENV, "env", from).output
                )
              }
            >
              {messages.sampleLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!input}
              onClick={() => updateInput("")}
            >
              {messages.clearLabel}
            </Button>
          </CardFooter>
        </Card>
        <Card className="min-w-0">
          <CardHeader className="border-b">
            <CardTitle>
              <label htmlFor={`${id}-output`}>
                {messages.outputLabel} ·{" "}
                <bdi dir="ltr">{FORMAT_LABELS[to]}</bdi>
              </label>
            </CardTitle>
            <CardDescription>{messages.outputDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id={`${id}-output`}
              name="configuration-output"
              readOnly
              autoComplete="off"
              spellCheck={false}
              wrap="off"
              dir="ltr"
              value={result.output}
              placeholder={messages.outputPlaceholder}
              className="field-sizing-fixed min-h-56 resize-y bg-muted/30 font-mono leading-6 sm:min-h-80"
            />
          </CardContent>
          <CardFooter className="flex-wrap justify-end gap-3 border-t">
            <ToolCopyButton
              value={result.output}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              disabled={!canExport}
            />
            <Button
              type="button"
              size="sm"
              disabled={!canExport}
              onClick={download}
            >
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.downloadLabel}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">{messages.rulesLabel}</p>
    </div>
  )
}
