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
  DEFAULT_JSON_TO_XML_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"
import { parseStoredOptions } from "./client/storage"
import type { JsonToXmlConverterMessages } from "./client/types"
import { HighlightedXml } from "./components/highlighted-xml"
import { OptionsCard } from "./components/options-card"
import {
  convertJsonToXmlText,
  type JsonToXmlOptions,
} from "./core/convert-json-to-xml"

type JsonToXmlConverterClientProps = Readonly<{
  messages: JsonToXmlConverterMessages
}>

function JsonToXmlConverterClient({ messages }: JsonToXmlConverterClientProps) {
  const jsonTextId = useId()
  const rootElementId = useId()
  const arrayItemTagId = useId()
  const indentSizeId = useId()
  const includeDeclarationId = useId()
  const expandEmptyElementsId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const [options, setOptions] = useState<JsonToXmlOptions>(
    DEFAULT_JSON_TO_XML_OPTIONS
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredJsonText = useDeferredValue(jsonText)
  const deferredOptions = useDeferredValue(options)
  const result = convertJsonToXmlText(deferredJsonText, deferredOptions)
  const xmlOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  const hasJsonError =
    result.state === "error" && result.errorCode === "invalid-json"
  const hasRootElementError =
    result.state === "error" && result.errorCode === "invalid-root-element-name"
  const hasArrayItemTagError =
    result.state === "error" && result.errorCode === "invalid-array-item-tag"

  const outputErrorTitle =
    result.state === "error" && result.errorCode !== "invalid-json"
      ? messages.invalidXmlTagLabel
      : messages.invalidJsonLabel

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
      new Blob([result.xml], {
        type: "application/xml;charset=utf-8",
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
  }, [result.state, result.xml])

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
      <OptionsCard
        arrayItemTagId={arrayItemTagId}
        expandEmptyElementsId={expandEmptyElementsId}
        hasArrayItemTagError={hasArrayItemTagError}
        hasRootElementError={hasRootElementError}
        includeDeclarationId={includeDeclarationId}
        indentSizeId={indentSizeId}
        messages={messages}
        options={options}
        rootElementId={rootElementId}
        setOptions={setOptions}
      />

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
              aria-invalid={hasJsonError}
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
            <CardTitle>{messages.xmlLabel}</CardTitle>
            <CardDescription>{messages.xmlDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <HighlightedXml
              ariaLabel={messages.xmlLabel}
              emptyDescription={messages.xmlEmptyDescription}
              errorTitle={outputErrorTitle}
              errorDescription={
                result.state === "error"
                  ? hasRootElementError
                    ? messages.invalidRootElementNameMessage
                    : hasArrayItemTagError
                      ? messages.invalidArrayItemTagMessage
                      : result.message
                  : ""
              }
              state={xmlOutputState}
              value={result.state === "converted" ? result.xml : ""}
            />
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t">
            <ToolCopyButton
              value={result.state === "converted" ? result.xml : ""}
              copyLabel={messages.copyXmlLabel}
              copiedLabel={messages.copiedLabel}
              disabled={result.state !== "converted"}
            />

            {downloadUrl ? (
              <Button asChild size="sm">
                <a href={downloadUrl} download="converted.xml">
                  <Download data-icon="inline-start" />
                  {messages.downloadXmlLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadXmlLabel}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default JsonToXmlConverterClient
