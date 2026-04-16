import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
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
  LoaderCircle,
  TriangleAlert,
} from "@workspace/ui/icons"

import { ReadOnlyOutput } from "./components/read-only-output"
import { deriveEncodedFileName, encodeBase32 } from "./core/base32-encoder"

type Base32EncoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputLabel: string
  inputPlaceholder: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  encodedOutputLabel: string
  encodedOutputEmptyDescription: string
  downloadFileLabel: string
  copyResultLabel: string
  copiedLabel: string
  fileReadFailedTitle: string
}>

type Base32EncoderClientProps = Readonly<{
  messages: Base32EncoderMessages
}>

type EncodingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; encodedText: string }
  | { status: "error"; message: string }

const STORAGE_KEY = "tools:base32-encoder:text"
const DEFAULT_INPUT = "Hello, World!"
const FILE_ACCEPT = "*/*"

function Base32EncoderClient({ messages }: Base32EncoderClientProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_INPUT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [encodingState, setEncodingState] = useState<EncodingState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)

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
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, plainText)
  }, [plainText])

  useEffect(() => {
    let cancelled = false

    const source = selectedFile
      ? selectedFile
      : deferredPlainText.length > 0
        ? new Blob([deferredPlainText])
        : null

    if (!source) {
      setEncodingState({ status: "idle" })
      return
    }

    setEncodingState({ status: "loading" })

    void encodeBase32(source)
      .then((encodedText) => {
        if (!cancelled) {
          setEncodingState({ status: "ready", encodedText })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEncodingState({
            status: "error",
            message: messages.fileReadFailedTitle,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, messages.fileReadFailedTitle, selectedFile])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (encodingState.status !== "ready") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([encodingState.encodedText], {
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
  }, [encodingState])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  const outputText =
    encodingState.status === "ready" ? encodingState.encodedText : ""
  const downloadFileName = deriveEncodedFileName(
    selectedFile ? (selectedFile.name ?? null) : undefined
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputLabel}</CardTitle>
          <CardDescription>
            {selectedFile
              ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
              : messages.plainTextDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {selectedFile ? (
            <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
              <FileText className="size-5 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium break-all text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          ) : (
            <Textarea
              id={inputId}
              name="plain-text"
              rows={10}
              autoComplete="off"
              aria-label={messages.inputLabel}
              value={plainText}
              onChange={(event) => {
                setPlainText(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="min-h-72 resize-y font-mono text-sm"
            />
          )}
        </CardContent>
        <CardFooter className="justify-start gap-3 border-t">
          {selectedFile ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
              }}
            >
              {messages.plainTextLabel}
            </Button>
          ) : null}

          <Button
            type="button"
            variant={selectedFile ? "outline" : "ghost"}
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
            accept={FILE_ACCEPT}
            aria-label={messages.importFromFileLabel}
            className="sr-only"
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <CardTitle>{messages.encodedOutputLabel}</CardTitle>
            <CardDescription>{messages.meta.description}</CardDescription>
          </div>
          {encodingState.status === "loading" ? (
            <CardAction>
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          {encodingState.status === "error" ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{encodingState.message}</AlertDescription>
            </Alert>
          ) : encodingState.status === "idle" ? (
            <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              {messages.encodedOutputEmptyDescription}
            </div>
          ) : encodingState.status === "loading" ? (
            <div className="min-h-72 animate-pulse rounded-lg border bg-muted/20" />
          ) : (
            <ReadOnlyOutput
              ariaLabel={messages.encodedOutputLabel}
              value={outputText}
              className="min-h-72"
            />
          )}
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={outputText}
            copyLabel={messages.copyResultLabel}
            copiedLabel={messages.copiedLabel}
            disabled={encodingState.status !== "ready"}
          />

          {downloadUrl && encodingState.status === "ready" ? (
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
        </CardFooter>
      </Card>
    </div>
  )
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default Base32EncoderClient
