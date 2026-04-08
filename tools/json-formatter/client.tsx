import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileJson2, TriangleAlert } from "@workspace/ui/icons"

import { DEFAULT_JSON, STORAGE_KEYS } from "./client/constants"
import type { JsonFormatterMessages } from "./client/types"
import { HighlightedJson } from "./components/highlighted-json"
import {
  DEFAULT_INDENT_SIZE,
  clampIndentSize,
  formatJsonText,
} from "./core/format-json"

type JsonFormatterClientProps = Readonly<{
  messages: JsonFormatterMessages
}>

function JsonFormatterClient({ messages }: JsonFormatterClientProps) {
  const jsonTextId = useId()
  const indentSizeId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const [indentSize, setIndentSize] = useState(DEFAULT_INDENT_SIZE)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredJsonText = useDeferredValue(jsonText)
  const result = formatJsonText(deferredJsonText, indentSize)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedJsonText = window.localStorage.getItem(STORAGE_KEYS.jsonText)
    const storedIndentSize = window.localStorage.getItem(
      STORAGE_KEYS.indentSize
    )

    if (storedJsonText !== null) {
      setJsonText(storedJsonText)
    }

    if (storedIndentSize !== null) {
      setIndentSize(clampIndentSize(Number(storedIndentSize)))
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.jsonText, jsonText)
  }, [jsonText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.indentSize, String(indentSize))
  }, [indentSize])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (result.state !== "formatted") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([result.formatted], {
        type: "application/json;charset=utf-8",
      })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [result.formatted, result.state])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setJsonText(nextText)
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.rawJsonLabel}</CardTitle>
          <CardDescription>{messages.rawJsonDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <Textarea
            id={jsonTextId}
            aria-label={messages.rawJsonLabel}
            spellCheck={false}
            value={jsonText}
            onChange={(event) => {
              setJsonText(event.target.value)
            }}
            placeholder={messages.jsonPlaceholder}
            className="min-h-80 flex-1 resize-y font-mono text-sm"
          />
        </CardContent>
        <CardFooter className="justify-start border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <FileJson2 data-icon="inline-start" />
            {messages.importFromFileLabel}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.txt,application/json,text/plain"
            aria-label={messages.importFromFileLabel}
            className="sr-only"
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="gap-4 border-b sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>{messages.formattedJsonLabel}</CardTitle>
            <CardDescription>
              {messages.formattedJsonDescription}
            </CardDescription>
          </div>

          <Field className="w-full sm:max-w-28">
            <FieldLabel htmlFor={indentSizeId}>
              {messages.indentSizeLabel}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={indentSizeId}
                type="number"
                inputMode="numeric"
                min={1}
                max={8}
                aria-label={messages.indentSizeLabel}
                value={String(indentSize)}
                onChange={(event) => {
                  setIndentSize(clampIndentSize(Number(event.target.value)))
                }}
              />
            </InputGroup>
          </Field>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          {result.state === "error" ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.invalidJsonLabel}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          ) : null}

          <HighlightedJson
            ariaLabel={messages.formattedJsonLabel}
            emptyTitle={messages.formattedJsonLabel}
            emptyDescription={messages.formattedJsonDescription}
            value={result.state === "formatted" ? result.formatted : ""}
          />
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={result.state === "formatted" ? result.formatted : ""}
            copyLabel={messages.copyJsonLabel}
            copiedLabel={messages.copiedLabel}
            disabled={result.state !== "formatted"}
          />

          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download="formatted.json">
                <Download data-icon="inline-start" />
                {messages.downloadJsonLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadJsonLabel}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default JsonFormatterClient
