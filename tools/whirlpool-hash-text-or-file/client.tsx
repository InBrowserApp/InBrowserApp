import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

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
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { DEFAULT_TEXT, STORAGE_KEYS } from "./client/constants"
import type { WhirlpoolHashTextOrFilePageMessages } from "./client/types"
import { HashOutputGrid } from "./components/hash-output-grid"
import { hashWhirlpool, type WhirlpoolDigest } from "./core/whirlpool"

type WhirlpoolDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: WhirlpoolDigest }
  | { status: "error"; message: string }

type WhirlpoolHashTextOrFileClientProps = Readonly<{
  messages: WhirlpoolHashTextOrFilePageMessages
}>

function WhirlpoolHashTextOrFileClient({
  messages,
}: WhirlpoolHashTextOrFileClientProps) {
  const plainTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<WhirlpoolDigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, plainText)
  }, [plainText])

  useEffect(() => {
    let cancelled = false

    const source = selectedFile
      ? selectedFile
      : deferredPlainText.length > 0
        ? new Blob([deferredPlainText])
        : null

    if (!source) {
      setDigestState({ status: "idle" })
      return
    }

    setDigestState({ status: "loading" })

    void hashWhirlpool(source)
      .then((digest) => {
        if (!cancelled) {
          setDigestState({ status: "ready", digest })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDigestState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : selectedFile
                  ? "Failed to hash file."
                  : "Failed to hash text.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, selectedFile])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  return (
    <div className="grid gap-6">
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
            <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
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
            <Field className="flex flex-1 flex-col">
              <FieldLabel htmlFor={plainTextId}>
                {messages.plainTextLabel}
              </FieldLabel>
              <Textarea
                id={plainTextId}
                aria-label={messages.plainTextLabel}
                spellCheck={false}
                value={plainText}
                onChange={(event) => {
                  setPlainText(event.target.value)
                }}
                className="min-h-64 flex-1 resize-y font-mono text-sm"
              />
            </Field>
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
            className="sr-only"
            aria-label={messages.importFromFileLabel}
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <CardTitle>{messages.hashResultLabel}</CardTitle>
            <CardDescription>
              {selectedFile
                ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
                : messages.hashResultDescription}
            </CardDescription>
          </div>
          {digestState.status === "loading" ? (
            <CardAction>
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <DigestSection state={digestState} messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}

function DigestSection({
  state,
  messages,
}: Readonly<{
  state: WhirlpoolDigestState
  messages: WhirlpoolHashTextOrFilePageMessages
}>) {
  if (state.status === "idle") {
    return (
      <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        {messages.plainTextDescription}
      </div>
    )
  }

  return (
    <section className="grid gap-4">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "loading" || state.status === "ready" ? (
        <HashOutputGrid
          messages={messages}
          digest={state.status === "ready" ? state.digest : null}
          loading={state.status === "loading"}
        />
      ) : null}
    </section>
  )
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${formatNumber(size / 1024)} KB`
  }

  return `${formatNumber(size / (1024 * 1024))} MB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export default WhirlpoolHashTextOrFileClient
