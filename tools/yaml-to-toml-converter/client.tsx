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

import { DEFAULT_YAML, STORAGE_KEYS } from "./client/constants"
import type { YamlToTomlConverterMessages } from "./client/types"
import { HighlightedToml } from "./components/highlighted-toml"
import { convertYamlToTomlText } from "./core/convert-yaml-to-toml"

type YamlToTomlConverterClientProps = Readonly<{
  messages: YamlToTomlConverterMessages
}>

function YamlToTomlConverterClient({
  messages,
}: YamlToTomlConverterClientProps) {
  const yamlTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [yamlText, setYamlText] = useState(DEFAULT_YAML)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredYamlText = useDeferredValue(yamlText)
  const result = convertYamlToTomlText(deferredYamlText)
  const tomlOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedYamlText = window.localStorage.getItem(STORAGE_KEYS.yamlText)

    if (storedYamlText !== null) {
      setYamlText(storedYamlText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.yamlText, yamlText)
  }, [yamlText])

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
      new Blob([result.toml], {
        type: "application/toml;charset=utf-8",
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
  }, [result.state, result.toml])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setYamlText(nextText)
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.yamlLabel}</CardTitle>
          <CardDescription>{messages.yamlDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <Textarea
            id={yamlTextId}
            aria-label={messages.yamlLabel}
            aria-invalid={result.state === "error"}
            spellCheck={false}
            value={yamlText}
            onChange={(event) => {
              setYamlText(event.target.value)
            }}
            placeholder={messages.yamlPlaceholder}
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
            accept=".yaml,.yml,.txt,application/yaml,application/x-yaml,text/yaml,text/plain"
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
          <CardTitle>{messages.tomlLabel}</CardTitle>
          <CardDescription>{messages.tomlDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <HighlightedToml
            ariaLabel={messages.tomlLabel}
            emptyDescription={messages.tomlEmptyDescription}
            errorTitle={messages.invalidYamlLabel}
            errorDescription={result.state === "error" ? result.message : ""}
            state={tomlOutputState}
            value={result.state === "converted" ? result.toml : ""}
          />
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={result.state === "converted" ? result.toml : ""}
            copyLabel={messages.copyTomlLabel}
            copiedLabel={messages.copiedLabel}
            disabled={result.state !== "converted"}
          />

          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download="converted.toml">
                <Download data-icon="inline-start" />
                {messages.downloadTomlLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadTomlLabel}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default YamlToTomlConverterClient
