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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Download,
  FileText,
  RefreshCcw,
  TriangleAlert,
} from "@workspace/ui/icons"

import { DEFAULT_DOCKER_RUN_INPUT, STORAGE_KEYS } from "./client/constants"
import type { DockerRunToComposeMessages } from "./client/types"
import { HighlightedCompose } from "./components/highlighted-compose"
import { convertDockerRunToCompose } from "./core/convert-docker-run-to-compose"

type DockerRunToComposeClientProps = Readonly<{
  messages: DockerRunToComposeMessages
}>

function DockerRunToComposeClient({ messages }: DockerRunToComposeClientProps) {
  const dockerRunInputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [inputText, setInputText] = useState(DEFAULT_DOCKER_RUN_INPUT)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredInputText = useDeferredValue(inputText)
  const result = convertDockerRunToCompose(deferredInputText)
  const composeOutputState = result.error
    ? "error"
    : result.output
      ? "success"
      : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedInputText = window.localStorage.getItem(STORAGE_KEYS.inputText)

    if (storedInputText !== null) {
      setInputText(storedInputText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.inputText, inputText)
  }, [inputText])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!result.output) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([result.output], {
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
  }, [result.output])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setInputText(nextText)
    })
  }

  function applySample() {
    startTransition(() => {
      setInputText(DEFAULT_DOCKER_RUN_INPUT)
    })
  }

  function clearInput() {
    startTransition(() => {
      setInputText("")
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.dockerRunLabel}</CardTitle>
          <CardDescription>{messages.dockerRunDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <Textarea
            id={dockerRunInputId}
            aria-label={messages.dockerRunLabel}
            aria-invalid={Boolean(result.error)}
            spellCheck={false}
            value={inputText}
            onChange={(event) => {
              setInputText(event.target.value)
            }}
            placeholder={messages.dockerRunPlaceholder}
            className="min-h-80 flex-1 resize-y font-mono text-sm"
          />
        </CardContent>
        <CardFooter className="justify-start gap-3 border-t">
          <Button type="button" variant="ghost" size="sm" onClick={applySample}>
            {messages.useSampleLabel}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={clearInput}>
            <RefreshCcw data-icon="inline-start" />
            {messages.clearLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <FileText data-icon="inline-start" />
            {messages.importFromFileLabel}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.sh,text/plain,application/x-sh"
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
          <CardTitle>{messages.composeLabel}</CardTitle>
          <CardDescription>{messages.composeDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          {result.warnings.length ? (
            <Alert>
              <TriangleAlert />
              <AlertTitle>{messages.warningsTitle}</AlertTitle>
              <AlertDescription>
                <ul className="ml-4 flex list-disc flex-col gap-1">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          <HighlightedCompose
            ariaLabel={messages.composeLabel}
            emptyDescription={messages.composeEmptyDescription}
            errorTitle={messages.invalidDockerRunLabel}
            errorDescription={result.error ?? ""}
            state={composeOutputState}
            value={result.output}
          />
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={result.output}
            copyLabel={messages.copyComposeLabel}
            copiedLabel={messages.copiedLabel}
            disabled={!result.output}
          />

          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download="docker-compose.yml">
                <Download data-icon="inline-start" />
                {messages.downloadComposeLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadComposeLabel}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default DockerRunToComposeClient
