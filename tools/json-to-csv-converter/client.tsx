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
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileJson2 } from "@workspace/ui/icons"

import {
  DEFAULT_JSON,
  DEFAULT_JSON_TO_CSV_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"
import { parseStoredOptions } from "./client/storage"
import type { JsonToCsvConverterMessages } from "./client/types"
import { CsvOutput } from "./components/csv-output"
import { OptionsCard } from "./components/options-card"
import {
  convertJsonToCsvText,
  type JsonToCsvOptions,
} from "./core/convert-json-to-csv"

type JsonToCsvConverterClientProps = Readonly<{
  messages: JsonToCsvConverterMessages
}>

function JsonToCsvConverterClient({ messages }: JsonToCsvConverterClientProps) {
  const jsonTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const [options, setOptions] = useState<JsonToCsvOptions>(
    DEFAULT_JSON_TO_CSV_OPTIONS
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredJsonText = useDeferredValue(jsonText)
  const deferredOptions = useDeferredValue(options)
  const result = convertJsonToCsvText(deferredJsonText, deferredOptions)
  const csvOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedJsonText = window.localStorage.getItem(STORAGE_KEYS.jsonText)
    const storedOptions = window.localStorage.getItem(STORAGE_KEYS.options)

    if (storedJsonText !== null) {
      setJsonText(storedJsonText)
    }

    setOptions(parseStoredOptions(storedOptions))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.jsonText, jsonText)
  }, [jsonText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.options, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (result.state !== "converted") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([result.csv], {
        type: "text/csv;charset=utf-8",
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
  }, [result.csv, result.state])

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
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.jsonLabel}</CardTitle>
            <CardDescription>{messages.jsonDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <Textarea
              id={jsonTextId}
              aria-label={messages.jsonLabel}
              aria-invalid={result.state === "error"}
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
          <CardHeader className="border-b">
            <CardTitle>{messages.csvLabel}</CardTitle>
            <CardDescription>{messages.csvDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <CsvOutput
              ariaLabel={messages.csvLabel}
              emptyDescription={messages.csvEmptyDescription}
              errorTitle={messages.invalidJsonLabel}
              errorDescription={result.state === "error" ? result.message : ""}
              state={csvOutputState}
              value={result.state === "converted" ? result.csv : ""}
            />
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t">
            <ToolCopyButton
              value={result.state === "converted" ? result.csv : ""}
              copyLabel={messages.copyCsvLabel}
              copiedLabel={messages.copiedLabel}
              disabled={result.state !== "converted"}
            />

            {downloadUrl ? (
              <Button asChild size="sm">
                <a href={downloadUrl} download="converted.csv">
                  <Download data-icon="inline-start" />
                  {messages.downloadCsvLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadCsvLabel}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <OptionsCard
        messages={messages}
        options={options}
        setOptions={setOptions}
      />
    </div>
  )
}

export default JsonToCsvConverterClient
