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
  deriveEncodedFileName,
  encodeBytesToBase16Preview,
  encodeTextToBase16Preview,
} from "./core/base16"
import type { Base16EncoderMessages } from "./client/types"

type Base16EncoderClientProps = Readonly<{
  messages: Base16EncoderMessages
}>

const STORAGE_KEY = "tools:base16-encoder:text"
const DEFAULT_INPUT = "Hello, World!"
const FILE_ACCEPT = "*/*"

function Base16EncoderClient({ messages }: Base16EncoderClientProps) {
  const plainTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pendingFileReadIdRef = useRef(0)
  const downloadUrlRef = useRef<string | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_INPUT)
  const [sourceFileName, setSourceFileName] = useState<string | null>(null)
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null)
  const [fileReadFailed, setFileReadFailed] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredPlainText = useDeferredValue(plainText)
  const encodeState =
    sourceBytes !== null
      ? encodeBytesToBase16Preview(sourceBytes)
      : encodeTextToBase16Preview(deferredPlainText)

  const encodedText = encodeState.state === "encoded" ? encodeState.text : ""
  const downloadFileName = deriveEncodedFileName(sourceFileName)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEY)

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || sourceBytes !== null) return

    window.localStorage.setItem(STORAGE_KEY, plainText)
  }, [plainText, sourceBytes])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (encodedText.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([encodedText], {
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
  }, [encodedText])

  function handleTextChange(nextValue: string) {
    pendingFileReadIdRef.current += 1
    setPlainText(nextValue)
    setSourceBytes(null)
    setSourceFileName(null)
    setFileReadFailed(false)
  }

  function handleReset() {
    pendingFileReadIdRef.current += 1
    setPlainText(DEFAULT_INPUT)
    setSourceBytes(null)
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
      const nextBytes = new Uint8Array(await file.arrayBuffer())

      if (requestId !== pendingFileReadIdRef.current) {
        return
      }

      startTransition(() => {
        setPlainText("")
        setSourceBytes(nextBytes)
        setSourceFileName(file.name || null)
        setFileReadFailed(false)
      })
    } catch {
      if (requestId !== pendingFileReadIdRef.current) {
        return
      }

      startTransition(() => {
        setSourceBytes(null)
        setSourceFileName(null)
        setFileReadFailed(true)
      })
    }
  }

  const outputErrorTitle = fileReadFailed ? messages.fileReadFailedTitle : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.plainTextLabel}</CardTitle>
          <CardDescription>
            {sourceFileName
              ? `${messages.importFromFileLabel}: ${sourceFileName}`
              : messages.plainTextPlaceholder}
          </CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <Textarea
            id={plainTextId}
            name="plain-text-input"
            rows={10}
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.plainTextLabel}
            value={sourceBytes === null ? plainText : ""}
            onChange={(event) => {
              handleTextChange(event.target.value)
            }}
            placeholder={messages.plainTextPlaceholder}
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
          <CardTitle>{messages.hexOutputLabel}</CardTitle>
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
          ) : encodeState.state === "empty" ? (
            <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              {messages.hexOutputEmptyDescription}
            </div>
          ) : (
            <>
              <ReadOnlyOutput
                ariaLabel={messages.hexOutputLabel}
                className="min-h-72"
                value={encodeState.previewText}
              />

              {encodeState.isPreviewTruncated ? (
                <p className="text-sm text-muted-foreground">
                  {messages.previewTruncatedLabel}
                </p>
              ) : null}
            </>
          )}
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={encodedText}
            copyLabel={messages.copyResultLabel}
            copiedLabel={messages.copiedLabel}
            disabled={encodeState.state !== "encoded"}
            variant="ghost"
          />

          {downloadUrl ? (
            <Button asChild size="sm">
              <a href={downloadUrl} download={downloadFileName}>
                <Download data-icon="inline-start" />
                {messages.downloadHexLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" size="sm" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadHexLabel}
            </Button>
          )}
        </ToolPanelCardFooter>
      </ToolPanelCard>
    </div>
  )
}

export default Base16EncoderClient
