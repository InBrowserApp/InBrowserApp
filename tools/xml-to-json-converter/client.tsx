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
  DEFAULT_XML,
  DEFAULT_XML_TO_JSON_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"
import { parseStoredOptions } from "./client/storage"
import type { XmlToJsonConverterMessages } from "./client/types"
import { HighlightedJson } from "./components/highlighted-json"
import { OptionsCard } from "./components/options-card"
import {
  convertXmlToJsonText,
  type XmlToJsonOptions,
} from "./core/convert-xml-to-json"

type XmlToJsonConverterClientProps = Readonly<{
  messages: XmlToJsonConverterMessages
}>

function XmlToJsonConverterClient({ messages }: XmlToJsonConverterClientProps) {
  const xmlTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [xmlText, setXmlText] = useState(DEFAULT_XML)
  const [options, setOptions] = useState<XmlToJsonOptions>(
    DEFAULT_XML_TO_JSON_OPTIONS
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredXmlText = useDeferredValue(xmlText)
  const deferredOptions = useDeferredValue(options)
  const result = convertXmlToJsonText(deferredXmlText, deferredOptions)
  const jsonOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedXmlText = window.localStorage.getItem(STORAGE_KEYS.xmlText)
    const storedOptions = window.localStorage.getItem(STORAGE_KEYS.options)

    if (storedXmlText !== null) {
      setXmlText(storedXmlText)
    }

    setOptions(parseStoredOptions(storedOptions))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.xmlText, xmlText)
  }, [xmlText])

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
      new Blob([result.json], {
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
  }, [result.json, result.state])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setXmlText(nextText)
    })
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.xmlLabel}</CardTitle>
            <CardDescription>{messages.xmlDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <Textarea
              id={xmlTextId}
              aria-label={messages.xmlLabel}
              aria-invalid={result.state === "error"}
              spellCheck={false}
              value={xmlText}
              onChange={(event) => {
                setXmlText(event.target.value)
              }}
              placeholder={messages.xmlPlaceholder}
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
              accept=".xml,.txt,application/xml,text/xml,text/plain"
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
            <CardTitle>{messages.jsonLabel}</CardTitle>
            <CardDescription>{messages.jsonDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <HighlightedJson
              ariaLabel={messages.jsonLabel}
              emptyDescription={messages.jsonEmptyDescription}
              errorTitle={messages.invalidXmlLabel}
              errorDescription={result.state === "error" ? result.message : ""}
              state={jsonOutputState}
              value={result.state === "converted" ? result.json : ""}
            />
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t">
            <ToolCopyButton
              value={result.state === "converted" ? result.json : ""}
              copyLabel={messages.copyJsonLabel}
              copiedLabel={messages.copiedLabel}
              disabled={result.state !== "converted"}
            />

            {downloadUrl ? (
              <Button asChild size="sm">
                <a href={downloadUrl} download="converted.json">
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

      <OptionsCard
        messages={messages}
        options={options}
        setOptions={setOptions}
      />
    </div>
  )
}

export default XmlToJsonConverterClient
