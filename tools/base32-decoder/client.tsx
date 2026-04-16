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
import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
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
  RefreshCcw,
  TriangleAlert,
} from "@workspace/ui/icons"

import { ReadOnlyOutput } from "./components/read-only-output"
import {
  decodeBase32,
  decodeBase32Preview,
  deriveDecodedFileName,
} from "./core/base32"

type Base32DecoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  base32InputLabel: string
  base32InputPlaceholder: string
  importFromFileLabel: string
  decodedOutputLabel: string
  decodedOutputEmptyDescription: string
  downloadFileLabel: string
  copyResultLabel: string
  copiedLabel: string
  resetLabel: string
  invalidBase32Title: string
  fileReadFailedTitle: string
  previewTruncatedLabel: string
}>

type Base32DecoderClientProps = Readonly<{
  messages: Base32DecoderMessages
}>

const STORAGE_KEY = "tools:base32-decoder:text"
const DEFAULT_INPUT = "MZXW6==="
const FILE_ACCEPT = "text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b32,.base32"

function Base32DecoderClient({ messages }: Base32DecoderClientProps) {
  const base32InputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pendingFileReadIdRef = useRef(0)
  const downloadUrlRef = useRef<string | null>(null)

  const [base32Input, setBase32Input] = useState(DEFAULT_INPUT)
  const [sourceFileName, setSourceFileName] = useState<string | null>(null)
  const [fileReadFailed, setFileReadFailed] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredBase32Input = useDeferredValue(base32Input)
  const decodeState = decodeBase32Preview(deferredBase32Input)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEY)

    if (storedText !== null) {
      setBase32Input(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, base32Input)
  }, [base32Input])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (decodeState.state !== "decoded") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([decodeBase32(deferredBase32Input)], {
        type: "application/octet-stream",
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
  }, [decodeState.state, deferredBase32Input])

  function handleInputChange(nextValue: string) {
    pendingFileReadIdRef.current += 1
    setBase32Input(nextValue)
    setSourceFileName(null)
    setFileReadFailed(false)
  }

  function handleReset() {
    pendingFileReadIdRef.current += 1
    setBase32Input(DEFAULT_INPUT)
    setSourceFileName(null)
    setFileReadFailed(false)
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const requestId = pendingFileReadIdRef.current + 1
    pendingFileReadIdRef.current = requestId
    setFileReadFailed(false)

    try {
      const nextText = await file.text()

      if (requestId !== pendingFileReadIdRef.current) {
        return
      }

      startTransition(() => {
        setBase32Input(nextText)
        setSourceFileName(file.name || null)
        setFileReadFailed(false)
      })
    } catch {
      if (requestId !== pendingFileReadIdRef.current) {
        return
      }

      startTransition(() => {
        setFileReadFailed(true)
        setSourceFileName(null)
      })
    }
  }

  const outputErrorTitle = fileReadFailed
    ? messages.fileReadFailedTitle
    : decodeState.state === "invalid-base32"
      ? messages.invalidBase32Title
      : null
  const decodedText = decodeState.state === "decoded" ? decodeState.text : ""
  const downloadFileName = deriveDecodedFileName(sourceFileName)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.base32InputLabel}</CardTitle>
          <CardDescription>
            {sourceFileName
              ? `${messages.importFromFileLabel}: ${sourceFileName}`
              : messages.base32InputPlaceholder}
          </CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <Textarea
            id={base32InputId}
            name="base32-input"
            rows={10}
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.base32InputLabel}
            aria-invalid={
              !fileReadFailed && decodeState.state === "invalid-base32"
            }
            value={base32Input}
            onChange={(event) => {
              handleInputChange(event.target.value)
            }}
            placeholder={messages.base32InputPlaceholder}
            className="min-h-72 resize-y font-mono text-sm"
          />
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-between gap-3 border-t">
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

          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_ACCEPT}
            aria-label={messages.importFromFileLabel}
            className="sr-only"
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.decodedOutputLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          {outputErrorTitle ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{outputErrorTitle}</AlertTitle>
              </Alert>
            </div>
          ) : decodeState.state === "empty" ? (
            <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              {messages.decodedOutputEmptyDescription}
            </div>
          ) : decodeState.state === "decoded" ? (
            <>
              <ReadOnlyOutput
                ariaLabel={messages.decodedOutputLabel}
                value={decodeState.previewText}
                className="min-h-72"
              />

              {decodeState.isPreviewTruncated ? (
                <p className="text-sm text-muted-foreground">
                  {messages.previewTruncatedLabel}
                </p>
              ) : null}
            </>
          ) : null}
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={decodedText}
            copyLabel={messages.copyResultLabel}
            copiedLabel={messages.copiedLabel}
            disabled={decodeState.state !== "decoded"}
            variant="ghost"
          />

          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download={downloadFileName}>
                <Download data-icon="inline-start" />
                {messages.downloadFileLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadFileLabel}
            </Button>
          )}
        </ToolPanelCardFooter>
      </ToolPanelCard>
    </div>
  )
}

export default Base32DecoderClient
