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

import { DEFAULT_TOML, STORAGE_KEYS } from "./client/constants"
import type { TomlToJsonConverterMessages } from "./client/types"
import { HighlightedJson } from "./components/highlighted-json"
import { convertTomlToJsonText } from "./core/convert-toml-to-json"

type TomlToJsonConverterClientProps = Readonly<{
  messages: TomlToJsonConverterMessages
}>

function TomlToJsonConverterClient({
  messages,
}: TomlToJsonConverterClientProps) {
  const tomlTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [tomlText, setTomlText] = useState(DEFAULT_TOML)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredTomlText = useDeferredValue(tomlText)
  const result = convertTomlToJsonText(deferredTomlText)
  const jsonOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedTomlText = window.localStorage.getItem(STORAGE_KEYS.tomlText)

    if (storedTomlText !== null) {
      setTomlText(storedTomlText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.tomlText, tomlText)
  }, [tomlText])

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
  }, [result.state, result.json])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setTomlText(nextText)
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.tomlLabel}</CardTitle>
          <CardDescription>{messages.tomlDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <Textarea
            id={tomlTextId}
            aria-label={messages.tomlLabel}
            aria-invalid={result.state === "error"}
            spellCheck={false}
            value={tomlText}
            onChange={(event) => {
              setTomlText(event.target.value)
            }}
            placeholder={messages.tomlPlaceholder}
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
            accept=".toml,.txt,application/toml,text/plain"
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
            errorTitle={messages.invalidTomlLabel}
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
  )
}

export default TomlToJsonConverterClient
