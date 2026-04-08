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
import type { TomlToYamlConverterMessages } from "./client/types"
import { HighlightedYaml } from "./components/highlighted-yaml"
import { convertTomlToYamlText } from "./core/convert-toml-to-yaml"

type TomlToYamlConverterClientProps = Readonly<{
  messages: TomlToYamlConverterMessages
}>

function TomlToYamlConverterClient({
  messages,
}: TomlToYamlConverterClientProps) {
  const tomlTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [tomlText, setTomlText] = useState(DEFAULT_TOML)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredTomlText = useDeferredValue(tomlText)
  const result = convertTomlToYamlText(deferredTomlText)
  const yamlOutputState =
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
          <CardTitle>{messages.yamlLabel}</CardTitle>
          <CardDescription>{messages.yamlDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <HighlightedYaml
            ariaLabel={messages.yamlLabel}
            emptyDescription={messages.yamlEmptyDescription}
            errorTitle={messages.invalidTomlLabel}
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

export default TomlToYamlConverterClient
