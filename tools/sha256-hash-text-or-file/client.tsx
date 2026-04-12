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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { DEFAULT_TEXT, STORAGE_KEYS } from "./client/constants"
import { HashOutputGrid } from "./components/hash-output-grid"
import { hashSha256, type Sha256Digest } from "./core/sha256"

import type { Sha256HashTextOrFilePageMessages } from "./client/types"

type Sha256DigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: Sha256Digest }
  | { status: "error"; message: string }

type Sha256HashTextOrFileClientProps = Readonly<{
  messages: Sha256HashTextOrFilePageMessages
}>

function Sha256HashTextOrFileClient({
  messages,
}: Sha256HashTextOrFileClientProps) {
  const plainTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [textDigestState, setTextDigestState] = useState<Sha256DigestState>({
    status: "loading",
  })
  const [fileDigestState, setFileDigestState] = useState<Sha256DigestState>({
    status: "idle",
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

    if (deferredPlainText.length === 0) {
      setTextDigestState({ status: "idle" })
      return
    }

    setTextDigestState({ status: "loading" })

    void hashSha256(new Blob([deferredPlainText]))
      .then((digest) => {
        if (!cancelled) {
          setTextDigestState({ status: "ready", digest })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setTextDigestState({
            status: "error",
            message:
              error instanceof Error ? error.message : "Failed to hash text.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText])

  useEffect(() => {
    let cancelled = false

    if (!selectedFile) {
      setFileDigestState({ status: "idle" })
      return
    }

    setFileDigestState({ status: "loading" })

    void hashSha256(selectedFile)
      .then((digest) => {
        if (!cancelled) {
          setFileDigestState({ status: "ready", digest })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setFileDigestState({
            status: "error",
            message:
              error instanceof Error ? error.message : "Failed to hash file.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedFile])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null
    event.target.value = ""

    setSelectedFile(nextFile)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputLabel}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Field>
            <FieldLabel htmlFor={plainTextId}>
              {messages.plainTextLabel}
            </FieldLabel>
            <FieldDescription>{messages.plainTextDescription}</FieldDescription>
            <Textarea
              id={plainTextId}
              aria-label={messages.plainTextLabel}
              spellCheck={false}
              value={plainText}
              onChange={(event) => {
                setPlainText(event.target.value)
              }}
              className="min-h-64 resize-y font-mono text-sm"
            />
          </Field>

          <DigestSection
            title={messages.hashResultLabel}
            state={textDigestState}
            messages={messages}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.importFromFileLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              <FileText data-icon="inline-start" />
              {messages.importFromFileLabel}
            </Button>
            {selectedFile ? (
              <div className="min-w-0 text-sm text-muted-foreground">
                <p className="truncate font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p>{formatFileSize(selectedFile.size)}</p>
              </div>
            ) : null}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            aria-label={messages.importFromFileLabel}
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />

          <DigestSection
            title={messages.hashResultLabel}
            state={fileDigestState}
            messages={messages}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function DigestSection({
  title,
  state,
  messages,
}: Readonly<{
  title: string
  state: Sha256DigestState
  messages: Sha256HashTextOrFilePageMessages
}>) {
  if (state.status === "idle") {
    return null
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        {state.status === "loading" ? (
          <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
        ) : null}
        <span>{title}</span>
      </div>

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

export default Sha256HashTextOrFileClient
