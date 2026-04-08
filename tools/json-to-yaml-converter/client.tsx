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

import { DEFAULT_JSON, STORAGE_KEYS } from "./client/constants"
import type { JsonToYamlConverterMessages } from "./client/types"
import { HighlightedYaml } from "./components/highlighted-yaml"
import { convertJsonToYamlText } from "./core/convert-json-to-yaml"

type JsonToYamlConverterClientProps = Readonly<{
  messages: JsonToYamlConverterMessages
}>

function JsonToYamlConverterClient({
  messages,
}: JsonToYamlConverterClientProps) {
  const jsonTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredJsonText = useDeferredValue(jsonText)
  const result = convertJsonToYamlText(deferredJsonText)
  const yamlOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedJsonText = window.localStorage.getItem(STORAGE_KEYS.jsonText)

    if (storedJsonText !== null) {
      setJsonText(storedJsonText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.jsonText, jsonText)
  }, [jsonText])

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
      new Blob([result.yaml], {
        type: "text/yaml;charset=utf-8",
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
  }, [result.state, result.yaml])

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
          <CardTitle>{messages.yamlLabel}</CardTitle>
          <CardDescription>{messages.yamlDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <HighlightedYaml
            ariaLabel={messages.yamlLabel}
            emptyDescription={messages.yamlEmptyDescription}
            errorTitle={messages.invalidJsonLabel}
            errorDescription={result.state === "error" ? result.message : ""}
            state={yamlOutputState}
            value={result.state === "converted" ? result.yaml : ""}
          />
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={result.state === "converted" ? result.yaml : ""}
            copyLabel={messages.copyYamlLabel}
            copiedLabel={messages.copiedLabel}
            disabled={result.state !== "converted"}
          />

          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download="converted.yaml">
                <Download data-icon="inline-start" />
                {messages.downloadYamlLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadYamlLabel}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default JsonToYamlConverterClient
