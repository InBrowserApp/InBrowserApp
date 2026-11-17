import { useEffect, useId, useMemo, useRef, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"
import { characters, createResult } from "./core/subset"
import { processFont } from "./client/processor"
import { UploadCard } from "./client/upload-card"
import { SubsetResultPanel } from "./client/result"
import type { Messages, OutputFormat, SubsetResult } from "./types"

export default function FontSubsetClient({
  messages,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const id = useId()
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [format, setFormat] = useState<OutputFormat>("woff2")
  const [result, setResult] = useState<SubsetResult | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const operation = useRef<AbortController | null>(null)
  const textInput = useRef<HTMLTextAreaElement>(null)
  useEffect(() => () => operation.current?.abort(), [])
  const unique = useMemo(() => characters(text).length, [text])
  const number = useMemo(
    () => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }),
    [lang]
  )
  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${number.format(bytes)} B`
    if (bytes < 1024 ** 2) return `${number.format(bytes / 1024)} KiB`
    return `${number.format(bytes / 1024 ** 2)} MiB`
  }
  function invalidate() {
    operation.current?.abort()
    operation.current = null
    setBusy(false)
    setResult(null)
    setError("")
  }
  async function generate() {
    invalidate()
    if (!file) {
      setError(messages.invalidFont)
      return
    }
    if (!text.trim()) {
      setError(messages.emptyText)
      textInput.current?.focus()
      return
    }
    const controller = new AbortController()
    operation.current = controller
    setBusy(true)
    try {
      const output = await processFont(
        file,
        { text, format },
        controller.signal
      )
      if (!controller.signal.aborted)
        setResult(createResult(output, file, text, format))
    } catch (caught) {
      if (!controller.signal.aborted) {
        const code = caught instanceof Error ? caught.message : ""
        setError(
          code === "NO_CHARACTERS"
            ? messages.noCharacters
            : code === "INVALID_FONT" ||
                caught instanceof RangeError ||
                caught instanceof TypeError
              ? messages.invalidFont
              : code === "WORKER_ERROR"
                ? messages.workerError
                : messages.generationError
        )
      }
    } finally {
      if (operation.current === controller) {
        operation.current = null
        setBusy(false)
      }
    }
  }
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void generate()
        }}
        className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
        aria-busy={busy}
      >
        <UploadCard
          file={file}
          messages={messages}
          formatBytes={formatBytes}
          onFile={(next) => {
            invalidate()
            setFile(next)
          }}
        />
        <ToolPanelCard>
          <CardHeader>
            <CardTitle>{messages.textTitle}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent>
            <FieldGroup>
              <Field data-invalid={error === messages.emptyText}>
                <FieldLabel htmlFor={`${id}-text`} className="sr-only">
                  {messages.textTitle}
                </FieldLabel>
                <Textarea
                  ref={textInput}
                  id={`${id}-text`}
                  name="subset-text"
                  autoComplete="off"
                  dir="auto"
                  spellCheck={false}
                  aria-invalid={error === messages.emptyText}
                  aria-describedby={`${id}-text-help`}
                  placeholder={messages.textPlaceholder}
                  className="min-h-28 resize-y lg:min-h-36"
                  value={text}
                  onChange={(event) => {
                    invalidate()
                    setText(event.target.value)
                  }}
                />
                <FieldDescription id={`${id}-text-help`}>
                  {messages.textDescription}
                </FieldDescription>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {messages.uniqueCharacters}:{" "}
                  {new Intl.NumberFormat(lang).format(unique)}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-auto min-h-9 self-start whitespace-normal"
                  onClick={() => {
                    invalidate()
                    setText(
                      (current) =>
                        current +
                        Array.from({ length: 95 }, (_, index) =>
                          String.fromCharCode(index + 32)
                        ).join("")
                    )
                  }}
                >
                  {messages.addAscii}
                </Button>
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-format`}>
                  {messages.formatLabel}
                </FieldLabel>
                <Select
                  value={format}
                  onValueChange={(next) => {
                    invalidate()
                    setFormat(next as OutputFormat)
                  }}
                >
                  <SelectTrigger
                    id={`${id}-format`}
                    className="h-auto min-h-9 w-full min-w-0 text-start whitespace-normal"
                  >
                    <SelectValue className="min-w-0 whitespace-normal" />
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-2rem)]">
                    <SelectGroup>
                      <SelectItem value="woff2" className="whitespace-normal">
                        {messages.woff2Option}
                      </SelectItem>
                      <SelectItem value="sfnt" className="whitespace-normal">
                        {messages.sfntOption}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>{messages.preserveNote}</FieldDescription>
              </Field>
            </FieldGroup>
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="flex-wrap gap-3">
            <Button
              type="submit"
              disabled={busy}
              className="h-auto min-h-9 whitespace-normal"
            >
              {busy ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                />
              ) : null}
              {busy ? messages.generating : messages.generate}
            </Button>
            {busy ? (
              <Button type="button" variant="outline" onClick={invalidate}>
                {messages.cancel}
              </Button>
            ) : null}
          </ToolPanelCardFooter>
        </ToolPanelCard>
      </form>
      <div aria-live="polite" role="status" className="sr-only">
        {busy ? messages.generating : result ? messages.resultTitle : ""}
      </div>
      {error ? (
        <Alert variant="destructive" role="alert">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {result ? (
        <SubsetResultPanel
          result={result}
          messages={messages}
          lang={lang}
          formatBytes={formatBytes}
        />
      ) : null}
    </div>
  )
}
