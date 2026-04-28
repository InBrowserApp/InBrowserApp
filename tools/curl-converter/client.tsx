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
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Download,
  FileText,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "@workspace/ui/icons"

import { INPUT_STORAGE_KEY, SAMPLE_CURL, TARGET_STORAGE_KEY } from "./constants"
import { HighlightedCode } from "./components/highlighted-code"
import { TargetSelectCard } from "./components/target-select-card"
import { convertCurlToTarget, type ConversionResult } from "./core/converter"
import {
  defaultTargetId,
  getDownloadFilename,
  getTargetConfig,
} from "./core/targets"
import type { CurlConverterMessages } from "./types"

type CurlConverterClientProps = Readonly<{ messages: CurlConverterMessages }>

const EMPTY_RESULT: ConversionResult = { output: "", warnings: [] }

function isKnownTarget(value: string) {
  return getTargetConfig(value) !== undefined
}

function CurlConverterClient({ messages }: CurlConverterClientProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [targetId, setTargetId] = useState(defaultTargetId)
  const [curlInput, setCurlInput] = useState(SAMPLE_CURL)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [result, setResult] = useState<ConversionResult>(EMPTY_RESULT)
  const [hasHydratedState, setHasHydratedState] = useState(false)

  const deferredCurlInput = useDeferredValue(curlInput)
  const selectedTarget = getTargetConfig(targetId)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedTarget = window.localStorage.getItem(TARGET_STORAGE_KEY) ?? ""
    const storedInput = window.localStorage.getItem(INPUT_STORAGE_KEY)

    if (isKnownTarget(storedTarget)) {
      setTargetId(storedTarget)
    }

    if (storedInput !== null) {
      setCurlInput(storedInput)
    }

    setHasHydratedState(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasHydratedState) {
      return
    }

    window.localStorage.setItem(TARGET_STORAGE_KEY, targetId)
  }, [hasHydratedState, targetId])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasHydratedState) {
      return
    }

    window.localStorage.setItem(INPUT_STORAGE_KEY, curlInput)
  }, [curlInput, hasHydratedState])

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
        type: "text/plain;charset=utf-8",
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

  useEffect(() => {
    if (!hasHydratedState) {
      return
    }

    let cancelled = false

    void (async () => {
      const nextResult = await convertCurlToTarget(deferredCurlInput, targetId)

      if (!cancelled) {
        setResult(nextResult)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [deferredCurlInput, hasHydratedState, targetId])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setCurlInput(nextText)
    })
  }

  return (
    <div className="grid gap-6">
      <TargetSelectCard
        messages={messages}
        targetId={targetId}
        onTargetChange={(nextValue) => {
          if (isKnownTarget(nextValue)) {
            setTargetId(nextValue)
          }
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputCurlLabel}</CardTitle>
            <CardDescription>{messages.curlPlaceholder}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            <Textarea
              id={inputId}
              aria-label={messages.inputCurlLabel}
              spellCheck={false}
              value={curlInput}
              onChange={(event) => {
                setCurlInput(event.target.value)
              }}
              placeholder={messages.curlPlaceholder}
              className="min-h-80 flex-1 resize-y font-mono text-sm"
            />
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="flex flex-wrap gap-3 border-t">
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
              accept=".txt,.sh,.curl,text/plain"
              aria-label={messages.importFromFileLabel}
              className="sr-only"
              onChange={(event) => {
                void handleFileChange(event)
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurlInput(SAMPLE_CURL)
              }}
            >
              <Sparkles data-icon="inline-start" />
              {messages.useSampleLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurlInput("")
              }}
            >
              <Trash2 data-icon="inline-start" />
              {messages.clearLabel}
            </Button>
          </ToolPanelCardFooter>
        </ToolPanelCard>

        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.outputCodeLabel}</CardTitle>
            <CardDescription>
              {selectedTarget
                ? selectedTarget.label
                : messages.languagePlaceholder}
            </CardDescription>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            {result.error ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.errorsTitle}</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            ) : null}

            {result.warnings.length > 0 ? (
              <Alert>
                <TriangleAlert />
                <AlertTitle>{messages.warningsTitle}</AlertTitle>
                <AlertDescription>
                  <ul className="grid gap-1">
                    {result.warnings.map((warning) => (
                      <li
                        key={warning}
                        className="font-mono text-xs break-words"
                      >
                        {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}

            <HighlightedCode
              ariaLabel={messages.outputCodeLabel}
              className="h-[min(32rem,60vh)]"
              highlightLanguage={
                selectedTarget?.highlightLanguage ?? "plaintext"
              }
              value={result.output}
            />
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="flex flex-wrap gap-3 border-t">
            <ToolCopyButton
              value={result.output}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />

            {downloadUrl ? (
              <Button asChild type="button" variant="ghost" size="sm">
                <a href={downloadUrl} download={getDownloadFilename(targetId)}>
                  <Download data-icon="inline-start" />
                  {messages.downloadCodeLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadCodeLabel}
              </Button>
            )}
          </ToolPanelCardFooter>
        </ToolPanelCard>
      </div>
    </div>
  )
}

export default CurlConverterClient
